import { StrictMode } from "react";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";

import { AppProviders } from "./AppProviders";
import "@/styles/global.css";

export function renderApp(rootElement: HTMLElement, app: ReactNode) {
  createRoot(rootElement).render(
    <StrictMode>
      <AppProviders>{app}</AppProviders>
    </StrictMode>,
  );
}
