import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

const API = (
  import.meta.env.VITE_API_URL || "https://cloud-cost-firewall.onrender.com"
).replace(/\/+$/, "");

const REQUEST_TIMEOUT_MS = 45000;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function apiFetch(path, options = {}, retries = 0) {
  const url = `${API}${path.startsWith("/") ? path : `/${path}`}`;
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      return await fetch(url, {
        ...options,
        headers: {
          Accept: "application/json",
          ...(options.body ? { "Content-Type": "application/json" } : {}),
          ...options.headers,
        },
        signal: controller.signal,
      });
    } catch (error) {
      lastError = error;
      if (attempt < retries) await sleep(1500);
    } finally {
      clearTimeout(timer);
    }
  }

  if (lastError?.name === "AbortError") {
    throw new Error(
      "The backend took too long to respond. Render may be waking up; please try again."
    );
  }

  throw new Error(
    "Cannot reach the backend. Check that the server is running and CORS allows this website."
  );
}

async function readJsonResponse(response, label) {
  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // Keep data null so the caller gets a clear response-format error.
  }

  if (!response.ok) {
    const detail =
      typeof data?.detail === "string"
        ? data.detail
        : Array.isArray(data?.detail)
        ? data.detail.map((item) => item?.msg || String(item)).join(", ")
        : typeof data?.message === "string"
        ? data.message
        : `${label} failed (${response.status})`;
    throw new Error(detail);
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error(`${label} returned an invalid JSON response.`);
  }

  return data;
}

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  marginTop: "8px",
  marginBottom: "18px",
  border: "1px solid #454064",
  borderRadius: "8px",
  background: "#171529",
  color: "#ffffff",
  fontSize: "14px",
};

