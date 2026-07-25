# RemitWise AI — Multi-Agent System

> **Production-quality Multi-Agent AI architecture layered on top of the existing RemitWise AI backend.**
> All existing APIs remain fully operational. The agent layer is purely additive.

---

## Architecture Overview

```
                         User / Frontend / MCP
                                  │
                    POST /agent/chat (JSON)
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │  OrchestratorAgent  │◄──── ConversationMemory
                       │  (orchestrator.py)  │      (session-scoped)
                       └──────────┬──────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │    Planner  │  Executor   │  Merger
                    │ (intent →   │  (run agents│  (synthesise
                    │  agent list)│  safely)    │   outputs)
                    └─────────────┴─────────────┘
                                  │
             ┌────────────────────┼────────────────────┐
             ▼                    ▼                    ▼
    ┌──────────────┐   ┌──────────────────┐  ┌─────────────────┐
    │ ExchangeAgent│   │  ProviderAgent   │  │ ComplianceAgent │
    │              │   │                  │  │                 │
    │ Tools:       │   │ Tools:           │  │ Tools:          │
    │ get_rate()   │   │ compare()        │  │ get_kyc()       │
    │ convert()    │   │ list_providers() │  │ get_docs()      │
    │ history()    │   │ get_corridors()  │  │ get_aml()       │
    └──────┬───────┘   └────────┬─────────┘  └───────┬─────────┘
           │                    │                     │
           └────────────────────┴─────────────────────┘
                                │
                                ▼
                    Existing FastAPI Services
                  (exchange_service.py, etc.)
                                │
                                ▼
                    Frankfurter API / JSON data files
```

---

## New Files

```
backend/
└── agents/
    ├── __init__.py
    ├── shared/
    │   ├── schemas.py        ← All Pydantic models (AgentRequest, AgentResponse, etc.)
    │   ├── base_agent.py     ← Abstract BaseAgent with timing + error wrapping
    │   ├── logger.py         ← Colourised structured agent logger
    │   ├── memory.py         ← Thread-safe in-memory conversation memory
    │   └── utils.py          ← Currency/country normalisation, timing, text helpers
    ├── exchange/
    │   ├── prompt.py         ← Exchange agent system prompt
    │   ├── tools.py          ← Wrappers: get_latest_rate, convert_amount, etc.
    │   └── exchange_agent.py ← ExchangeAgent(BaseAgent) implementation
    ├── provider/
    │   ├── prompt.py         ← Provider agent system prompt
    │   ├── tools.py          ← Wrappers: compare_providers, list_providers, etc.
    │   └── provider_agent.py ← ProviderAgent(BaseAgent) with ranking logic
    ├── compliance/
    │   ├── prompt.py         ← Compliance agent system prompt
    │   ├── tools.py          ← Wrappers: get_kyc, get_aml, get_documents, etc.
    │   └── compliance_agent.py ← ComplianceAgent(BaseAgent) implementation
    └── orchestrator/
        ├── planner.py        ← Rule-based intent detection & agent selection
        ├── executor.py       ← Sequential agent runner with error isolation
        ├── merger.py         ← Response synthesis & summary generation
        └── orchestrator.py   ← OrchestratorAgent (main entry point)
```

**Modified files (minimal changes):**
- `api/app.py` — 2 lines added: import agent router, register it
- `api/routes/agent.py` — **NEW** route file: `/agent/chat`, `/agent/health`, `/agent/session/{id}`

---

## New API Endpoints

### `POST /agent/chat`

The main conversational endpoint.

**Request:**
```json
{
  "query": "Send 1000 USD to India. Cheapest provider and KYC docs?",
  "session_id": "user-abc-123",
  "context": {
    "base_currency": "USD",
    "target_currency": "INR",
    "amount": 1000,
    "from_country": "US",
    "to_country": "IN"
  }
}
```

