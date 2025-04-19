import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;
let observer: MutationObserver | null = null;
let isProcessing = false;
let retryCount = 0;
let isExtensionConnected = true;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const SECURITY_DELAY = 2000; // 2 seconds for security-related delays
let processedReels = new Set<string>();

// Debug logging function
function debugLog(message: string, data?: any) {
  console.log(`[Instagram Reels Auto-Reply] ${message}`, data || '');
}

// Set up connection to detect extension unload/reload
function setupConnectionMonitor() {
  try {
    debugLog('Setting up connection monitor');
    const port = chrome.runtime.connect({ name: 'instagram-reels-content-script' });
    
    if (chrome.runtime.lastError) {
      debugLog('Connection warning:', chrome.runtime.lastError.message);
    }
    
    port.onDisconnect.addListener(() => {
      if (chrome.runtime.lastError) {
        debugLog('Disconnect warning:', chrome.runtime.lastError.message);
      }
      
      debugLog('Extension disconnected - disabling content script');
      isExtensionConnected = false;
      cleanup();
    });
    
    isExtensionConnected = true;
    debugLog('Connection monitor setup successful');
    return true;
  } catch (error) {
    debugLog('Failed to connect to extension:', error);
    isExtensionConnected = false;
    return false;
  }
}

// Fallback method to check extension connection
function checkExtensionConnection(): boolean {
  try {
    if (chrome && chrome.runtime && chrome.runtime.id) {
      return true;
    }
    debugLog('Extension connection check failed - no runtime ID');
    return false;
  } catch (error) {
    debugLog('Extension connection check failed:', error);
    return false;
  }
}

// Cleanup function to stop all activities when disconnected
function cleanup() {
  debugLog('Cleaning up content script');
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  genAI = null;
  isProcessing = false;
  retryCount = 0;
  
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  window.removeEventListener('pageshow', handlePageShow);
}

// Initialize Gemini API
async function initGemini(apiKey: string) {
  if (!checkExtensionConnection()) {
    debugLog('Cannot initialize Gemini - extension not connected');
    return null;
  }

  try {
    debugLog('Initializing Gemini API with key:', apiKey.substring(0, 10) + '...');
    genAI = new GoogleGenerativeAI(apiKey);
    // Test the API with a simple request
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    await model.generateContent("Test");
    debugLog('Gemini API initialized and tested successfully');
    return genAI;
  } catch (error) {
    debugLog('Failed to initialize Gemini API:', error);
    return null;
  }
}

// Safe DOM query function with security checks
function safeQuerySelector(selector: string): Element | null {
  if (!checkExtensionConnection()) {
    debugLog('Cannot query DOM - extension not connected');
    return null;
  }

  try {
    const element = document.querySelector(selector);
    if (!element) {
      debugLog(`Element not found: ${selector}`);
    }
    return element;
  } catch (error) {
    debugLog('DOM query failed:', error);
    return null;
  }
}

// Wait for Instagram's chat input to be ready with security checks
async function waitForChatInput(): Promise<HTMLElement | null> {
  if (!checkExtensionConnection()) {
    debugLog('Cannot wait for chat input - extension not connected');
    return null;
  }

  debugLog('Waiting for chat input');
  return new Promise((resolve) => {
    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(() => {
      if (!checkExtensionConnection()) {
        clearInterval(interval);
        debugLog('Connection lost while waiting for chat input');
        resolve(null);
        return;
      }

      try {
        const chatInput = safeQuerySelector('div[role="textbox"]');
        if (chatInput) {
          clearInterval(interval);
          debugLog('Chat input found');
          resolve(chatInput as HTMLElement);
        } else if (++attempts >= maxAttempts) {
          clearInterval(interval);
          debugLog('Chat input not found after maximum attempts');
          resolve(null);
        }
      } catch (error) {
        debugLog('Error checking for chat input:', error);
        if (++attempts >= maxAttempts) {
          clearInterval(interval);
          resolve(null);
        }
      }
    }, 500);
  });
}

// Send message to chat with enhanced security checks
async function sendMessage(message: string): Promise<boolean> {
  if (!checkExtensionConnection()) {
    debugLog('Cannot send message - extension not connected');
    return false;
  }

  debugLog('Attempting to send message:', message);
  try {
    const chatInput = await waitForChatInput();
    if (!chatInput) {
      debugLog('Cannot send message - chat input not found');
      return false;
    }

    debugLog('Focusing chat input');
    await new Promise(resolve => setTimeout(resolve, SECURITY_DELAY));

    try {
      chatInput.focus();
      const event = new InputEvent('input', {
        bubbles: true,
        cancelable: true,
        inputType: 'insertText',
        data: message
      });
      chatInput.dispatchEvent(event);
      debugLog('Message typed into chat input');
    } catch (error) {
      debugLog('Error interacting with chat input:', error);
      return false;
    }

    await new Promise(resolve => setTimeout(resolve, SECURITY_DELAY));
    try {
      // Look for the send button with the exact class structure
      const sendButtons = document.querySelectorAll('div[role="button"][tabindex="0"]');
      const sendButton = Array.from(sendButtons).find(button => 
        button.textContent?.trim() === 'Send'
      );
      
      if (!sendButton) {
        debugLog('Cannot send message - send button not found');
        return false;
      }

      debugLog('Found send button, clicking it');
      (sendButton as HTMLElement).click();
      debugLog('Message sent successfully');
      return true;
    } catch (error) {
      debugLog('Error clicking send button:', error);
      return false;
    }
  } catch (error) {
    debugLog('Unexpected error in sendMessage:', error);
    return false;
  }
}

