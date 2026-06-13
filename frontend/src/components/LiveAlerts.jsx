import { useState } from "react";
import { Panel, SEVERITY_HEX } from "../ui.jsx";

const FILTERS = ["ALL", "CRITICAL", "HIGH", "MEDIUM"];

// Live alert feed with severity filter chips (right column, top).
export default function LiveAlerts({ alerts }) {
  const [filter, setFilter] = useState("ALL");
  const shown = filter === "ALL" ? alerts : alerts.filter((a) => a.severity === filter);

  return (
    <Panel
      title="Live Alerts"
      right={
        <div className="flex gap-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded transition-colors ${
                filter === f ? "bg-brand text-white" : "text-muted hover:bg-bg"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      }
      className="h-full"
    >
      <ul className="divide-y divide-line">
        {shown.map((a, i) => (
          <li key={i} className="px-4 py-2.5 flex gap-3">
            <div className="flex flex-col items-center pt-0.5">
              <span
                className="w-2 h-2 rounded-full pulse-dot flex-shrink-0"
                style={{ background: SEVERITY_HEX[a.severity] || "#888" }}
              />
              <span className="text-[10px] text-muted font-mono mt-1">{a.time}</span>
            </div>
            <div className="min-w-0">
              <span
                className="text-[9px] font-bold tracking-wider"
                style={{ color: SEVERITY_HEX[a.severity] || "#888" }}
              >
                {a.type}
              </span>
              <p className="text-xs text-ink leading-snug">{a.message}</p>
            </div>
          </li>
        ))}
        {shown.length === 0 && (
          <li className="px-4 py-6 text-center text-xs text-muted">No {filter.toLowerCase()} alerts.</li>
        )}
      </ul>
    </Panel>
  );
}
