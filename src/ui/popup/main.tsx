import { LogIn, PanelRightOpen, Search } from "lucide-react";

import { renderApp } from "@/app/renderApp";
import { Button } from "@/shared/components/Button";
import { StatusPill } from "@/shared/components/StatusPill";

function PopupApp() {
  return (
    <main className="popup-shell">
      <header className="compact-header">
        <div>
          <p className="eyebrow">Radeion</p>
          <h1>Extension</h1>
        </div>
        <StatusPill label="Local" />
      </header>

      <section className="stack">
        <div className="info-row">
          <span>Session</span>
          <strong>Not connected</strong>
        </div>
        <div className="info-row">
          <span>Current site</span>
          <strong>Pending config</strong>
        </div>
      </section>

      <section className="action-grid">
        <Button>
          <LogIn size={16} />
          Login
        </Button>
        <Button variant="secondary">
          <PanelRightOpen size={16} />
          Open Panel
        </Button>
        <Button variant="secondary">
          <Search size={16} />
          Search
        </Button>
      </section>
    </main>
  );
}

const root = document.getElementById("root");

if (root) {
  renderApp(root, <PopupApp />);
}
