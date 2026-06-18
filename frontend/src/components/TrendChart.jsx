import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Panel, SEVERITY_HEX } from "../ui.jsx";
import { fetchDrilldown } from "../api.js";

const TIMEFRAMES = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
];

export default function TrendChart({ trend }) {
  const [selectedDays, setSelectedDays] = useState(30);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const filteredTrend = useMemo(() => {
    if (!trend) return [];
    return trend.slice(-selectedDays);
  }, [trend, selectedDays]);

  const handleChartClick = (activePayload) => {
    if (!activePayload || activePayload.length === 0) return;
    const dataPoint = activePayload[0].payload;
    if (!dataPoint || !dataPoint.date) return;

    const date = dataPoint.date;
    setSelectedPoint(dataPoint);
    setLoading(true);
    setResult(null);
    setError(null);
    setLogs([]);

    // Cosmetic stream of analysis steps while the real request runs.
    const steps = [
      `[SYS] QUERYING CFPB RECORDS FOR ${date} ...`,
      `[AGG] AGGREGATING CASES BY FIRM / ISSUE / CLUSTER ...`,
      `[WEB] GROUNDED NEWS SEARCH VIA ANALYSIS ENGINE ...`,
      `[NLP] SYNTHESISING DRIVERS & RESPONSE ...`,
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setLogs((p) => [...p, steps[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 180);

    fetchDrilldown(date)
      .then((r) => {
        setResult(r);
        setLogs((p) => [...p, `[SYS] ANALYSIS COMPLETE — ${r.total} CASE(S).`]);
      })
      .catch((e) => setError(e.message))
      .finally(() => { clearInterval(interval); setLoading(false); });
  };

  const closePanel = () => { setSelectedPoint(null); setResult(null); setError(null); setLoading(false); };

  return (
    <Panel
      title="Alert Volume Trend"
      subtitle={`trailing ${selectedDays} days · by severity`}
      className="h-full"
      right={
        <div className="flex gap-1 bg-accent/50 p-1 rounded-xl border border-line/30">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.label}
              onClick={() => setSelectedDays(tf.days)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 ${selectedDays === tf.days
                ? "bg-brand text-white shadow-sm"
                : "text-muted hover:text-ink hover:bg-white/60 border border-transparent"
                }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      }
    >
      {/* Stacks vertically on small screens, side-by-side on large. */}
      <div className="flex flex-col lg:flex-row h-full min-h-[300px]">
        {/* Chart */}
        <div className="flex-1 p-4 min-h-[280px] flex flex-col justify-between">
          <ResponsiveContainer width="100%" height="88%" minHeight={240}>
            <AreaChart
              data={filteredTrend}
              margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
              onClick={(state) => {
                if (state && state.activePayload) handleChartClick(state.activePayload);
              }}
              className="cursor-pointer"
            >
              <defs>
                {Object.entries(SEVERITY_HEX).map(([k, hex]) => (
                  <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={hex} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={hex} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#b8e1e040" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#61758a" }} interval="preserveStartEnd" tickLine={false} axisLine={{ stroke: "#b8e1e0" }} />
              <YAxis tick={{ fontSize: 11, fill: "#61758a" }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ fontSize: 13, borderRadius: 12, border: "1px solid #b8e1e0", backgroundColor: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", color: "#384250", boxShadow: "0 8px 32px rgba(12, 92, 99, 0.1)" }}
                labelStyle={{ color: "#0c5c63", fontWeight: 600 }}
                itemStyle={{ color: "#384250" }}
              />
              {["low", "medium", "high", "critical"].map((sev) => (
                <Area key={sev} type="monotone" dataKey={sev} stackId="1" stroke={SEVERITY_HEX[sev.toUpperCase()]} fill={`url(#g-${sev.toUpperCase()})`} strokeWidth={1.5} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
          <div className="text-center text-[10px] text-muted/60 mb-1 font-mono tracking-wider select-none animate-pulse px-2">
            💡 CLICK ANY POINT TO ANALYSE THAT DAY — REAL CASES + LIVE NEWS CORRELATION
          </div>
        </div>

        {/* Drill-down panel */}
        {selectedPoint && (
          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-line/35 bg-bg/25 flex flex-col max-h-[420px] lg:max-h-none overflow-hidden animate-fade-in">
            <div className="px-4 py-3 border-b border-line/20 bg-white/40 flex items-center justify-between flex-shrink-0">
              <span className="text-[10px] font-bold font-mono text-ink tracking-widest">
                [DAY_ANALYSIS // {selectedPoint.label}]
              </span>
              <button onClick={closePanel} className="text-muted hover:text-ink text-sm leading-none p-1 hover:bg-white/60 rounded-md transition-colors">×</button>
            </div>

            <div className="flex-1 p-4 overflow-auto no-scrollbar text-xs leading-relaxed space-y-4">
              {/* Terminal log */}
              {logs.length > 0 && (
                <div className="space-y-1 bg-ink text-[10px] text-accent/80 p-3 rounded-lg border border-line/20 font-mono max-h-[120px] overflow-auto no-scrollbar shadow-inner">
                  {logs.map((log, idx) => (
                    <div key={idx} className={log.includes("COMPLETE") ? "text-low font-bold" : log.includes("QUERYING") ? "text-brand" : ""}>{log}</div>
                  ))}
                  {loading && <div className="w-1.5 h-3 bg-brand animate-ping inline-block" />}
                </div>
              )}

              {error && <div className="bg-critical/5 border border-critical/20 text-critical text-xs px-3 py-2 rounded-lg">{error}</div>}

              {result && (
                <div className="space-y-4 animate-fade-in">
                  {/* Top drivers */}
                  {result.total > 0 ? (
                    <>
                      <Stat label="Flagged cases that day" value={result.total} />
                      {result.top_companies?.length > 0 && (
                        <Group title="Top firms">
                          {result.top_companies.map((c) => (
                            <Row key={c.name} name={c.name} count={c.count} />
                          ))}
                        </Group>
                      )}
                      {result.top_issues?.length > 0 && (
                        <Group title="Top issues">
                          {result.top_issues.map((c) => (
                            <Row key={c.name} name={c.name} count={c.count} />
                          ))}
                        </Group>
                      )}
                    </>
                  ) : (
                    <p className="text-muted text-sm">{result.narrative}</p>
                  )}

                  {/* News synthesis */}
                  {result.total > 0 && result.narrative && (
                    <div className="glass-subtle p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-widest text-brand uppercase">Analysis</span>
                        <span className="text-[9px] font-mono text-muted">engine: {result.provider}</span>
                      </div>
                      <p className="text-xs text-muted leading-relaxed font-sans">{result.narrative}</p>
                    </div>
                  )}

                  {result.news?.length > 0 && (
                    <Group title="Sources">
                      {result.news.map((n, i) => (
                        <a key={i} href={n.url} target="_blank" rel="noopener noreferrer"
                          className="block text-xs text-brand hover:underline truncate py-0.5">
                          ↗ {n.headline} <span className="text-muted/60">· {n.source}</span>
                        </a>
                      ))}
                    </Group>
                  )}

                  {result.suggested_actions?.length > 0 && (
                    <Group title="Suggested actions">
                      {result.suggested_actions.map((a, i) => (
                        <p key={i} className="text-xs text-ink leading-relaxed flex gap-1.5 py-0.5">
                          <span className="text-brand flex-shrink-0">→</span> {a}
                        </p>
                      ))}
                    </Group>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}

function Stat({ label, value }) {
  return (
    <div className="glass-subtle p-3 flex items-center justify-between">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-lg font-bold text-ink font-heading">{value}</span>
    </div>
  );
}

function Group({ title, children }) {
  return (
    <div>
      <div className="text-[10px] font-bold tracking-widest text-muted uppercase mb-1.5">{title}</div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function Row({ name, count }) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="text-ink truncate">{name}</span>
      <span className="font-mono text-brand font-semibold flex-shrink-0">{count}</span>
    </div>
  );
}
