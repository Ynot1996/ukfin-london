// Supervisory assessment block rendered inside the cluster drawer.
// Answers: why concerning · why AI · which Consumer Duty · likely mechanism
// (with likelihood) · recommended regulator actions.

function Block({ icon, title, children }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-sm">{icon}</span>
        <span className="text-[11px] font-bold uppercase tracking-wide text-ink">{title}</span>
      </div>
      {children}
    </div>
  );
}

function LikelihoodBar({ value }) {
  const pct = Math.round(value * 100);
  const color = pct >= 70 ? "#dc2b4b" : pct >= 45 ? "#f0762b" : "#e0a92e";
  return (
    <div className="flex items-center gap-1.5 flex-shrink-0" title={`Estimated likelihood ${pct}%`}>
      <div className="w-12 h-1.5 bg-line rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="font-mono text-[10px] font-semibold" style={{ color }}>{pct}%</span>
    </div>
  );
}

export default function Assessment({ assessment }) {
  if (!assessment) return null;
  const a = assessment;

  return (
    <div className="space-y-4 border-t border-line pt-4 mt-1">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-ink">Supervisory Assessment</h4>
        <span className="text-[9px] text-muted bg-bg border border-line rounded px-1.5 py-0.5">
          {a.generated_by === "llm" ? "AI-reasoned (Claude)" : "rule-based"}
        </span>
      </div>

      <Block icon="⚠️" title="Why this is concerning">
        <p className="text-[11px] text-muted leading-relaxed">{a.why_concerning}</p>
      </Block>

      <Block icon="🤖" title="Why we think it is AI-driven">
        <p className="text-[11px] text-muted leading-relaxed">{a.ai_rationale}</p>
      </Block>

      <Block icon="⚖️" title="Consumer Duty at risk">
        <div className="space-y-1.5">
          {a.consumer_duty?.map((d, i) => (
            <div key={i} className="bg-bg border border-line rounded p-2">
              <div className="text-[11px] font-semibold text-brand">{d.outcome}</div>
              <div className="text-[10px] text-muted leading-snug">{d.rationale}</div>
            </div>
          ))}
        </div>
      </Block>

      <Block icon="🔬" title="Likely mechanism (hypotheses to investigate)">
        <div className="space-y-2">
          {a.hypotheses?.map((h, i) => (
            <div key={i} className="bg-bg border border-line rounded p-2">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-[11px] text-ink leading-snug">{h.mechanism}</p>
                <LikelihoodBar value={h.likelihood} />
              </div>
              <p className="text-[10px] text-muted leading-snug">
                <span className="font-semibold">Evidence:</span> {h.evidence}
              </p>
            </div>
          ))}
        </div>
      </Block>

      <Block icon="🛠️" title="Recommended actions">
        <ol className="space-y-1.5">
          {a.actions?.map((act, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-[10px] font-bold text-accent-dark mt-0.5 flex-shrink-0">{i + 1}.</span>
              <div>
                <p className="text-[11px] text-ink leading-snug">{act.action}</p>
                <p className="text-[10px] text-accent-dark mt-0.5">{act.basis}</p>
              </div>
            </li>
          ))}
        </ol>
      </Block>
    </div>
  );
}
