import { FloatingPanelApp } from "@/ui/floating-panel/FloatingPanelApp";
import { renderApp } from "@/app/renderApp";

const hostId = "radeion-extension-root";

function mountFloatingPanel() {
  if (document.getElementById(hostId)) {
    return;
  }

  const host = document.createElement("div");
  host.id = hostId;
  document.documentElement.append(host);

  renderApp(host, <FloatingPanelApp />);
}

mountFloatingPanel();
