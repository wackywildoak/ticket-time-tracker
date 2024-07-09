function formatTime(totalSeconds) {
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = Math.floor(totalSeconds % 60);

  hours = String(hours).padStart(2, '0');
  minutes = String(minutes).padStart(2, '0');
  seconds = String(seconds).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get(['totalTime'], function(result) {
      let totalTime = result.totalTime || 0;
      let formattedTime = formatTime(totalTime);
      document.querySelector('.block-time-content p').textContent = formattedTime;
  });
});