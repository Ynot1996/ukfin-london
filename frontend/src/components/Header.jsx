// Top app bar — slate-blue, matching the reference dashboard chrome.
export default function Header({ generatedAt, adjudicator }) {
  const date = generatedAt
    ? new Date(generatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "—";
  return (
    <header
      className="h-12 flex items-center px-5 gap-4 flex-shrink-0 text-white"
      style={{ backgroundColor: "#3d5a7a" }}
    >
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-sm flex items-center justify-center" style={{ background: "#4fc3dc" }}>
          <span className="text-[#1a2332] text-xs font-black">S</span>
        </div>
        <span className="font-semibold text-sm tracking-tight">Sentinel</span>
        <span className="text-white/50 text-sm">·</span>
        <span className="text-white/80 text-sm">FCA Supervision Intelligence</span>
      </div>

      <span className="text-[10px] font-semibold tracking-wider bg-white/15 px-2 py-0.5 rounded">
        ALPHA · LIVE CFPB DATA
      </span>

      <nav className="flex items-center gap-1 ml-4 text-sm">
        <a className="px-2.5 py-1 rounded bg-white/15 font-medium">Supervision</a>
        <a className="px-2.5 py-1 rounded text-white/70 hover:bg-white/10 cursor-pointer">Overview</a>
      </nav>

      <div className="ml-auto flex items-center gap-3 text-xs text-white/80">
        <span className="capitalize">Adjudicator: {adjudicator || "—"}</span>
        <span className="text-white/40">|</span>
        <span>{date} · Daily View</span>
      </div>
    </header>
  );
}
