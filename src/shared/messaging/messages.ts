export type ExtensionMessage =
  | {
      type: "RADEION_HEALTH_CHECK";
    }
  | {
      type: "RADEION_OPEN_FLOATING_PANEL";
    }
  | {
      type: "RADEION_OPEN_DASHBOARD";
      contextId?: string;
    };
