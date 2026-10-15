from threading import Lock
from datetime import datetime, timezone

from fastapi import FastAPI
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware

from firewall import BudgetFirewall
from loop_detector import LoopDetector
from cost_calculator import estimate_cost


app = FastAPI(
    title="Cloud Cost Firewall",
    description="AI API cost monitoring and budget protection",
    version="0.3.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://cloud-cost-firewall-ten.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Demo configuration: in-memory state resets when the server restarts.
BUDGET_USD = 0.01
MAX_ACTIVITY_ITEMS = 50

budget_firewall = BudgetFirewall(budget_usd=BUDGET_USD)
loop_detector = LoopDetector(max_repeats=5, window_seconds=30)

# Protect shared state.
state_lock = Lock()
activity_history = []
next_activity_id = 1


class RequestCheck(BaseModel):
    agent_id: str = Field(min_length=1, max_length=100)
    prompt: str = Field(min_length=1, max_length=10000)
    input_tokens: int = Field(default=1000, ge=0)
    output_tokens: int = Field(default=500, ge=0)


def record_activity(
    request,
    approved,
    blocked_by,
    estimated_cost,
):
    """Save one request in the in-memory activity history."""
    global next_activity_id

    activity = {
        "id": next_activity_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "agent_id": request.agent_id,
        "prompt": request.prompt[:120],
        "input_tokens": request.input_tokens,
        "output_tokens": request.output_tokens,
        "estimated_cost_usd": round(estimated_cost, 8),
        "status": "APPROVED" if approved else "BLOCKED",
        "blocked_by": blocked_by,
    }

    next_activity_id += 1
    activity_history.insert(0, activity)

    # Keep only the newest 50 records.
    del activity_history[MAX_ACTIVITY_ITEMS:]

    return activity


@app.get("/")
def home():
    return {
        "project": "Cloud Cost Firewall",
        "status": "running",
        "message": "AI cost protection is ready!",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/dashboard")
def dashboard():
    with state_lock:
        return {
            "budget_usd": budget_firewall.budget_usd,
            "spent_usd": round(budget_firewall.spent_usd, 8),
            "remaining_usd": max(0.0, budget_firewall.remaining_usd),
            "blocked_budget_requests": budget_firewall.blocked_requests,
        }


@app.get("/activity")
def get_activity():
    with state_lock:
        return {
            "count": len(activity_history),
            "activity": list(activity_history),
        }


@app.post("/check-request")
def check_request(request: RequestCheck):
    estimated_cost = estimate_cost(
        request.input_tokens,
        request.output_tokens,
    )

    with state_lock:
        loop_result = loop_detector.check_request(
            request.agent_id,
            request.prompt,
        )

        if not loop_result["allowed"]:
            activity = record_activity(
                request=request,
                approved=False,
                blocked_by="loop_detector",
                estimated_cost=estimated_cost,
            )

            return {
                "approved": False,
                "blocked_by": "loop_detector",
                "estimated_cost_usd": estimated_cost,
                "loop_check": loop_result,
                "activity": activity,
            }

        budget_result = budget_firewall.check_request(
            request.input_tokens,
            request.output_tokens,
        )

        approved = budget_result["approved"]
        blocked_by = (
            None if approved else "budget_firewall"
        )

        activity = record_activity(
            request=request,
            approved=approved,
            blocked_by=blocked_by,
            estimated_cost=estimated_cost,
        )

        return {
            **budget_result,
            "blocked_by": blocked_by,
            "loop_check": loop_result,
            "activity": activity,
        }