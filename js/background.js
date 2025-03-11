// SwiftClick Background Script

// Store state for the extension
const state = {
    activeInspector: false,
    activeColorPicker: false,
    lastInspectedElement: null,
    inspectorTabId: null,
    colorPickerTabId: null
};

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Forward inspector data to the active popup if open
    if (message.action === 'inspectorData') {
        state.lastInspectedElement = message.data;
        forwardToActivePopup(message);
    }
    
    // Forward color picker data to the active popup if open
    else if (message.action === 'colorPicked') {
        forwardToActivePopup(message);
    }
    
    // Handle asset download requests
    else if (message.action === 'downloadAssets') {
        downloadAssets(message.assets);
    }
    
    return true; // Keep the message channel open for async responses
});

// Forward messages to active popup
function forwardToActivePopup(message) {
    chrome.runtime.sendMessage(message).catch(err => {
        // Popup is probably closed, which is expected
        console.log('Could not forward message to popup:', err.message);
    });
}

// Add context menu items
chrome.runtime.onInstalled.addListener(() => {
    // Add inspect element context menu item
    chrome.contextMenus.create({
        id: 'swiftclick-inspect',
        title: 'Inspect with SwiftClick',
        contexts: ['all']
    });
    
    // Add color picker context menu item
    chrome.contextMenus.create({
        id: 'swiftclick-pick-color',
        title: 'Pick Color with SwiftClick',
        contexts: ['all']
    });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'swiftclick-inspect') {
        chrome.tabs.sendMessage(tab.id, { action: 'activateInspector' });
    } else if (info.menuItemId === 'swiftclick-pick-color') {
        chrome.tabs.sendMessage(tab.id, { action: 'activateColorPicker' });
    }
});

// Handle commands (keyboard shortcuts)
chrome.commands.onCommand.addListener((command) => {
    if (command === '_execute_action') {
        // This is the default command to open the popup
        // The popup will open automatically
    }
});

// Download assets function
function downloadAssets(assets) {
    if (!assets || !assets.length) return;
    
    assets.forEach((asset, index) => {
        // Create a unique filename based on the URL
        let filename = asset.url.split('/').pop();
        
        // Remove query parameters
        filename = filename.split('?')[0];
        
        // Add index if no filename was extracted
        if (!filename) {
            filename = `asset-${index}.${getExtensionFromType(asset.type)}`;
        }
        
        // Add a timestamp to prevent overwrites
        const timestamp = new Date().getTime();
        const parts = filename.split('.');
        if (parts.length > 1) {
            const ext = parts.pop();
            filename = `${parts.join('.')}-${timestamp}.${ext}`;
        } else {
            filename = `${filename}-${timestamp}`;
        }
        
        // Download the asset
        chrome.downloads.download({
            url: asset.url,
            filename: `SwiftClick/${asset.type}/${filename}`,
            saveAs: false
        });
    });
}

// Get file extension based on asset type
function getExtensionFromType(type) {
    switch (type) {
        case 'images': return 'png';
        case 'svg': return 'svg';
        case 'video': return 'mp4';
        case 'audio': return 'mp3';
        default: return 'txt';
    }
}

// Listener for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Inject the content script if needed
    if (changeInfo.status === 'complete') {
        // No need to re-inject since we're using content_scripts in manifest
    }
}); 