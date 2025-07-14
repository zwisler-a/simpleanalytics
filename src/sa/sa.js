window.sa = (function () {
    const script = document.currentScript;
    const websiteId = script.getAttribute('website');
    if (!websiteId) throw new Error('Website id not given');
    const reportingUrl = script.src.replace('sa.js', 'event/create');

    let trackingId = localStorage.getItem('sa_tracking_id');
    if (!trackingId) {
        trackingId = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
        localStorage.setItem('sa_tracking_id', trackingId);
    }

    const sendEvent = name => {
        fetch(reportingUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ websiteId, name, trackingId })
        });
    };

    sendEvent('script_loaded');
    return sendEvent;
})();