// Process reels with enhanced security checks
async function processReels(containers: NodeListOf<Element>) {
  if (!checkExtensionConnection() || isProcessing) {
    debugLog('Cannot process reels - extension not connected or already processing');
    return;
  }
  
  debugLog('Starting to process reels');
  isProcessing = true;

  try {
    for (const container of Array.from(containers)) {
      if (!checkExtensionConnection()) {
        debugLog('Connection lost while processing reels');
        return;
      }

      try {
        // Check if this is a reel container by looking for the clip icon
        const clipIcon = container.querySelector('svg[aria-label="Clip"]');
        if (!clipIcon) {
          debugLog('No clip icon found, not a reel');
          continue;
        }

        // Get the username from the link
        const usernameLink = container.querySelector('a[href^="/"]');
        const username = usernameLink?.getAttribute('href')?.replace('/', '') || '';
        
        if (!username) {
          debugLog('No username found, skipping');
          continue;
        }

        // Create a unique identifier for this reel
        const reelId = `${username}_${Date.now()}`;
        
        if (processedReels.has(reelId)) {
          debugLog('Reel already processed, skipping');
          continue;
        }

        // Get all possible content from the reel
        const mediaElement = container.querySelector('img[src*="cdninstagram.com"]') || 
                           container.querySelector('video');
        const mediaUrl = mediaElement?.getAttribute('src') || '';
        const description = mediaElement?.getAttribute('alt') || 
                          mediaElement?.getAttribute('aria-label') || 
                          '';

        // Get any text content from the reel
        const textContent = Array.from(container.querySelectorAll('span, div'))
          .map(el => el.textContent?.trim())
          .filter(Boolean)
          .join(' ');

        debugLog('Found reel from user:', username);
        debugLog('Reel media URL:', mediaUrl);
        debugLog('Reel description:', description);
        debugLog('Reel text content:', textContent);
        
        processedReels.add(reelId);
        
        if (!genAI) {
          debugLog('Reinitializing Gemini API');
          const apiKey = await new Promise<string>((resolve) => {
            chrome.storage.sync.get(['apiKey'], (result) => {
              resolve(result.apiKey);
            });
          });
          await initGemini(apiKey);
        }

        if (genAI) {
          let success = false;
          while (!success && retryCount < MAX_RETRIES && checkExtensionConnection()) {
            try {
              debugLog('Generating reply for reel');
              const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
              
              // Create a detailed prompt with all available information
              const prompt = `Generate a friendly and engaging reply for an Instagram reel from @${username}.
Content details:
- Description: ${description}
- Text content: ${textContent}
- Media URL: ${mediaUrl}

Please analyze this content and generate a personalized, engaging reply. Keep it casual and conversational. If the content is about writing, focus on that aspect. If it's a story or situation, respond accordingly. Make sure to include relevant emojis and keep the tone friendly.`;

              const result = await model.generateContent(prompt);
              const response = await result.response;
              const reply = response.text();
              debugLog('Generated reply:', reply);

              if (reply) {
                // Simulate hover over the reel container
                debugLog('Simulating hover over reel container');
                const mouseoverEvent = new MouseEvent('mouseover', {
                  bubbles: true,
                  cancelable: true,
                  view: window
                });
                container.dispatchEvent(mouseoverEvent);
                
                // Wait for the reply button to appear
                await new Promise(resolve => setTimeout(resolve, SECURITY_DELAY));
                
                // Try to find and click the reply button
                const replyButton = container.querySelector('div[role="presentation"].html-div');
                if (replyButton) {
                  debugLog('Clicking reply button');
                  (replyButton as HTMLElement).click();
                  await new Promise(resolve => setTimeout(resolve, SECURITY_DELAY));
                } else {
                  debugLog('Reply button not found after hover');
                }

                success = await sendMessage(reply);
                if (!success) {
                  retryCount++;
                  debugLog(`Failed to send message, retry ${retryCount}/${MAX_RETRIES}`);
                  await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retryCount));
                }
              }
            } catch (error) {
              debugLog('Error processing reel, retrying...', error);
              retryCount++;
              await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retryCount));
            }
          }
          retryCount = 0;
        } else {
          debugLog('Cannot process reel - Gemini API not initialized');
        }
      } catch (error) {
        debugLog('Error processing container:', error);
        continue;
      }
    }
  } catch (error) {
    debugLog('Unexpected error in processReels:', error);
  } finally {
    isProcessing = false;
    debugLog('Finished processing reels');
  }
}

