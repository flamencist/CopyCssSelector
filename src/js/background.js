let onCopy = function (info, tab) {
    chrome.tabs.sendMessage(tab.id, {target: "copy"});
};

chrome.contextMenus.create({
    id: "copy",
    title: "Copy CSS Selector",
    contexts: ["all"],
    "onclick": onCopy
});

chrome.runtime.onInstalled.addListener((details)=>{
    if(["install", "update"].some((reason)=>details.reason === reason)){
        injectScriptsInAllTabs();
    }
});

function injectScriptsInAllTabs(){
    console.log("reinject content scripts into all tabs");
    var manifest = chrome.runtime.getManifest();
    var scripts = manifest.content_scripts.reduce((sc, cur)=>sc.concat(cur.js || []), []);
    var styles = manifest.content_scripts.reduce((sc, cur)=>sc.concat(cur.css || []), []);
    chrome.tabs.query({url:"*://*/*"}, (tabs)=>{
        var filtered = tabs.filter(_=>_.url.indexOf("https://chrome.google.com/webstore/detail") !== 0);
        filtered.forEach(tab=>{
            scripts.map((sc)=>chrome.tabs.executeScript(tab.id, {file: sc, allFrames: true}));
        });
        filtered.forEach(tab=>{
            styles.map((sc)=>chrome.tabs.insertCSS(tab.id, {file: sc, allFrames: true}));
        });
    });
}