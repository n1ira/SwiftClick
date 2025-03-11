// SwiftClick Content Script
// This script is injected into the page to handle DOM interactions like element inspection

(function() {
    // State variables
    let inspectorActive = false;
    let colorPickerActive = false;
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
            if (message.action === 'activateInspector') {
                activateInspector();
                sendResponse({ success: true });
            } else if (message.action === 'activateColorPicker') {
                activateColorPicker();
                sendResponse({ success: true });
            } else if (message.action === 'scanAssets') {
                const assets = scanPageAssets();
                sendResponse({ assets: assets });
            }
            return true; // Keep the message channel open for async responses
        });
    }
    
    // Inspector Functionality
    function activateInspector() {
        if (inspectorActive) return;
        
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
            chrome.runtime.sendMessage({ 
                action: 'inspectorData', 
                data: elementData
            });
            
            // Deactivate inspector after selection
            deactivateInspector();
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
        const tagName = element.tagName.toLowerCase();
        const id = element.id ? `#${element.id}` : '';
        const classes = Array.from(element.classList).map(c => `.${c}`).join('');
        
        let tooltipContent = `<span class="swiftclick-tooltip-tag">${tagName}</span>`;
        if (id) tooltipContent += `<span class="swiftclick-tooltip-id">${id}</span>`;
        if (classes) tooltipContent += `<span class="swiftclick-tooltip-class">${classes}</span>`;
        
        tooltipElement.innerHTML = tooltipContent;
        showTooltip(event, null);
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
        for (let i = 0; i < computedStyle.length; i++) {
            const property = computedStyle[i];
            const value = computedStyle.getPropertyValue(property);
            cssText += `${property}: ${value};\n`;
        }
        
        // Get clean HTML
        let htmlContent = element.outerHTML;
        // Format HTML for display
        htmlContent = htmlContent
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\s+/g, ' ')
            .replace(/&lt;([\/\w]+)(&gt;|\s)/g, '&lt;<span style="color:#3498db;">$1</span>$2');
        
        return {
            tagName: element.tagName.toLowerCase(),
            id: element.id,
            className: element.className,
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            html: htmlContent,
            css: cssText
        };
    }
    
    // Color Picker Functionality
    function activateColorPicker() {
        if (colorPickerActive) return;
        
        colorPickerActive = true;
        document.body.classList.add('swiftclick-eyedropper-active');
        
        // Create color preview element
        if (!colorPreviewElement) {
            colorPreviewElement = document.createElement('div');
            colorPreviewElement.className = 'swiftclick-color-preview';
            document.body.appendChild(colorPreviewElement);
        }
        
        // Create color info element
        if (!colorInfoElement) {
            colorInfoElement = document.createElement('div');
            colorInfoElement.className = 'swiftclick-color-info';
            document.body.appendChild(colorInfoElement);
        }
        
        // Add event listeners
        document.addEventListener('mousemove', handleColorPickerMouseMove);
        document.addEventListener('click', handleColorPickerClick);
        document.addEventListener('keydown', handleColorPickerKeyDown);
    }
    
    function deactivateColorPicker() {
        if (!colorPickerActive) return;
        
        colorPickerActive = false;
        document.body.classList.remove('swiftclick-eyedropper-active');
        
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
    
})(); 