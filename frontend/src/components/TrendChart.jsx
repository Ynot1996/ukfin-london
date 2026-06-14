import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Panel, SEVERITY_HEX } from "../ui.jsx";

const TIMEFRAMES = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
];

export default function TrendChart({ trend }) {
  const [selectedDays, setSelectedDays] = useState(30);

  const filteredTrend = useMemo(() => {
    if (!trend) return [];
    return trend.slice(-selectedDays);
  }, [trend, selectedDays]);

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
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 ${
                selectedDays === tf.days
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
      <div className="p-4 h-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredTrend} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <defs>
              {Object.entries(SEVERITY_HEX).map(([k, hex]) => (
                <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={hex} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={hex} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#B4CDE640" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#5b6b82" }}
              interval="preserveStartEnd"
              tickLine={false}
              axisLine={{ stroke: "#B4CDE6" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#5b6b82" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: 13,
                borderRadius: 12,
                border: "1px solid #B4CDE6",
                backgroundColor: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(12px)",
                color: "#1a2332",
                boxShadow: "0 8px 32px rgba(180,205,230,0.2)",
              }}
              labelStyle={{ color: "#2563EB", fontWeight: 600 }}
              itemStyle={{ color: "#1a2332" }}
            />
            {["low", "medium", "high", "critical"].map((sev) => (
              <Area
                key={sev}
                type="monotone"
                dataKey={sev}
                stackId="1"
                stroke={SEVERITY_HEX[sev.toUpperCase()]}
                fill={`url(#g-${sev.toUpperCase()})`}
                strokeWidth={1.5}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
