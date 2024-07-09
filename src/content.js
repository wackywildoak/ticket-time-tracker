// content.js
var changeTextLink = document.querySelector('div.timer-button-holder');
if (changeTextLink) {
    changeTextLink.addEventListener('click', function(event) {
    event.preventDefault(); // Предотвращаем переход по ссылке
    console.log('Link clicked, sending message');
    chrome.runtime.sendMessage({action: 'changeText', newText: 'New Text Changed!'});
    });
}
  