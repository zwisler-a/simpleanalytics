window.sa = (function() {
  var script = document.currentScript;
  var websiteId = script.getAttribute('website');
  if (!websiteId) throw new Error('Website id not given');
  var reportingUrl = script.src.replace('sa.js', 'event/create');
  var sendEvent = function(eventName) {
    fetch(reportingUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ websiteId: websiteId, name: eventName })
    });
  };
  sendEvent('script_loaded');
  return sendEvent;
})();
