import { StrictMode } from "react";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";

import { AppProviders } from "./AppProviders";
import "@/styles/global.css";

type AppRootElement = HTMLElement & {
  __radeionReactRoot?: Root;
};

export function renderApp(rootElement: HTMLElement, app: ReactNode) {
  const appRootElement = rootElement as AppRootElement;
  const root = appRootElement.__radeionReactRoot ?? createRoot(rootElement);
  appRootElement.__radeionReactRoot = root;

  root.render(
    <StrictMode>
      <AppProviders>{app}</AppProviders>
    </StrictMode>,
  );
}
