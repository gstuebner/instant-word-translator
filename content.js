let dictionary = {};
let isEnabled = true; // Default state

// Tooltip-Element erstellen
const tooltip = document.createElement('div');
tooltip.id = 'translator-tooltip';
document.body.appendChild(tooltip);

// Load initial state
chrome.storage.local.get(['enabled', 'fontSize'], (data) => {
  isEnabled = data.enabled !== false; // Default true if undefined or true
  if (data.fontSize) {
    tooltip.style.fontSize = data.fontSize + 'px';
  } else {
    tooltip.style.fontSize = '14px';
  }
  if (!isEnabled) {
     tooltip.style.display = 'none';
  }
});

// Listen for changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    if (changes.enabled) {
      isEnabled = changes.enabled.newValue === true; // Ensure boolean
      if (!isEnabled) {
        tooltip.style.display = 'none'; // Hide immediately if disabled
      }
    }
    if (changes.fontSize) {
      tooltip.style.fontSize = changes.fontSize.newValue + 'px';
    }
  }
});

let currentRequestWord = null; // Um doppelte Anfragen zu vermeiden

document.addEventListener('mousemove', (e) => {
  try {
    if (!isEnabled) {
      if (tooltip) tooltip.style.display = 'none';
      return;
    }

    // Use caretRangeFromPoint or caretPositionFromPoint (standard)
    let range;
    if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(e.clientX, e.clientY);
    } else if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
      if (pos) {
        range = document.createRange();
        range.setStart(pos.offsetNode, pos.offset);
        range.collapse(true);
      }
    }

    if (!range) {
      if (tooltip) tooltip.style.display = 'none';
      return;
    }

    const node = range.startContainer;
    
    // Safety check: Node muss existieren
    if (!node) {
       if (tooltip) tooltip.style.display = 'none';
       return;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      const offset = range.startOffset;

      // Das Wort unter dem Cursor extrahieren
      const words = text.split(/(\s+)/);
      let currentPos = 0;
      let targetWord = "";

      for (let word of words) {
        if (offset >= currentPos && offset < currentPos + word.length) {
          // Bereinigen
          targetWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase().trim();
          break;
        }
        currentPos += word.length;
      }

      // Wenn kein Wort gefunden oder zu kurz
      if (!targetWord || targetWord.length < 2 || !isNaN(targetWord)) {
        if (tooltip) tooltip.style.display = 'none';
        return;
      }

      // Prüfen ob Tooltip noch im DOM ist, falls Seite ihn gelöscht hat
      if (!document.body.contains(tooltip)) {
         document.body.appendChild(tooltip);
      }

      // Position des Tooltips aktualisieren
      tooltip.style.left = `${e.pageX + 15}px`;
      tooltip.style.top = `${e.pageY + 15}px`;

      // 1. Fall: Wort ist bereits im Wörterbuch (Cache)
      if (dictionary[targetWord]) {
        tooltip.innerText = dictionary[targetWord];
        tooltip.style.display = 'block';
      } 
      // 2. Fall: Wort ist noch unbekannt und wir fragen nicht gerade schon genau dieses Wort ab
      else if (currentRequestWord !== targetWord) {
        // Zeige Lade-Indikator
        tooltip.innerText = "...";
        tooltip.style.display = 'block';
        
        currentRequestWord = targetWord;

        // Anfrage an background.js senden
        chrome.runtime.sendMessage({ action: "translate", word: targetWord }, (response) => {
          // Check runtime error
          if (chrome.runtime.lastError) return;

          if (response && response.translation) {
            dictionary[targetWord] = response.translation;
            if (currentRequestWord === targetWord) {
               tooltip.innerText = response.translation;
            }
          } else {
            dictionary[targetWord] = "[?]"; 
            if (currentRequestWord === targetWord) {
               tooltip.innerText = "[?]";
            }
          }
          if (currentRequestWord === targetWord) currentRequestWord = null;
        });
      }
    } else {
        if (tooltip) tooltip.style.display = 'none';
    }
  } catch (err) {
    // Silent fail to not spam console on complex sites
    // console.error("Translator error:", err);
  }
});
