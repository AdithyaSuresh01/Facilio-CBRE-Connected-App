(function () {
  if (typeof window.createOperationsHelpDeskApp === "function") {
    return;
  }

  document.write(
    '<script type="text/javascript" src="/app/scripts/app.js"><\\/script>'
  );
})();
