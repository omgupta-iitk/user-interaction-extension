// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "START" || request.action === "STOP" || request.action === "RESULT") {
      chrome.tabs.sendMessage(request.tabId, {
        type: request.action,
        value: request.value
      });
    }
  });
  