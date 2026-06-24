export type ExtensionUiState = {
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  promptX: number;
  promptY: number;
  selectedTab: string;
  lastOpenedAt: string;
};

export const defaultUiState: ExtensionUiState = {
  x: 24,
  y: 24,
  width: 420,
  height: 560,
  isMinimized: false,
  promptX: 24,
  promptY: 24,
  selectedTab: "home",
  lastOpenedAt: "",
};

const uiStateKey = "radeion:uiState";

function isChromeStorageAvailable() {
  return typeof chrome !== "undefined" && Boolean(chrome.storage?.local);
}

export async function getStoredUiState(): Promise<ExtensionUiState> {
  if (isChromeStorageAvailable()) {
    const result = await chrome.storage.local.get(uiStateKey);
    return {
      ...defaultUiState,
      ...((result[uiStateKey] as Partial<ExtensionUiState> | undefined) ?? {}),
    };
  }

  const rawValue = window.localStorage.getItem(uiStateKey);
  return rawValue
    ? {
        ...defaultUiState,
        ...(JSON.parse(rawValue) as Partial<ExtensionUiState>),
      }
    : defaultUiState;
}

export async function saveUiState(uiState: ExtensionUiState) {
  if (isChromeStorageAvailable()) {
    await chrome.storage.local.set({ [uiStateKey]: uiState });
    return;
  }

  window.localStorage.setItem(uiStateKey, JSON.stringify(uiState));
}
