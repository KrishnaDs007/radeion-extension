import { ExternalLink, Minus, X } from "lucide-react";

import { Button } from "@/shared/components/Button";
import { StatusPill } from "@/shared/components/StatusPill";

const tabs = ["Summary", "Workflow", "Documents", "Tasks", "Source"];

export function FloatingPanelApp() {
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
          <button className="icon-button" type="button" aria-label="Minimize panel">
            <Minus size={16} />
          </button>
          <button className="icon-button" type="button" aria-label="Close panel">
            <X size={16} />
          </button>
        </div>
      </header>

      <div className="context-strip">
        <StatusPill label="Site pending setup" tone="warning" />
        <span>No patient context loaded</span>
      </div>

      <nav className="tab-list" aria-label="Patient workspace sections">
        {tabs.map((tab) => (
          <button className="tab-button" key={tab} type="button">
            {tab}
          </button>
        ))}
      </nav>

      <div className="panel-body">
        <section className="empty-state">
          <h3>UI scaffold ready</h3>
          <p>
            Backend authorization, supported-site detection, and patient data rendering will be
            connected after the backend contract is finalized.
          </p>
          <Button variant="secondary">Open Search</Button>
        </section>
      </div>
    </section>
  );
}