// Detect reels with security checks
function detectReels() {
  if (!checkExtensionConnection() || isProcessing) {
    debugLog('Cannot detect reels - extension not connected or already processing');
    return;
  }
  
  debugLog('Detecting reels');
  try {
    // Look for containers that have the clip icon (indicating a reel)
    const reelContainers = document.querySelectorAll('div[role="button"]');
    debugLog(`Found ${reelContainers.length} potential reel containers`);
    
    if (reelContainers.length === 0) {
      debugLog('No reel containers found');
      return;
    }

    // Filter containers to only those that contain a clip icon
    const actualReelContainers = Array.from(reelContainers).filter(container => 
      container.querySelector('svg[aria-label="Clip"]')
    );
    
    debugLog(`Found ${actualReelContainers.length} actual reels`);
    processReels(actualReelContainers as unknown as NodeListOf<Element>);
  } catch (error) {
    debugLog('Error detecting reels:', error);
  }
}

// Handle visibility changes
function handleVisibilityChange() {
  debugLog('Visibility changed:', document.visibilityState);
  if (document.visibilityState === 'visible' && checkExtensionConnection()) {
    init();
  }
}

// Handle page show event
function handlePageShow(event: PageTransitionEvent) {
  debugLog('Page shown, persisted:', event.persisted);
  if (event.persisted && checkExtensionConnection()) {
    init();
  }
}

// Alternative initialization that doesn't rely on runtime.connect
function safeInit() {
  debugLog('Starting safe initialization');
  if (!checkExtensionConnection()) {
    debugLog('Cannot initialize - extension not connected');
    return;
  }

  if (observer) {
    observer.disconnect();
    observer = null;
  }

  try {
    debugLog('Getting extension settings');
    chrome.storage.sync.get(['enabled', 'apiKey'], async (result) => {
      if (chrome.runtime.lastError) {
        debugLog('Storage API error:', chrome.runtime.lastError.message);
        return;
      }

      debugLog('Extension settings:', result);
      if (result.enabled && result.apiKey) {
        await initGemini(result.apiKey);
        
        if (!checkExtensionConnection()) {
          debugLog('Connection lost after Gemini initialization');
          return;
        }
        
        debugLog('Setting up mutation observer');
        let timeoutId: number | null = null;
        observer = new MutationObserver(() => {
          if (!checkExtensionConnection()) {
            if (timeoutId) {
              window.clearTimeout(timeoutId);
            }
            observer?.disconnect();
            return;
          }

          if (timeoutId) {
            window.clearTimeout(timeoutId);
          }
          timeoutId = window.setTimeout(detectReels, SECURITY_DELAY);
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        debugLog('Mutation observer setup complete');
      } else {
        debugLog('Extension not enabled or API key not set');
      }
    });
  } catch (error: any) {
    debugLog('Error in safe initialization:', error);
    if (error.message && error.message.includes('Extension context invalidated')) {
      cleanup();
    } else {
      setTimeout(safeInit, RETRY_DELAY);
    }
  }
}

// Initialize with security checks
async function init() {
  debugLog('Starting initialization');
  try {
    const connected = setupConnectionMonitor();
    
    if (!connected) {
      debugLog('Connection monitor setup failed, falling back to safe init');
      safeInit();
      return;
    }
    
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    try {
      debugLog('Getting extension settings');
      const result = await chrome.storage.sync.get(['enabled', 'apiKey']);
      debugLog('Extension settings:', result);
      
      if (result.enabled && result.apiKey) {
        await initGemini(result.apiKey);
        
        debugLog('Setting up mutation observer');
        let timeoutId: number | null = null;
        observer = new MutationObserver(() => {
          if (!checkExtensionConnection()) {
            if (timeoutId) {
              window.clearTimeout(timeoutId);
            }
            observer?.disconnect();
            return;
          }

          if (timeoutId) {
            window.clearTimeout(timeoutId);
          }
          timeoutId = window.setTimeout(detectReels, SECURITY_DELAY);
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        debugLog('Mutation observer setup complete');
      } else {
        debugLog('Extension not enabled or API key not set');
      }
    } catch (error: any) {
      debugLog('Error in initialization:', error);
      if (error.message && error.message.includes('Extension context invalidated')) {
        isExtensionConnected = false;
        cleanup();
      } else {
        setTimeout(safeInit, RETRY_DELAY);
      }
    }
  } catch (error) {
    debugLog('Fatal error during initialization:', error);
    safeInit();
  }
}

// Set up event listeners
debugLog('Setting up event listeners');
document.addEventListener('visibilitychange', handleVisibilityChange);
window.addEventListener('load', init);
window.addEventListener('pageshow', handlePageShow);

// Start the extension
debugLog('Instagram Reels Auto-Reply content script starting');
init(); 