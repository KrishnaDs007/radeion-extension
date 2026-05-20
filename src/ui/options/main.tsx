import { renderApp } from "@/app/renderApp";
import { PageShell } from "@/shared/components/PageShell";
import { StatusPill } from "@/shared/components/StatusPill";

function OptionsApp() {
  return (
    <PageShell
      eyebrow="Configuration"
      title="Extension Settings"
      subtitle="Client-specific permissions, environments, and supported sites should come from backend configuration."
    >
      <section className="settings-list">
        <div className="info-row">
          <span>Host permissions</span>
          <StatusPill label="Least privilege" tone="success" />
        </div>
        <div className="info-row">
          <span>Storage policy</span>
          <StatusPill label="No PHI by default" tone="success" />
        </div>
        <div className="info-row">
          <span>Backend</span>
          <StatusPill label="Separate setup" tone="warning" />
        </div>
      </section>
    </PageShell>
  );
}

const root = document.getElementById("root");

if (root) {
  renderApp(root, <OptionsApp />);
}
