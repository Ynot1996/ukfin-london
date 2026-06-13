// Thin fetch wrapper for the Sentinel backend. In dev, /api is proxied to
// http://localhost:8000 by vite (see vite.config.js).
export async function fetchDashboard() {
  const res = await fetch("/api/dashboard");
  if (res.status === 503) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || "Dashboard not built yet — run build_dashboard.py");
  }
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}
