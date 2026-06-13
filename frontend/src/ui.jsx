// Shared UI helpers: severity styling, formatters, small primitives.

export const SEVERITY_HEX = {
  CRITICAL: "#dc2b4b",
  HIGH: "#f0762b",
  MEDIUM: "#e0a92e",
  LOW: "#3fa66a",
};

const SEV_CLASSES = {
  CRITICAL: "bg-critical/10 text-critical border-critical/30",
  HIGH: "bg-high/10 text-high border-high/30",
  MEDIUM: "bg-medium/10 text-medium border-medium/30",
  LOW: "bg-low/10 text-low border-low/30",
};

export function SeverityBadge({ band }) {
  const cls = SEV_CLASSES[band] || SEV_CLASSES.LOW;
  return (
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide border ${cls}`}>
      {band}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    ESCALATING: "text-critical",
    PERSISTENT: "text-high",
    SIMMERING: "text-medium",
    STABLE: "text-muted",
  };
  return <span className={`text-[11px] font-semibold ${map[status] || "text-muted"}`}>{status}</span>;
}

// "+312%" green-up / red-down with sign.
export function GrowthPill({ value }) {
  const v = Math.round(value);
  const up = v >= 0;
  return (
    <span className={`font-mono text-xs font-semibold ${up ? "text-critical" : "text-low"}`}>
      {up ? "+" : "−"}
      {Math.abs(v)}%
    </span>
  );
}

export function fmtTime(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function Panel({ title, subtitle, right, children, className = "" }) {
  return (
    <section className={`bg-card border border-line rounded-lg flex flex-col min-h-0 ${className}`}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-line flex-shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-ink">{title}</h2>
          {subtitle && <p className="text-[11px] text-muted mt-0.5">{subtitle}</p>}
        </div>
        {right}
      </div>
      <div className="flex-1 min-h-0 overflow-auto no-scrollbar">{children}</div>
    </section>
  );
}
