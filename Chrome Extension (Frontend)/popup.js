document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('scan-now').addEventListener('click', function() {
        // Send a message to the background script to initiate a scan
        chrome.runtime.sendMessage({action: "initiateScan"}, function(response) {
            if (response && response.success) {
                document.getElementById('last-scan-result').textContent = 'Scan initiated...';
            } else {
                document.getElementById('last-scan-result').textContent = 'Scan failed to start.';
            }
        });
    });
});

