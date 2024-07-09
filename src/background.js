// background.js
let lastMessage = {};

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log('Message received in background.js:', message);
  if (message.action === 'changeText') {
    lastMessage = {action: 'updatePopupText', newText: message.newText};
    chrome.runtime.sendMessage(lastMessage);
  } else if (message.action === 'getLastMessage') {
    sendResponse(lastMessage);
  }
});
