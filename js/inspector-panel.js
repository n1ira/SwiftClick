// SwiftClick Inspector Panel JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tabs
    initTabs();
    
    // Listen for element data from background script
    chrome.runtime.onMessage.addListener(function(message) {
        if (message.action === 'inspectorData') {
            updateInspectorPanels(message.data);
        }
    });
    
    // Add copy button functionality
    document.getElementById('copyHtmlBtn').addEventListener('click', function() {
        copyToClipboard(document.getElementById('htmlContent').textContent);
        showCopiedFeedback(this);
    });
    
    document.getElementById('copyCssBtn').addEventListener('click', function() {
        const cssProperties = document.querySelectorAll('#cssPropertiesContainer .property-item');
        let cssText = '';
        cssProperties.forEach(prop => {
            const name = prop.querySelector('.property-name').textContent;
            const value = prop.querySelector('.property-value').textContent;
            cssText += `${name}: ${value};\n`;
        });
        copyToClipboard(cssText);
        showCopiedFeedback(this);
    });
    
    // Add category filter functionality for CSS properties
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter properties
            const category = this.getAttribute('data-category');
            filterCssProperties(category);
        });
    });
    
    // Add copy functionality for scraping tab
    document.querySelectorAll('.copy-selector-btn').forEach(button => {
        button.addEventListener('click', function() {
            const selectorType = this.getAttribute('data-selector');
            const selectorValue = document.getElementById(`${selectorType}Selector`).textContent;
            copyToClipboard(selectorValue);
            showCopiedFeedback(this);
        });
    });
    
    document.querySelectorAll('.copy-content-btn').forEach(button => {
        button.addEventListener('click', function() {
            const contentType = this.getAttribute('data-content');
            const contentValue = document.getElementById(contentType).textContent;
            copyToClipboard(contentValue);
            showCopiedFeedback(this);
        });
    });
});

// Initialize tab functionality
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

// Update all inspector panels with element data
function updateInspectorPanels(data) {
    if (!data) return;
    
    // Update header info
    document.getElementById('elementTag').textContent = data.tagName;
    document.getElementById('elementId').textContent = data.id ? `#${data.id}` : '';
    document.getElementById('elementClasses').textContent = data.className ? `.${data.className.replace(/\s+/g, ' .').trim()}` : '';
    document.getElementById('elementDimensions').textContent = `${data.width} × ${data.height}`;
    
    // Update HTML tab
    updateHtmlTab(data);
    
    // Update CSS tab
    updateCssTab(data);
    
    // Update Box Model tab
    updateBoxModelTab(data);
    
    // Update Scraping tab if scraping data is available
    if (data.scrapingData) {
        updateScrapingTab(data.scrapingData);
    }
}

// Update HTML tab content
function updateHtmlTab(data) {
    // Update hierarchy
    const hierarchyContainer = document.getElementById('hierarchyContainer');
    hierarchyContainer.innerHTML = '';
    
    if (data.hierarchy && data.hierarchy.length) {
        data.hierarchy.forEach(item => {
            const hierarchyItem = document.createElement('div');
            hierarchyItem.className = 'hierarchy-item';
            
            const tagSpan = document.createElement('span');
            tagSpan.className = 'hierarchy-tag';
            tagSpan.textContent = item.tagName;
            hierarchyItem.appendChild(tagSpan);
            
            if (item.id) {
                const idSpan = document.createElement('span');
                idSpan.className = 'hierarchy-id';
                idSpan.textContent = `#${item.id}`;
                hierarchyItem.appendChild(idSpan);
            }
            
            if (item.classes) {
                const classesSpan = document.createElement('span');
                classesSpan.className = 'hierarchy-classes';
                classesSpan.textContent = `.${item.classes.replace(/\s+/g, ' .').trim()}`;
                hierarchyItem.appendChild(classesSpan);
            }
            
            hierarchyContainer.appendChild(hierarchyItem);
        });
    }
    
    // Update HTML content
    document.getElementById('htmlContent').innerHTML = data.html;
}