**Response:**
```json
{
  "session_id": "user-abc-123",
  "query": "Send 1000 USD to India. Cheapest provider and KYC docs?",
  "agents_used": ["exchange", "provider", "compliance"],
  "plan": [
    {"agent": "exchange", "reason": "Exchange rate and conversion query (USD→INR) for 1000", "priority": 1},
    {"agent": "provider", "reason": "Provider comparison and recommendation (US→IN)", "priority": 2},
    {"agent": "compliance", "reason": "KYC/AML compliance requirements for IN", "priority": 3}
  ],
  "results": {
    "exchange": { "status": "success", "data": { "exchange_rate": {...}, "conversion": {...} } },
    "provider": { "status": "success", "data": { "best_provider": "wise", ... } },
    "compliance": { "status": "success", "data": { "documents": ["Passport", "Aadhaar Card"], ... } }
  },
  "summary": "💱 Current USD/INR rate: 96.5600 (as of 2026-07-25). You will receive approximately ₹96,560.00 for $1,000.00. 🏦 For the US → IN corridor, 3 provider(s) are available. Top recommendation: Wise. Wise is recommended — it offers a low_flat fee structure, delivers in instant. 📋 Compliance for IN: KYC verification required. Required documents: Passport, Aadhaar Card. AML screening applies.",
  "status": "success",
  "total_execution_ms": 87.3
}
```

### `GET /agent/health`

Check agent system readiness.

### `GET /agent/session/{session_id}`

Retrieve conversation history for a session.

### `DELETE /agent/session/{session_id}`

Clear conversation memory for a session.

---

## Agent Descriptions

### OrchestratorAgent

**File:** `agents/orchestrator/orchestrator.py`

The single entry point for the agent system. Coordinates:
1. **Planner** — analyses the query, extracts entities, selects agents
2. **Executor** — runs agents with error isolation
3. **Merger** — synthesises responses into coherent answer
4. **Memory** — loads/saves conversation history

### Planner

**File:** `agents/orchestrator/planner.py`

Rule-based intent detector. No LLM required. Uses:
- **Keyword scoring** — counts domain-specific keywords (exchange / provider / compliance)
- **Regex entity extraction** — pulls out currency codes, country names, amounts
- **Context inference** — infers currency from country (US→USD, IN→INR)
- **Priority ordering** — Exchange first, then Provider, then Compliance

**Examples:**

| Query | Agents Selected |
|-------|----------------|
| `"USD to INR rate"` | `[Exchange]` |
| `"cheapest provider US to India"` | `[Provider]` |
| `"KYC for India"` | `[Compliance]` |
| `"send $1000 to India, best provider and docs?"` | `[Exchange, Provider, Compliance]` |

### Executor

**File:** `agents/orchestrator/executor.py`

Runs agents sequentially in priority order. Key property: **error isolation** — if one agent fails, the others still run and return partial results.

### Merger

**File:** `agents/orchestrator/merger.py`

Synthesises multiple `AgentResponse` objects into:
- A structured `results` dict (keyed by agent name)
- A single coherent `summary` paragraph (one sentence per domain)

### ExchangeAgent

**File:** `agents/exchange/exchange_agent.py`  
**Inherits:** `BaseAgent`

Handles: live exchange rates, currency conversion, historical data.

**Tools called:**
- `get_latest_rate(base, target)` → calls `exchange_service.get_latest_rate()`
- `convert_amount(base, target, amount)` → calls `exchange_service.convert_amount()`

**Structured output:**
```json
{
  "agent": "exchange",
  "data": {
    "exchange_rate": { "rate": 96.56, "base": "USD", "target": "INR", ... },
    "conversion": { "converted_amount": 96560.0, ... }
  }
}
```

### ProviderAgent

**File:** `agents/provider/provider_agent.py`  
**Inherits:** `BaseAgent`

Handles: provider comparison, recommendation, corridor support.

**Ranking logic:** Fee score + delivery speed score → lower = better.  
Order: `no_fee < low_flat < flat < percentage < flat_plus_fx`

