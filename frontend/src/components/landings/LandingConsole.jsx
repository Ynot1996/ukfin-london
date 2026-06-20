import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Wifi, Database, GitCommitHorizontal, CheckCircle2 } from "lucide-react";
import reguLensLogo from "../../ReguLensLogo.png";

// "Internal audit console" variant: utilitarian, system-status framing that
// reads like a regulated firm's internal supervision tool / SSO gate.
export default function LandingConsole({ onLaunch }) {
  const now = new Date();
  const status = [
    { Icon: Wifi, label: "Data feed", value: "CFPB_LIVE", ok: true },
    { Icon: Database, label: "Corpus", value: "130,217 records", ok: true },
    { Icon: GitCommitHorizontal, label: "Engine build", value: "v1.0.0", ok: true },
    { Icon: ShieldCheck, label: "Access", value: "Demo / open", ok: true },
  ];

  return (
    <div className="min-h-screen w-full bg-[#384250] text-[#c7e6e5] font-sans flex flex-col overflow-x-hidden relative">
      {/* Scan line + grid */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#78ede7]/40 to-transparent animate-[shimmer_8s_infinite] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(120,237,231,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(120,237,231,0.4) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* Top status bar */}
      <header className="relative z-10 h-12 border-b border-[#0c5c63]/40 flex items-center justify-between px-4 sm:px-8 text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#78ede7] animate-pulse" />
          <span className="text-[#78ede7]">SUPERVISION CONSOLE</span>
        </div>
        <span className="text-white/40 hidden sm:inline">SYS.LOC // London UK · {now.toLocaleDateString("en-GB")}</span>
        <span className="text-white/60">[MODE: ACTIVE_SUPERVISION]</span>
      </header>

      {/* Center console */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-xl rounded-2xl border border-[#7accc9]/25 bg-white/[0.04] backdrop-blur-md p-7 sm:p-10 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-xl border border-[#7accc9]/30 bg-white/10 flex items-center justify-center p-1.5">
              <img src={reguLensLogo} alt="ReguLens" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="font-extrabold text-xl font-heading tracking-tight text-white">ReguLens</div>
              <div className="text-[11px] font-mono text-[#78ede7]">conduct-supervision intelligence</div>
            </div>
          </div>

          <p className="text-sm text-[#c7e6e5]/70 leading-relaxed mb-6">
            Internal console for surfacing emerging consumer-harm patterns across the live complaints corpus.
            Authenticate to enter the supervision dashboard.
          </p>

          {/* System status panel */}
          <div className="rounded-xl border border-[#7accc9]/20 divide-y divide-[#7accc9]/10 mb-7">
            {status.map(({ Icon, label, value, ok }) => (
              <div key={label} className="flex items-center justify-between px-4 py-2.5 text-xs">
                <span className="flex items-center gap-2 text-[#c7e6e5]/70">
                  <Icon className="w-3.5 h-3.5 text-[#78ede7]" /> {label}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-white">
                  {value}
                  {ok && <CheckCircle2 className="w-3.5 h-3.5 text-low" />}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={onLaunch}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#0c5c63] to-[#7accc9] hover:from-[#073a3f] hover:to-[#0c5c63] text-white font-bold rounded-xl uppercase tracking-widest text-sm transition-all"
          >
            Enter console <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-center text-[10px] font-mono text-white/35 mt-4">SSO bypassed · demo environment</p>
        </motion.div>
      </main>

      <footer className="relative z-10 h-10 border-t border-[#0c5c63]/40 flex items-center justify-center text-[10px] font-mono text-white/30">
        REGULENS // ALPHA_v1.0.0 — demo
      </footer>
    </div>
  );
}
