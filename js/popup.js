// SwiftClick Popup JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI
    initTabs();
    initDarkMode();
    initInspector();
    initColorPicker();
    initAssetScanner();
    
    // Handle extension version display
    document.querySelectorAll('.settings-section p').forEach(p => {
        if (p.textContent.includes('SwiftClick v')) {
            const manifest = chrome.runtime.getManifest();
            p.textContent = `SwiftClick v${manifest.version}`;
        }
    });

    // Get all toggle switches
    const toggles = document.querySelectorAll('.toggle-item .switch input[type="checkbox"]');
    
    // Get all menu items
    const menuItems = document.querySelectorAll('.menu-item');
    
    // Load saved toggle states from storage
    chrome.storage.sync.get(['swiftClickToggles'], function(result) {
        const savedToggles = result.swiftClickToggles || {};
        
        // Initialize toggles with saved states
        toggles.forEach(toggle => {
            const id = toggle.id;
            if (savedToggles.hasOwnProperty(id)) {
                toggle.checked = savedToggles[id];
                if (toggle.checked) {
                    toggle.closest('.feature-item').classList.add('active');
                }
            }
        });
    });
    
    // Save toggle state when changed
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const id = this.id;
            const isChecked = this.checked;
            
            // Update UI
            const featureItem = this.closest('.feature-item');
            if (isChecked) {
                featureItem.classList.add('active');
            } else {
                featureItem.classList.remove('active');
            }
            
            // Get current saved toggles
            chrome.storage.sync.get(['swiftClickToggles'], function(result) {
                const savedToggles = result.swiftClickToggles || {};
                savedToggles[id] = isChecked;
                
                // Save updated toggles
                chrome.storage.sync.set({swiftClickToggles: savedToggles});
            });
            
            // Send message to content script to enable/disable feature
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs.length > 0) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'toggleFeature',
                        feature: id.replace('Toggle', ''),
                        enabled: isChecked
                    });
                }
            });
        });
    });
    
    // Add click handlers for menu items
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const id = this.id;
            const feature = id.replace('MenuItem', '');
            
            // Send message to content script to activate feature
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs.length > 0) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'activateFeature',
                        feature: feature
                    });
                }
            });
            
            // Close popup after menu item click
            window.close();
        });
    });
    
    // Preferences button event listener
    document.getElementById('preferencesBtn').addEventListener('click', function() {
        // Open settings page or show settings modal
        chrome.runtime.openOptionsPage();
    });
});

// Tab Functionality
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Update tab buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTab) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Dark Mode Functionality
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkMode');
    
    // Check saved preference
    chrome.storage.sync.get(['darkMode'], function(result) {
        if (result.darkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
    });
    
    // Toggle dark mode
    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            chrome.storage.sync.set({ darkMode: true });
        } else {
            document.body.classList.remove('dark-mode');
            chrome.storage.sync.set({ darkMode: false });
        }
    });
}

// Inspector Functionality
function initInspector() {
    const activateInspectorBtn = document.getElementById('activateInspector');
    const highlightElementsToggle = document.getElementById('highlightElements');
    
    // Store the highlight preference
    highlightElementsToggle.addEventListener('change', function() {
        chrome.storage.sync.set({ highlightElements: this.checked });
    });
    
    // Load saved preference
    chrome.storage.sync.get(['highlightElements'], function(result) {
        if (result.highlightElements === undefined) {
            // Default to true if not set
            chrome.storage.sync.set({ highlightElements: true });
        } else {
            highlightElementsToggle.checked = result.highlightElements;
        }
    });
    
    // Activate the inspector on button click
    activateInspectorBtn.addEventListener('click', function() {
        // Send message to content script to activate inspector mode
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'activateInspector' });
            window.close(); // Close the popup to see the page
        });
    });
    
    // Listen for inspector data from background script
    chrome.runtime.onMessage.addListener(function(message) {
        if (message.action === 'inspectorData') {
            updateInspectorPanels(message.data);
        }
    });
}

// Update inspector panels with element data
function updateInspectorPanels(data) {
    const visualPanel = document.getElementById('visualPanel');
    const codePanel = document.getElementById('codePanel');
    const htmlPanel = document.getElementById('htmlPanel');
    
    // This would be populated with actual data from the inspected element
    if (data) {
        // Visual panel - properties grouped by category
        visualPanel.innerHTML = `
            <div class="property-group">
                <h4>Dimensions</h4>
                <div class="property-row">
                    <span class="property-name">Width:</span>
                    <span class="property-value">${data.width}px</span>
                </div>
                <div class="property-row">
                    <span class="property-name">Height:</span>
                    <span class="property-value">${data.height}px</span>
                </div>
            </div>
            <!-- More property groups would go here -->
        `;
        
        // Code panel - CSS
        codePanel.innerHTML = `
            <div class="code-block">
                <pre>${data.css}</pre>
            </div>
            <button class="action-btn copy-btn">Copy CSS</button>
        `;
        
        // HTML panel - element structure
        htmlPanel.innerHTML = `
            <div class="code-block">
                <pre>${data.html}</pre>
            </div>
            <button class="action-btn copy-btn">Copy HTML</button>
        `;
        
        // Add copy functionality to buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const pre = this.previousElementSibling.querySelector('pre');
                navigator.clipboard.writeText(pre.textContent);
                
                // Show copied feedback
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 1500);
            });
        });
    }
}

