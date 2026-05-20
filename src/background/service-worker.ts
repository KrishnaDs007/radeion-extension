chrome.runtime.onInstalled.addListener(() => {
  console.info("Radeion extension installed.");
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "RADEION_HEALTH_CHECK") {
    sendResponse({ ok: true });
    return true;
  }

  return false;
});
