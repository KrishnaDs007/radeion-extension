import { FloatingPanelApp } from "@/ui/floating-panel/FloatingPanelApp";
import { renderApp } from "@/app/renderApp";
import { Button } from "@/shared/components/Button";
import { detectSiteContext } from "@/shared/site/supportedSites";
import { X } from "lucide-react";
import { useState } from "react";

const hostId = "radeion-extension-root";

function ContentApp() {
  const [isClosed, setIsClosed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const context = detectSiteContext(document, window.location);

  if (isClosed) {
    return null;
  }

  if (isOpen) {
    return (
      <FloatingPanelApp
        context={context}
        onClose={() => setIsClosed(true)}
        onMinimize={() => setIsOpen(false)}
      />
    );
  }

  return (
    <section className="site-prompt" aria-label="Radeion companion prompt">
      <div>
        <p className="eyebrow">Radeion</p>
        <strong>{context.status === "supported" ? "Patient context available" : "Search available"}</strong>
      </div>
      <div className="icon-button-row">
        <Button onClick={() => setIsOpen(true)} type="button">
          Open
        </Button>
        <button className="icon-button" onClick={() => setIsClosed(true)} type="button" aria-label="Close prompt" title="Close">
          <X size={16} />
        </button>
      </div>
    </section>
  );
}

function mountFloatingPanel() {
  if (document.getElementById(hostId)) {
    return;
  }

  const host = document.createElement("div");
  host.id = hostId;
  document.documentElement.append(host);

  renderApp(host, <ContentApp />);
}

mountFloatingPanel();
