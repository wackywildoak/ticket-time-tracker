function formatTime(totalSeconds) {
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = Math.floor(totalSeconds % 60);

    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

function startTimer() {
    let startTime = new Date().getTime();
    console.log('Таймер запущен:', startTime);
    chrome.storage.sync.set({ startTime: startTime });
}

function stopTimer() {
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