# Instagram Reels Auto-Reply Extension

A Chrome extension that automatically detects Instagram reels in your chat messages and generates contextual replies using AI.

## Features

- Automatically detects Instagram reels in your chat messages
- Analyzes reel content using TensorFlow.js and COCO-SSD for object detection
- Generates contextual replies using Google's Gemini AI
- Modern React-based popup interface for configuration
- Secure storage of API keys using Chrome's storage API
- Real-time monitoring of Instagram chat messages

## Tech Stack

- React 18 for UI components
- TypeScript for type safety
- TensorFlow.js for computer vision
- Google Gemini AI for natural language processing
- Webpack for bundling
- Styled Components for styling

## Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/instagram-reels-auto-reply.git
cd instagram-reels-auto-reply
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` directory from this project

## Configuration

1. Click the extension icon in your Chrome toolbar
2. Enter your Google Gemini API key (get it from https://makersuite.google.com/app/apikey)
3. Toggle the extension on/off as needed

## Usage

1. Open Instagram in your browser
2. Navigate to any chat conversation
3. When someone sends you a reel, the extension will:
   - Detect the reel automatically
   - Analyze its content using computer vision
   - Generate a contextual reply using Gemini AI
   - Send the reply automatically

## Development

To start development:

```bash
npm run watch
```

This will rebuild the extension whenever you make changes to the source code.

The project structure is organized as follows:
- `src/` - Main source code
  - `background/` - Background service worker
  - `content/` - Content scripts for Instagram
  - `popup/` - React-based popup UI
  - `types/` - TypeScript type definitions

## Requirements

- Chrome browser
- Google Gemini API key
- Node.js v18 or higher
- npm package manager

## Privacy & Security

- Your Gemini API key is stored securely in Chrome's storage
- The extension only processes reels that are sent to you
- No data is collected or shared with third parties
- All processing happens locally in your browser

## License

MIT License 