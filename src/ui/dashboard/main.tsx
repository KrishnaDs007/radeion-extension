import { FileText, ListChecks, Search, ShieldCheck, UserRound } from "lucide-react";

import { renderApp } from "@/app/renderApp";
import { PageShell } from "@/shared/components/PageShell";
import { StatusPill } from "@/shared/components/StatusPill";

const sections = [
  { title: "Patient Summary", icon: UserRound },
  { title: "Workflow Details", icon: ShieldCheck },
  { title: "Documents", icon: FileText },
  { title: "Tasks", icon: ListChecks },
  { title: "Search", icon: Search },
];

function DashboardApp() {
  return (
    <PageShell
      eyebrow="Radeion Dashboard"
      title="Healthcare Companion"
      subtitle="Full-page extension workspace scaffold. Patient data and backend workflows are intentionally not wired yet."
    >
      <div className="dashboard-layout">
        <aside className="sidebar">
          {sections.map(({ title, icon: Icon }) => (
            <button className="sidebar-item" key={title} type="button">
              <Icon size={18} />
              {title}
            </button>
          ))}
        </aside>
        <section className="workspace">
          <div className="workspace-header">
            <h2>Workspace setup</h2>
            <StatusPill label="No backend connected" tone="warning" />
          </div>
          <p>
            This area is reserved for authorized patient summaries, source-site context, documents,
            and tasks after backend APIs and access rules are available.
          </p>
        </section>
      </div>
    </PageShell>
  );
}

const root = document.getElementById("root");

if (root) {
  renderApp(root, <DashboardApp />);
}
