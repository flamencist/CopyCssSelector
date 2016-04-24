//global chrome
chrome.devtools.panels.elements.createSidebarPane(
    "Css Path",
    function(sidebar) {
  function updateElementProperties() {
    sidebar.setExpression("(" + cssPath + ")($0)");
  }
  updateElementProperties();
  chrome.devtools.panels.elements.onSelectionChanged.addListener(
      updateElementProperties);
});
