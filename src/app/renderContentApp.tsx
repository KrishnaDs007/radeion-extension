import { StrictMode } from "react";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";

import { AppProviders } from "./AppProviders";
import contentStyles from "@/styles/global.css?inline";

export function renderContentApp(hostElement: HTMLElement, app: ReactNode) {
  const shadowRoot = hostElement.attachShadow({ mode: "open" });
  const styleElement = document.createElement("style");
  const appRoot = document.createElement("div");

  styleElement.textContent = `
    :host {
      all: initial;
      color: #172026;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.5;
    }
    ${contentStyles}
  `;
  shadowRoot.append(styleElement, appRoot);

  createRoot(appRoot).render(
    <StrictMode>
      <AppProviders>{app}</AppProviders>
    </StrictMode>,
  );
}
