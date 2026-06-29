import { ExternalLink, Grip, Maximize2, Move, Minus, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";

import { Button } from "@/shared/components/Button";
import { StatusPill } from "@/shared/components/StatusPill";
import type { PatientTabId } from "@/shared/patient/patientTabs";
import { patientTabs } from "@/shared/patient/patientTabs";
import { getStoredUiState, saveUiState } from "@/shared/storage/uiState";
import type { SiteContext } from "@/shared/types/siteContext";

type FloatingPanelAppProps = {
  context?: SiteContext;
  onClose?: () => void;
  onMinimize?: () => void;
};

type PanelFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const defaultFrame: PanelFrame = {
  x: 24,
  y: 24,
  width: 420,
  height: 560,
};

const minFrameWidth = 320;
const minFrameHeight = 320;
const viewportPadding = 8;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

function getViewportFrame(frame: PanelFrame): PanelFrame {
  const width = clamp(frame.width, minFrameWidth, window.innerWidth - viewportPadding * 2);
  const height = clamp(frame.height, minFrameHeight, window.innerHeight - viewportPadding * 2);

  return {
    width,
    height,
    x: clamp(frame.x, viewportPadding, window.innerWidth - width - viewportPadding),
    y: clamp(frame.y, viewportPadding, window.innerHeight - height - viewportPadding),
  };
}

function getDefaultViewportFrame() {
  return getViewportFrame({
    ...defaultFrame,
    x: window.innerWidth - defaultFrame.width - 24,
    y: window.innerHeight - defaultFrame.height - 24,
  });
}

export function FloatingPanelApp({ context, onClose, onMinimize }: FloatingPanelAppProps) {
  const [selectedTab, setSelectedTab] = useState<PatientTabId>("home");
  const [frame, setFrame] = useState<PanelFrame>(() => getDefaultViewportFrame());
  const [hasLoadedStoredFrame, setHasLoadedStoredFrame] = useState(false);
  const selectedTabDefinition = patientTabs.find((tab) => tab.id === selectedTab) ?? patientTabs[0];
  const patientStatus = context?.detectedPatientId
    ? `Patient ${context.detectedPatientId}`
    : "No patient context loaded";
  const panelStyle: CSSProperties = {
    height: frame.height,
    left: frame.x,
    top: frame.y,
    width: frame.width,
  };

  useEffect(() => {
    let isMounted = true;

    getStoredUiState().then((uiState) => {
      if (!isMounted) {
        return;
      }

      setFrame(getViewportFrame(uiState));

      if (patientTabs.some((tab) => tab.id === uiState.selectedTab)) {
        setSelectedTab(uiState.selectedTab as PatientTabId);
      }

      setHasLoadedStoredFrame(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredFrame) {
      return;
    }

    const saveTimer = window.setTimeout(() => {
      void saveUiState({
        ...frame,
        isMinimized: false,
        promptX: viewportPadding,
        promptY: viewportPadding,
        selectedTab,
        lastOpenedAt: new Date().toISOString(),
      });
    }, 150);

    return () => window.clearTimeout(saveTimer);
  }, [frame, hasLoadedStoredFrame, selectedTab]);

  useEffect(() => {
    function keepPanelInViewport() {
      setFrame((currentFrame) => getViewportFrame(currentFrame));
    }

    window.addEventListener("resize", keepPanelInViewport);
    return () => window.removeEventListener("resize", keepPanelInViewport);
  }, []);

  function startDrag(event: PointerEvent<HTMLElement>) {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const startFrame = frame;

    event.currentTarget.setPointerCapture(event.pointerId);

    function onPointerMove(moveEvent: globalThis.PointerEvent) {
      setFrame((currentFrame) => ({
        ...currentFrame,
        x: clamp(
          startFrame.x + moveEvent.clientX - startX,
          viewportPadding,
          window.innerWidth - currentFrame.width - viewportPadding,
        ),
        y: clamp(
          startFrame.y + moveEvent.clientY - startY,
          viewportPadding,
          window.innerHeight - currentFrame.height - viewportPadding,
        ),
      }));
    }

    function stopDragging() {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);
  }

  function startResize(event: PointerEvent<HTMLElement>) {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const startFrame = frame;

    event.currentTarget.setPointerCapture(event.pointerId);

    function onPointerMove(moveEvent: globalThis.PointerEvent) {
      setFrame((currentFrame) => ({
        ...currentFrame,
        width: clamp(
          startFrame.width + moveEvent.clientX - startX,
          minFrameWidth,
          window.innerWidth - currentFrame.x - viewportPadding,
        ),
        height: clamp(
          startFrame.height + moveEvent.clientY - startY,
          minFrameHeight,
          window.innerHeight - currentFrame.y - viewportPadding,
        ),
      }));
    }

    function stopResizing() {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stopResizing);
      window.removeEventListener("pointercancel", stopResizing);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stopResizing);
    window.addEventListener("pointercancel", stopResizing);
  }

  function resetFrame() {
    setFrame(getDefaultViewportFrame());
  }

  async function minimizePanel() {
    await saveUiState({
      ...frame,
      isMinimized: true,
      promptX: viewportPadding,
      promptY: viewportPadding,
      selectedTab,
      lastOpenedAt: new Date().toISOString(),
    });
    onMinimize?.();
  }

  async function closePanel() {
    await saveUiState({
      ...frame,
      isMinimized: false,
      promptX: viewportPadding,
      promptY: viewportPadding,
      selectedTab,
      lastOpenedAt: new Date().toISOString(),
    });
    onClose?.();
  }

  function openDashboard() {
    if (typeof chrome !== "undefined" && chrome.runtime?.getURL) {
      window.open(chrome.runtime.getURL("src/ui/dashboard/index.html"), "_blank", "noopener,noreferrer");
      return;
    }

    window.open("../dashboard/index.html", "_blank", "noopener,noreferrer");
  }

  return (
    <section className="floating-panel" style={panelStyle} aria-label="Radeion healthcare companion">
      <header className="floating-panel-header">
        <div className="panel-heading">
          <p className="eyebrow">Radeion</p>
          <h2>Patient Workspace</h2>
        </div>
        <div className="icon-button-row">
          <button
            className="icon-button"
            onPointerDown={startDrag}
            type="button"
            aria-label="Move panel"
            title="Move"
          >
            <Move size={16} />
          </button>
          <button
            className="icon-button"
            onClick={resetFrame}
            type="button"
            aria-label="Reset panel size"
            title="Reset size"
          >
            <Maximize2 size={16} />
          </button>
          <button
            className="icon-button"
            onClick={openDashboard}
            type="button"
            aria-label="Open dashboard"
            title="Open dashboard"
          >
            <ExternalLink size={16} />
          </button>
          <button className="icon-button" onClick={minimizePanel} type="button" aria-label="Minimize panel" title="Minimize">
            <Minus size={16} />
          </button>
          <button className="icon-button" onClick={closePanel} type="button" aria-label="Close panel" title="Close">
            <X size={16} />
          </button>
        </div>
      </header>

      <div className="context-strip">
        <StatusPill
          label={context?.status === "supported" ? "Supported site" : "Manual search"}
          tone={context?.status === "supported" ? "success" : "warning"}
        />
        <span>{patientStatus}</span>
      </div>

      <nav className="tab-list" aria-label="Patient workspace sections">
        {patientTabs.map(({ id, label }) => (
          <button
            className={`tab-button ${selectedTab === id ? "tab-button-active" : ""}`.trim()}
            key={id}
            onClick={() => setSelectedTab(id)}
            type="button"
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="panel-body">
        <section className="empty-state">
          <h3>{selectedTabDefinition.label}</h3>
          <p>
            This tab is ready for backend data wiring. Full patient details stay behind
            authenticated API access.
          </p>
          <Button variant="secondary">Open Search</Button>
        </section>
      </div>
      <button
        className="resize-handle"
        onPointerDown={startResize}
        type="button"
        aria-label="Resize panel"
        title="Resize"
      >
        <Grip size={16} />
      </button>
    </section>
  );
}
