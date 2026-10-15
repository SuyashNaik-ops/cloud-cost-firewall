from datetime import datetime, timezone
from collections import defaultdict, deque
from threading import Lock

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI(
    title="Cloud Cost Firewall",
    description="A simulated AI/cloud cost protection API",
    version="0.3.0",
)

# Allow the deployed Vercel frontend to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://cloud-cost-firewall-ten.vercel.app",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

lock = Lock()

DEFAULT_BUDGET = 0.01
budget = DEFAULT_BUDGET
spent = 0.0
activity = []
request_history = defaultdict(deque)

MAX_REQUESTS = 5
WINDOW_SECONDS = 30


class BudgetUpdate(BaseModel):
    budget: float


class RequestCheck(BaseModel):
    agent: str = "default-agent"
    estimated_cost: float = 0.001
    description: str = "AI request"


def current_time():
    return datetime.now(timezone.utc).isoformat()


def record_event(event_type, message, cost=0.0):
    activity.insert(
        0,
        {
            "timestamp": current_time(),
            "type": event_type,
            "message": message,
            "cost": round(cost, 6),
        },
    )
    del activity[100:]


@app.get("/")
def root():
    return {
        "name": "Cloud Cost Firewall",
        "status": "running",
        "version": "0.3.0",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/dashboard")
def dashboard():
    with lock:
        remaining = max(budget - spent, 0.0)

        return {
            "budget": round(budget, 6),
            "spent": round(spent, 6),
            "remaining": round(remaining, 6),
            "approved_requests": sum(
                1 for item in activity if item["type"] == "APPROVED"
            ),
            "blocked_requests": sum(
                1 for item in activity if item["type"] == "BLOCKED"
            ),
            "status": "ACTIVE",
        }


@app.get("/activity")
def get_activity():
    with lock:
        return {
            "count": len(activity),
            "activity": list(activity),
        }


@app.put("/budget")
def update_budget(update: BudgetUpdate):
    global budget

    if update.budget <= 0:
        return {
            "success": False,
            "message": "Budget must be greater than zero.",
        }

    with lock:
        budget = round(update.budget, 6)
        record_event(
            "BUDGET_UPDATED",
            f"Budget updated to ${budget:.6f}",
        )

    return {
        "success": True,
        "budget": budget,
    }


@app.post("/check-request")
def check_request(request: RequestCheck):
    global spent

    now = datetime.now(timezone.utc).timestamp()
    agent = request.agent.strip() or "default-agent"
    cost = request.estimated_cost

    with lock:
        history = request_history[agent]

        while history and now - history[0] > WINDOW_SECONDS:
            history.popleft()

        if cost < 0:
            record_event(
                "BLOCKED",
                f"{agent}: Invalid negative cost rejected",
            )
            return {
                "decision": "BLOCKED",
                "reason": "Estimated cost cannot be negative.",
            }

        if len(history) >= MAX_REQUESTS:
            record_event(
                "BLOCKED",
                f"{agent}: Request loop detected",
            )
            return {
                "decision": "BLOCKED",
                "reason": "Loop detector: too many requests in 30 seconds.",
            }

        if spent + cost > budget:
            record_event(
                "BLOCKED",
                f"{agent}: Budget limit exceeded",
                cost,
            )
            return {
                "decision": "BLOCKED",
                "reason": "Budget firewall: insufficient remaining budget.",
                "remaining": round(max(budget - spent, 0.0), 6),
            }

        history.append(now)
        spent = round(spent + cost, 6)

        record_event(
            "APPROVED",
            f"{agent}: {request.description}",
            cost,
        )

        return {
            "decision": "APPROVED",
            "estimated_cost": round(cost, 6),
            "spent": round(spent, 6),
            "remaining": round(max(budget - spent, 0.0), 6),
        }