"""
api.py — Sentinel FastAPI server. Serves the prebuilt dashboard.json plus
filtered drill-down endpoints for the React frontend.

Run:
    uvicorn api:app --reload --port 8000
"""

import json
import os
from typing import Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

HERE = os.path.dirname(os.path.abspath(__file__))
DASHBOARD_PATH = os.path.join(HERE, "output", "dashboard.json")
NOT_BUILT_MSG = "Dashboard not built yet — run: python build_dashboard.py"

app = FastAPI(title="Sentinel — FCA Supervision Intelligence API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _load() -> dict:
    if not os.path.exists(DASHBOARD_PATH):
        raise HTTPException(status_code=503, detail=NOT_BUILT_MSG)
    try:
        with open(DASHBOARD_PATH, "r", encoding="utf-8") as fh:
            return json.load(fh)
    except (json.JSONDecodeError, OSError) as exc:
        raise HTTPException(status_code=500, detail=f"Could not read dashboard: {exc}")


@app.get("/health")
def health():
    return {"status": "ok", "dashboard_built": os.path.exists(DASHBOARD_PATH)}


@app.get("/api/dashboard")
def dashboard():
    """Full dashboard payload: kpis, clusters (ranked), alerts, trend."""
    return _load()


@app.get("/api/clusters")
def clusters(
    severity: Optional[str] = Query(None, description="Filter by severity_band"),
    status: Optional[str] = Query(None, description="Filter by status"),
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(50, ge=1, le=200),
):
    """Ranked clusters with optional filtering — backs the rankings + table."""
    data = _load()
    items = data.get("clusters", [])
    if severity:
        items = [c for c in items if c.get("severity_band", "").lower() == severity.lower()]
    if status:
        items = [c for c in items if c.get("status", "").lower() == status.lower()]
    if category:
        items = [c for c in items if c.get("category", "").lower() == category.lower()]
    return {"total": len(items), "clusters": items[:limit]}


@app.get("/api/clusters/{cluster_id}")
def cluster_detail(cluster_id: str):
    """One cluster's full record, including sample narratives."""
    for c in _load().get("clusters", []):
        if c.get("id") == cluster_id:
            return c
    raise HTTPException(status_code=404, detail=f"Cluster {cluster_id} not found")


@app.get("/api/alerts")
def alerts(severity: Optional[str] = Query(None), limit: int = Query(30, ge=1, le=100)):
    """Live alert feed, optionally filtered by severity."""
    items = _load().get("alerts", [])
    if severity and severity.upper() != "ALL":
        items = [a for a in items if a.get("severity", "").upper() == severity.upper()]
    return {"total": len(items), "alerts": items[:limit]}


@app.get("/api/trend")
def trend():
    """Alert-volume trend (stacked by severity)."""
    return {"trend": _load().get("trend", [])}
