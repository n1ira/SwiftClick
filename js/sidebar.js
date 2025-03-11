document.addEventListener('DOMContentLoaded', function() {
    // Get all toggle switches
    const toggles = document.querySelectorAll('.switch input[type="checkbox"]');
    
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
    
    // Preferences button event listener
    document.getElementById('preferencesBtn').addEventListener('click', function() {
        // Open settings page or show settings modal
        chrome.runtime.openOptionsPage();
    });
}); 