import { FloatingPanelApp } from "@/ui/floating-panel/FloatingPanelApp";
import { renderApp } from "@/app/renderApp";
import { Button } from "@/shared/components/Button";
import { detectSiteContext } from "@/shared/site/supportedSites";
import { getStoredUiState, saveUiState } from "@/shared/storage/uiState";
import { Move, PanelRightOpen, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";

const hostId = "radeion-extension-root";
const promptWidth = 340;
const promptHeight = 74;
const promptPadding = 8;

type PromptFrame = {
  x: number;
  y: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

function getDefaultPromptFrame(): PromptFrame {
  return {
    x: clamp(window.innerWidth - promptWidth - 24, promptPadding, window.innerWidth - promptWidth - promptPadding),
    y: clamp(window.innerHeight - promptHeight - 24, promptPadding, window.innerHeight - promptHeight - promptPadding),
  };
}

function ContentApp() {
  const [isClosed, setIsClosed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [promptFrame, setPromptFrame] = useState<PromptFrame>(() => getDefaultPromptFrame());
  const [hasLoadedUiState, setHasLoadedUiState] = useState(false);
  const context = detectSiteContext(document, window.location);
  const promptStyle: CSSProperties = {
    left: promptFrame.x,
    top: promptFrame.y,
  };

  useEffect(() => {
    let isMounted = true;

    getStoredUiState().then((uiState) => {
      if (!isMounted) {
        return;
      }

      setIsMinimized(uiState.isMinimized);
      setPromptFrame({
        x: clamp(uiState.promptX || getDefaultPromptFrame().x, promptPadding, window.innerWidth - promptWidth - promptPadding),
        y: clamp(uiState.promptY || getDefaultPromptFrame().y, promptPadding, window.innerHeight - promptHeight - promptPadding),
      });
      setHasLoadedUiState(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedUiState || isOpen) {
      return;
    }

    getStoredUiState().then((uiState) =>
      saveUiState({
        ...uiState,
        isMinimized,
        promptX: promptFrame.x,
        promptY: promptFrame.y,
      }),
    );
  }, [hasLoadedUiState, isMinimized, isOpen, promptFrame]);

  function openPanel() {
    setIsMinimized(false);
    setIsOpen(true);
  }

  function minimizePanel() {
    setIsMinimized(true);
    setIsOpen(false);
  }

  function startPromptDrag(event: PointerEvent<HTMLElement>) {
    const startX = event.clientX;
    const startY = event.clientY;
    const startFrame = promptFrame;

    event.currentTarget.setPointerCapture(event.pointerId);

    function onPointerMove(moveEvent: globalThis.PointerEvent) {
      setPromptFrame({
        x: clamp(
          startFrame.x + moveEvent.clientX - startX,
          promptPadding,
          window.innerWidth - promptWidth - promptPadding,
        ),
        y: clamp(
          startFrame.y + moveEvent.clientY - startY,
          promptPadding,
          window.innerHeight - promptHeight - promptPadding,
        ),
      });
    }

    function onPointerUp() {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  if (isClosed) {
    return null;
  }

  if (isOpen) {
    return (
      <FloatingPanelApp
        context={context}
        onClose={() => setIsClosed(true)}
        onMinimize={minimizePanel}
      />
    );
  }

  if (isMinimized) {
    return (
      <button className="site-dock" onClick={openPanel} style={promptStyle} type="button" aria-label="Open Radeion panel">
        <PanelRightOpen size={18} />
        Radeion
      </button>
    );
  }

  return (
    <section className="site-prompt" style={promptStyle} aria-label="Radeion companion prompt">
      <div className="site-prompt-drag" onPointerDown={startPromptDrag} role="presentation">
        <p className="eyebrow">Radeion</p>
        <strong>{context.status === "supported" ? "Patient context available" : "Search available"}</strong>
      </div>
      <div className="icon-button-row">
        <button
          className="icon-button"
          onPointerDown={startPromptDrag}
          type="button"
          aria-label="Move prompt"
          title="Move"
        >
          <Move size={16} />
        </button>
        <Button onClick={openPanel} type="button">
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
