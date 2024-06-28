document.addEventListener("DOMContentLoaded", runFunction);
console.log("DOM is ready");
var hasBeenStopped = false;

function runFunction() {
  let button1 = document.getElementById('start');
  button1.addEventListener("click", start);
  let button3 = document.getElementById('result');
  button3.addEventListener('click', result);
  let button2 = document.getElementById('stop');
  function stop() {
    hasBeenStopped = true;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log("stop sending....")
      let activeTabId = tabs[0].id;
      chrome.tabs.sendMessage(activeTabId, { message: "STOP" });
      return;
    });
  }
  button2.addEventListener("click", stop);
  function start() {
    hasBeenStopped = false;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log("start sending....")
      let activeTabId = tabs[0].id;
      chrome.tabs.sendMessage(activeTabId, { message: "START" });
    });
    var intrv = setInterval(() => {
      console.log(hasBeenStopped);
      if (hasBeenStopped) {
        clearInterval(intrv);
        return;
      }
      console.log("sent....")
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log("result sending....")
        chrome.tabs.captureVisibleTab().then((dataUrl) => {
          let activeTabId = tabs[0].id;
          chrome.tabs.sendMessage(activeTabId, { message: "RESULT", ss: dataUrl});
        })
        
        // narate(data);
        // console.log(data)
      });
      // const narate = json => {
      //   const genAI = new GoogleGenerativeAI("AIzaSyBVGNTYqXhyg2v-d15dJn9oYxqJAJRHHLI");

      //   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      //   async function run(json) {
      //     let rag = json;
      //     const prompt = `can you create just a short and precise narative summary of the user behaviour on a website and here is the user activity tracking data: ${JSON.stringify(rag)}`
      //     const result = await model.generateContent(prompt);
      //     const response = await result.response;
      //     const text = response.text();
      //     console.log(text)
      //   }
      //   run(json)
      //   console.log(json)
      // }

    }, 10 * 1000)

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
      let data = chrome.tabs.sendMessage(activeTabId, { message: "RESULT" });
      // let summary = chrome.tabs.sendMessage(activeTabId, { message: "NARATE" , data:data});
      // console.log(summary);
    });
  }






}
// let curr = '0';

// chrome.storage.sync.get([curr], (data) => {
//   const results = data ? JSON.parse(data) : ["NONE"];
//   console.log(results);
// });