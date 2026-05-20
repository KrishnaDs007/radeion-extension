export type ExtensionUiState = {
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  selectedTab: string;
  lastOpenedAt: string;
};

export const defaultUiState: ExtensionUiState = {
  x: 24,
  y: 24,
  width: 420,
  height: 560,
  isMinimized: false,
  selectedTab: "summary",
  lastOpenedAt: "",
};
