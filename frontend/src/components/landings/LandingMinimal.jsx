import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import reguLensLogo from "../../ReguLensLogo.png";

// Minimal, calm enterprise variant: lots of whitespace, one clear message,
// one action. Reads as a confident, understated internal tool.
export default function LandingMinimal({ onLaunch }) {
  const stats = [
    { v: "130K+", l: "complaints" },
    { v: "44", l: "harm clusters" },
    { v: "4", l: "scoring dimensions" },
  ];
  return (
    <div className="min-h-screen w-full bg-white text-ink font-sans flex flex-col overflow-x-hidden">
      <header className="px-6 sm:px-10 h-20 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl border border-line/40 flex items-center justify-center p-1.5 bg-[#f2faf9]">
          <img src={reguLensLogo} alt="ReguLens" className="w-full h-full object-contain" />
        </div>
        <span className="font-extrabold text-lg font-heading tracking-tight">ReguLens</span>
      </header>

      <main className="flex-1 flex items-center">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="h-px w-12 bg-brand mb-8" />
            <h1 className="text-4xl sm:text-6xl font-extrabold font-heading tracking-tight leading-[1.08]">
              A clearer lens on<br />consumer-finance harm.
            </h1>
            <p className="text-lg text-muted mt-6 max-w-xl leading-relaxed">
              ReguLens reads the entire complaints corpus, clusters recurring harm,
              and ranks what a supervision team should act on first.
            </p>

            <button
              onClick={onLaunch}
              className="group mt-10 inline-flex items-center gap-2.5 text-base font-semibold text-ink border-b-2 border-brand pb-1 hover:gap-4 transition-all"
            >
              Enter the dashboard
              <ArrowRight className="w-5 h-5 text-brand group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex flex-wrap gap-8 mt-16">
              {stats.map((s) => (
                <div key={s.l}>
                  <div className="text-3xl font-bold font-heading text-ink">{s.v}</div>
                  <div className="text-sm text-muted mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="px-6 sm:px-10 py-6 text-xs text-muted/60 border-t border-line/20">
        © {new Date().getFullYear()} ReguLens — a new lens to view financial regulation. Demo environment.
      </footer>
    </div>
  );
}