**Structured output:**
```json
{
  "agent": "provider",
  "data": {
    "best_provider": "wise",
    "best_provider_name": "Wise",
    "corridor": "US → IN",
    "provider_count": 3,
    "recommendation_reason": "Wise is recommended — it offers a low_flat fee structure, delivers in instant."
  }
}
```

### ComplianceAgent

**File:** `agents/compliance/compliance_agent.py`  
**Inherits:** `BaseAgent`

Handles: KYC requirements, AML rules, required documents, risk level.

Checks **both sender and receiver countries** when available.

**Structured output:**
```json
{
  "agent": "compliance",
  "data": {
    "primary_country": "IN",
    "kyc_required": true,
    "documents": ["Passport", "Aadhaar Card"],
    "aml_check": true,
    "sanctions_screening": true,
    "risk_level": "Low",
    "regulatory_framework": ["FEMA", "PMLA"]
  }
}
```

---

## Conversation Memory

Memory is stored per `session_id` using a bounded deque (max 20 turns).

- **Scope:** in-process memory (lives in uvicorn worker)
- **Thread-safe:** protected by `threading.Lock`
- **No persistence:** cleared on server restart
- **API:** `GET /agent/session/{id}` to view, `DELETE /agent/session/{id}` to clear

---

## Running Tests

```bash
cd backend

# All agent tests (no live API needed — uses mocks)
python -m pytest tests/agents/ -v

# Planner only (pure unit tests, fastest)
python -m pytest tests/agents/test_planner.py -v

# Full suite including existing backend tests
python -m pytest tests/ -v
```

---

## How the Backend Is Reused

**Zero duplication.** Agents call existing service functions directly:

| Agent | Service Called | Function |
|-------|---------------|----------|
| ExchangeAgent | `exchange_service` | `get_latest_rate()`, `convert_amount()` |
| ProviderAgent | `provider_service` | `compare_providers()`, `list_providers()` |
| ComplianceAgent | `compliance_service` | `get_country_rules()`, `get_kyc_requirements()`, etc. |

No HTTP round-trips. Agents import and call Python functions directly.

---

## Frontend Compatibility

**100% compatible.** The frontend only calls:
- `GET /exchange/latest` → unchanged ✅
- `GET /exchange/history` → unchanged ✅
- `GET /providers/compare` → unchanged ✅
- `GET /compliance/{country}` → unchanged ✅

The agent endpoints (`/agent/*`) are purely additive. Frontend can optionally integrate `POST /agent/chat` for an AI chat feature in the future.

---

## New Dependencies

None. The agent layer uses only:
- Python stdlib (`re`, `threading`, `time`, `collections`, `abc`)
- `pydantic` — already in `requirements.txt`
- `fastapi` — already in `requirements.txt`

No LLM API keys required.

---

## Sequence Diagram: Multi-Domain Query

```
User         /agent/chat     Orchestrator    Planner    Executor   Exchange  Provider  Compliance   Merger
 │                │                │             │           │          │         │          │          │
 │──POST /chat──►│                │             │           │          │         │          │          │
 │               │──run()────────►│             │           │          │         │          │          │
 │               │                │──plan()────►│           │          │         │          │          │
 │               │                │             │──detect──►│          │         │          │          │
 │               │                │◄───plan─────│           │          │         │          │          │
 │               │                │──execute()──────────────►          │         │          │          │
 │               │                │             │           │──run────►│         │          │          │
 │               │                │             │           │◄─resp────│         │          │          │
 │               │                │             │           │──run──────────────►│          │          │
 │               │                │             │           │◄─resp──────────────│          │          │
 │               │                │             │           │──run───────────────────────►  │          │
 │               │                │             │           │◄─resp──────────────────────── │          │
 │               │                │◄──responses─────────────│          │         │          │          │
 │               │                │──merge()─────────────────────────────────────────────────────────►│
 │               │                │◄──merged─────────────────────────────────────────────────────────│
 │               │                │──save memory│           │          │         │          │          │
 │               │◄─response─────│             │           │          │         │          │          │
 │◄──JSON────────│                │             │           │          │         │          │          │
```
