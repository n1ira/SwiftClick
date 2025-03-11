// SwiftClick Background Script

// Store state for the extension
const state = {
    activeInspector: false,
    activeColorPicker: false,
    scrapingModeActive: false,
    lastInspectedElement: null,
    inspectorTabId: null,
    colorPickerTabId: null
};

// Load state from storage when extension starts
chrome.storage.sync.get(['inspectorActive', 'colorPickerActive'], function(result) {
    console.log('Loaded state from storage:', result);
    state.activeInspector = result.inspectorActive || false;
    state.activeColorPicker = result.colorPickerActive || false;
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Forward inspector data to the active popup if open
    if (message.action === 'inspectorData') {
        state.lastInspectedElement = message.data;
        forwardToActivePopup(message);
        sendResponse({ success: true });
    }
    
    // Forward color picker data to the active popup if open
    else if (message.action === 'colorPicked') {
        forwardToActivePopup(message);
        sendResponse({ success: true });
    }
    
    // Handle asset download requests
    else if (message.action === 'downloadAssets') {
        downloadAssets(message.assets);
        sendResponse({ success: true });
    }
    
    // Handle toggle feature requests
    else if (message.action === 'toggleFeature') {
        if (message.feature === 'inspector') {
            state.activeInspector = message.enabled;
            // Save state to storage
            chrome.storage.sync.set({ inspectorActive: message.enabled });
            // Update the active tab with the new state
            updateActiveTab(message);
        } else if (message.feature === 'eyedropper') {
            state.activeColorPicker = message.enabled;
            // Save state to storage
            chrome.storage.sync.set({ colorPickerActive: message.enabled });
            // Update the active tab with the new state
            updateActiveTab(message);
        } else if (message.feature === 'scrapingMode') {
            state.scrapingModeActive = message.enabled;
            // Update the active tab with the new state
            updateActiveTab(message);
        }
        sendResponse({ success: true });
    }
    
    // Handle get state requests from popup
    else if (message.action === 'getState') {
        sendResponse({
            activeInspector: state.activeInspector,
            activeColorPicker: state.activeColorPicker,
            scrapingModeActive: state.scrapingModeActive
        });
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

// Update the active tab with the new state
function updateActiveTab(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, message);
        }
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
        // Toggle inspector mode
        state.activeInspector = !state.activeInspector;
        // Save state to storage
        chrome.storage.sync.set({ inspectorActive: state.activeInspector });
        // Send message to content script
        chrome.tabs.sendMessage(tab.id, {
            action: 'toggleFeature',
            feature: 'inspector',
            enabled: state.activeInspector
        });
    } else if (info.menuItemId === 'swiftclick-pick-color') {
        // Toggle color picker mode
        state.activeColorPicker = !state.activeColorPicker;
        // Save state to storage
        chrome.storage.sync.set({ colorPickerActive: state.activeColorPicker });
        // Send message to content script
        chrome.tabs.sendMessage(tab.id, {
            action: 'toggleFeature',
            feature: 'eyedropper',
            enabled: state.activeColorPicker
        });
    }
});

// Handle commands (keyboard shortcuts)
chrome.commands.onCommand.addListener((command) => {
    if (command === 'toggle_inspector') {
        state.activeInspector = !state.activeInspector;
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs.length > 0) {
                if (state.activeInspector) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'activateInspector' });
                } else {
                    chrome.tabs.sendMessage(tabs[0].id, { 
                        action: 'toggleFeature', 
                        feature: 'inspector', 
                        enabled: false 
                    });
                }
                
                // Also update storage for UI consistency
                chrome.storage.sync.get(['swiftClickToggles'], function(result) {
                    const savedToggles = result.swiftClickToggles || {};
                    savedToggles['inspectorToggle'] = state.activeInspector;
                    chrome.storage.sync.set({ swiftClickToggles: savedToggles });
                });
            }
        });
    } else if (command === 'toggle_eyedropper') {
        state.activeColorPicker = !state.activeColorPicker;
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs.length > 0) {
                if (state.activeColorPicker) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'activateColorPicker' });
                } else {
                    chrome.tabs.sendMessage(tabs[0].id, { 
                        action: 'toggleFeature', 
                        feature: 'eyedropper', 
                        enabled: false 
                    });
                }
                
                // Also update storage for UI consistency
                chrome.storage.sync.get(['swiftClickToggles'], function(result) {
                    const savedToggles = result.swiftClickToggles || {};
                    savedToggles['eyedropperToggle'] = state.activeColorPicker;
                    chrome.storage.sync.set({ swiftClickToggles: savedToggles });
                });
            }
        });
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