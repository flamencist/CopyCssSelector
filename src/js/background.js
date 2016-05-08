let onCopy = function (info, tab) {
    chrome.tabs.sendMessage(tab.id, {target: "copy"});
};

chrome.contextMenus.create({
    id: "copy",
    title: "Copy CSS Selector",
    contexts: ["all"],
    "onclick": onCopy
});
