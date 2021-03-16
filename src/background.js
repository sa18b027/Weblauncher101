chrome.browserAction.onClicked.addListener(function () {
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});

let mode = 1;
if (localStorage.getItem("mode")) {
  mode = parseInt(localStorage.getItem("mode"));
}
//wenn eine Nachricht kommt, dann z.B von Taststatur subject=mode, schicke die Antwort zurück
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.subject == "mode") {
    sendResponse({ mode: mode });
  } else if (request.subject == "home") {
    chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
  }
});

//console.log(mode);
