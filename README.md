# SwiftClick Chrome Extension

SwiftClick is an all-in-one browser extension for web developers and designers. It provides powerful tools to inspect, modify, debug, and extract assets from websites directly in your browser.

## Features

- **Element Inspector**: Hover over and select elements on a webpage to view their HTML structure and CSS styles.
- **Live CSS Editing**: Modify CSS properties in real-time to see how changes affect the design.
- **Color Eyedropper**: Sample colors from any part of a webpage and get the color values in various formats.
- **Asset Extraction**: Extract images, SVGs, videos, and other media from webpages.
- **Copy Functionality**: Easily copy HTML, CSS, or element selectors with a single click.

## Installation (Development Mode)

Since this extension is currently in development, you'll need to load it as an unpacked extension:

1. Clone or download this repository to your local machine
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the SwiftClick directory
5. The extension should now appear in your extensions list and toolbar

## Usage

### Element Inspector

1. Click the SwiftClick icon in your toolbar to open the popup
2. Select the "Inspector" tab
3. Click the "Select Element" button
4. Hover over elements on the page and click to select one
5. View the element's properties in the Visual, Code, and HTML tabs

### Color Picker

1. Open the SwiftClick popup
2. Select the "Colors" tab
3. Click the "Pick Color" button
4. Click anywhere on the page to sample the color
5. The color will be saved to your recent colors list

### Asset Extraction

1. Open the SwiftClick popup
2. Select the "Assets" tab
3. Click "Scan Page" to find all assets
4. Browse through the different asset categories
5. Download individual assets or all at once

## Keyboard Shortcuts

- **Ctrl+Shift+S** (Windows/Linux) or **Cmd+Shift+S** (Mac): Open the SwiftClick popup

## Project Structure

```
SwiftClick/
├── css/
│   ├── content.css    # Styles for on-page elements (inspector, etc.)
│   └── popup.css      # Styles for the popup UI
├── html/
│   └── popup.html     # Main popup interface
├── images/
│   ├── icon16.png     # 16x16 icon
│   ├── icon48.png     # 48x48 icon
│   └── icon128.png    # 128x128 icon
├── js/
│   ├── background.js  # Background script for extension lifecycle
│   ├── content.js     # Content script injected into pages
│   └── popup.js       # JavaScript for the popup UI
└── manifest.json      # Extension configuration
```

## Development

Please follow the [development guide](development-guide.md) for a step-by-step approach to extending and improving this extension.

## License

MIT License

## Acknowledgements

This extension is inspired by similar developer tools like Hoverify and Chrome DevTools. 