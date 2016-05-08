//global chrome
let onCopy = function (info, tab) {
    chrome.tabs.sendMessage(tab.id, {target: "copy"});
};
chrome.contextMenus.create({
    id: "copy",
    title: "Copy CSS Selector",
    contexts: ["all"],
    "onclick": onCopy
});

/*
 chrome.commands.onCommand.addListener(function(command) {
 if(command === "copyCssSelector"){
 chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
 onCopy({},tabs[0]);
 });}
 });*/
