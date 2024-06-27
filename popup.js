document.addEventListener("DOMContentLoaded", runFuction);
console.log("DOM is ready");
function runFuction() {


  
  let button1 = document.getElementById('start');
  button1.addEventListener("click",start);
  let button2 = document.getElementById('stop');
  button2.addEventListener("click",stop);
  let button3 = document.getElementById('result');
  button3.addEventListener("click",result);
  
  function start() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log("start sending....")
      let activeTabId = tabs[0].id;
      chrome.tabs.sendMessage(activeTabId, { message: "START" });
    });
  }
  function stop() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log("stop sending....")
      let activeTabId = tabs[0].id;
      chrome.tabs.sendMessage(activeTabId, { message: "STOP" });
    });
  }
  function result() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log("result sending....")
      let activeTabId = tabs[0].id;
      chrome.tabs.sendMessage(activeTabId, { message: "RESULT" });
    });
  }






}
// let curr = '0';

// chrome.storage.sync.get([curr], (data) => {
//   const results = data ? JSON.parse(data) : ["NONE"];
//   console.log(results);
// });