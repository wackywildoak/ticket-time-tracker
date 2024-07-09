function formatTime(totalSeconds) {
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = Math.floor(totalSeconds % 60);

  hours = String(hours).padStart(2, '0');
  minutes = String(minutes).padStart(2, '0');
  seconds = String(seconds).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

function calculateEarnings(totalSeconds) {
  // Конвертируем время в часах в рубли по тарифу 600 рублей в час
  let hours = totalSeconds / 3600;
  let earnings = hours * 600;
  return earnings.toFixed(2); // Округляем до двух знаков после запятой
}

function updateTimer() {
  chrome.storage.sync.get(['startTime', 'totalTime'], function(result) {
      let startTime = result.startTime;
      let totalTime = result.totalTime || 0;

      if (startTime) {
          let currentTime = new Date().getTime();
          let elapsedTime = (currentTime - startTime) / 1000; // в секундах
          totalTime += elapsedTime;
      }

      let formattedTime = formatTime(totalTime);
      let earnings = calculateEarnings(totalTime);

      document.querySelector('.block-time-content p').textContent = formattedTime;
      document.querySelector('.earnings-content p').textContent = `${earnings} рублей`;
  });
}

updateTimer(); // Вызов функции без обертки в DOMContentLoaded

setInterval(updateTimer, 1000); // Обновляем таймер каждую секунду
