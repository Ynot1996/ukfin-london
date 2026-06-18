import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../DataContext.jsx";
import KpiStrip from "../components/KpiStrip.jsx";
import ClusterRankings from "../components/ClusterRankings.jsx";
import LiveAlerts from "../components/LiveAlerts.jsx";
import TrendChart from "../components/TrendChart.jsx";
import ClusterDrawer from "../components/ClusterDrawer.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import Footer from "../components/Footer.jsx";

export default function Overview() {
  const { data } = useDashboard();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);

  const handleKpiClick = (type) => {
    const map = {
      critical: "/clusters?severity=CRITICAL",
      escalating: "/clusters?status=ESCALATING",
      active: "/clusters",
      cases: "/cases",
    };
    if (map[type]) navigate(map[type]);
  };

  const selected = data.clusters.find((c) => c.id === selectedId) || null;

  return (
    <div className="space-y-6">
      <div data-tour="kpis">
        <ErrorBoundary>
          <KpiStrip kpis={data.kpis} onKpiClick={handleKpiClick} />
        </ErrorBoundary>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6 h-[460px] lg:h-[560px]" data-tour="clusters">
          <ErrorBoundary>
            <ClusterRankings clusters={data.clusters} selectedId={selectedId} onSelect={setSelectedId} />
          </ErrorBoundary>
        </div>
        <div className="col-span-12 lg:col-span-6 h-[460px] lg:h-[560px]" data-tour="alerts">
          <ErrorBoundary>
            <LiveAlerts alerts={data.alerts} />
          </ErrorBoundary>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12" data-tour="trend">
          <ErrorBoundary>
            <TrendChart trend={data.trend} />
          </ErrorBoundary>
        </div>
      </div>

      <Footer />

      {selected && <ClusterDrawer cluster={selected} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
