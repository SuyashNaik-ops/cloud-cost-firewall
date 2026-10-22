 🛡️ Cloud Cost Firewall

 Runtime AI Security • Intelligent Cost Governance • AI Infrastructure Protection

<p align="center">
  <strong>Control AI Spending. Prevent Runaway Requests. Protect AI Infrastructure.</strong>
</p>

<p align="center">
  An AI infrastructure security and FinOps governance platform designed to detect repeated AI requests, enforce configurable spending limits, and monitor AI application activity through a unified dashboard.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Project-Cloud%20Cost%20Firewall-0A192F?style=for-the-badge" alt="Cloud Cost Firewall"/>
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Status-Prototype-orange?style=for-the-badge" alt="Prototype"/>
</p>



 📌 Table of Contents

 [Overview](#-overview)
 [The Problem](#-the-problem)
 [Our Solution](#-our-solution)
 [Project Objectives](#-project-objectives)
 [Key Features](#-key-features)
 [How It Works](#-how-it-works)
 [System Architecture](#-system-architecture)
 [Core Security Modules](#-core-security-modules)
 [Technology Stack](#-technology-stack)
* [Project Structure](#-project-structure)
* [Getting Started](#-getting-started)
* [Configuration](#-configuration)
* [Running the Application](#-running-the-application)
* [API Documentation](#-api-documentation)
* [Cost Estimation](#-cost-estimation)
* [Testing and Simulation](#-testing-and-simulation)
* [Dashboard](#-dashboard)
* [Use Cases](#-use-cases)
* [Security Considerations](#-security-considerations)
* [Current Limitations](#-current-limitations)
* [Future Roadmap](#-future-roadmap)
* [Team](#-team)
* [Contributing](#-contributing)
* [License](#-license)

---

 🚀 Overview

**Cloud Cost Firewall** is a prototype platform for runtime AI cost governance and infrastructure protection.

As organizations integrate Large Language Models (LLMs), AI agents, and generative AI applications into their products, they face a growing challenge: controlling the operational cost and behavior of AI-powered systems.

An application may unintentionally send the same request repeatedly, enter an agent execution loop, consume an excessive number of tokens, or exceed its intended spending budget.

These problems can increase operational expenses, waste computing resources, and make AI systems more difficult to manage.

Cloud Cost Firewall explores a solution by combining cost estimation, configurable budget enforcement, repeated-request detection, and operational monitoring into a unified interface.

Instead of focusing exclusively on how much an AI application has spent, the project focuses on a broader question:

> **Can we detect potentially wasteful AI activity and enforce cost-related policies before that activity becomes an expensive operational problem?**

The project includes a FastAPI backend, a React dashboard, and a simulation environment for demonstrating security and cost-governance scenarios.

### Project Information

| Attribute         | Details                                             |
| ----------------- | --------------------------------------------------- |
| Project Name      | Cloud Cost Firewall                                 |
| Domain            | AI Infrastructure Security and FinOps               |
| Project Type      | AI governance and runtime monitoring prototype      |
| Backend           | Python, FastAPI                                     |
| Frontend          | React, Vite, JavaScript                             |
| API Style         | REST                                                |
| API Documentation | FastAPI interactive documentation                   |
| Institution       | Pravara Rural Engineering College, Loni             |
| Team              | VoiceLink                                           |
| Primary Goal      | Demonstrate runtime AI cost controls and monitoring |

**Repository:** [SuyashNaik-ops/cloud-cost-firewall](https://github.com/SuyashNaik-ops/cloud-cost-firewall)

---

## ❗ The Problem

Generative AI has made it easier than ever to build intelligent applications. However, the operational behavior of these applications can introduce unexpected costs and reliability problems.

### 1. Uncontrolled AI Spending

AI services may charge according to input tokens, output tokens, requests, model selection, or other usage metrics.

Without appropriate monitoring and budget controls, an application can generate more usage than its developers intended.

**Example:** A developer sets a small budget for an AI application, but repeated requests gradually push usage beyond the planned amount.

### 2. Repeated Requests

Applications can accidentally submit identical or nearly identical requests multiple times.

This may happen because of retry logic, frontend errors, duplicated events, or poorly controlled agent workflows.

**Result:** Unnecessary processing and potentially avoidable costs.

### 3. AI Agent Loops

AI agents can repeatedly call tools, revisit the same task, or continue executing without making meaningful progress.

A poorly controlled workflow can consume additional API requests and computing resources.

**Result:** Wasteful execution, increased latency, and unpredictable costs.

### 4. Limited Runtime Visibility

Developers may have access to cloud billing dashboards, but billing information alone does not necessarily explain which application behavior caused an unexpected increase.

A team may need to understand:

* Which requests were approved or blocked.
* Whether repeated activity was detected.
* Whether a spending threshold was reached.
* How estimated costs change during a simulation.
* What actions occurred during a test run.

### 5. Reactive Cost Management

Traditional billing alerts often help teams understand that spending has increased after usage has already occurred.

Runtime governance introduces another layer: evaluating requests and enforcing policies before allowing additional activity.

Cloud Cost Firewall explores this approach through a demonstration environment.

---

## 💡 Our Solution

Cloud Cost Firewall brings together three primary concepts:

### 🛡️ Runtime Budget Enforcement

Evaluate estimated request costs against a configurable spending budget.

Requests that violate the configured budget policy can be blocked by the application.

### 🔁 Repeated-Request Detection

Track repeated activity within a defined time window and flag requests that exceed the configured repetition threshold.

This helps demonstrate how an application can identify potentially wasteful request patterns.

### 📊 Centralized Monitoring

Present cost estimates, security decisions, request activity, and monitoring information through a unified dashboard.

The aim is to make runtime AI governance easier to understand, demonstrate, and extend.

### The Core Idea

```text
AI REQUEST
    |
    v
REQUEST EVALUATION
    |
    +----> Estimate Request Cost
    |
    +----> Check Budget Policy
    |
    +----> Detect Repeated Activity
    |
    v
POLICY DECISION
    |
    +----> APPROVED
    |
    +----> BLOCKED
    |
    v
ACTIVITY MONITORING
    |
    v
DASHBOARD AND REPORTING
```

This represents the intended conceptual workflow. The exact execution order and enforcement guarantees depend on the implemented backend modules.

---

## 🎯 Project Objectives

The primary objectives of Cloud Cost Firewall are:

1. **Cost awareness:** Estimate the potential cost associated with AI requests.
2. **Budget governance:** Demonstrate configurable spending limits.
3. **Loop detection:** Identify repeated activity within a configurable time window.
4. **Runtime policy enforcement:** Approve or block requests according to defined rules.
5. **Activity monitoring:** Provide visibility into request decisions and simulated events.
6. **Developer usability:** Expose backend functionality through a documented API and interactive dashboard.
7. **Extensibility:** Establish a foundation for integrating additional AI security and cost-governance capabilities.

---

## ✨ Key Features

### 1. 💰 Budget Firewall

The budget firewall evaluates request costs against a configured budget.

**What it demonstrates:**

* Configurable budget thresholds.
* Estimated request-cost calculations.
* Budget-related approval or blocking decisions.
* Testing of budget-exceeded scenarios.

**Example scenario:**

A simulation begins with a configured spending limit. As requests are processed, the estimated cost is evaluated against the remaining budget.

If the next request would exceed the permitted limit, the policy can reject that request.

The exact behavior depends on how the budget accounting and request evaluation are implemented.

### 2. 🔄 Loop Detector

The loop detector identifies repeated requests within a configurable time window.

For example, the project has used a configuration with:

* Maximum repeats: `5`
* Detection window: `30 seconds`

When repeated activity reaches the configured threshold, the detector can flag the activity for blocking.

These values are example development settings, not universal recommendations.

**Why this matters:**

Repeated requests may indicate:

* Incorrect retry behavior.
* A duplicated frontend action.
* An agent repeating the same operation.
* A workflow that is failing to make progress.

Repeated requests are not necessarily malicious. A production implementation should distinguish legitimate retries from genuinely problematic activity.

### 3. 📊 Monitoring Dashboard

The React frontend provides a centralized interface for observing the system.

The project interface includes the following navigation areas:

| Dashboard Section | Purpose                                         |
| ----------------- | ----------------------------------------------- |
| Overview          | High-level system and monitoring information    |
| AI Firewall       | AI request and policy-control interface         |
| Agent Monitor     | Monitoring interface for agent-related activity |
| Activity          | Visibility into recorded or simulated events    |

The dashboard is intended to make security decisions and cost-governance behavior easier to inspect.

The metrics displayed depend on the backend data and frontend implementation.

### 4. 🧪 Simulation Environment

The project includes a simulator for demonstrating different request patterns and policy decisions.

A simulation can be used to explore scenarios such as:

* Normal request processing.
* Repeated requests.
* Budget-limit violations.
* Multiple consecutive blocked requests.
* Changes in estimated cost during execution.

Simulation is particularly useful when demonstrating a security concept without connecting the application to a real paid AI provider.

### 5. ⚡ FastAPI Backend

The backend exposes application functionality through HTTP endpoints.

FastAPI also provides interactive API documentation, allowing developers to inspect available routes and test supported operations.

The backend currently exposes routes including:

* `/`
* `/health`
* `/dashboard`

Additional routes should be documented here as they are verified in the implementation.

### 6. 📚 Technical Documentation

The project includes a technical documentation feature intended to help developers and judges understand the architecture and technology stack.

The existing project documentation work also includes:

* A technical stack and architecture document.
* A technical-stack interface in the application.
* A print-to-PDF documentation page.
* Information about packages and technologies used by the project.

Documentation should remain consistent with the actual implementation as the project evolves.

---

## ⚙️ How It Works

Cloud Cost Firewall can be understood as a request-governance workflow.

### Step 1: A Request Enters the System

An AI application or simulator submits a request for evaluation.

The request may contain information needed to estimate its cost and evaluate its behavior.

The exact request format depends on the implemented endpoint.

### Step 2: The System Estimates Cost

The backend estimates the potential cost associated with the request.

The estimate can be used as an input to the budget policy.

The quality of the estimate depends on the pricing assumptions, token counts, model configuration, and other factors supported by the implementation.

### Step 3: The Budget Policy Is Evaluated

The estimated request cost is compared with the applicable budget policy.

If the request would violate the policy, the system can return a blocked decision.

### Step 4: Repeated Activity Is Evaluated

The loop detector checks whether the request matches a repeated pattern within the configured time window.

If the repetition threshold is exceeded, the system can block the request according to the configured policy.

### Step 5: A Decision Is Produced

Depending on the applicable rules, the request may be approved or blocked.

The simulator can demonstrate different decisions under different configurations.

### Step 6: Activity Is Presented

The dashboard provides a place to inspect the results of request evaluation and monitoring.

The completeness of the displayed information depends on the implemented logging, persistence, and frontend integrations.

---

## 🏗️ System Architecture

Cloud Cost Firewall follows a frontend-and-backend architecture.

```text
                  ┌────────────────────────────┐
                  │       USER / DEVELOPER     │
                  └─────────────┬──────────────┘
                                │
                                v
                  ┌────────────────────────────┐
                  │       REACT FRONTEND       │
                  │                            │
                  │  Overview                  │
                  │  AI Firewall               │
                  │  Agent Monitor              │
                  │  Activity                  │
                  └─────────────┬──────────────┘
                                │
                         HTTP / REST API
                                │
                                v
                  ┌────────────────────────────┐
                  │       FASTAPI BACKEND      │
                  │                            │
                  │  API Endpoints             │
                  │  Request Evaluation        │
                  │  Cost Estimation           │
                  │  Policy Enforcement        │
                  │  Loop Detection            │
                  └─────────────┬──────────────┘
                                │
                                v
                  ┌────────────────────────────┐
                  │     POLICY DECISION        │
                  │                            │
                  │  Approve                  │
                  │  Block                    │
                  │  Return Decision          │
                  └─────────────┬──────────────┘
                                │
                                v
                  ┌────────────────────────────┐
                  │     MONITORING / UI        │
                  │                            │
                  │  Status                    │
                  │  Activity                  │
                  │  Cost Estimates            │
                  │  Simulation Results        │
                  └────────────────────────────┘
```

*This is a conceptual architecture diagram. It describes the project's major responsibilities rather than guaranteeing that every component is implemented as a separate service.*

### Architecture Components

| Component             | Responsibility                             |
| --------------------- | ------------------------------------------ |
| React frontend        | Provides the user interface                |
| Vite                  | Supports frontend development and building |
| FastAPI               | Exposes backend HTTP endpoints             |
| Cost estimation logic | Estimates request-related costs            |
| Budget firewall       | Evaluates configured spending policies     |
| Loop detector         | Identifies repeated activity               |
| Simulator             | Demonstrates runtime scenarios             |
| Dashboard integration | Presents available monitoring information  |

### Architecture Design Goals

The architecture aims to support:

* Clear separation between frontend and backend responsibilities.
* Independently testable backend policy logic.
* Configurable policy parameters.
* Reproducible demonstration scenarios.
* Future integration with real AI services.
* Additional monitoring and reporting features.

---

## 🔐 Core Security Modules

### A. Budget Policy Engine

The budget policy engine evaluates estimated request costs against a spending limit.

A simplified conceptual rule is:

```python
if estimated_cost > remaining_budget:
    decision = "BLOCKED"
else:
    decision = "APPROVED"
```

This is illustrative pseudocode, not a replacement for the actual implementation.

A robust implementation must account for concurrent requests, cumulative usage, reservations, rounding, and consistent accounting.

### B. Loop Detection Engine

The loop detector observes repeated requests over a defined period.

A simplified conceptual model is:

```text
Receive request
      |
      v
Identify request pattern
      |
      v
Check repetition window
      |
      v
Compare with threshold
      |
      +---- Threshold exceeded ---> BLOCK / FLAG
      |
      +---- Threshold not exceeded -> CONTINUE
```

A production detector should consider legitimate retries, request identity, user or agent identity, and the possibility that similar requests may have different purposes.

### C. Request Decision Layer

The decision layer combines relevant policy outcomes to determine whether an operation should be permitted.

Potential decision categories include:

* Approved.
* Blocked by budget policy.
* Blocked by loop detection.
* Rejected because of invalid input or another application error.

The actual response values should follow the backend's API contract.

### D. Monitoring and Auditability

Useful monitoring information can include:

* Request timestamps.
* Policy decisions.
* Estimated cost.
* Blocking reasons.
* Repetition counts.
* Simulator outcomes.

These fields are suggested monitoring requirements; their availability depends on the implemented logging and storage functionality.

For production deployments, security-relevant events should be recorded in a reliable, access-controlled audit system.

---

## 🧰 Technology Stack

### Backend

| Technology | Role                                                      |
| ---------- | --------------------------------------------------------- |
| Python     | Backend programming language                              |
| FastAPI    | HTTP API framework                                        |
| Uvicorn    | ASGI server used to run the backend                       |
| Pydantic   | Data validation and schema support through FastAPI        |
| SQLAlchemy | Database toolkit available in the development environment |

The use of SQLAlchemy in the development environment does not by itself establish that every policy decision or event is persisted in a database.

### Frontend

| Technology | Role                                          |
| ---------- | --------------------------------------------- |
| React      | User interface components                     |
| Vite       | Frontend development server and build tooling |
| JavaScript | Frontend application logic                    |
| HTML       | Application structure                         |
| CSS        | Styling and layout                            |

### Development and Testing

| Tool                       | Role                             |
| -------------------------- | -------------------------------- |
| Git                        | Version control                  |
| GitHub                     | Source-code hosting              |
| FastAPI Swagger UI         | Interactive API exploration      |
| Python virtual environment | Backend dependency isolation     |
| Local simulator            | Demonstration of policy behavior |

### Technology Selection Rationale

**Python** provides a practical foundation for implementing policy logic, numerical calculations, and AI-related integrations.

**FastAPI** makes it possible to expose backend functionality through a structured HTTP API and generate interactive documentation.

**React** supports a component-based dashboard that can evolve as monitoring capabilities expand.

**Vite** provides a development workflow for building and running the frontend.

Together, these technologies provide a foundation for experimenting with runtime AI governance.

---

## 📂 Project Structure

The repository contains backend, frontend, simulator, and testing areas.

A conceptual representation of the project is shown below.

```text
cloud-cost-firewall/
│
├── backend/
│   ├── main.py
│   ├── .venv/
│   └── ...
│
├── frontend/
│   ├── package.json
│   ├── src/
│   ├── public/
│   └── ...
│
├── simulator/
│   └── ...
│
├── tests/
│   └── ...
│
├── TECH_STACK_DOCUMENTATION.md
├── README.md
└── ...
```

**Note:** This is an illustrative structure, not a guaranteed exhaustive listing of repository files. The exact modules and filenames should be verified against the current repository.

### Directory Responsibilities

* `backend/` — Backend application and API implementation.
* `frontend/` — React user interface and frontend assets.
* `simulator/` — Simulation code used to demonstrate request and policy scenarios.
* `tests/` — Automated or manual testing assets, depending on the implemented test suite.
* `TECH_STACK_DOCUMENTATION.md` — Technical stack and architecture documentation, where present.
* `README.md` — Project overview and developer setup instructions.

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Install the following tools:

* Python 3.12 or another explicitly supported Python version.
* Node.js and npm.
* Git.
* A code editor such as Visual Studio Code.

Python 3.12.7 has been used successfully in the project's development environment.

Check your installations:

```bash
python --version
node --version
npm --version
git --version
```

If your system has multiple Python versions, make sure the backend virtual environment uses the intended interpreter.

### 1. Clone the Repository

```bash
git clone https://github.com/SuyashNaik-ops/cloud-cost-firewall.git
```

Move into the project directory:

```bash
cd cloud-cost-firewall
```

### 2. Set Up the Backend Environment

Create a virtual environment using Python 3.12:

```bash
py -3.12 -m venv backend/.venv
```

Activate it on Windows Command Prompt:

```bat
backend\.venv\Scripts\activate.bat
```

If you are using PowerShell and script execution restrictions prevent activation, you can invoke the virtual environment's Python executable directly.

### 3. Install Backend Dependencies

Install the packages listed in the repository's backend dependency manifest.

For example, if the project uses `backend/requirements.txt`:

```bash
backend\.venv\Scripts\python.exe -m pip install -r backend/requirements.txt
```

If the repository uses a different dependency-management file, follow that file instead.

Do not install dependencies from an assumed manifest path without checking that the file exists.

### 4. Start the Backend

From the project root, the development command used for this project is:

```bash
backend\.venv\Scripts\python.exe -m uvicorn --app-dir backend main:app --reload
```

The backend should start using the configuration defined by the application.

Verify the terminal output and check the available health endpoint.

### 5. Start the Frontend

Open a second terminal:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend development server has been configured to use port `5173` in the development environment.

Open the local address printed by Vite in your browser.

### 6. Verify the Application

Check the backend health endpoint:

```text
http://127.0.0.1:8000/health
```

Open the interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

Open the frontend using the local address printed in the terminal, typically:

```text
http://localhost:5173
```

If the frontend reports that the backend is offline, verify that:

1. The backend process is running.
2. The frontend is configured to contact the correct backend address.
3. The backend's CORS configuration permits the frontend origin.
4. The browser console does not report a network or API error.
5. The required backend dependencies are installed.

---

## ⚙️ Configuration

Cloud Cost Firewall uses configurable values to demonstrate cost and request-governance behavior.

### Example Development Configuration

| Setting          | Example Value | Purpose                       |
| ---------------- | ------------: | ----------------------------- |
| `BUDGET_USD`     |        `0.01` | Example budget threshold      |
| Maximum repeats  |           `5` | Example repetition threshold  |
| Detection window |  `30 seconds` | Example loop-detection window |

These are example development values used during project testing. They are not necessarily suitable for a production workload.

### Budget Configuration

The budget setting determines the spending limit used by the budget policy.

For example:

```text
BUDGET_USD=0.01
```

This represents a configured budget of one cent in US dollars.

The application must use consistent accounting rules when comparing estimated costs with the budget.

### Loop Detection Configuration

The loop detector uses a repetition threshold and a time window.

For example:

```text
Maximum repeats: 5
Time window: 30 seconds
```

This allows the detector to evaluate whether repeated activity crosses the configured threshold during the specified period.

**Important:** The actual environment variable names, configuration file format, and threshold semantics should match the backend implementation. Do not assume the example values are loaded automatically unless the corresponding configuration code exists.

---

## 🔌 API Documentation

Cloud Cost Firewall uses FastAPI to expose HTTP endpoints.

The interactive API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

This interface allows developers to inspect the available endpoints, examine their schemas, and test supported requests.

### Known Development Endpoints

| Endpoint         | Purpose                    |
| ---------------- | -------------------------- |
| `GET /`          | Root endpoint              |
| `GET /health`    | Health-check endpoint      |
| `GET /dashboard` | Dashboard-related endpoint |

The exact response schemas should be inspected in the running application's documentation.

### Root Endpoint

The root endpoint provides an entry point for the backend API.

Example:

```http
GET /
```

Its actual response depends on the backend implementation.

### Health Endpoint

The health endpoint can be used to check whether the application responds to an HTTP request.

Example:

```http
GET /health
```

A successful response confirms that the endpoint is reachable. It does not necessarily prove that every dependency, database, or external service is healthy.

### Dashboard Endpoint

The dashboard endpoint provides dashboard-related backend functionality.

Example:

```http
GET /dashboard
```

Inspect the API schema to determine which metrics and data fields it returns.

### Adding New API Documentation

When additional endpoints are implemented, document each endpoint using a consistent format:

* HTTP method and path.
* Purpose.
* Required request fields.
* Optional request fields.
* Successful response.
* Possible error responses.
* Authentication requirements, if applicable.
* Relevant policy behavior.

This makes the API easier for developers and judges to evaluate.

---

## 💵 Cost Estimation

Cost estimation is a central concept in Cloud Cost Firewall.

AI service costs may depend on factors such as:

* Input tokens.
* Output tokens.
* Model-specific pricing.
* Cached input or other provider-specific pricing categories.
* Tool usage or other separately billed operations.

A simple token-based estimate can be expressed as:

$$
C = \frac{T_{in}}{10^6}P_{in}
  + \frac{T_{out}}{10^6}P_{out}
$$

Where:

* \(C\) is the estimated request cost.
* \(T_{in}\) is the number of input tokens.
* \(T_{out}\) is the number of output tokens.
* \(P_{in}\) is the input price per million tokens.
* \(P_{out}\) is the output price per million tokens.

This formula is illustrative. The actual calculation must match the pricing model of the AI service being evaluated.

### Example Development Calculation

The project has used the following example calculation:

```python
estimate_cost(1000, 500)
```

With the development pricing assumptions used in that example, the result was:

```text
Estimated cost: $0.00155
```

This is a development example, not a universal price for processing 1,000 input tokens and 500 output tokens.

Actual prices depend on the provider, model, pricing schedule, and applicable billing rules.

### Why Cost Estimation Matters

Cost estimates can help the system:

1. Compare request costs with a configured budget.
2. Demonstrate how repeated requests affect projected spending.
3. Explain why a request was rejected by a budget policy.
4. Explore how different usage patterns affect cost.
5. Support more detailed reporting in future versions.

### Important Accounting Considerations

A production implementation should distinguish estimated cost from actual billed cost.

It should also define how the budget is updated, how concurrent requests are handled, and how failed or cancelled requests are accounted for.

A cost estimate alone does not guarantee that the actual cloud bill will remain below a specified amount.

---

## 🧪 Testing and Simulation

Testing is essential because a runtime governance system must behave predictably under different request patterns.

Cloud Cost Firewall includes simulation-related project components intended to demonstrate policy behavior.

### Scenario 1: Normal Request

**Objective:** Demonstrate ordinary request evaluation.

Expected conceptual behavior:

1. A request enters the system.
2. The applicable policy checks run.
3. The request is approved if no blocking rule applies.
4. The result is made available to the relevant interface.

### Scenario 2: Budget Threshold

**Objective:** Demonstrate budget-related request blocking.

Test steps:

1. Configure a small spending limit.
2. Submit simulated requests with known estimated costs.
3. Observe how the policy evaluates the requests.
4. Verify the resulting approval or blocking decision.
5. Check whether the reported cost and remaining budget are consistent with the implementation.

### Scenario 3: Repeated Requests

**Objective:** Demonstrate loop detection.

Test steps:

1. Configure the repetition threshold.
2. Configure the detection window.
3. Generate repeated requests through the simulator.
4. Observe when the detector flags or blocks activity.
5. Verify that unrelated requests are handled according to the intended policy.

### Scenario 4: Combined Policy Behavior

**Objective:** Explore interactions between the budget firewall and loop detector.

A simulated request sequence can help demonstrate how different policy conditions affect decisions.

The implementation should define whether the policies run sequentially, independently, or through a combined decision engine.

### Scenario 5: API Availability

**Objective:** Confirm that the backend is reachable.

Test steps:

1. Start the backend.
2. Request the health endpoint.
3. Inspect the returned response.
4. Open the interactive API documentation.
5. Verify that the frontend can communicate with the backend.

### Example Development Observation

During an earlier development simulation, the following outcomes were observed:

| Simulated Requests | Observed Outcome           |
| ------------------ | -------------------------- |
| Requests 1–3       | Approved                   |
| Requests 4–5       | Blocked by budget firewall |
| Requests 6–10      | Blocked by loop detector   |

This records a development scenario, not a guarantee that every run will produce these results.

The outcome depends on the simulator inputs, budget settings, repetition threshold, request history, and execution order.

### Testing Principles

A reliable test suite should verify:

* Correct cost calculations.
* Budget-boundary behavior.
* Repetition counting.
* Time-window expiration.
* Correct approval and blocking decisions.
* Handling of invalid requests.
* Consistent responses under concurrent requests.
* Proper frontend/backend communication.
* Correct behavior when dependencies are unavailable.

Only tests that have actually been executed should be reported as passing.

---

## 📊 Dashboard

The dashboard is the primary interface for exploring the project's functionality.

### Overview

The Overview section provides a starting point for examining system status and available monitoring information.

Potential future additions include:

* Estimated usage cost.
* Approved and blocked request counts.
* Budget utilization.
* Recent policy decisions.
* System health indicators.

These should be described as implemented metrics only after they are connected to real backend data.

### AI Firewall

The AI Firewall section focuses on request evaluation and cost-governance functionality.

It is intended to provide a convenient interface for exploring how policy decisions affect incoming requests.

### Agent Monitor

The Agent Monitor section provides an interface for agent-related monitoring.

A more advanced implementation could incorporate:

* Per-agent usage.
* Request frequency.
* Repeated-action detection.
* Tool-call limits.
* Execution duration.
* Agent-specific spending limits.

These are potential capabilities, not claims that all of them currently exist.

### Activity

The Activity section provides a place to inspect system activity and simulated events.

Useful additions could include timestamps, decision reasons, estimated costs, and request identifiers.

---

## 🌍 Use Cases

Cloud Cost Firewall explores several potential applications of runtime AI cost governance.

### 1. AI-Powered Applications

Applications that send requests to language models can use cost policies to reduce the risk of uncontrolled usage.

### 2. AI Agent Workflows

Agent-based systems can generate multiple model requests while attempting to complete a task.

Repetition detection and request budgets can help identify problematic execution patterns.

### 3. Development and Testing

Developers can use a simulator to test budget policies before integrating them into a larger application.

### 4. AI Product Prototypes

Teams building AI prototypes can experiment with cost thresholds and request-governance rules before introducing more comprehensive infrastructure.

### 5. Educational Demonstrations

The project can demonstrate concepts related to:

* AI application architecture.
* API development.
* Runtime monitoring.
* Cloud cost estimation.
* Policy enforcement.
* Repeated-request detection.
* Frontend/backend integration.

---

## 🔒 Security Considerations

Cloud Cost Firewall is a prototype for exploring AI cost governance. It should not be considered a complete cloud security product or a guaranteed spending-control mechanism.

### API Authentication

A production deployment should authenticate API clients and enforce appropriate permissions.

An exposed endpoint should not be assumed safe merely because it is part of a prototype.

### Budget Enforcement

Budget policies must account for concurrent requests and cumulative usage.

If two requests independently check the same remaining budget before either request updates the accounting state, both may be approved even when their combined cost exceeds the limit.

Production implementations should address this race condition.

### Cost Accuracy

Estimated costs depend on pricing assumptions and usage information.

A production system should validate its calculations against the relevant provider's pricing rules and actual usage records.

### Request Tracking

Repeated-request detection should use an appropriate request identity and scope.

A global repetition counter may incorrectly combine unrelated requests from different users or agents.

### Secrets Management

API keys and credentials should be stored securely and must not be committed to the repository.

Environment files containing secrets should be excluded from version control.

### Logging and Privacy

Logs should avoid unnecessarily storing sensitive prompts, credentials, personal information, or confidential application data.

Access to audit records should be controlled.

### Failure Handling

A production system must define what happens when the policy service, database, or monitoring component becomes unavailable.

For high-risk workloads, policy enforcement should fail safely according to clearly defined requirements.

### Deployment Security

Before public deployment, the application should be reviewed for:

* Authentication and authorization.
* Input validation.
* CORS restrictions.
* Rate limiting.
* Secure secret handling.
* Dependency vulnerabilities.
* Logging and monitoring.
* Error handling.
* Production server configuration.

---

## ⚠️ Current Limitations

Cloud Cost Firewall is being developed as a prototype, and its current scope should be understood accordingly.

Potential limitations include:

1. **Prototype scope:** The current implementation focuses on demonstrating cost-governance concepts rather than providing a complete enterprise platform.
2. **Estimated costs:** Calculated costs may differ from actual provider billing.
3. **Provider integration:** Real AI-provider interception and enforcement should not be assumed unless explicitly implemented.
4. **Simulation versus production:** Simulated request outcomes do not prove that the same controls operate across an actual cloud infrastructure.
5. **Persistence:** Durable storage of request histories and policy decisions depends on the implemented database and logging layers.
6. **Concurrency:** Production budget enforcement requires careful handling of simultaneous requests.
7. **Authentication:** Production access controls must be implemented and verified before exposing sensitive endpoints.
8. **Detection accuracy:** Repeated requests can be legitimate, so a repetition threshold alone cannot establish malicious behavior.

These limitations provide a clear direction for further engineering work.

---

## 🛣️ Future Roadmap

The following improvements could extend Cloud Cost Firewall into a more comprehensive AI governance platform.

### Phase 1: Strengthen the Core

* [ ] Expand automated tests for budget policies.
* [ ] Test repetition thresholds and time-window behavior.
* [ ] Standardize API response schemas.
* [ ] Improve error handling.
* [ ] Validate cost-estimation calculations.
* [ ] Document configuration and policy semantics.

### Phase 2: Improve Monitoring

* [ ] Add persistent request-event storage.
* [ ] Introduce searchable activity history.
* [ ] Display budget utilization.
* [ ] Add policy-decision explanations.
* [ ] Track per-agent request activity.
* [ ] Introduce structured audit logging.

### Phase 3: Integrate AI Providers

* [ ] Add a provider integration layer.
* [ ] Support provider-specific token and usage information.
* [ ] Compare estimated costs with reported usage.
* [ ] Introduce configurable model-specific pricing.
* [ ] Implement request controls around supported provider calls.
* [ ] Test behavior using controlled development workloads.

### Phase 4: Advanced Governance

* [ ] Add per-user and per-agent spending limits.
* [ ] Support configurable rate limits.
* [ ] Introduce request quotas.
* [ ] Add more sophisticated loop-detection policies.
* [ ] Explore anomaly detection for unusual usage patterns.
* [ ] Provide exportable cost and activity reports.

### Phase 5: Production Readiness

* [ ] Implement authentication and authorization.
* [ ] Secure budget accounting against concurrent requests.
* [ ] Add robust persistence and recovery.
* [ ] Introduce comprehensive monitoring.
* [ ] Conduct security and performance testing.
* [ ] Document deployment and operational procedures.

**Roadmap note:** These are proposed improvements. They should not be interpreted as completed functionality.

---

## 🤝 Contributing

Contributions and constructive feedback can help improve the project.

### How to Contribute

1. Fork the repository.
2. Create a separate branch for your changes.
3. Make a focused modification.
4. Run the relevant tests.
5. Document any new configuration or behavior.
6. Submit a pull request describing the changes.

### Contribution Guidelines

When contributing, please:

* Keep changes focused and understandable.
* Avoid committing secrets or credentials.
* Add tests for new policy behavior.
* Document changes to API contracts.
* Clearly identify limitations or assumptions.
* Avoid claiming functionality that has not been verified.

---

## 📜 License

A license should be added to the repository before redistribution terms are claimed.

Until a license is present, do not assume that the project is available for unrestricted reuse.

---

## 👥 Team

**Project:** Cloud Cost Firewall

**Team:** VoiceLink

**Institution:** Pravara Rural Engineering College, Loni

**Domain:** AI Infrastructure Security & Runtime FinOps Governance

### Project Vision

We aim to explore how AI applications can become more cost-aware, observable, and predictable through runtime governance.

As AI systems become more capable, managing their behavior and operational costs becomes an important engineering challenge.

Cloud Cost Firewall is a step toward exploring practical mechanisms for request-level cost evaluation, configurable spending policies, repeated-activity detection, and centralized monitoring.

---

## ⭐ Support the Project

If you find this project interesting:

* Explore the source code.
* Review the architecture.
* Experiment with the local simulation.
* Suggest improvements.
* Report bugs and unexpected behavior.
* Contribute tests and documentation.

Every constructive contribution helps make the project more reliable and easier to understand.

---

## 🔗 Repository

**Cloud Cost Firewall — AI Infrastructure Security & Runtime FinOps Governance**

Repository: `SuyashNaik-ops/cloud-cost-firewall`

Built with Python, FastAPI, React, and Vite.

**The goal: make AI usage more observable, cost-aware, and governed at runtime.**
