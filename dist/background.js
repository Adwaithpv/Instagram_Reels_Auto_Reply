/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*********************************!*\
  !*** ./src/background/index.ts ***!
  \*********************************/

// Listen for extension installation or update
chrome.runtime.onInstalled.addListener(() => {
    // Set default settings
    chrome.storage.sync.set({
        enabled: false,
        apiKey: ''
    });
});
// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_SETTINGS') {
        chrome.storage.sync.get(['enabled', 'apiKey'], (result) => {
            sendResponse(result);
        });
        return true; // Will respond asynchronously
    }
});

/******/ })()
;
//# sourceMappingURL=background.js.map