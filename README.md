# SwiftClick Chrome Extension

SwiftClick is an all-in-one browser extension for web developers and designers. It provides powerful tools to inspect, modify, debug, and extract assets from websites directly in your browser.

## Features

### Core Inspection Tools
- **Hover Inspection**: Quickly access HTML and CSS details by hovering over elements, eliminating the need for manual selection.
- **Element Inspector**: Hover over and select elements on a webpage to view their HTML structure and CSS styles.
- **Pseudo-Class Inspection**: Easily inspect and edit pseudo-classes like :hover, :focus, and :active, ensuring comprehensive style management.
- **Element Box Model Visualization**: Visually inspect the padding, margin, border, and size of elements, aiding in layout debugging.

### Editing & Customization
- **Real-Time Editing**: Modify HTML content, CSS properties, media queries, and animations on-the-fly, allowing for immediate visual feedback.
- **Visual Style Editor**: Utilize a user-friendly interface to adjust styles, enabling precise design refinements without delving into code.
- **Media Query Management**: Access and edit styles across different screen sizes, facilitating responsive design testing and adjustments.
- **Live CSS Editing**: Modify CSS properties in real-time to see how changes affect the design.

### Color & Typography Tools
- **Color Eyedropper**: Sample colors from any part of a webpage and get the color values in various formats.
- **Color Palette Extraction**: Retrieve all colors used on a page, assisting in maintaining consistent design aesthetics.
- **Font Identification**: Determine the fonts applied to each tag, useful for typography analysis and consistency.

### Asset Management
- **Asset Extraction**: Extract images, SVGs, videos, and other media from webpages with visual previews.
- **Copy Functionality**: Easily copy HTML, CSS, or element selectors with a single click.

### Navigation & Testing
- **Search Functionality**: Locate elements using tag names, IDs, classes, or even CSS selectors, enhancing navigation and editing efficiency.
- **Responsive Design Testing**: Preview how websites appear at different screen sizes and device configurations.

### Additional Tools
- **Debug Tools**: Analyze JavaScript events and network requests to identify issues.
- **SEO Analysis**: Examine metadata, headings, and structured data for search engine optimization.
- **Site Technology Stack**: Identify frameworks, libraries, and platforms used by websites.
- **Screenshot Capture**: Take full-page screenshots or capture specific elements.

## Installation (Development Mode)

Since this extension is currently in development, you'll need to load it as an unpacked extension:

1. Clone or download this repository to your local machine
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the SwiftClick directory
5. The extension should now appear in your extensions list and toolbar

## Usage

### Hover Inspection

1. Click the SwiftClick icon in your toolbar to open the sidebar
2. Toggle on the "Inspector" switch
3. Hover over elements on the page to see HTML and CSS details instantly
4. Toggle off when you're done to prevent interference with normal browsing

### Element Inspector

1. With the SwiftClick sidebar open
2. Use the Element Inspector to click and select specific elements
3. View detailed properties in the inspector panel
4. Switch between HTML, CSS, and computed styles views

### Visual Style Editor

1. Select an element on the page
2. Use the Visual Style Editor controls to adjust properties
3. See changes applied in real-time
4. Copy the modified CSS when satisfied

### Color Tools

1. Toggle on the "Color Eyedropper" switch in the sidebar
2. Click anywhere on the page to sample colors
3. Use the "Extract Palette" button to find all colors used on the page
4. Click any color to copy its value in your preferred format

### Asset Extraction

1. Navigate to the "Assets" section in the sidebar
2. View thumbnails of all detected assets on the page
3. Filter by type (images, SVG, video, etc.)
4. Download individual assets or in bulk

### Media Query Management

1. Open the "Responsive" section in the sidebar
2. View all media queries defined on the page
3. Edit or create new media queries
4. Test the page at different screen sizes

## Keyboard Shortcuts

- **Ctrl+Shift+S** (Windows/Linux) or **Cmd+Shift+S** (Mac): Open SwiftClick sidebar
- **Esc**: Close active tools or panels
- **Alt+Click**: Quick element inspection
- **Shift+E**: Toggle eyedropper tool
- **Shift+I**: Toggle inspector tool

## Project Structure

```
SwiftClick/
├── css/
│   ├── content.css    # Styles for on-page elements (inspector, etc.)
│   ├── sidebar.css    # Styles for the sidebar UI
│   └── popup.css      # Styles for the popup UI
├── html/
│   ├── sidebar.html   # Main sidebar interface
│   └── popup.html     # Popup interface
├── images/
│   ├── icon16.png     # 16x16 icon
│   ├── icon48.png     # 48x48 icon
│   └── icon128.png    # 128x128 icon
├── js/
│   ├── background.js  # Background script for extension lifecycle
│   ├── content.js     # Content script injected into pages
│   ├── sidebar.js     # JavaScript for the sidebar UI
│   ├── inspector.js   # Element inspection functionality
│   ├── color-tools.js # Color extraction and manipulation tools
│   ├── assets.js      # Asset detection and handling
│   └── popup.js       # JavaScript for the popup UI
└── manifest.json      # Extension configuration
```

## UI Design

SwiftClick features a sleek, dark-themed sidebar interface with toggle switches for major features, allowing you to enable only the tools you need. The design is inspired by Hoverify and focuses on providing powerful functionality with minimal visual interference.

## Development

Please follow the [development guide](development-guide.md) for a step-by-step approach to extending and improving this extension.

## License

MIT License

## Acknowledgements

This extension is inspired by similar developer tools like Hoverify and Chrome DevTools. 