// Color Picker Functionality
function initColorPicker() {
    const activateColorPickerBtn = document.getElementById('activateColorPicker');
    const recentColorsContainer = document.getElementById('recentColors');
    
    // Load saved colors
    chrome.storage.sync.get(['recentColors'], function(result) {
        if (result.recentColors && result.recentColors.length > 0) {
            displayRecentColors(result.recentColors);
        }
    });
    
    // Activate the color picker on button click
    activateColorPickerBtn.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'activateColorPicker' });
            window.close(); // Close the popup
        });
    });
    
    // Listen for color picker data
    chrome.runtime.onMessage.addListener(function(message) {
        if (message.action === 'colorPicked') {
            savePickedColor(message.color);
        }
    });
}

// Display recent colors in the popup
function displayRecentColors(colors) {
    const recentColorsContainer = document.getElementById('recentColors');
    recentColorsContainer.innerHTML = ''; // Clear existing content
    
    colors.forEach(color => {
        const colorSwatch = document.createElement('div');
        colorSwatch.className = 'color-swatch';
        colorSwatch.style.backgroundColor = color;
        colorSwatch.title = color;
        colorSwatch.addEventListener('click', () => {
            navigator.clipboard.writeText(color);
            // Show feedback
            const feedback = document.createElement('span');
            feedback.className = 'copied-feedback';
            feedback.textContent = 'Copied!';
            colorSwatch.appendChild(feedback);
            setTimeout(() => {
                feedback.remove();
            }, 1500);
        });
        
        recentColorsContainer.appendChild(colorSwatch);
    });
}

// Save a picked color to history
function savePickedColor(color) {
    chrome.storage.sync.get(['recentColors'], function(result) {
        let colors = result.recentColors || [];
        
        // Add color to start, remove duplicates
        colors = [color, ...colors.filter(c => c !== color)];
        
        // Limit to 20 colors
        if (colors.length > 20) {
            colors = colors.slice(0, 20);
        }
        
        chrome.storage.sync.set({ recentColors: colors });
    });
}

// Asset Scanner Functionality
function initAssetScanner() {
    const scanAssetsBtn = document.getElementById('scanAssets');
    const assetGallery = document.getElementById('assetGallery');
    const downloadAllBtn = document.getElementById('downloadAll');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    let scannedAssets = null;
    
    // Category button functionality
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter assets if available
            if (scannedAssets) {
                const category = button.getAttribute('data-category');
                displayFilteredAssets(scannedAssets, category);
            }
        });
    });
    
    // Scan for assets on button click
    scanAssetsBtn.addEventListener('click', function() {
        scanAssetsBtn.disabled = true;
        scanAssetsBtn.textContent = 'Scanning...';
        
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'scanAssets' }, function(response) {
                scanAssetsBtn.disabled = false;
                scanAssetsBtn.textContent = 'Scan Page';
                
                if (response && response.assets) {
                    scannedAssets = response.assets;
                    const activeCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
                    displayFilteredAssets(scannedAssets, activeCategory);
                    
                    // Enable download button if assets found
                    if (scannedAssets.length > 0) {
                        downloadAllBtn.disabled = false;
                    }
                }
            });
        });
    });
    
    // Download all assets
    downloadAllBtn.addEventListener('click', function() {
        if (scannedAssets && scannedAssets.length > 0) {
            const activeCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
            const assetsToDownload = activeCategory === 'all' 
                ? scannedAssets 
                : scannedAssets.filter(asset => asset.type === activeCategory);
            
            chrome.runtime.sendMessage({ 
                action: 'downloadAssets', 
                assets: assetsToDownload 
            });
        }
    });
}

// Display filtered assets in the gallery
function displayFilteredAssets(assets, category) {
    const assetGallery = document.getElementById('assetGallery');
    assetGallery.innerHTML = ''; // Clear existing content
    
    const filteredAssets = category === 'all' 
        ? assets 
        : assets.filter(asset => asset.type === category);
    
    if (filteredAssets.length === 0) {
        assetGallery.innerHTML = '<p>No assets found in this category.</p>';
        return;
    }
    
    // Create asset grid
    const assetGrid = document.createElement('div');
    assetGrid.className = 'asset-grid';
    
    filteredAssets.forEach(asset => {
        const assetItem = document.createElement('div');
        assetItem.className = 'asset-item';
        
        // TODO: Create appropriate preview based on asset type
        // For now, just create a text representation
        assetItem.innerHTML = `
            <div class="asset-preview">${asset.type}</div>
            <div class="asset-info">${asset.url.substring(0, 30)}...</div>
            <button class="asset-download-btn">⬇️</button>
        `;
        
        assetGrid.appendChild(assetItem);
    });
    
    assetGallery.appendChild(assetGrid);
} 