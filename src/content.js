function startTimer() { // стартуем таймер
    let startTime = new Date().getTime(); // получаем начало таймера
    console.log('Таймер запущен:', startTime);
    chrome.storage.sync.set({ startTime: startTime }); // сохраняем в памяти браузера
}

function stopTimer() { // остановили таймер
    chrome.storage.sync.get(['startTime'], function(result) {
        let startTime = result.startTime;
        if (startTime) {
            let endTime = new Date().getTime();
            let elapsedTime = (endTime - startTime) / 1000; // в секундах

            chrome.storage.sync.get(['totalTime'], function(result) {
                let totalTime = result.totalTime || 0;
                totalTime += elapsedTime;

                chrome.storage.sync.set({ 
                    elapsedTime: elapsedTime,
                    totalTime: totalTime 
                }, function() {
                    console.log('Таймер остановлен:', endTime);
                    console.log('Прошедшее время в секундах:', elapsedTime);
                    console.log('Общее время в секундах:', totalTime);

                    chrome.storage.sync.remove('startTime'); // удаляем startTime после остановки
                });
            });
        } else {
            console.log('Таймер не был запущен.');
        }
    });
}

let timerButton = document.querySelector('div.timer-button-holder');

let timerExists = document.getElementsByClassName('timer')[0];

timerButton.addEventListener("click", function () {
    if (timerExists.classList.contains('start')) {
        startTimer();
    } else {
        stopTimer();
    }
});

const widgetHtml = `
  <div id="ticket-time-tracker-widget" class="main-content__widget">
      <div class="block-time__widget">
        <div class="block-time-content">
          <p>00:00:00</p>
        </div>
        <div class="block-time-content earnings-content">
          <p>00:00:00</p>
        </div>
      </div>
    <button id="close-widget">✖</button>
  </div>
`;

const widgetContainer = document.createElement('div');
widgetContainer.innerHTML = widgetHtml;
document.body.appendChild(widgetContainer);

// Добавим стили для виджета
const widgetStyles = `
  .main-content__widget {
    position: fixed;
    bottom: 0;
    right: 95px;
    width: 240px;
    background-color: rgba(0, 0, 0, 0.6);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    z-index: 10000;
    padding-top: 20px;
    color: black;
  }
  #close-widget {
    position: absolute;
    top: 5px;
    right: 5px;
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: white;
  }
  .block-time-content p{
    color: white;
    margin-right: 20px;
  }
  .block-time__widget {
    display: flex;
    justify-content: center;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = widgetStyles;
document.head.appendChild(styleSheet);

document.getElementById('close-widget').addEventListener('click', () => {
  document.getElementById('ticket-time-tracker-widget').style.display = 'none';
});

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
    return earnings.toFixed(0); // Округляем до двух знаков после запятой
  }
  
  function updateTimer() { // обновляем данные в виджете 
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
  