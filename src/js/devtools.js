//global chrome
chrome.devtools.panels.elements.createSidebarPane(
    "Css Path",
    function(sidebar) {
  function updateElementProperties() {
    sidebar.setExpression("var result = (" + cssPath + ")($0); ("+watchSelector+")(result,$$,inspect); result;");
  }
  updateElementProperties();
  chrome.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);
});
