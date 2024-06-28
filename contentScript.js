(() => {
var userBehaviour = (function () {
    var defaults = {
        userInfo: true,
        clicks: true,
        mouseMovement: true,
        mouseMovementInterval: 1,
        mouseScroll: true,
        keyLogger: true,
        mousePageChange: true, //todo
        timeCount: true,
        clearAfterProcess: true, // todo
        processTime: 15,
        windowResize: true,
        visibilitychange: true,
        gazeTracking: true,
        processData: function (results) {
            console.log(results);
        },
    };
    var user_config = {}
    var mem = {
        processInterval: null,
        mouseInterval: null,
        mousePosition: [], //x,y,timestamp
        eventListeners: {
            scroll: null,
            click: null,
            mouseMovement: null,
            windowResize: null,
            visibilitychange: null,
            keyLogger: null,
            gazeListener: null
        },
        initGazeTracking : function() {
            if (!defaults.gazeTracking) return;
            webgazer.setGazeListener((data, elapsedTime) => {
                if (data) {
                    const x = data.x;
                    const y = data.y;
                    results.gazeData.append([x,y,getTimeStamp()]);
                }
            }).begin();
        },
        eventsFunctions: {
            scroll: () => {
                results.mouseScroll.push([window.scrollX, window.scrollY, getTimeStamp()]);
            },
            click: (e) => {
                results.clicks.clickCount++;
                var path = [];
                var node = "";
                e.composedPath().forEach((el, i) => {
                    if ((i !== e.composedPath().length - 1) && (i !== e.composedPath().length - 2)) {
                        node = el.localName;
                        (el.className !== "") ? el.classList.forEach((clE) => {
                            node += "." + clE
                        }): 0;
                        (el.id !== "") ? node += "#" + el.id: 0;
                        path.push(node);
                    }
                })
                path = path.reverse().join(">");
                results.clicks.clickDetails.push([e.clientX, e.clientY, path, getTimeStamp()]);
            },
            mouseMovement: (e) => {
                mem.mousePosition = [e.clientX, e.clientY, getTimeStamp()];
            },
            windowResize: (e) => {
                results.windowSizes.push([window.innerWidth, window.innerHeight, getTimeStamp()]);
            },
            visibilitychange: (e) => {
                results.visibilitychanges.push([document.visibilityState, getTimeStamp()]);
                processResults();
                // stop();
            }, 
            keyLogger: function(){
                document.addEventListener('paste', function(event){
                    var pastedText = undefined;
                    // Get Pasted Text
                    if (window.clipboardData && window.clipboardData.getData) {
                        pastedText = window.clipboardData.getData('Text');
                    } else if (event.clipboardData && event.clipboardData.getData) {
                        pastedText = event.clipboardData.getData('text/plain');
                    }
    
                    if(!!pastedText){
                        results.keyLogger.push({
                            timestamp: Date.now(),
                            data: pastedText,
                            type: 'paste'
                        });
                    }
                });
                document.addEventListener('keyup', function(event){
                    var keyString    = event.key;
                    results.keyLogger.push({
                        timestamp: Date.now(),
                        data: keyString,
                        type: 'keypress'
                    });
                });
            },
    }};
    var results = {};

    function resetResults() {
        results = {
            userInfo: {
                windowSize: [window.innerWidth, window.innerHeight],
                appCodeName: navigator.appCodeName || '',
                appName: navigator.appName || '',
                vendor: navigator.vendor || '',
                platform: navigator.platform || '',
                userAgent: navigator.userAgent || ''
            },
            time: { //todo
                startTime: 0,
                currentTime: 0,
                stopTime: 0,
            },
            clicks: {
                clickCount: 0,
                clickDetails: []
            },
            mouseMovements: [],
            mouseScroll: [],
            contextChange: [], //todo
            keyLogger: [], //todo
            windowSizes: [],
            visibilitychanges: [],
            gazeData: []
        }
    };
    resetResults();

    function getTimeStamp() {
        return Date.now();
    };

    function config(ob) {
        user_config = {};
        Object.keys(defaults).forEach((i) => {
            i in ob ? user_config[i] = ob[i] : user_config[i] = defaults[i];
        })
    };

    function start() {

        if (Object.keys(user_config).length !== Object.keys(defaults).length) {
            console.log("no config provided. using default..");
            user_config = defaults;
        }
        // TIME SET
        if (user_config.timeCount !== undefined && user_config.timeCount) {
            results.time.startTime = getTimeStamp();
        }
        // MOUSE MOVEMENTS
        if (user_config.mouseMovement) {
            mem.eventListeners.mouseMovement = window.addEventListener("mousemove", mem.eventsFunctions.mouseMovement);
            mem.mouseInterval = setInterval(() => {
                if (mem.mousePosition && mem.mousePosition.length) { //if data has been captured
                    if (!results.mouseMovements.length || ((mem.mousePosition[0] !== results.mouseMovements[results.mouseMovements.length - 1][0]) && (mem.mousePosition[1] !== results.mouseMovements[results.mouseMovements.length - 1][1]))) {
                        results.mouseMovements.push(mem.mousePosition)
                    }
                }
            }, defaults.mouseMovementInterval * 1000);
        }
        //CLICKS
        if (user_config.clicks) {
            mem.eventListeners.click = window.addEventListener("click", mem.eventsFunctions.click);
        }
        //SCROLL
        if (user_config.mouseScroll) {
            mem.eventListeners.scroll = window.addEventListener("scroll", mem.eventsFunctions.scroll);
        }
        //Window sizes
        if (user_config.windowResize !== false) {
            // mem.eventsFunctions.windowResize();
            mem.eventListeners.windowResize = window.addEventListener("resize", mem.eventsFunctions.windowResize);
        }
        //Before unload / visibilitychange
        if (user_config.visibilitychange !== false) {
            mem.eventListeners.visibilitychange = window.addEventListener("visibilitychange", mem.eventsFunctions.visibilitychange);
        }
        if (user_config.keyLogger !== false){
            mem.eventsFunctions.keyLogger();
        }
        if (user_config.gazeTracking !== false){
            mem.initGazeTracking();
        }
        //PROCESS INTERVAL
        if (user_config.processTime !== false) {
            mem.processInterval = setInterval(() => {
                processResults();
            }, user_config.processTime * 1000)
        }
    };

    function processResults() {
        user_config.processData(result());
        if (user_config.clearAfterProcess) {
            resetResults();
        }
    }

    function stop() {
        if (user_config.processTime !== false) {
            console.log("Stopping it!");
            clearInterval(mem.processInterval);
        }
        clearInterval(mem.mouseInterval);
        webgazer.end();
        console.log("this has run");
        window.removeEventListener("scroll", mem.eventsFunctions.scroll);
        window.removeEventListener("click", mem.eventsFunctions.click);
        window.removeEventListener("mousemove", mem.eventsFunctions.mouseMovement);
        window.removeEventListener("resize", mem.eventsFunctions.windowResize);
        window.removeEventListener("visibilitychange", mem.eventsFunctions.visibilitychange);
        results.time.stopTime = getTimeStamp();
        processResults();
    }

    function result() {
        if (user_config.userInfo === false && userBehaviour.showResult().userInfo !== undefined) {
            delete userBehaviour.showResult().userInfo;
        }
        if (user_config.timeCount !== undefined && user_config.timeCount) {
            results.time.currentTime = getTimeStamp();
        }
        return results
    };

    function showConfig() {
        if (Object.keys(user_config).length !== Object.keys(defaults).length) {
            return defaults;
        } else {
            return user_config;
        }
    };
    return {
        showConfig: showConfig,
        config: config,
        start: start,
        stop: stop,
        showResult: result,
        processResults: processResults,
    };

})();
console.log("I am a content script!");
chrome.runtime.onMessage.addListener(function(obj, sender, response){
    console.log("RECV");
    if (obj.message === "START") {
        console.log("START");
        userBehaviour.start();
    } else if (obj.message === "STOP") {
        console.log("STOP");
        userBehaviour.stop();
        webgazer.end();
    } else if ( obj.message === "RESULT") {
        const txt = document.documentElement.outerHTML;
        let dataUrl = obj.ss;
        console.log("RESULT");
        // let curr = '0';
        let data = userBehaviour.showResult();
        console.log(data);
        chrome.runtime.sendMessage({
            total_elements: data, 
            full_html: txt
          });
        // chrome.storage.sync.set({ [curr]: JSON.stringify(data)});
    }
  });
//   function narate(results){
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         console.log("NARATING")
//         let activeTabId = tabs[0].id;
//         chrome.tabs.sendMessage(activeTabId, { message: "NARATE" });
//       });
//   }
})();