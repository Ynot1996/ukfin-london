# Sentinel — FCA Supervision Intelligence

An early-warning system that mines the **CFPB Consumer Complaint Database** for
**AI / automation-driven consumer harm**, clusters it into recurring patterns,
and ranks those patterns so a regulator can see *what to act on first* — striking
the balance between consumer protection and financial innovation.

## The pipeline (workflow)

```
CFPB API  ─►  Stage 1: candidate filter   ─►  Stage 2: adjudication   ─►
              (likelihood × narrative          (LLM via Claude, or a
               signal — high recall)            deterministic score)

          ─►  Stage 3: clustering          ─►  Stage 4: scoring + alerts
              (TF-IDF + KMeans, unsupervised    (weighted priority, severity,
               harm-pattern discovery)           status, live alerts, trend)

          ─►  dashboard.json  ─►  FastAPI  ─►  React dashboard
```

**Why clustering, not random forest:** we have no labelled training data telling
us which harm pattern a complaint belongs to — the goal is to *discover* the
patterns. That is an unsupervised problem, so we cluster (TF-IDF + KMeans, k
chosen by silhouette). Random forest is supervised and would need labels we
don't have.

**Priority score** (transparent, tunable weights):
`0.25·frequency + 0.30·severity + 0.20·growth + 0.15·regulatory_relevance + 0.10·AI_confidence`.

## Layout

```
Sentinel/
├── backend/        Python pipeline + FastAPI
│   ├── cfpb_client.py        CFPB fetcher (month-chunked, retry/backoff)
│   ├── ai_filter.py          Stage 1: two-signal candidate filter
│   ├── llm_adjudicator.py    Stage 2: LLM (Claude) or deterministic score
│   ├── cluster.py            Stage 3: TF-IDF + KMeans clustering
│   ├── scoring.py            Stage 4: priority, severity, alerts, trend
│   ├── build_dashboard.py    orchestrator → output/dashboard.json
│   ├── api.py                FastAPI serving the dashboard
│   └── output/               raw_cache.json, dashboard.json
└── frontend/       Vite + React + Tailwind + recharts dashboard
```

## Run it

**Backend** (port 8050 — the frontend proxies `/api` here):
```bash
cd backend
pip install -r requirements.txt
python build_dashboard.py            # builds output/dashboard.json from the cached CFPB data
uvicorn api:app --reload --port 8050
```

**Frontend** (port 5173):
```bash
cd frontend
npm install
npm run dev          # open http://localhost:5173
```

## Options

| Env var | Effect |
|---|---|
| `REFRESH=1` | force a fresh CFPB crawl instead of using `output/raw_cache.json` |
| `YEARS_BACK=3` | crawl depth (default 3 years) |
| `ADJUDICATE_BACKEND=llm\|score\|auto` | Stage 2 backend (`auto` = LLM if `ANTHROPIC_API_KEY` set, else deterministic score) |
| `ANTHROPIC_API_KEY=...` | enables the Claude adjudicator (best recall on implied-automation cases) |
| `ADJUDICATE_MAX=50` | cap LLM calls (cost control) |
| `REGUTRIAGE_LLM_MODEL=claude-haiku-4-5` | cheaper/faster adjudication model (default `claude-opus-4-8`) |

The bundled `output/raw_cache.json` holds ~2 months of real CFPB complaints so the
demo runs offline. For the full picture run `REFRESH=1 YEARS_BACK=3 python build_dashboard.py`.
