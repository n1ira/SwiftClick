// SwiftClick Content Script
// This script is injected into the page to handle DOM interactions like element inspection

(function() {
    // State variables
    let inspectorActive = false;
    let colorPickerActive = false;
    let assetsActive = false;
    let responsiveActive = false;
    let debugActive = false;
    let seoActive = false;
    let captureActive = false;
    let siteStackActive = false;
    let scrapingModeActive = false;
    let highlightElement = null;
    let tooltipElement = null;
    let selectedElement = null;
    let colorPreviewElement = null;
    let colorInfoElement = null;
    let overlayElement = null;
    
    // Initialize when the content script loads
    init();
    
    function init() {
        // Listen for messages from the popup or background script
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            console.log('Content script received message:', message);
            
            switch(message.action) {
                case 'toggleFeature':
                    handleToggleFeature(message);
                    sendResponse({ success: true });
                    break;
                case 'activateInspector':
                    activateInspector();
                    sendResponse({ success: true });
                    break;
                case 'deactivateInspector':
                    deactivateInspector();
                    sendResponse({ success: true });
                    break;
                case 'activateColorPicker':
                    activateColorPicker();
                    sendResponse({ success: true });
                    break;
                case 'deactivateColorPicker':
                    deactivateColorPicker();
                    sendResponse({ success: true });
                    break;
                case 'scanAssets':
                    activateAssets();
                    sendResponse({ success: true });
                    break;
                case 'deactivateAssets':
                    deactivateAssets();
                    sendResponse({ success: true });
                    break;
                case 'activateResponsiveMode':
                    activateResponsiveMode();
                    sendResponse({ success: true });
                    break;
                case 'deactivateResponsiveMode':
                    deactivateResponsiveMode();
                    sendResponse({ success: true });
                    break;
                case 'activateDebugMode':
                    activateDebugMode();
                    sendResponse({ success: true });
                    break;
                case 'deactivateDebugMode':
                    deactivateDebugMode();
                    sendResponse({ success: true });
                    break;
                case 'activateSEOMode':
                    activateSEOMode();
                    sendResponse({ success: true });
                    break;
                case 'deactivateSEOMode':
                    deactivateSEOMode();
                    sendResponse({ success: true });
                    break;
                case 'activateCaptureMode':
                    activateCaptureMode();
                    sendResponse({ success: true });
                    break;
                case 'deactivateCaptureMode':
                    deactivateCaptureMode();
                    sendResponse({ success: true });
                    break;
                case 'activateSiteStackMode':
                    activateSiteStackMode();
                    sendResponse({ success: true });
                    break;
                case 'deactivateSiteStackMode':
                    deactivateSiteStackMode();
                    sendResponse({ success: true });
                    break;
                case 'toggleScrapingMode':
                    scrapingModeActive = message.enabled;
                    sendResponse({ success: true });
                    break;
                // New window actions
                case 'openAssetsWindow':
                    openAssetsWindow();
                    sendResponse({ success: true });
                    break;
                case 'openResponsiveWindow':
                    openResponsiveWindow();
                    sendResponse({ success: true });
                    break;
                case 'openDebugWindow':
                    openDebugWindow();
                    sendResponse({ success: true });
                    break;
                case 'openSEOWindow':
                    openSEOWindow();
                    sendResponse({ success: true });
                    break;
                case 'openCaptureWindow':
                    openCaptureWindow();
                    sendResponse({ success: true });
                    break;
                case 'openSiteStackWindow':
                    openSiteStackWindow();
                    sendResponse({ success: true });
                    break;
            }
            
            return true; // Keep the message channel open for async responses
        });
    }
    
    // Handle toggle feature message
    function handleToggleFeature(message) {
        console.log('Toggling feature:', message.feature, message.enabled);
        
        switch(message.feature) {
            case 'inspector':
                if (message.enabled) {
                    activateInspector();
                } else {
                    deactivateInspector();
                }
                break;
            case 'eyedropper':
                if (message.enabled) {
                    activateColorPicker();
                } else {
                    deactivateColorPicker();
                }
                break;
            case 'scrapingMode':
                scrapingModeActive = message.enabled;
                break;
        }
    }
    
    // Window opening functions for non-toggle tools
    function openAssetsWindow() {
        console.log('Opening assets window');
        scanPageAssets();
        // Create a floating window for assets
        createFloatingWindow('Assets', 'assets-window');
    }
    
    function openResponsiveWindow() {
        console.log('Opening responsive window');
        // Create a floating window for responsive mode
        createFloatingWindow('Responsive Mode', 'responsive-window');
    }
    
    function openDebugWindow() {
        console.log('Opening debug window');
        // Create a floating window for debug mode
        createFloatingWindow('Debug Tools', 'debug-window');
    }
    
    function openSEOWindow() {
        console.log('Opening SEO window');
        // Create a floating window for SEO mode
        createFloatingWindow('SEO Analysis', 'seo-window');
    }
    
    function openCaptureWindow() {
        console.log('Opening capture window');
        // Create a floating window for capture mode
        createFloatingWindow('Capture Tools', 'capture-window');
    }
    
    function openSiteStackWindow() {
        console.log('Opening site stack window');
        // Create a floating window for site stack mode
        createFloatingWindow('Site Stack Analysis', 'site-stack-window');
    }
    
    // Helper function to create a floating window
    function createFloatingWindow(title, id) {
        // Remove any existing window with the same ID
        const existingWindow = document.getElementById(id);
        if (existingWindow) {
            existingWindow.remove();
        }
        
        // Create window container
        const windowElement = document.createElement('div');
        windowElement.id = id;
        windowElement.className = 'swiftclick-floating-window';
        
        // Create window header
        const headerElement = document.createElement('div');
        headerElement.className = 'swiftclick-window-header';
        
        // Create title
        const titleElement = document.createElement('div');
        titleElement.className = 'swiftclick-window-title';
        titleElement.textContent = title;
        
        // Create close button
        const closeButton = document.createElement('div');
        closeButton.className = 'swiftclick-window-close';
        closeButton.textContent = '×';
        closeButton.addEventListener('click', () => {
            windowElement.remove();
        });
        
        // Create window content
        const contentElement = document.createElement('div');
        contentElement.className = 'swiftclick-window-content';
        contentElement.innerHTML = `<p>This is the ${title} window. Content will be implemented in a future update.</p>`;
        
        // Assemble window
        headerElement.appendChild(titleElement);
        headerElement.appendChild(closeButton);
        windowElement.appendChild(headerElement);
        windowElement.appendChild(contentElement);
        
        // Make window draggable
        let isDragging = false;
        let offsetX, offsetY;
        
        headerElement.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - windowElement.getBoundingClientRect().left;
            offsetY = e.clientY - windowElement.getBoundingClientRect().top;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                windowElement.style.left = (e.clientX - offsetX) + 'px';
                windowElement.style.top = (e.clientY - offsetY) + 'px';
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        // Add to page
        document.body.appendChild(windowElement);
        
        return windowElement;
    }
    
    // Inspector Functionality
    function activateInspector() {
        if (inspectorActive) return;
        
        // Deactivate other tools
        deactivateAllExcept('inspector');
        
        inspectorActive = true;
        document.body.classList.add('swiftclick-selecting');
        
        // Create overlay if it doesn't exist
        if (!overlayElement) {
            overlayElement = document.createElement('div');
            overlayElement.className = 'swiftclick-inspector-overlay';
            document.body.appendChild(overlayElement);
        }
        
        // Create highlight element if it doesn't exist
        if (!highlightElement) {
            highlightElement = document.createElement('div');
            highlightElement.className = 'swiftclick-highlight';
            document.body.appendChild(highlightElement);
        }
        
        // Create tooltip element if it doesn't exist
        if (!tooltipElement) {
            tooltipElement = document.createElement('div');
            tooltipElement.className = 'swiftclick-tooltip';
            document.body.appendChild(tooltipElement);
        }
        
        // Add event listeners
        document.addEventListener('mousemove', handleInspectorMouseMove);
        document.addEventListener('click', handleInspectorClick);
        document.addEventListener('keydown', handleInspectorKeyDown);
        
        // Show initial instructions
        showTooltip({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 }, 
            'Hover over elements and click to inspect. Press ESC to exit.');
    }
    
    // Helper function to deactivate all tools except the one being activated
    function deactivateAllExcept(tool) {
        if (tool !== 'inspector' && inspectorActive) deactivateInspector();
        if (tool !== 'colorPicker' && colorPickerActive) deactivateColorPicker();
        if (tool !== 'assets' && assetsActive) deactivateAssets();
        if (tool !== 'responsive' && responsiveActive) deactivateResponsiveMode();
        if (tool !== 'debug' && debugActive) deactivateDebugMode();
        if (tool !== 'seo' && seoActive) deactivateSEOMode();
        if (tool !== 'capture' && captureActive) deactivateCaptureMode();
        if (tool !== 'siteStack' && siteStackActive) deactivateSiteStackMode();
    }
    
    function deactivateInspector() {
        if (!inspectorActive) return;
        
        inspectorActive = false;
        document.body.classList.remove('swiftclick-selecting');
        
        // Hide elements
        highlightElement.style.display = 'none';
        tooltipElement.style.display = 'none';
        
        // Remove event listeners
        document.removeEventListener('mousemove', handleInspectorMouseMove);
        document.removeEventListener('click', handleInspectorClick);
        document.removeEventListener('keydown', handleInspectorKeyDown);
    }
    
    function handleInspectorMouseMove(event) {
        // Prevent normal mouse behavior
        event.preventDefault();
        
        // Get the element under the cursor but ignore our overlay elements
        const elements = document.elementsFromPoint(event.clientX, event.clientY);
        const targetElement = elements.find(el => {
            return !el.classList.contains('swiftclick-highlight') && 
                   !el.classList.contains('swiftclick-tooltip') &&
                   !el.classList.contains('swiftclick-inspector-overlay');
        });
        
        if (targetElement) {
            // Highlight the element
            highlightElement.style.display = 'block';
            positionHighlight(targetElement);
            
            // Show tooltip with element info
            showElementTooltip(event, targetElement);
            
            // Store the current hovered element for potential selection
            highlightElement.dataset.targetElement = getXPath(targetElement);
        }
    }
    
    function handleInspectorClick(event) {
        // Prevent the click from affecting the page
        event.preventDefault();
        event.stopPropagation();
        
        if (!inspectorActive) return;
        
        // Get the element under the cursor (same as in mousemove)
        const elements = document.elementsFromPoint(event.clientX, event.clientY);
        selectedElement = elements.find(el => {
            return !el.classList.contains('swiftclick-highlight') && 
                   !el.classList.contains('swiftclick-tooltip') &&
                   !el.classList.contains('swiftclick-inspector-overlay');
        });
        
        if (selectedElement) {
            // Update highlight to indicate selection
            highlightElement.classList.add('selected');
            
            // Get the data and send to background/popup
            const elementData = getElementData(selectedElement);
            
            // Add scraping mode data if active
            if (scrapingModeActive) {
                elementData.scrapingData = {
                    xpath: getXPath(selectedElement),
                    cssSelector: getCssSelector(selectedElement),
                    innerText: selectedElement.innerText,
                    innerHTML: selectedElement.innerHTML,
                    attributes: getElementAttributes(selectedElement)
                };
            }
            
            chrome.runtime.sendMessage({ 
                action: 'inspectorData', 
                data: elementData
            });
            
            // Open inspector panel if not already open
            chrome.runtime.sendMessage({ action: 'openInspectorPanel' });
            
            // Don't deactivate inspector after selection to allow for multiple inspections
            // Only update the UI to show selection
            highlightElement.classList.add('selected');
            setTimeout(() => {
                highlightElement.classList.remove('selected');
            }, 1000);
        }
    }
    
    function handleInspectorKeyDown(event) {
        // Exit inspector mode if ESC is pressed
        if (event.key === 'Escape') {
            deactivateInspector();
        }
    }
    
    function positionHighlight(element) {
        const rect = element.getBoundingClientRect();
        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        
        highlightElement.style.width = rect.width + 'px';
        highlightElement.style.height = rect.height + 'px';
        highlightElement.style.top = (rect.top + scrollY) + 'px';
        highlightElement.style.left = (rect.left + scrollX) + 'px';
    }
    
    function showElementTooltip(event, element) {
        // Get element details
        const tagName = element.tagName.toLowerCase();
        const id = element.id ? `#${element.id}` : '';
        const classes = element.className ? `.${element.className.replace(/\s+/g, ' .').trim()}` : '';
        
        // Get element dimensions
        const rect = element.getBoundingClientRect();
        const width = Math.round(rect.width);
        const height = Math.round(rect.height);
        
        // Create tooltip content
        let tooltipContent = `
            <span class="swiftclick-tooltip-tag">${tagName}</span>
            <span class="swiftclick-tooltip-id">${id}</span>
            <span class="swiftclick-tooltip-class">${classes}</span>
            <span class="swiftclick-tooltip-dimensions">${width}×${height}</span>
        `;
        
        // Add scraping mode info if active
        if (scrapingModeActive) {
            // Add XPath
            const xpath = getXPath(element);
            tooltipContent += `<br><span style="color: #ff9800;">XPath:</span> ${xpath.length > 50 ? xpath.substring(0, 50) + '...' : xpath}`;
            
            // Add CSS Selector
            const cssSelector = getCssSelector(element);
            tooltipContent += `<br><span style="color: #ff9800;">CSS:</span> ${cssSelector.length > 50 ? cssSelector.substring(0, 50) + '...' : cssSelector}`;
            
            // Add text content if available
            if (element.innerText && element.innerText.trim()) {
                const text = element.innerText.trim();
                tooltipContent += `<br><span style="color: #ff9800;">Text:</span> ${text.length > 50 ? text.substring(0, 50) + '...' : text}`;
            }
            
            // Apply scraping mode styles
            highlightElement.classList.add('swiftclick-scraping-highlight');
            tooltipElement.classList.add('swiftclick-scraping-tooltip');
        } else {
            // Remove scraping mode styles
            highlightElement.classList.remove('swiftclick-scraping-highlight');
            tooltipElement.classList.remove('swiftclick-scraping-tooltip');
        }
        
        // Show tooltip
        tooltipElement.innerHTML = tooltipContent;
        showTooltip(event);
    }
    
    function showTooltip(event, customText) {
        if (customText) {
            tooltipElement.innerHTML = customText;
        }
        
        // Position the tooltip near the cursor or in the middle of the screen
        tooltipElement.style.display = 'block';
        
        const x = event.clientX;
        const y = event.clientY;
        
        // Adjust position to prevent tooltip from going off-screen
        const tooltipRect = tooltipElement.getBoundingClientRect();
        const maxX = window.innerWidth - tooltipRect.width - 10;
        const maxY = window.innerHeight - tooltipRect.height - 10;
        
        tooltipElement.style.left = Math.min(x + 15, maxX) + 'px';
        tooltipElement.style.top = Math.min(y + 15, maxY) + 'px';
    }
    
    function getElementData(element) {
        // Get computed styles
        const computedStyle = window.getComputedStyle(element);
        
        // Get element dimensions
        const rect = element.getBoundingClientRect();
        
        // Format CSS properties
        let cssText = '';
        let cssProperties = {};
        
        // Organize CSS properties by categories
        const cssCategories = {
            layout: ['display', 'position', 'top', 'right', 'bottom', 'left', 'float', 'clear', 'z-index', 'overflow', 'overflow-x', 'overflow-y'],
            flexbox: ['flex', 'flex-direction', 'flex-wrap', 'flex-flow', 'justify-content', 'align-items', 'align-content', 'order', 'flex-grow', 'flex-shrink', 'flex-basis', 'align-self'],
            grid: ['grid', 'grid-template-columns', 'grid-template-rows', 'grid-template-areas', 'grid-column-gap', 'grid-row-gap', 'grid-gap', 'grid-auto-columns', 'grid-auto-rows', 'grid-auto-flow', 'grid-column-start', 'grid-column-end', 'grid-row-start', 'grid-row-end', 'grid-column', 'grid-row'],
            box: ['width', 'height', 'min-width', 'min-height', 'max-width', 'max-height', 'box-sizing', 'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
            border: ['border', 'border-width', 'border-style', 'border-color', 'border-top', 'border-right', 'border-bottom', 'border-left', 'border-radius', 'box-shadow'],
            background: ['background', 'background-color', 'background-image', 'background-repeat', 'background-position', 'background-size', 'background-attachment', 'background-clip', 'background-origin'],
            typography: ['color', 'font', 'font-family', 'font-size', 'font-weight', 'font-style', 'font-variant', 'line-height', 'text-align', 'text-decoration', 'text-transform', 'letter-spacing', 'word-spacing', 'white-space', 'vertical-align'],
            animation: ['transition', 'transition-property', 'transition-duration', 'transition-timing-function', 'transition-delay', 'animation', 'animation-name', 'animation-duration', 'animation-timing-function', 'animation-delay', 'animation-iteration-count', 'animation-direction', 'animation-fill-mode', 'animation-play-state'],
            other: []
        };
        
        // Categorized CSS properties
        const categorizedCss = {
            layout: {},
            flexbox: {},
            grid: {},
            box: {},
            border: {},
            background: {},
            typography: {},
            animation: {},
            other: {}
        };
        
        for (let i = 0; i < computedStyle.length; i++) {
            const property = computedStyle[i];
            const value = computedStyle.getPropertyValue(property);
            cssText += `${property}: ${value};\n`;
            cssProperties[property] = value;
            
            // Categorize the property
            let categorized = false;
            for (const category in cssCategories) {
                if (cssCategories[category].includes(property)) {
                    categorizedCss[category][property] = value;
                    categorized = true;
                    break;
                }
            }
            
            // If not categorized, add to 'other'
            if (!categorized) {
                categorizedCss.other[property] = value;
            }
        }
        
        // Get clean HTML
        let htmlContent = element.outerHTML;
        // Format HTML for display
        htmlContent = htmlContent
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\s+/g, ' ')
            .replace(/&lt;([\/\w]+)(&gt;|\s)/g, '&lt;<span style="color:#3498db;">$1</span>$2');
        
        // Get element hierarchy
        let hierarchy = [];
        let currentElement = element;
        while (currentElement && currentElement !== document.body) {
            let elementInfo = {
                tagName: currentElement.tagName.toLowerCase(),
                id: currentElement.id || '',
                classes: Array.from(currentElement.classList).join(' ') || '',
                innerHTML: currentElement.innerHTML.length > 100 ? 
                    currentElement.innerHTML.substring(0, 100) + '...' : 
                    currentElement.innerHTML
            };
            hierarchy.unshift(elementInfo);
            currentElement = currentElement.parentElement;
        }
        
        // Add body as the root element
        hierarchy.unshift({
            tagName: 'body',
            id: document.body.id || '',
            classes: Array.from(document.body.classList).join(' ') || ''
        });
        
        // Get box model data
        const boxModel = {
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            margin: {
                top: parseInt(computedStyle.marginTop),
                right: parseInt(computedStyle.marginRight),
                bottom: parseInt(computedStyle.marginBottom),
                left: parseInt(computedStyle.marginLeft)
            },
            border: {
                top: parseInt(computedStyle.borderTopWidth),
                right: parseInt(computedStyle.borderRightWidth),
                bottom: parseInt(computedStyle.borderBottomWidth),
                left: parseInt(computedStyle.borderLeftWidth)
            },
            padding: {
                top: parseInt(computedStyle.paddingTop),
                right: parseInt(computedStyle.paddingRight),
                bottom: parseInt(computedStyle.paddingBottom),
                left: parseInt(computedStyle.paddingLeft)
            }
        };
        
        // Return the element data
        return {
            tagName: element.tagName.toLowerCase(),
            id: element.id || '',
            className: Array.from(element.classList).join(' ') || '',
            attributes: getElementAttributes(element),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            x: Math.round(rect.left + window.scrollX),
            y: Math.round(rect.top + window.scrollY),
            cssText: cssText,
            cssProperties: cssProperties,
            categorizedCss: categorizedCss,
            htmlContent: htmlContent,
            hierarchy: hierarchy,
            boxModel: boxModel,
            xpath: getXPath(element),
            cssSelector: getCssSelector(element),
            innerText: element.innerText,
            innerHTML: element.innerHTML
        };
    }
    
    // Helper function to get XPath for an element
    function getXPath(element) {
        if (element.id !== '') {
            return `//*[@id="${element.id}"]`;
        }
        
        if (element === document.body) {
            return '/html/body';
        }
        
        let ix = 0;
        const siblings = element.parentNode.childNodes;
        
        for (let i = 0; i < siblings.length; i++) {
            const sibling = siblings[i];
            
            if (sibling === element) {
                return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
            }
            
            if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
                ix++;
            }
        }
    }
    
    // Helper function to get a unique CSS selector for an element
    function getCssSelector(element) {
        if (element.id) {
            return '#' + element.id;
        }
        
        // Try to build a selector with classes
        if (element.className) {
            const classes = element.className.split(/\s+/).filter(c => c);
            if (classes.length > 0) {
                const selector = '.' + classes.join('.');
                // Check if this selector is unique
                if (document.querySelectorAll(selector).length === 1) {
                    return selector;
                }
            }
        }
        
        // Build a selector with the element's position in the DOM
        let path = [];
        while (element && element.nodeType === Node.ELEMENT_NODE) {
            let selector = element.nodeName.toLowerCase();
            if (element.id) {
                selector += '#' + element.id;
                path.unshift(selector);
                break;
            } else {
                let sibling = element;
                let nth = 1;
                while (sibling = sibling.previousElementSibling) {
                    if (sibling.nodeName.toLowerCase() === selector) nth++;
                }
                if (nth > 1) selector += `:nth-of-type(${nth})`;
            }
            path.unshift(selector);
            element = element.parentNode;
        }
        return path.join(' > ');
    }
    
    // Helper function to get all attributes of an element
    function getElementAttributes(element) {
        const attributes = {};
        for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            attributes[attr.name] = attr.value;
        }
        return attributes;
    }
    
    // Color Picker Functionality
    function activateColorPicker() {
        if (colorPickerActive) return;
        
        // Deactivate other tools
        deactivateAllExcept('colorPicker');
        
        colorPickerActive = true;
        document.body.classList.add('swiftclick-color-picking');
        
        // Create color preview element if it doesn't exist
        if (!colorPreviewElement) {
            colorPreviewElement = document.createElement('div');
            colorPreviewElement.className = 'swiftclick-color-preview';
            document.body.appendChild(colorPreviewElement);
        }
        
        // Create color info element if it doesn't exist
        if (!colorInfoElement) {
            colorInfoElement = document.createElement('div');
            colorInfoElement.className = 'swiftclick-color-info';
            document.body.appendChild(colorInfoElement);
        }
        
        // Add event listeners
        document.addEventListener('mousemove', handleColorPickerMouseMove);
        document.addEventListener('click', handleColorPickerClick);
        document.addEventListener('keydown', handleColorPickerKeyDown);
        
        // Show initial instructions
        showTooltip({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 }, 
            'Move cursor over colors and click to pick. Press ESC to exit.');
    }
    
    function deactivateColorPicker() {
        if (!colorPickerActive) return;
        
        colorPickerActive = false;
        document.body.classList.remove('swiftclick-color-picking');
        
        // Hide elements
        colorPreviewElement.style.display = 'none';
        colorInfoElement.style.display = 'none';
        
        // Remove event listeners
        document.removeEventListener('mousemove', handleColorPickerMouseMove);
        document.removeEventListener('click', handleColorPickerClick);
        document.removeEventListener('keydown', handleColorPickerKeyDown);
    }
    
    function handleColorPickerMouseMove(event) {
        if (!colorPickerActive) return;
        
        // Get the pixel color at the current position
        const color = getColorAtPoint(event.clientX, event.clientY);
        
        // Update the color preview
        colorPreviewElement.style.display = 'block';
        colorPreviewElement.style.backgroundColor = color.hex;
        colorPreviewElement.style.top = (event.clientY - 50) + 'px';
        colorPreviewElement.style.left = (event.clientX - 50) + 'px';
        
        // Show color information
        colorInfoElement.style.display = 'block';
        colorInfoElement.innerHTML = `
            HEX: ${color.hex}<br>
            RGB: ${color.rgb}<br>
            HSL: ${color.hsl}
        `;
        colorInfoElement.style.top = (event.clientY + 20) + 'px';
        colorInfoElement.style.left = (event.clientX + 20) + 'px';
    }
    
    function handleColorPickerClick(event) {
        if (!colorPickerActive) return;
        
        // Prevent click from affecting the page
        event.preventDefault();
        event.stopPropagation();
        
        // Get color at click point
        const color = getColorAtPoint(event.clientX, event.clientY);
        
        // Send color to background/popup
        chrome.runtime.sendMessage({ 
            action: 'colorPicked', 
            color: color.hex
        });
        
        // Deactivate picker
        deactivateColorPicker();
    }
    
    function handleColorPickerKeyDown(event) {
        // Exit color picker mode if ESC is pressed
        if (event.key === 'Escape') {
            deactivateColorPicker();
        }
    }
    
    function getColorAtPoint(x, y) {
        // Create a canvas to grab the pixel color
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Set canvas size to 1x1 pixel
        canvas.width = 1;
        canvas.height = 1;
        
        // Draw the page content at the specified point
        context.drawWindow(window, x, y, 1, 1, 'rgb(255,255,255)');
        
        // Get pixel data
        const pixelData = context.getImageData(0, 0, 1, 1).data;
        
        // Format the color values
        const r = pixelData[0];
        const g = pixelData[1];
        const b = pixelData[2];
        
        // Convert to HEX
        const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        
        // Convert to HSL
        const hsl = rgbToHsl(r, g, b);
        
        return {
            hex: hex,
            rgb: `rgb(${r}, ${g}, ${b})`,
            hsl: `hsl(${Math.round(hsl[0])}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%)`
        };
    }
    
    // RGB to HSL conversion
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }
        
        return [h * 360, s, l];
    }
    
    // Assets Functionality
    function activateAssets() {
        if (assetsActive) return;
        
        // Deactivate other tools
        deactivateAllExcept('assets');
        
        assetsActive = true;
        
        // Scan for assets and send to popup
        const assets = scanPageAssets();
        chrome.runtime.sendMessage({ 
            action: 'assetsData', 
            data: assets 
        });
        
        // Show notification
        showTooltip({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 }, 
            'Scanning page for assets...');
    }
    
    function deactivateAssets() {
        if (!assetsActive) return;
        
        assetsActive = false;
        
        // Hide any asset-related UI elements
        // ...
    }
    
    // Asset Scanner Functionality
    function scanPageAssets() {
        const assets = [];
        
        // Scan for images
        document.querySelectorAll('img').forEach(img => {
            if (img.src) {
                assets.push({
                    type: 'images',
                    url: img.src,
                    dimensions: `${img.naturalWidth}x${img.naturalHeight}`
                });
            }
        });
        
        // Scan for SVGs
        document.querySelectorAll('svg').forEach(svg => {
            const svgContent = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
            const svgUrl = URL.createObjectURL(svgBlob);
            
            assets.push({
                type: 'svg',
                url: svgUrl,
                content: svgContent
            });
        });
        
        // Scan for videos
        document.querySelectorAll('video').forEach(video => {
            if (video.src) {
                assets.push({
                    type: 'video',
                    url: video.src
                });
            }
        });
        
        // Scan for audio
        document.querySelectorAll('audio').forEach(audio => {
            if (audio.src) {
                assets.push({
                    type: 'other',
                    url: audio.src,
                    subtype: 'audio'
                });
            }
        });
        
        // Scan for favicons
        document.querySelectorAll('link[rel*="icon"]').forEach(link => {
            if (link.href) {
                assets.push({
                    type: 'other',
                    url: link.href,
                    subtype: 'favicon'
                });
            }
        });
        
        return assets;
    }
    
    // Responsive Mode Functionality
    function activateResponsiveMode() {
        if (responsiveActive) return;
        
        // Deactivate other tools
        deactivateAllExcept('responsive');
        
        responsiveActive = true;
        
        // Implement responsive mode functionality
        // This would typically create a resizable viewport or overlay
        showTooltip({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 }, 
            'Responsive mode activated. Feature coming soon.');
    }
    
    function deactivateResponsiveMode() {
        if (!responsiveActive) return;
        
        responsiveActive = false;
        
        // Clean up responsive mode UI elements
        // ...
    }
    
    // Debug Mode Functionality
    function activateDebugMode() {
        if (debugActive) return;
        
        // Deactivate other tools
        deactivateAllExcept('debug');
        
        debugActive = true;
        
        // Implement debug mode functionality
        // This would typically show event listeners, network requests, etc.
        showTooltip({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 }, 
            'Debug mode activated. Feature coming soon.');
    }
    
    function deactivateDebugMode() {
        if (!debugActive) return;
        
        debugActive = false;
        
        // Clean up debug mode UI elements
        // ...
    }
    
    // SEO Mode Functionality
    function activateSEOMode() {
        if (seoActive) return;
        
        // Deactivate other tools
        deactivateAllExcept('seo');
        
        seoActive = true;
        
        // Implement SEO mode functionality
        // This would typically analyze meta tags, headings, etc.
        showTooltip({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 }, 
            'SEO analysis mode activated. Feature coming soon.');
    }
    
    function deactivateSEOMode() {
        if (!seoActive) return;
        
        seoActive = false;
        
        // Clean up SEO mode UI elements
        // ...
    }
    
    // Capture Mode Functionality
    function activateCaptureMode() {
        if (captureActive) return;
        
        // Deactivate other tools
        deactivateAllExcept('capture');
        
        captureActive = true;
        
        // Implement capture mode functionality
        // This would typically allow screenshots of elements or the page
        showTooltip({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 }, 
            'Capture mode activated. Feature coming soon.');
    }
    
    function deactivateCaptureMode() {
        if (!captureActive) return;
        
        captureActive = false;
        
        // Clean up capture mode UI elements
        // ...
    }
    
    // Site Stack Mode Functionality
    function activateSiteStackMode() {
        if (siteStackActive) return;
        
        // Deactivate other tools
        deactivateAllExcept('siteStack');
        
        siteStackActive = true;
        
        // Implement site stack mode functionality
        // This would typically analyze technologies used on the page
        showTooltip({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 }, 
            'Site stack analysis mode activated. Feature coming soon.');
    }
    
    function deactivateSiteStackMode() {
        if (!siteStackActive) return;
        
        siteStackActive = false;
        
        // Clean up site stack mode UI elements
        // ...
    }
})(); 