# Instant Word Translator

A lightweight browser extension that instantly translates words as you hover over them. Perfect for language learning or quickly understanding foreign texts without interrupting your reading flow.

## Features

- **Real-time Translation:** Simply move the mouse over a word, and the translation appears immediately in a small tooltip.
- **Language Detection:** Supports automatic detection of the source language or fixed presets (German, English, French, Spanish, etc.).
- **Customizable:** In the options, you can individually set the source and target languages as well as the font size of the tooltip.
- **Dark Mode Support:** The settings menu automatically adapts to your browser's theme.
- **Easy to Use:** The extension can be quickly toggled on and off with a click on the icon in the toolbar. The icon shows the current status (Colored = Active, Gray = Inactive).
- **Privacy-friendly:** The extension requires minimal permissions and collects no personal data.

## Installation

### Automatic Installation

The extension can be installed automatically via the Chrome Web Store.

### Manual Installation

You can manually install the extension in Chrome as follows:

1. Download this repository or clone it (`git clone ...`).
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click on **Load unpacked** and select the folder containing the files of this repository.

## Usage

1. Ensure the extension is activated (the icon should be colored).
2. Hover the mouse cursor over any word on a webpage.
3. After a brief moment, the translation appears directly next to the cursor.
4. By right-clicking on the extension icon and selecting "Options", you can change the languages and font size.

## Technical Details

- **Manifest V3:** Complies with the latest security and performance standards for Chrome extensions.
- **API:** Uses the Google Translate API for precise translations in over 100 languages.
- **Lightweight:** No dependencies on external libraries, minimal memory usage.

## Author

Created by **Gregor Stübner**.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.