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
let lastProcessedReelId: string | null = null;
let lastReelCount = 0;

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

// Function to safely get image data
async function getImageData(imgElement: HTMLImageElement): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      // Create a canvas with the same dimensions as the image
      const canvas = document.createElement('canvas');
      canvas.width = imgElement.naturalWidth;
      canvas.height = imgElement.naturalHeight;
      
      // Get the canvas context
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        debugLog('Could not get canvas context');
        resolve(null);
        return;
      }

      // Try to draw the image
      try {
        ctx.drawImage(imgElement, 0, 0);
        
        // Get the image data as a blob
        canvas.toBlob((blob) => {
          if (!blob) {
            debugLog('Failed to create blob from canvas');
            resolve(null);
            return;
          }

          // Create a FileReader to read the blob
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            resolve(base64);
          };
          reader.onerror = () => {
            debugLog('Failed to read blob');
            resolve(null);
          };
          reader.readAsDataURL(blob);
        }, 'image/jpeg');
      } catch (error) {
        debugLog('Failed to draw image to canvas:', error);
        resolve(null);
      }
    } catch (error) {
      debugLog('Error in getImageData:', error);
      resolve(null);
    }
  });
}

// Function to capture a frame from a video element
async function captureVideoFrame(video: HTMLVideoElement): Promise<string | null> {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      debugLog('Could not get canvas context');
      return null;
    }

    // Draw the current frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to base64
    return canvas.toDataURL('image/jpeg', 0.8);
  } catch (error) {
    debugLog('Error capturing video frame:', error);
    return null;
  }
}

