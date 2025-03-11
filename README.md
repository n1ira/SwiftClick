# SwiftClick Chrome Extension

SwiftClick is an all-in-one browser extension for web developers and designers. It provides powerful tools to inspect, modify, debug, and extract assets from websites directly in your browser.

## Features

- **Hover Inspection**: Quickly access HTML and CSS details by hovering over elements, eliminating the need for manual selection.
- **Real-Time Editing**: Modify HTML content, CSS properties, media queries, and animations on-the-fly with immediate visual feedback.
- **Visual Style Editor**: Utilize a user-friendly interface to adjust styles, enabling precise design refinements without delving into code.
- **Pseudo-Class Inspection**: Easily inspect and edit pseudo-classes like :hover, :focus, and :active for comprehensive style management.
- **Media Query Management**: Access and edit styles across different screen sizes, facilitating responsive design testing and adjustments.
- **Element Box Model Visualization**: Visually inspect the padding, margin, border, and size of elements, aiding in layout debugging.
- **Color Palette Extraction**: Retrieve all colors used on a page, assisting in maintaining consistent design aesthetics.
- **Font Identification**: Determine the fonts applied to each tag, useful for typography analysis and consistency.
- **Search Functionality**: Locate elements using tag names, IDs, classes, or CSS selectors, enhancing navigation and editing efficiency.
- **Scraping Mode**: Special inspector mode that displays data useful for web scraping, including XPaths, selectors, and data attributes.
- **Asset Extraction**: Extract images, SVGs, videos, and other media from webpages with visual previews.
- **Responsive Design Tools**: Test how websites look at different screen sizes and device types.
- **SEO Analysis**: Analyze page structure and content for search engine optimization.
- **Debug Tools**: Inspect JavaScript events and network requests.
- **Capture Tools**: Take screenshots of elements, visible area, or entire pages.
- **Site Stack Analysis**: Identify technologies and frameworks used on websites.

## Installation (Development Mode)

Since this extension is currently in development, you'll need to load it as an unpacked extension:

1. Clone or download this repository to your local machine
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the SwiftClick directory
5. The extension should now appear in your extensions list and toolbar

## Usage

### Hover Inspector

1. Click the SwiftClick icon in your toolbar to open the extension
2. Toggle on the "Inspector" switch
3. Hover over elements on the page to see their HTML and CSS details
4. Toggle "Scraping Mode" to view data useful for web scraping

### Real-Time Editing

1. With Inspector active, hover over an element you want to edit
2. Use the visual editor to modify styles or directly edit HTML/CSS
3. See changes applied in real-time on the page

### Color Tools

1. Toggle on the "Color Eyedropper" switch
2. Hover over any color on the page to sample it
3. Use "Color Palette" to extract all colors used on the page

### Asset Extraction

1. Click on the "Assets" option
2. Browse through the visual previews of images, SVGs, videos, and other media
3. Download individual assets or in bulk

### Responsive Design Testing

1. Click on the "Responsive" option
2. Select different device presets or set custom dimensions
3. View how the page responds to different screen sizes

### Additional Tools

- **Debug**: Inspect JavaScript events and network requests
- **SEO**: Analyze page structure and content for search optimization
- **Capture**: Take screenshots of elements or pages
- **Site Stack**: Identify technologies used on the website

## Keyboard Shortcuts

- **Ctrl+Shift+S** (Windows/Linux) or **Cmd+Shift+S** (Mac): Open the SwiftClick extension

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

## UI Design

The extension features a sleek sidebar interface similar to Hoverify, with:
- Toggle switches for Inspector and Color Eyedropper modes
- Clean, organized sections for different tools
- Visual previews for assets and colors
- Intuitive controls for all features

## Development

Please follow the [development guide](development-guide.md) for a step-by-step approach to extending and improving this extension.

## License

MIT License

## Acknowledgements

This extension is inspired by similar developer tools like Hoverify and Chrome DevTools. 