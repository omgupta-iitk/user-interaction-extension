alert("hello");
async function getActiveTabURL() {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    active: true
  });

  return tabs[0];
}
let buttons = document.querySelectorAll('button');
let string = ""
let arr = Array.from(buttons);
let id = 23;
arr.forEach(button => {
  button.addEventListener('click', (e) => {
    if (e.target.innerHTML == 'start') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let activeTabId = tabs[0].id;
      chrome.runtime.sendMessage({
        action:"START",
        value: id,
      });
    });
    };
    if (e.target.innerHTML == 'stop') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let activeTabId = tabs[0].id;
      chrome.runtime.sendMessage({
        action: "STOP",
        value: id,
      });
    });
    };
    if (e.target.innerHTML == 'result') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let activeTabId = tabs[0].id;
      chrome.runtime.sendMessage({
        action: "RESULT",
        value: id,
      });
    });
    };
  });
});

let curr = '0';

chrome.storage.sync.get([curr], (data) => {
  const results = data ? JSON.parse(data) : ["NONE"];
  alert(results);
});