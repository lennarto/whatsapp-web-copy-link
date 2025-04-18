document.getElementById('copy-url-btn').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: generateWhatsAppLinkAndCopy
        });
    });
});

function generateWhatsAppLinkAndCopy() {
    const chatElement = document.querySelector('[data-id]');
    if (chatElement) {
        const dataId = chatElement.getAttribute('data-id');
        const numberMatch = dataId.match(/(false|true)_(\d+)@c.us/);
        if (numberMatch) {
            const phoneNumber = numberMatch[2];
            const waLink = `https://wa.me/${phoneNumber}`;
            navigator.clipboard.writeText(waLink).then(() => {
                alert('WhatsApp link copied to clipboard: ' + waLink);
            });
        }
    }
}
