document.addEventListener('DOMContentLoaded', function() {
    var scanBtn = document.getElementById('scanBtn');
    scanBtn.addEventListener('click', async () => {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab.url) {
            // Display the URL in your extension's popup, or send it to your server
            document.getElementById('result').textContent = `URL: ${tab.url}`;
            // Here you can also send the URL to your React app for scanning
        }
    });
});
