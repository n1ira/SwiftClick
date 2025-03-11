// Create a panel in Chrome DevTools
chrome.devtools.panels.create(
    "SwiftClick", // Panel title
    "../images/icon16.png", // Panel icon
    "../html/sidebar.html", // Panel HTML page
    function(panel) {
        // Panel created
        console.log("SwiftClick DevTools panel created");
        
        // You can add event listeners here if needed
        panel.onShown.addListener(function(window) {
            console.log("SwiftClick panel shown");
        });
        
        panel.onHidden.addListener(function() {
            console.log("SwiftClick panel hidden");
        });
    }
); 