// Function to play reel and capture frames
async function playAndCaptureReel(container: Element): Promise<string[]> {
  try {
    // Click the reel to start playback
    const reelClickArea = container.querySelector('[id^="mid\\."] > div.html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x78zum5.xh8yej3 > div.x1cy8zhl.x78zum5.xdt5ytf.x193iq5w.x1n2onr6.x1kxipp6 > div > div > div > div > div > div > div.x1ey2m1c.xds687c.x17qophe.x10l6tqk.x13vifvy.x6m44yg');
    
    if (!reelClickArea) {
      debugLog('Could not find reel click area');
      return [];
    }

    debugLog('Clicking reel to start playback');
    (reelClickArea as HTMLElement).click();
    
    // Wait for the video player to appear
    await new Promise(resolve => setTimeout(resolve, SECURITY_DELAY));
    
    // Find the video element
    const videoContainer = document.querySelector('body > div.x1n2onr6.xzkaem6 > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe.x1qjc9v5.xjbqb8w.x1lcm9me.x1yr5g0i.xrt01vj.x10y3i5r.xr1yuqi.xkrivgy.x4ii5y1.x1gryazu.x15h9jz8.x47corl.xh8yej3.xir0mxb.x1juhsu6 > div > article > div > div._aatk._aatl');
    const video = videoContainer?.querySelector('video');
    
    if (!video) {
      debugLog('Could not find video element');
      return [];
    }

    debugLog('Found video element, waiting for playback');
    
    // Wait for video to start playing
    await new Promise<void>((resolve) => {
      const checkVideo = () => {
        if (!video.paused && video.currentTime > 0) {
          resolve();
        } else {
          setTimeout(checkVideo, 100);
        }
      };
      checkVideo();
    });

    debugLog('Video is playing, capturing frames');
    
    // Capture frames at different points in the video
    const frames: string[] = [];
    const capturePoints = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9]; // Capture at 15%, 30%, 45%, 60%, 75%, and 90% of the video
    
    for (const point of capturePoints) {
      // Seek to the desired point
      video.currentTime = video.duration * point;
      
      // Wait for seek to complete
      await new Promise<void>((resolve) => {
        video.onseeked = () => resolve();
      });
      
      // Capture frame
      const frame = await captureVideoFrame(video);
      if (frame) {
        frames.push(frame);
        debugLog(`Captured frame at ${Math.round(point * 100)}% of video`);
      }
    }

    // Find and click the close button
    const closeButton = document.querySelector('div.x6s0dn4.x78zum5.xdt5ytf.xl56j7k svg[aria-label="Close"]')?.closest('div[role="button"]');
    if (closeButton) {
      debugLog('Found close button, clicking it');
      (closeButton as HTMLElement).click();
      await new Promise(resolve => setTimeout(resolve, SECURITY_DELAY));
    } else {
      debugLog('Could not find close button, clicking outside instead');
      document.body.click();
    }
    
    return frames;
  } catch (error) {
    debugLog('Error in playAndCaptureReel:', error);
    return [];
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

        // Get the media URL for a more stable identifier
        const mediaElement = container.querySelector('img[src*="cdninstagram.com"]') || 
                           container.querySelector('video');
        const mediaUrl = mediaElement?.getAttribute('src') || '';
        
        // Create a stable identifier using username and media URL
        const reelId = `${username}_${mediaUrl.split('/').pop()?.split('?')[0] || ''}`;
        
        if (processedReels.has(reelId)) {
          debugLog('Reel already processed, skipping');
          continue;
        }

        // Get all possible content from the reel
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
        debugLog(`Added reel ${reelId} to processed set`);
        
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
              
              // Capture frames from the reel
              debugLog('Attempting to capture frames from reel');
              const frames = await playAndCaptureReel(container);
              
              // Create a detailed prompt with all available information
              const prompt = `Generate a short, natural reply to an Instagram reel that someone sent me in DMs. The reel is about:
Content details:
- Description: ${description}
- Text content: ${textContent}
${frames.length > 0 ? '- I can see multiple frames from the video above\n' : ''}


Requirements:
- Be specific to the content (mention something specific you notice)
- Super brief (3-10 words max)
- No generic phrases like "Haha nice!" or "That's cool!"
- Do not be overly enthusiastic. Its not always that every reel is happy. Be chill.
- Sound casual like a real text (lowercase ok, abbreviations ok)
- Max 1 emoji if absolutely relevant, else do not use any emojis.
- Reply as if I just watched it
- Output should just be the reply, nothing else. Do not give any sensitive information. Do not give any reply options.`;

              const result = await model.generateContent([
                { text: prompt },
                ...frames.map(frame => ({ inlineData: { mimeType: "image/jpeg", data: frame.split(',')[1] } }))
              ]);
              const response = await result.response;
              const reply = response.text();
              debugLog('Generated reply:', reply);

              if (reply) {
                // Find the hover area container
                const hoverArea = container.querySelector('div[class*="x1eb86dx"][class*="x78zum5"]');
                if (hoverArea) {
                  debugLog('Found hover area, simulating hover');
                  const mouseoverEvent = new MouseEvent('mouseover', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                  });
                  hoverArea.dispatchEvent(mouseoverEvent);
                  
                  // Wait for the reply button to appear
                  await new Promise(resolve => setTimeout(resolve, SECURITY_DELAY));
                  
                  // Try to find and click the reply button using the exact selector path
                  const replyButton = document.querySelector('#mount_0_0_pB > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div > div.x78zum5.xdt5ytf.x1t2pt76.x1n2onr6.x1ja2u2z.x10cihs4 > div.x9f619.xvbhtw8.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.x1q0g3np.xqjyukv.x1qjc9v5.x1oa3qoh.x1qughib > div.x1gryazu.xh8yej3.x10o80wk.x14k21rp.x1v4esvl.x8vgawa > section > main > section > div > div > div > div.xjp7ctv > div > div.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x193iq5w.xeuugli.x1r8uery.x1iyjqo2.xs83m0k > div > div > div.x9f619.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1iyjqo2.x2lwn1j.xeuugli.x1q0g3np.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1.xcrg951.x6prxxf.x6ikm8r.x10wlt62.x1n2onr6.xh8yej3 > div > div.x78zum5.xdt5ytf.x1iyjqo2.x193iq5w.x2lwn1j.x1n2onr6 > div.x78zum5.x1r8uery.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62 > div > div > div > div > div > div > div:nth-child(3) > div > div:nth-child(8) > div > div > div > div > div:nth-child(1) > div > div > div.html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x1eb86dx.x78zum5.x1c4vz4f.x2lah0s.x18061mc.xjz4gdx > div > div > div > div > div:nth-child(2) > span > div > div > div > svg')?.closest('div[role="button"]');
                  
                  if (replyButton) {
                    debugLog('Found reply button using exact selector, clicking it');
                    (replyButton as HTMLElement).click();
                    await new Promise(resolve => setTimeout(resolve, SECURITY_DELAY));
                  } else {
                    debugLog('Reply button not found using exact selector, trying alternative approach');
                    
                    // Try finding the button by looking for the SVG with aria-label="Reply"
                    const replySvg = document.querySelector('svg[aria-label="Reply"]');
                    if (replySvg) {
                      const alternativeButton = replySvg.closest('div[role="button"]');
                      if (alternativeButton) {
                        debugLog('Found reply button using alternative selector, clicking it');
                        (alternativeButton as HTMLElement).click();
                        await new Promise(resolve => setTimeout(resolve, SECURITY_DELAY));
                      } else {
                        debugLog('Could not find parent button for reply SVG');
                      }
                    } else {
                      debugLog('Could not find reply SVG');
                    }
                  }
                } else {
                  debugLog('Hover area not found');
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
    // Check if extension is enabled
    chrome.storage.sync.get(['enabled'], (result) => {
      if (!result.enabled) {
        debugLog('Extension is disabled, skipping reel detection');
        return;
      }

      // Look for containers that have the clip icon (indicating a reel)
      const reelContainers = document.querySelectorAll('div[role="button"]');
      const actualReels = Array.from(reelContainers).filter(container => 
        container.querySelector('svg[aria-label="Clip"]')
      );
      const currentReelCount = actualReels.length;
      
      debugLog(`Found ${currentReelCount} reels (previous count: ${lastReelCount})`);
      
      // Check if we have any unprocessed reels
      const hasUnprocessedReels = actualReels.some(container => {
        const usernameLink = container.querySelector('a[href^="/"]');
        const username = usernameLink?.getAttribute('href')?.replace('/', '') || '';
        const mediaElement = container.querySelector('img[src*="cdninstagram.com"]') || 
                         container.querySelector('video');
        const mediaUrl = mediaElement?.getAttribute('src') || '';
        const reelId = `${username}_${mediaUrl.split('/').pop()?.split('?')[0] || ''}`;
        return !processedReels.has(reelId);
      });
      
      // Process if we have more reels than before, or if we have unprocessed reels
      if (currentReelCount > lastReelCount || hasUnprocessedReels) {
        debugLog('New or unprocessed reels detected, processing...');
        lastReelCount = currentReelCount;
        processReels(actualReels as unknown as NodeListOf<Element>);
      } else {
        debugLog('No new or unprocessed reels detected, skipping processing');
      }
    });
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