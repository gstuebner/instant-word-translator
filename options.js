// Optionen speichern
function saveOptions() {
  const sourceLang = document.getElementById('sourceLang').value;
  const targetLang = document.getElementById('targetLang').value;
  const fontSize = document.getElementById('fontSize').value;

  chrome.storage.local.set({
    sourceLang: sourceLang,
    targetLang: targetLang,
    fontSize: fontSize
  }, () => {
    // Status anzeigen
    const status = document.getElementById('status');
    status.textContent = 'Einstellungen gespeichert.';
    setTimeout(() => {
      status.textContent = '';
    }, 1500);
  });
}

// Optionen wiederherstellen
function restoreOptions() {
  chrome.storage.local.get({
    sourceLang: 'en', // Standardwert
    targetLang: 'de', // Standardwert
    fontSize: '14'    // Standardwert
  }, (items) => {
    document.getElementById('sourceLang').value = items.sourceLang;
    document.getElementById('targetLang').value = items.targetLang;
    document.getElementById('fontSize').value = items.fontSize;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('sourceLang').addEventListener('change', saveOptions);
document.getElementById('targetLang').addEventListener('change', saveOptions);
document.getElementById('fontSize').addEventListener('change', saveOptions);
