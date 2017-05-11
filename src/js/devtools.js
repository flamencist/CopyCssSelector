/*global SelectorGenerator, watchSelector */
chrome.devtools.panels.elements.createSidebarPane(
    "Css Path",
    function (sidebar) {
        function createObject(selectorGenerator, node){
            return Object.create(null, {
                selector: {value: selectorGenerator.getSelector(node), writable: true},
                path: {value: selectorGenerator.getPath(node)},
                element: {value: node, writable: true}
            });
        }
        function updateElementProperties() {
            sidebar.setExpression("var selectorGenerator = new ("+ SelectorGenerator +")({querySelectorAll:window.document.querySelectorAll.bind(window.document)});" +
                "var result = (" + createObject + ")(selectorGenerator,$0);" +
                " (" + watchSelector + ")(result,$$,inspect); result;");
        }

        updateElementProperties();
        chrome.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);
    });
