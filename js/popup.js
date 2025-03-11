// SwiftClick Popup JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Popup loaded');
    
    // Initialize UI
    loadToggleStates();
    initToggles();
    initDarkMode();
    
    // Handle extension version display
    const manifest = chrome.runtime.getManifest();
    const version = manifest.version;
    console.log('Extension version:', version);
});

// Load toggle states from storage
function loadToggleStates() {
    console.log('Loading toggle states from storage');
    
    chrome.storage.sync.get(['inspectorActive', 'colorPickerActive', 'scrapingModeActive'], function(result) {
        console.log('Loaded toggle states:', result);
        
        // Set inspector toggle state
        const inspectorToggle = document.getElementById('inspectorToggle');
        if (inspectorToggle && result.inspectorActive) {
            inspectorToggle.checked = true;
            // Activate inspector if it was active
            activateInspector();
        }
        
        // Set color picker toggle state
        const colorPickerToggle = document.getElementById('colorPickerToggle');
        if (colorPickerToggle && result.colorPickerActive) {
            colorPickerToggle.checked = true;
            // Activate color picker if it was active
            activateColorPicker();
        }
        
        // Set scraping mode toggle state
        const scrapingModeToggle = document.getElementById('scrapingModeToggle');
        if (scrapingModeToggle && result.scrapingModeActive) {
            scrapingModeToggle.checked = true;
            // Activate scraping mode if it was active
            toggleScrapingMode(true);
        }
    });
}

// Toggle Functionality
function initToggles() {
    console.log('Initializing toggles');
    
    // Inspector Toggle
    const inspectorToggle = document.getElementById('inspectorToggle');
    if (inspectorToggle) {
        inspectorToggle.addEventListener('change', function() {
            console.log('Inspector toggle:', this.checked);
            if (this.checked) {
                activateInspector();
                // Save state to storage
                chrome.storage.sync.set({ inspectorActive: true });
            } else {
                deactivateInspector();
                // Save state to storage
                chrome.storage.sync.set({ inspectorActive: false });
            }
        });
    } else {
        console.error('Inspector toggle not found');
    }
    
    // Color Picker Toggle
    const colorPickerToggle = document.getElementById('colorPickerToggle');
    if (colorPickerToggle) {
        colorPickerToggle.addEventListener('change', function() {
            console.log('Color picker toggle:', this.checked);
            if (this.checked) {
                activateColorPicker();
                // Save state to storage
                chrome.storage.sync.set({ colorPickerActive: true });
            } else {
                deactivateColorPicker();
                // Save state to storage
                chrome.storage.sync.set({ colorPickerActive: false });
            }
        });
    } else {
        console.error('Color picker toggle not found');
    }
    
    // Scraping Mode Toggle
    const scrapingModeToggle = document.getElementById('scrapingModeToggle');
    if (scrapingModeToggle) {
        scrapingModeToggle.addEventListener('change', function() {
            console.log('Scraping mode toggle:', this.checked);
            toggleScrapingMode(this.checked);
            // Save state to storage
            chrome.storage.sync.set({ scrapingModeActive: this.checked });
        });
    } else {
        console.error('Scraping mode toggle not found');
    }
    
    // Assets Item (clickable)
    const assetsItem = document.getElementById('assetsItem');
    if (assetsItem) {
        assetsItem.addEventListener('click', function() {
            console.log('Assets item clicked');
            openAssetsWindow();
        });
    } else {
        console.error('Assets item not found');
    }
    
    // Responsive Item (clickable)
    const responsiveItem = document.getElementById('responsiveItem');
    if (responsiveItem) {
        responsiveItem.addEventListener('click', function() {
            console.log('Responsive item clicked');
            openResponsiveWindow();
        });
    } else {
        console.error('Responsive item not found');
    }
    
    // Debug Item (clickable)
    const debugItem = document.getElementById('debugItem');
    if (debugItem) {
        debugItem.addEventListener('click', function() {
            console.log('Debug item clicked');
            openDebugWindow();
        });
    } else {
        console.error('Debug item not found');
    }
    
    // SEO Item (clickable)
    const seoItem = document.getElementById('seoItem');
    if (seoItem) {
        seoItem.addEventListener('click', function() {
            console.log('SEO item clicked');
            openSEOWindow();
        });
    } else {
        console.error('SEO item not found');
    }
    
    // Capture Item (clickable)
    const captureItem = document.getElementById('captureItem');
    if (captureItem) {
        captureItem.addEventListener('click', function() {
            console.log('Capture item clicked');
            openCaptureWindow();
        });
    } else {
        console.error('Capture item not found');
    }
    
    // Site Stack Item (clickable)
    const siteStackItem = document.getElementById('siteStackItem');
    if (siteStackItem) {
        siteStackItem.addEventListener('click', function() {
            console.log('Site stack item clicked');
            openSiteStackWindow();
        });
    } else {
        console.error('Site stack item not found');
    }
    
    // Settings Icon
    const settingsIcon = document.querySelector('.settings-icon');
    if (settingsIcon) {
        settingsIcon.addEventListener('click', function() {
            console.log('Settings icon clicked');
            // Open settings panel or modal
            alert('Settings will be implemented in a future update.');
        });
    } else {
        console.error('Settings icon not found');
    }
}

// Dark Mode Functionality
function initDarkMode() {
    // Check saved preference
    chrome.storage.sync.get(['darkMode'], function(result) {
        if (result.darkMode) {
            document.body.classList.add('dark-mode');
        }
    });
}

// Inspector Functionality
function activateInspector() {
    // Send message to content script to activate inspector mode
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { 
            action: 'toggleFeature',
            feature: 'inspector',
            enabled: true
        });
    });
}

function deactivateInspector() {
    // Send message to content script to deactivate inspector mode
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { 
            action: 'toggleFeature',
            feature: 'inspector',
            enabled: false
        });
    });
}

// Color Picker Functionality
function activateColorPicker() {
    // Send message to content script to activate color picker mode
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { 
            action: 'toggleFeature',
            feature: 'eyedropper',
            enabled: true
        });
    });
}

function deactivateColorPicker() {
    // Send message to content script to deactivate color picker mode
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { 
            action: 'toggleFeature',
            feature: 'eyedropper',
            enabled: false
        });
    });
}

// Toggle scraping mode
function toggleScrapingMode(enabled) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, { 
                action: 'toggleScrapingMode', 
                enabled: enabled 
            });
        }
    });
}

// Window opening functions for non-toggle tools
function openAssetsWindow() {
    // Send message to content script to scan for assets and open assets window
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'openAssetsWindow' });
    });
}

function openResponsiveWindow() {
    // Send message to content script to open responsive window
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'openResponsiveWindow' });
    });
}

function openDebugWindow() {
    // Send message to content script to open debug window
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'openDebugWindow' });
    });
}

function openSEOWindow() {
    // Send message to content script to open SEO window
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'openSEOWindow' });
    });
}

function openCaptureWindow() {
    // Send message to content script to open capture window
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'openCaptureWindow' });
    });
}

function openSiteStackWindow() {
    // Send message to content script to open site stack window
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'openSiteStackWindow' });
    });
}

// Listen for messages from content script or background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    // Handle various messages from content script
    if (message.action === 'inspectorData') {
        // Handle inspector data
    } else if (message.action === 'colorPickerData') {
        // Handle color picker data
    } else if (message.action === 'assetsData') {
        // Handle assets data
    }
}); 