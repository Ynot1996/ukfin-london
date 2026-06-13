// Top-line KPI cards.
function Kpi({ label, value, sub, accent }) {
  return (
    <div className="bg-card border border-line rounded-lg px-4 py-2.5 flex-1 min-w-0">
      <div className="text-[11px] text-muted font-medium truncate">{label}</div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-bold" style={accent ? { color: accent } : undefined}>{value}</span>
        {sub && <span className="text-[11px] text-muted">{sub}</span>}
      </div>
    </div>
  );
}

export default function KpiStrip({ kpis }) {
  if (!kpis) return null;
  return (
    <div className="flex gap-3">
      <Kpi label="Active clusters" value={kpis.active_clusters} sub="harm patterns" />
      <Kpi label="Critical" value={kpis.critical_clusters} accent="#dc2b4b" sub="need review" />
      <Kpi label="Escalating" value={kpis.escalating_clusters} accent="#f0762b" sub="+growth" />
      <Kpi label="AI-related cases" value={kpis.ai_cases?.toLocaleString()} sub={`of ${kpis.total_fetched?.toLocaleString()}`} />
      <Kpi label="Match rate" value={`${kpis.match_rate}%`} sub="AI / all complaints" />
    </div>
  );
}