function App() {
  const [health, setHealth] = useState("Connecting...");
  const [dashboard, setDashboard] = useState(null);
  const [newBudget, setNewBudget] = useState("0.0004");
  const [budgetMessage, setBudgetMessage] = useState("");
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [activities, setActivities] = useState([]);
  const [agentId, setAgentId] = useState("demo-agent");
  const [prompt, setPrompt] = useState("Summarize my report");
  const [model, setModel] = useState("demo-flash");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshPromiseRef = useRef(null);
  const budgetSubmittingRef = useRef(false);
  const requestSubmittingRef = useRef(false);

  const fetchDashboardData = useCallback(async () => {
    const response = await apiFetch("/dashboard", { method: "GET" }, 1);
    const data = await readJsonResponse(response, "Dashboard request");

    const numericFields = [
      "budget_usd",
      "spent_usd",
      "remaining_usd",
      "blocked_budget_requests",
    ];

    for (const field of numericFields) {
      if (
        typeof data[field] !== "number" ||
        !Number.isFinite(data[field])
      ) {
        throw new Error(`Dashboard response has an invalid "${field}" value.`);
      }
    }

    return data;
  }, []);

  const fetchActivityData = useCallback(async () => {
    const response = await apiFetch("/activity", { method: "GET" }, 1);
    const data = await readJsonResponse(response, "Activity request");

    // backend/main.py returns { count: number, activity: array }.
    if (!Array.isArray(data.activity)) {
      throw new Error('Activity response must contain an "activity" array.');
    }

    return data.activity;
  }, []);

  const executeRefresh = useCallback(() => {
    if (refreshPromiseRef.current) return refreshPromiseRef.current;

    const promise = (async () => {
      try {
        const [nextDashboard, nextActivities] = await Promise.all([
          fetchDashboardData(),
          fetchActivityData(),
        ]);
        setDashboard(nextDashboard);
        setActivities(nextActivities);
        setHealth("Connected");
      } catch (error) {
        setHealth("Backend offline");
        throw error;
      }
    })();

    refreshPromiseRef.current = promise;
    promise.finally(() => {
      if (refreshPromiseRef.current === promise) {
        refreshPromiseRef.current = null;
      }
    }).catch(() => {
      // The original promise is handled by the caller.
    });

    return promise;
  }, [fetchDashboardData, fetchActivityData]);

  const refreshData = useCallback(async () => {
    try {
      await executeRefresh();
    } catch (error) {
      console.warn("Dashboard refresh failed:", error.message);
    }
  }, [executeRefresh]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    if (health !== "Backend offline") return undefined;
    const timer = setInterval(refreshData, 10000);
    return () => clearInterval(timer);
  }, [health, refreshData]);

  async function updateBudget(event) {
    event?.preventDefault();
    if (budgetSubmittingRef.current) return;

    const amount = Number(newBudget);
    if (!Number.isFinite(amount) || amount <= 0 || amount > 1000000) {
      setBudgetMessage("Enter a valid budget greater than $0 and no more than $1,000,000.");
      return;
    }

    budgetSubmittingRef.current = true;
    setBudgetLoading(true);
    setBudgetMessage("Updating budget...");

    try {
      const response = await apiFetch("/budget", {
        method: "PUT",
        body: JSON.stringify({ budget_usd: amount }),
      });
      const data = await readJsonResponse(response, "Budget update");

      // Actual backend response includes message, budget_usd, spent_usd and remaining_usd.
      if (
        typeof data.budget_usd !== "number" ||
        !Number.isFinite(data.budget_usd) ||
        data.budget_usd <= 0
      ) {
        throw new Error('Budget response did not include a valid "budget_usd" value.');
      }

      setBudgetMessage(
        `Budget updated to $${data.budget_usd.toFixed(6)}. Refreshing dashboard...`
      );

      try {
        await executeRefresh();
        setBudgetMessage(`Budget successfully updated to $${data.budget_usd.toFixed(6)}.`);
      } catch (refreshError) {
        setBudgetMessage(
          `Budget was updated to $${data.budget_usd.toFixed(6)}, but dashboard refresh failed: ${refreshError.message}`
        );
      }
    } catch (error) {
      setBudgetMessage(error.message || "Could not update the budget.");
    } finally {
      budgetSubmittingRef.current = false;
      setBudgetLoading(false);
    }
  }

  async function checkRequest(event) {
    event?.preventDefault();
    if (requestSubmittingRef.current) return;

    if (!agentId.trim()) {
      setResult({ approved: false, error: "Enter an agent identifier first." });
      return;
    }
    if (!prompt.trim()) {
      setResult({ approved: false, error: "Enter a prompt before checking the request." });
      return;
    }

    requestSubmittingRef.current = true;
    setLoading(true);
    setResult(null);

    try {
      const response = await apiFetch("/check-request", {
        method: "POST",
        body: JSON.stringify({
          agent_id: agentId.trim(),
          prompt: prompt.trim(),
          model,
          input_tokens: 1000,
          output_tokens: 500,
        }),
      });
      const data = await readJsonResponse(response, "Request evaluation");

      // Both the loop-block and budget-check paths return a boolean "approved".
      if (typeof data.approved !== "boolean") {
        throw new Error('Evaluation response did not include an "approved" boolean.');
      }

      setResult(data);

      try {
        await executeRefresh();
      } catch (refreshError) {
        console.warn("Activity refresh failed after evaluation:", refreshError.message);
      }
    } catch (error) {
      setResult({
        approved: false,
        error: error.message || "Could not evaluate the request.",
      });
    } finally {
      requestSubmittingRef.current = false;
      setLoading(false);
    }
  }

  const approvedCount = activities.filter((item) => item?.status === "APPROVED").length;
  const blockedCount = activities.filter((item) => item?.status === "BLOCKED").length;
  const budgetBlocks = activities.filter(
    (item) => item?.blocked_by === "budget_firewall"
  ).length;
  const loopBlocks = activities.filter(
    (item) => item?.blocked_by === "loop_detector"
  ).length;

  const totalBudgetValue = dashboard?.budget_usd;
  const spentValue = dashboard?.spent_usd;
  const remainingValue = dashboard?.remaining_usd;
  const blockedRequestsValue = dashboard?.blocked_budget_requests;

  const currentBudgetText =
    typeof totalBudgetValue === "number"
      ? `$${totalBudgetValue.toFixed(6)}`
      : health === "Backend offline"
      ? "Unavailable — retrying automatically"
      : "Loading (backend may be waking up)...";

  return (
    <div className="app" id="overview">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">⬡</span>
          <div>
            <h2>CloudGuard</h2>
            <p>COST FIREWALL</p>
          </div>
        </div>

        <nav aria-label="Main navigation">
          <a className="nav-item active" href="#overview">▦ &nbsp; Overview</a>
          <a className="nav-item" href="#simulator">◈ &nbsp; AI Firewall</a>
          <a className="nav-item" href="#agent-monitor">⟳ &nbsp; Agent Monitor</a>
          <a className="nav-item" href="#activity">◷ &nbsp; Activity</a>
        </nav>

        <div className="sidebar-bottom">
          <span className={`status-dot ${health === "Connected" ? "" : "offline"}`} />
          <div>
            <strong>{health}</strong>
            <p>Backend status</p>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">AI INFRASTRUCTURE / OVERVIEW</p>
            <h1>Cloud Cost Firewall</h1>
            <p className="subtitle">Control runaway AI spending before it happens.</p>
          </div>
          <div className="live-badge">
            <span className={`status-dot ${health === "Connected" ? "" : "offline"}`} />
            SYSTEM MONITOR
          </div>
        </header>

        <section className="hero">
          <div>
            <span className="pill">● LIVE PROTECTION</span>
            <h2>Your AI agents.<br />Your budget. <span>Your control.</span></h2>
            <p>
              Monitor estimated AI request costs and block requests that exceed
              your budget or trigger repeated-prompt detection.
            </p>
          </div>
          <div className="hero-symbol" aria-hidden="true">⬡</div>
        </section>

        <section className="panel budget-config" aria-labelledby="budget-title">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">BUDGET CONTROL</p>
              <h2 id="budget-title">Configure spending limit</h2>
            </div>
            <span className="mini-tag">USD</span>
          </div>
          <p className="panel-description">
            Set the maximum estimated spend allowed by this demo firewall.
          </p>
          <form onSubmit={updateBudget}>
            <label htmlFor="budget-input">Budget limit (USD)</label>
            <div className="budget-controls" style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <input
                id="budget-input"
                type="number"
                min="0.000001"
                max="1000000"
                step="any"
                value={newBudget}
                onChange={(event) => setNewBudget(event.target.value)}
                required
                style={{ ...inputStyle, flex: "1 1 180px", marginBottom: 0 }}
              />
              <button className="primary-button" type="submit" disabled={budgetLoading}>
                {budgetLoading ? "Updating..." : "Update Budget"}
              </button>
            </div>
          </form>
          {budgetMessage && <p className="field-hint" role="status">{budgetMessage}</p>}
          <p className="field-hint">Current backend budget: {currentBudgetText}</p>
        </section>

        <section className="stats" aria-label="Budget summary">
          <Stat
            title="Total Budget"
            value={Number.isFinite(totalBudgetValue) ? `$${totalBudgetValue.toFixed(6)}` : "—"}
            note="Configured spending limit"
            icon="◎"
          />
          <Stat
            title="Estimated Spend"
            value={Number.isFinite(spentValue) ? `$${spentValue.toFixed(6)}` : "—"}
            note="Approved requests only"
            icon="↗"
          />
          <Stat
            title="Budget Remaining"
            value={Number.isFinite(remainingValue) ? `$${remainingValue.toFixed(6)}` : "—"}
            note="Available budget"
            icon="◈"
          />
          <Stat
            title="Budget Blocks"
            value={Number.isFinite(blockedRequestsValue) ? blockedRequestsValue : "—"}
            note="Requests blocked by budget"
            icon="⊘"
          />
        </section>

        <section className="content-grid">
          <div className="panel" id="simulator">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">REQUEST SIMULATOR</p>
                <h2>Test the firewall</h2>
              </div>
              <span className="mini-tag">DEMO</span>
            </div>
            <p className="panel-description">
              Submit a simulated AI request to check whether your firewall approves
              or blocks it. This demo does not call an AI model.
            </p>

            <form onSubmit={checkRequest}>
              <div className="form-group">
                <label htmlFor="agent-id">Agent identifier</label>
                <input
                  id="agent-id"
                  type="text"
                  value={agentId}
                  onChange={(event) => setAgentId(event.target.value)}
                  placeholder="demo-agent"
                  style={inputStyle}
                />
              </div>

              <div className="form-group">
                <label htmlFor="model-select">Demo model</label>
                <select
                  id="model-select"
                  value={model}
                  onChange={(event) => setModel(event.target.value)}
                  style={inputStyle}
                >
                  <option value="demo-economy">Demo Economy — lowest estimated cost</option>
                  <option value="demo-flash">Demo Flash — balanced</option>
                  <option value="demo-pro">Demo Pro — highest estimated cost</option>
                </select>
                <p className="field-hint">These are illustrative pricing tiers, not live provider prices.</p>
              </div>

              <div className="form-group">
                <label htmlFor="request-prompt">Prompt</label>
                <textarea
                  id="request-prompt"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="Describe the AI task..."
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              <div className="request-info">
                <span>Input tokens <strong>1,000</strong></span>
                <span>Output tokens <strong>500</strong></span>
              </div>

              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? "Checking request..." : "⛨  Check request"}
              </button>
            </form>

            {result && (
              <div
                className={`result ${result.error ? "blocked" : result.approved ? "success" : "blocked"}`}
                role="status"
              >
                <strong>
                  {result.error
                    ? "REQUEST FAILED (SYSTEM / NETWORK ERROR)"
                    : result.approved
                    ? "✓ REQUEST APPROVED"
                    : "⊘ REQUEST BLOCKED"}
                </strong>
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </div>

          <div className="panel protection-panel">
            <p className="eyebrow">PROTECTION LAYERS</p>
            <h2>Security at the request level</h2>
            <p className="panel-description">Each simulated request is checked against these safeguards.</p>
            <Protection icon="＄" title="Budget Firewall" description="Rejects requests that would exceed the configured budget." status="ACTIVE" />
            <Protection icon="⟳" title="Loop Detection" description="Detects repeated prompts from the same agent." status="ACTIVE" />
            <Protection icon="◉" title="Request Monitoring" description="Displays backend responses and estimated request costs." status="ACTIVE" />
            <div className="notice">
              <strong>DEMO MODE</strong>
              <p>Costs use placeholder pricing assumptions. No real AI API calls or actual cloud charges are generated.</p>
            </div>
          </div>
        </section>

        <section className="panel activity-panel" id="activity">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">LIVE MONITORING</p>
              <h2>Request Activity</h2>
            </div>
            <span className="mini-tag">{activities.length} RECORDS</span>
          </div>
          <p className="panel-description">Recent requests evaluated by your budget firewall and loop detector.</p>

          {activities.length === 0 ? (
            <div className="empty-activity">No requests recorded yet. Use the request simulator to get started.</div>
          ) : (
            <div className="activity-table-wrapper">
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Agent</th>
                    <th>Model</th>
                    <th>Prompt</th>
                    <th>Est. Cost</th>
                    <th>Status</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((item, index) => {
                    const cost = Number(item?.estimated_cost_usd);
                    const formattedCost =
                      item?.estimated_cost_usd !== null &&
                      item?.estimated_cost_usd !== undefined &&
                      Number.isFinite(cost)
                        ? `$${cost.toFixed(6)}`
                        : "—";

                    let timeString = "—";
                    if (item?.timestamp) {
                      const date = new Date(item.timestamp);
                      if (Number.isFinite(date.getTime())) {
                        timeString = date.toLocaleTimeString();
                      }
                    }

                    const reasonText =
                      item?.blocked_by === "budget_firewall"
                        ? "Budget limit"
                        : item?.blocked_by === "loop_detector"
                        ? "Repeated prompt"
                        : item?.blocked_by || "—";

                    return (
                      <tr key={item?.id ?? `${item?.timestamp || ""}-${item?.agent_id || ""}-${index}`}>
                        <td>{timeString}</td>
                        <td>{item?.agent_id || "—"}</td>
                        <td>{item?.model || "—"}</td>
                        <td className="activity-prompt">{item?.prompt || "—"}</td>
                        <td>{formattedCost}</td>
                        <td>
                          <span className={`activity-status ${item?.status === "APPROVED" ? "approved" : item?.status === "BLOCKED" ? "blocked" : ""}`}>
                            {item?.status || "UNKNOWN"}
                          </span>
                        </td>
                        <td>{reasonText}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel agent-monitor" id="agent-monitor">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">AGENT MONITOR</p>
              <h2>Request health overview</h2>
            </div>
            <span className="mini-tag">SESSION</span>
          </div>
          <p className="panel-description">Summary of the activity currently held by the running demo backend.</p>
          <div className="agent-stats">
            <div className="agent-stat"><span>Total requests</span><strong>{activities.length}</strong></div>
            <div className="agent-stat"><span>Approved</span><strong>{approvedCount}</strong></div>
            <div className="agent-stat"><span>Blocked</span><strong>{blockedCount}</strong></div>
            <div className="agent-stat"><span>Budget blocks</span><strong>{budgetBlocks}</strong></div>
            <div className="agent-stat"><span>Loop blocks</span><strong>{loopBlocks}</strong></div>
          </div>
        </section>

        <footer>
          CLOUD COST FIREWALL <span>•</span> HACKATHON PROTOTYPE
          <button type="button" onClick={refreshData}>↻ Refresh data</button>
        </footer>
      </main>
    </div>
  );
}

function Stat({ title, value, note, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{title}</span>
        <span className="stat-icon">{icon}</span>
      </div>
      <h2>{value}</h2>
      <p>{note}</p>
    </div>
  );
}

function Protection({ icon, title, description, status }) {
  return (
    <div className="protection">
      <div className="protection-icon">{icon}</div>
      <div className="protection-copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <span className="active-tag">{status}</span>
    </div>
  );
}

export default App;