// Update CSS tab content
function updateCssTab(data) {
    const cssPropertiesContainer = document.getElementById('cssPropertiesContainer');
    cssPropertiesContainer.innerHTML = '';
    
    // Group properties by category
    const cssCategories = {
        layout: ['display', 'position', 'top', 'right', 'bottom', 'left', 'float', 'clear', 'z-index', 'flex', 'grid', 'align', 'justify'],
        typography: ['font', 'text', 'line-height', 'letter-spacing', 'word', 'white-space', 'color'],
        colors: ['color', 'background', 'opacity', 'filter'],
        spacing: ['margin', 'padding', 'width', 'height', 'max-', 'min-'],
        borders: ['border', 'outline', 'box-shadow', 'border-radius']
    };
    
    // Create property items
    if (data.cssProperties) {
        Object.keys(data.cssProperties).sort().forEach(property => {
            const value = data.cssProperties[property];
            
            // Create property item
            const propertyItem = document.createElement('div');
            propertyItem.className = 'property-item';
            
            // Determine category
            let category = 'other';
            for (const [cat, keywords] of Object.entries(cssCategories)) {
                if (keywords.some(keyword => property.includes(keyword))) {
                    category = cat;
                    break;
                }
            }
            propertyItem.setAttribute('data-category', category);
            
            // Create property name
            const propertyName = document.createElement('div');
            propertyName.className = 'property-name';
            propertyName.textContent = property;
            propertyItem.appendChild(propertyName);
            
            // Create property value
            const propertyValue = document.createElement('div');
            propertyValue.className = 'property-value';
            propertyValue.textContent = value;
            propertyItem.appendChild(propertyValue);
            
            cssPropertiesContainer.appendChild(propertyItem);
        });
    }
}

// Update Box Model tab content
function updateBoxModelTab(data) {
    if (!data.cssProperties) return;
    
    // Get box model values
    const marginTop = data.cssProperties['margin-top'] || '0px';
    const marginBottom = data.cssProperties['margin-bottom'] || '0px';
    const borderTop = data.cssProperties['border-top-width'] || '0px';
    const borderBottom = data.cssProperties['border-bottom-width'] || '0px';
    const paddingTop = data.cssProperties['padding-top'] || '0px';
    const paddingBottom = data.cssProperties['padding-bottom'] || '0px';
    
    // Update box model display
    document.getElementById('marginTop').textContent = marginTop;
    document.getElementById('marginBottom').textContent = marginBottom;
    document.getElementById('borderTop').textContent = borderTop;
    document.getElementById('borderBottom').textContent = borderBottom;
    document.getElementById('paddingTop').textContent = paddingTop;
    document.getElementById('paddingBottom').textContent = paddingBottom;
    document.getElementById('boxWidth').textContent = data.width;
    document.getElementById('boxHeight').textContent = data.height;
}

// Update Scraping tab content
function updateScrapingTab(scrapingData) {
    // Update selectors
    document.getElementById('cssSelector').textContent = scrapingData.cssSelector || '';
    document.getElementById('xpathSelector').textContent = scrapingData.xpath || '';
    
    // Update content
    document.getElementById('innerText').textContent = scrapingData.innerText || '';
    document.getElementById('textContent').textContent = scrapingData.textContent || '';
    
    // Update attributes
    const attributesContainer = document.getElementById('attributesContainer');
    attributesContainer.innerHTML = '';
    
    if (scrapingData.attributes) {
        Object.keys(scrapingData.attributes).forEach(attrName => {
            const attrValue = scrapingData.attributes[attrName];
            
            // Create attribute item
            const attributeItem = document.createElement('div');
            attributeItem.className = 'attribute-item';
            
            // Create attribute name
            const attributeName = document.createElement('div');
            attributeName.className = 'attribute-name';
            attributeName.textContent = attrName;
            attributeItem.appendChild(attributeName);
            
            // Create attribute value
            const attributeValue = document.createElement('div');
            attributeValue.className = 'attribute-value';
            attributeValue.textContent = attrValue;
            attributeItem.appendChild(attributeValue);
            
            // Create copy button
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-attribute-btn';
            copyButton.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>';
            copyButton.addEventListener('click', function() {
                copyToClipboard(attrValue);
                showCopiedFeedback(this);
            });
            attributeItem.appendChild(copyButton);
            
            attributesContainer.appendChild(attributeItem);
        });
    }
}

// Filter CSS properties by category
function filterCssProperties(category) {
    const propertyItems = document.querySelectorAll('.property-item');
    
    propertyItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => {
        console.error('Could not copy text: ', err);
    });
}

// Show copied feedback
function showCopiedFeedback(button) {
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    setTimeout(() => {
        button.textContent = originalText;
    }, 1500);
} 