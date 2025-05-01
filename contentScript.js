// Function to generate the dynamic WhatsApp URL
function generateWhatsAppLink() {
    const chatElement = document.querySelector('[data-id]');
    if (chatElement) {
        const dataId = chatElement.getAttribute('data-id');
        const numberMatch = dataId.match(/(false|true)_(\d+)@c.us/); // Detect personal chats, not groups
        if (numberMatch) {
            const phoneNumber = numberMatch[2];
            return `https://wa.me/${phoneNumber}`;
        }
    }
    return null;
}

// Function to copy text to clipboard
function copyToClipboard(text, color = '#f5e3a1') {
    navigator.clipboard.writeText(text).then(function() {
        showNotification('URL copied to clipboard!', color);
    }, function(err) {
        showNotification('Failed to copy URL', '#f5e3a1');
        console.error('Could not copy text: ', err);
    });
}

// Function to show a custom notification that fades out
function showNotification(message, backgroundColor) {
    const existingNotification = document.querySelector('#wa-notification');
    if (existingNotification) {
        existingNotification.remove(); // Remove any existing notification before showing a new one
    }

    const notification = document.createElement('div');
    notification.id = 'wa-notification';
    notification.innerText = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = backgroundColor;
    notification.style.color = '#000'; // Black text for good contrast
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '8px'; // Round edges
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.zIndex = '10000';
    notification.style.opacity = '1';
    notification.style.transition = 'opacity 0.5s ease';

    document.body.appendChild(notification);

    // Fade out after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500); // Wait until the transition completes
    }, 3000);
}

// Inject the button into the header, but only if it's not a group chat
function injectCopyButton() {
    const chatElement = document.querySelector('[data-id]');
    if (!chatElement) return;

    const dataId = chatElement.getAttribute('data-id');
    if (dataId.includes('@g.us')) {
        return;
    }

    const header = document.querySelector('header[class^="x1n2onr6"]');
    const existingButtonGroup = header?.querySelector('div[class*="x1ad89wd"]') || header?.lastElementChild;

    if (header && !document.querySelector('#copy-url-btn')) {
        const phoneNumber = (dataId.match(/(false|true)_(\d+)@c.us/) || [])[2];

        if (!phoneNumber) return;

        const buttonStyles = `
            background-color: #f5e3a1;
            border: none;
            border-radius: 8px;
            padding: 2px 10px 4px 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            margin-right: 10px;
        `;

        // Create "Copy" button
        const copyBtn = document.createElement('button');
        copyBtn.id = 'copy-url-btn';
        copyBtn.innerHTML = `🔗 Both urls`;
        copyBtn.style.cssText = buttonStyles;
        copyBtn.addEventListener('click', () => {
            const waLink = `https://wa.me/${phoneNumber} / https://web.whatsapp.com/send?phone=${phoneNumber}`;
            copyToClipboard(waLink, '#f5e3a1');
        });

        // Create "Web" button
        const webBtn = document.createElement('button');
        webBtn.id = 'open-wa-web-btn';
        webBtn.innerHTML = `💻 Web`;
        webBtn.style.cssText = buttonStyles.replace('#f5e3a1', '#d4fdd4');
        webBtn.addEventListener('click', () => {
            const url = `https://web.whatsapp.com/send?phone=${phoneNumber}`;
            copyToClipboard(url, '#d4fdd4');
        });

        // Create "API" button
        const apiBtn = document.createElement('button');
        apiBtn.id = 'open-wa-api-btn';
        apiBtn.innerHTML = `📱 App`;
        apiBtn.style.cssText = buttonStyles.replace('#f5e3a1', '#d1e7fd');
        apiBtn.addEventListener('click', () => {
            const url = `https://wa.me/${phoneNumber}`;
            copyToClipboard(url, '#d1e7fd');
        });

        header.insertBefore(apiBtn, existingButtonGroup);
        header.insertBefore(webBtn, apiBtn);
        header.insertBefore(copyBtn, webBtn);
    }
}

// Run the injection when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', injectCopyButton);

// Re-inject the button when the URL changes or new messages are loaded
const observer = new MutationObserver(injectCopyButton);
observer.observe(document.body, { childList: true, subtree: true });
