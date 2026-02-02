// Funktion zum Aktualisieren des Icons
function updateIcon(isEnabled) {
  const iconName = isEnabled ? "icon-on" : "icon-off";
  chrome.action.setIcon({
    path: {
      "16": `${iconName}-16.png`,
      "48": `${iconName}-48.png`,
      "128": `${iconName}-128.png`
    }
  });
}

// Initialer Check beim Start
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get('enabled', (data) => {
    const isEnabled = data.enabled !== false;
    updateIcon(isEnabled);
  });
});

// Auch beim Installieren/Update einmal setzen
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('enabled', (data) => {
    // Initialize storage if not set
    if (data.enabled === undefined) {
      chrome.storage.local.set({ enabled: true });
    }
    const isEnabled = data.enabled !== false;
    updateIcon(isEnabled);
  });
});

// Direkter Toggle bei Klick auf das Browser-Icon
chrome.action.onClicked.addListener(() => {
  chrome.storage.local.get('enabled', (data) => {
    const newState = data.enabled === false;
    chrome.storage.local.set({ enabled: newState }, () => {
      updateIcon(newState);
    });
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translate") {
    const word = request.word;

    chrome.storage.local.get({
      sourceLang: 'en',
      targetLang: 'de'
    }, (items) => {
      const sl = items.sourceLang;
      const tl = items.targetLang;
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(word)}`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          // Die API gibt eine verschachtelte Struktur zurück.
          // data[0][0][0] ist meistens die Übersetzung.
          if (data && data[0] && data[0][0] && data[0][0][0]) {
            sendResponse({ translation: data[0][0][0] });
          } else {
            sendResponse({ translation: null });
          }
        })
        .catch(error => {
          console.error("Translation error:", error);
          sendResponse({ translation: null });
        });
    });

    return true; // Wichtig: Signalisiert, dass sendResponse asynchron aufgerufen wird
  }
});
