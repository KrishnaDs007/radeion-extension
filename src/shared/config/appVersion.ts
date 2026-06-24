import packageJson from "../../../package.json";

export function getAppVersion() {
  if (typeof chrome !== "undefined" && chrome.runtime?.getManifest) {
    return chrome.runtime.getManifest().version;
  }

  return packageJson.version;
}
