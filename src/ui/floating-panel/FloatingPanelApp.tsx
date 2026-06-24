import { ExternalLink, Minus, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/components/Button";
import { StatusPill } from "@/shared/components/StatusPill";
import type { PatientTabId } from "@/shared/patient/patientTabs";
import { patientTabs } from "@/shared/patient/patientTabs";
import type { SiteContext } from "@/shared/types/siteContext";

type FloatingPanelAppProps = {
  context?: SiteContext;
  onClose?: () => void;
  onMinimize?: () => void;
};

export function FloatingPanelApp({ context, onClose, onMinimize }: FloatingPanelAppProps) {
  const [selectedTab, setSelectedTab] = useState<PatientTabId>("home");
  const selectedTabDefinition = patientTabs.find((tab) => tab.id === selectedTab) ?? patientTabs[0];
  const patientStatus = context?.detectedPatientId
    ? `Patient ${context.detectedPatientId}`
    : "No patient context loaded";

  return (
    <section className="floating-panel" aria-label="Radeion healthcare companion">
      <header className="floating-panel-header">
        <div>
          <p className="eyebrow">Radeion</p>
          <h2>Patient Workspace</h2>
        </div>
        <div className="icon-button-row">
          <button className="icon-button" type="button" aria-label="Open dashboard">
            <ExternalLink size={16} />
          </button>
          <button className="icon-button" onClick={onMinimize} type="button" aria-label="Minimize panel">
            <Minus size={16} />
          </button>
          <button className="icon-button" onClick={onClose} type="button" aria-label="Close panel">
            <X size={16} />
          </button>
        </div>
      </header>

      <div className="context-strip">
        <StatusPill
          label={context?.status === "supported" ? "Supported site" : "Manual search"}
          tone={context?.status === "supported" ? "success" : "warning"}
        />
        <span>{patientStatus}</span>
      </div>

      <nav className="tab-list" aria-label="Patient workspace sections">
        {patientTabs.map(({ id, label }) => (
          <button
            className={`tab-button ${selectedTab === id ? "tab-button-active" : ""}`.trim()}
            key={id}
            onClick={() => setSelectedTab(id)}
            type="button"
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="panel-body">
        <section className="empty-state">
          <h3>{selectedTabDefinition.label}</h3>
          <p>
            This tab is ready for backend data wiring. Full patient details stay behind
            authenticated API access.
          </p>
          <Button variant="secondary">Open Search</Button>
        </section>
      </div>
    </section>
  );
}
