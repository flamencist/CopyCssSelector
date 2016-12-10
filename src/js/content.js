/* global cssPath */
let clickedElement;

function copyToClipboard(text) {
    const input = document.createElement("input");
    input.style.position = "fixed";
    input.style.opacity = 0;
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("Copy");
    document.body.removeChild(input);
}

document.addEventListener("mousedown", function (event) {
    clickedElement = event.target;
}, true);

chrome.runtime.onMessage.addListener(function (request) {
    if(request && request.target === "copy"){
        let cssPathObject = cssPath(clickedElement, window.document.querySelectorAll.bind(window.document));
        copyToClipboard(cssPathObject.selector);
    }
});