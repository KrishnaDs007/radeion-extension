import { ExternalLink, Grip, Maximize2, Move, Minus, X } from "lucide-react";
import { useState } from "react";
import type { CSSProperties, PointerEvent } from "react";

import { Button } from "@/shared/components/Button";
import { StatusPill } from "@/shared/components/StatusPill";
import type { PatientTabId } from "@/shared/patient/patientTabs";
import { patientTabs } from "@/shared/patient/patientTabs";
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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function FloatingPanelApp({ context, onClose, onMinimize }: FloatingPanelAppProps) {
  const [selectedTab, setSelectedTab] = useState<PatientTabId>("home");
  const [frame, setFrame] = useState<PanelFrame>(() => ({
    ...defaultFrame,
    x: Math.max(window.innerWidth - defaultFrame.width - defaultFrame.x, 16),
    y: Math.max(window.innerHeight - defaultFrame.height - defaultFrame.y, 16),
  }));
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

  function startDrag(event: PointerEvent<HTMLButtonElement>) {
    const startX = event.clientX;
    const startY = event.clientY;
    const startFrame = frame;

    event.currentTarget.setPointerCapture(event.pointerId);

    function onPointerMove(moveEvent: globalThis.PointerEvent) {
      setFrame((currentFrame) => ({
        ...currentFrame,
        x: clamp(startFrame.x + moveEvent.clientX - startX, 8, window.innerWidth - currentFrame.width - 8),
        y: clamp(startFrame.y + moveEvent.clientY - startY, 8, window.innerHeight - currentFrame.height - 8),
      }));
    }

    function onPointerUp() {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  function startResize(event: PointerEvent<HTMLButtonElement>) {
    const startX = event.clientX;
    const startY = event.clientY;
    const startFrame = frame;

    event.currentTarget.setPointerCapture(event.pointerId);

    function onPointerMove(moveEvent: globalThis.PointerEvent) {
      setFrame((currentFrame) => ({
        ...currentFrame,
        width: clamp(startFrame.width + moveEvent.clientX - startX, 340, window.innerWidth - currentFrame.x - 8),
        height: clamp(startFrame.height + moveEvent.clientY - startY, 360, window.innerHeight - currentFrame.y - 8),
      }));
    }

    function onPointerUp() {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  function resetFrame() {
    setFrame({
      ...defaultFrame,
      x: Math.max(window.innerWidth - defaultFrame.width - defaultFrame.x, 16),
      y: Math.max(window.innerHeight - defaultFrame.height - defaultFrame.y, 16),
    });
  }

  return (
    <section className="floating-panel" style={panelStyle} aria-label="Radeion healthcare companion">
      <header className="floating-panel-header">
        <div>
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
          <button className="icon-button" onClick={resetFrame} type="button" aria-label="Reset panel size" title="Reset size">
            <Maximize2 size={16} />
          </button>
          <button className="icon-button" type="button" aria-label="Open dashboard" title="Open dashboard">
            <ExternalLink size={16} />
          </button>
          <button className="icon-button" onClick={onMinimize} type="button" aria-label="Minimize panel" title="Minimize">
            <Minus size={16} />
          </button>
          <button className="icon-button" onClick={onClose} type="button" aria-label="Close panel" title="Close">
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
