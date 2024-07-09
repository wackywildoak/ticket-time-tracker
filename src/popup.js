// popup.js
  chrome.runtime.sendMessage({action: 'getLastMessage'}, function(response) {
    if (response && response.newText) {
      document.getElementById('textToChange').textContent = response.newText;
    }
  });

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log('Message received in popup.js:', message);
    if (message.action === 'updatePopupText') {
      const textElement = document.getElementById('textToChange');
      if (textElement) {
        textElement.textContent = message.newText;
      }
    }
  });

