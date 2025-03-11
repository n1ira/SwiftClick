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
    
    // Update Scraping tab
    updateScrapingTab(data);
}

// Update HTML tab with element data
function updateHtmlTab(data) {
    // Update HTML content
    const htmlContentElement = document.getElementById('htmlContent');
    htmlContentElement.innerHTML = data.htmlContent;
    
    // Update hierarchy
    const hierarchyContainer = document.getElementById('hierarchyContainer');
    hierarchyContainer.innerHTML = '';
    
    // Create hierarchy elements
    data.hierarchy.forEach((item, index) => {
        const hierarchyItem = document.createElement('div');
        hierarchyItem.className = 'hierarchy-item';
        
        // Add indentation based on depth
        hierarchyItem.style.paddingLeft = `${index * 15}px`;
        
        // Create element representation
        let elementText = `<span class="hierarchy-tag">${item.tagName}</span>`;
        if (item.id) {
            elementText += `<span class="hierarchy-id">#${item.id}</span>`;
        }
        if (item.classes) {
            elementText += `<span class="hierarchy-classes">.${item.classes.replace(/\s+/g, ' .')}</span>`;
        }
        
        hierarchyItem.innerHTML = elementText;
        
        // Highlight the selected element
        if (index === data.hierarchy.length - 1) {
            hierarchyItem.classList.add('selected');
        }
        
        hierarchyContainer.appendChild(hierarchyItem);
    });
}

// Update CSS tab with element data
function updateCssTab(data) {
    const cssPropertiesContainer = document.getElementById('cssPropertiesContainer');
    cssPropertiesContainer.innerHTML = '';
    
    // Get the active category button
    const activeCategory = document.querySelector('.category-btn.active');
    const category = activeCategory ? activeCategory.getAttribute('data-category') : 'all';
    
    // Display properties based on category
    if (category === 'all') {
        // Display all properties
        for (const property in data.cssProperties) {
            addCssProperty(cssPropertiesContainer, property, data.cssProperties[property]);
        }
    } else {
        // Display properties for the selected category
        const categoryProperties = data.categorizedCss[category];
        for (const property in categoryProperties) {
            addCssProperty(cssPropertiesContainer, property, categoryProperties[property]);
        }
    }
}

// Helper function to add a CSS property to the container
function addCssProperty(container, name, value) {
    const propertyItem = document.createElement('div');
    propertyItem.className = 'property-item';
    
    const propertyName = document.createElement('div');
    propertyName.className = 'property-name';
    propertyName.textContent = name;
    
    const propertyValue = document.createElement('div');
    propertyValue.className = 'property-value';
    
    // Special handling for color values
    if (name.includes('color') || value.startsWith('rgb') || value.startsWith('#')) {
        const colorPreview = document.createElement('span');
        colorPreview.className = 'color-preview';
        colorPreview.style.backgroundColor = value;
        propertyValue.appendChild(colorPreview);
    }
    
    const valueText = document.createElement('span');
    valueText.textContent = value;
    propertyValue.appendChild(valueText);
    
    propertyItem.appendChild(propertyName);
    propertyItem.appendChild(propertyValue);
    container.appendChild(propertyItem);
}

// Update Box Model tab with element data
function updateBoxModelTab(data) {
    const boxModel = data.boxModel;
    
    // Update box model visualization
    document.getElementById('boxModelMarginTop').textContent = boxModel.margin.top + 'px';
    document.getElementById('boxModelMarginRight').textContent = boxModel.margin.right + 'px';
    document.getElementById('boxModelMarginBottom').textContent = boxModel.margin.bottom + 'px';
    document.getElementById('boxModelMarginLeft').textContent = boxModel.margin.left + 'px';
    
    document.getElementById('boxModelBorderTop').textContent = boxModel.border.top + 'px';
    document.getElementById('boxModelBorderRight').textContent = boxModel.border.right + 'px';
    document.getElementById('boxModelBorderBottom').textContent = boxModel.border.bottom + 'px';
    document.getElementById('boxModelBorderLeft').textContent = boxModel.border.left + 'px';
    
    document.getElementById('boxModelPaddingTop').textContent = boxModel.padding.top + 'px';
    document.getElementById('boxModelPaddingRight').textContent = boxModel.padding.right + 'px';
    document.getElementById('boxModelPaddingBottom').textContent = boxModel.padding.bottom + 'px';
    document.getElementById('boxModelPaddingLeft').textContent = boxModel.padding.left + 'px';
    
    document.getElementById('boxModelWidth').textContent = boxModel.width + 'px';
    document.getElementById('boxModelHeight').textContent = boxModel.height + 'px';
}

// Update Scraping tab with element data
function updateScrapingTab(data) {
    // Update XPath
    document.getElementById('xpathSelector').textContent = data.xpath;
    
    // Update CSS Selector
    document.getElementById('cssSelector').textContent = data.cssSelector;
    
    // Update Text Content
    document.getElementById('textContent').textContent = data.innerText;
    
    // Update HTML Content
    document.getElementById('htmlContent2').textContent = data.innerHTML;
    
    // Update Attributes
    const attributesContainer = document.getElementById('attributesContainer');
    attributesContainer.innerHTML = '';
    
    for (const name in data.attributes) {
        const attributeItem = document.createElement('div');
        attributeItem.className = 'attribute-item';
        
        const attributeName = document.createElement('div');
        attributeName.className = 'attribute-name';
        attributeName.textContent = name;
        
        const attributeValue = document.createElement('div');
        attributeValue.className = 'attribute-value';
        attributeValue.textContent = data.attributes[name];
        
        attributeItem.appendChild(attributeName);
        attributeItem.appendChild(attributeValue);
        attributesContainer.appendChild(attributeItem);
    }
}

// Filter CSS properties by category
function filterCssProperties(category) {
    // Get the last inspected element data
    chrome.runtime.sendMessage({ action: 'getLastInspectedElement' }, function(response) {
        if (response && response.data) {
            updateCssTab(response.data);
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