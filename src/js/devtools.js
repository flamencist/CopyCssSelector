/*global SelectorGenerator, watchSelector */
chrome.devtools.panels.elements.createSidebarPane(
    "Css Path",
    function (sidebar) {
        function createObject(selectorGenerator, node) {
            return Object.create(null, {
                selector: {value: selectorGenerator.getSelector(node), writable: true},
                path: {value: selectorGenerator.getPath(node)},
                element: {value: node, writable: true}
            });
        }

        /*eslint-disable*/
        function execute() {
            var selectorGenerator = new SelectorGenerator({querySelectorAll: window.document.querySelectorAll.bind(window.document)});
            var result = createObject(selectorGenerator, $0);
            watchSelector(result, $$, inspect);
            return result;
        }

        function buildExpression() {
            return "(function(){ " +
                "var exports = {};" +
                "var SelectorGenerator = (" + SelectorGenerator + "); " +
                "var createObject = (" + createObject + ");" +
                "var watchSelector = (" + watchSelector + ");" +
                "var execute = (" + execute + ");" +
                "return execute();" +
                "})();";
        }

        function updateElementProperties() {
            sidebar.setExpression(buildExpression());
        }


        updateElementProperties();
        chrome.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);
    });
