import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import styles from './styles.module.css';

const Popup: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    // Load saved settings
    chrome.storage.sync.get(['enabled', 'apiKey'], (result) => {
      setEnabled(result.enabled || false);
      setApiKey(result.apiKey || '');
    });
  }, []);

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    chrome.storage.sync.set({ enabled: newEnabled }, () => {
      setSaveStatus('Settings saved!');
      setTimeout(() => setSaveStatus(''), 2000);
    });
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleSave = () => {
    chrome.storage.sync.set({ apiKey }, () => {
      setSaveStatus('API key saved!');
      setTimeout(() => setSaveStatus(''), 2000);
    });
  };

  return (
    <div className={styles.popupContainer}>
      <h1 className={styles.title}>Instagram Reels Auto-Reply</h1>
      <div className={styles.toggleContainer}>
        <label className={styles.toggleLabel}>Enable Auto-Reply</label>
        <label className={styles.toggleSwitch}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={handleToggle}
          />
          <span className={styles.slider} />
        </label>
      </div>
      <input
        className={styles.input}
        type="password"
        placeholder="Enter Google Gemini API Key"
        value={apiKey}
        onChange={handleApiKeyChange}
      />
      <button className={styles.button} onClick={handleSave}>
        Save Settings
      </button>
      {saveStatus && <p className={styles.saveStatus}>{saveStatus}</p>}
      <p className={styles.infoText}>
        Get your API key from the Google AI Studio: https://makersuite.google.com/app/apikey
      </p>
    </div>
  );
};

// Use the new React 18 createRoot API
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
} 