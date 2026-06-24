import { LogIn, PanelRightOpen, Search } from "lucide-react";

import { renderApp } from "@/app/renderApp";
import { useAuthSession } from "@/shared/auth/useAuthSession";
import { Button } from "@/shared/components/Button";
import { StatusPill } from "@/shared/components/StatusPill";
import { getAppVersion } from "@/shared/config/appVersion";

function PopupApp() {
  const { isConfigured, isDeveloperBypass, isLoading, user } = useAuthSession();
  const sessionLabel = isLoading ? "Checking" : user ? user.email ?? "Signed in" : "Not connected";

  function openExtensionPage(path: string) {
    window.location.href = path;
  }

  return (
    <main className="popup-shell">
      <header className="compact-header">
        <div>
          <p className="eyebrow">Radeion</p>
          <h1>Extension</h1>
        </div>
        <StatusPill label={isConfigured ? "Ready" : "Config"} tone={isConfigured ? "success" : "warning"} />
      </header>

      <section className="stack">
        <div className="info-row">
          <span>Session</span>
          <strong>{sessionLabel}</strong>
        </div>
        <div className="info-row">
          <span>Current site</span>
          <strong>Pending config</strong>
        </div>
        <div className="info-row">
          <span>Version</span>
          <strong>{getAppVersion()}</strong>
        </div>
        {isDeveloperBypass ? (
          <div className="info-row">
            <span>Auth mode</span>
            <strong>Developer bypass</strong>
          </div>
        ) : null}
      </section>

      <section className="action-grid">
        <Button onClick={() => openExtensionPage(user ? "../dashboard/index.html" : "../login/index.html")}>
          <LogIn size={16} />
          {user ? "Home" : "Login"}
        </Button>
        <Button onClick={() => openExtensionPage("../dashboard/index.html")} variant="secondary">
          <PanelRightOpen size={16} />
          Open Panel
        </Button>
        <Button onClick={() => openExtensionPage("../dashboard/index.html")} variant="secondary">
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
