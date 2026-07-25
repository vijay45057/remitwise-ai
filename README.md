# RemitWise AI — Multi-Agent System

RemitWise AI is a production-quality multi-agent platform that compares international money transfer providers, predicts optimal transfer timing, validates compliance requirements, and tracks cross-border transfers.

---

## 🚀 Quick Start & Ollama Setup

RemitWise AI uses **Ollama** with the `llama3.1` model by default for intelligent natural language planning.

### 1. Install & Serve Ollama

```bash
# Pull the recommended model
ollama pull llama3.1

# Start the Ollama server (default host: http://localhost:11434)
ollama serve
```

### 2. Run the Backend API

```bash
cd backend
python -m uvicorn api.app:app --reload
```

The server runs at `http://localhost:8000`.

---

## 🛡️ Multi-Tier Automatic Fallback Mechanics

The multi-agent system features a resilient, 3-tier fallback architecture to ensure **zero downtime** and **100% operational availability**:

```
                       User Request
                            │
                            ▼
                  OrchestratorAgent
                            │
            ┌───────────────┴───────────────┐
            │   Primary LLM: OllamaProvider │
            │   (Host: localhost:11434)     │
            └───────────────┬───────────────┘
                            │ (If offline / connection refused / model missing / timeout)
                            ▼
            ┌───────────────────────────────┐
            │  Fallback 1: MockProvider     │
            │  (Offline simulation)         │
            └───────────────┬───────────────┘
                            │ (If LLM response malformed / invalid)
                            ▼
            ┌───────────────────────────────┐
            │  Fallback 2: RuleBasedPlanner │
            │  (Deterministic Heuristics)   │
            └───────────────────────────────┘
```

1. **Primary (`OllamaProvider`)**: Attempts connection to local Ollama (`llama3.1`).
2. **Fallback 1 (`MockProvider`)**: If Ollama is offline or unavailable, automatically switches to `MockProvider` without raising errors.
3. **Fallback 2 (`RuleBasedPlanner`)**: If LLM planning fails completely, automatically falls back to deterministic rule-based planning.

> **Note**: The application will **never crash** due to an LLM service failure or network timeout.

---

## ⚙️ Configuration Guide

Set configuration variables in `.env` or system environment:

```bash
# Default provider settings
LLM_PROVIDER=ollama
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.1

# Optional OpenAI Provider settings
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
```

---

## 🧪 Running Tests

```bash
cd backend

# Run the complete test suite (60+ unit tests)
python -m pytest tests/ -v
```
