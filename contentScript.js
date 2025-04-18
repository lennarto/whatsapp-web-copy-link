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
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showNotification('URL copied to clipboard!');
    }, function(err) {
        showNotification('Failed to copy URL');
        console.error('Could not copy text: ', err);
    });
}

// Function to show a custom notification that fades out
function showNotification(message) {
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
    notification.style.backgroundColor = '#f5e3a1'; // Match the pastel yellow color of the button
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
        // Do not inject button for group chats
        return;
    }

    const header = document.querySelector('header[class^="x1n2onr6"]');

    // Check if the button is already present, avoid adding it multiple times
    if (header && !document.querySelector('#copy-url-btn')) {
        const button = document.createElement('button');
        
        // Add icon next to "Copy URL" text
        button.innerHTML = `
            <img src="https://img.icons8.com/ios-filled/16/000000/link.png" alt="Link Icon" style="margin-right: 5px;">
            Copy URL
        `;
        button.id = 'copy-url-btn';
        button.style.backgroundColor = '#f5e3a1'; // Pastel yellow color
        button.style.border = 'none';
        button.style.borderRadius = '8px'; // Round edges for the button
        button.style.padding = '10px';
        button.style.cursor = 'pointer';
        button.style.display = 'flex'; // Align icon and text
        button.style.alignItems = 'center'; // Vertically center icon and text
        button.style.marginRight = '10px'; // Move it to the left of existing buttons
        button.style.marginLeft = 'auto'; // Align it to the left

        // Add click event to copy the generated URL
        button.addEventListener('click', () => {
            const waLink = generateWhatsAppLink();
            if (waLink) {
                copyToClipboard(waLink);
            } else {
                showNotification('Could not generate the link');
            }
        });

        // Find the existing button group and insert the new button before it
        const existingButtonGroup = header.querySelector('div[class*="x1ad89wd"]') || header.lastElementChild;
        header.insertBefore(button, existingButtonGroup);
    }
}

// Run the injection when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', injectCopyButton);

// Re-inject the button when the URL changes or new messages are loaded
const observer = new MutationObserver(injectCopyButton);
observer.observe(document.body, { childList: true, subtree: true });
