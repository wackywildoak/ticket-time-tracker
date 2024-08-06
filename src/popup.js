function formatTime(totalSeconds) {
	let hours = Math.floor(totalSeconds / 3600);
	let minutes = Math.floor((totalSeconds % 3600) / 60);
	let seconds = Math.floor(totalSeconds % 60);

	hours = String(hours).padStart(2, '0');
	minutes = String(minutes).padStart(2, '0');
	seconds = String(seconds).padStart(2, '0');

	return `${hours}:${minutes}:${seconds}`;
}

function calculateEarnings(totalSeconds, salary, coefficient) {
	// Конвертируем время в часах в рубли по тарифу 600 рублей в час
	// let salary = 13050; // оклад
	let hours = totalSeconds / 3600;
	let earnings = hours * (600 * coefficient) + salary;
	return earnings.toFixed(2); // Округляем до двух знаков после запятой
}

function updateTimer() {
	chrome.storage.sync.get(['startTime', 'totalTime', 'salary', 'coefficient'], function (result) {
		let startTime = result.startTime;
		let totalTime = result.totalTime || 0;
		let salary = result.salary || 0;
		let coefficient = result.coefficient || 1;


		if (startTime) {
			let currentTime = new Date().getTime();
			let elapsedTime = (currentTime - startTime) / 1000; // в секундах
			totalTime += elapsedTime;
		}

		let formattedTime = formatTime(totalTime);
		let earnings = calculateEarnings(totalTime, salary, coefficient);

		document.querySelector('.block-time-content p').textContent = formattedTime;
		document.querySelector('.earnings-content p').textContent = `${earnings} рублей`;
	});
}

function addTime(addTotalTime) {
	chrome.storage.sync.get(['totalTime'], function (result) {
		let totalTime = result.totalTime;

		if (totalTime) {
			console.log(totalTime);
			addTotalTime *= 60;
			addTotalTime += result.totalTime;
			return chrome.storage.sync.set({ totalTime: addTotalTime }); // сохраняем в памяти браузера

		} else {
			addTotalTime *= 60;
			return chrome.storage.sync.set({ totalTime: addTotalTime });
		}
	});
}

function setSalary (addSalary) {
	chrome.storage.sync.get(['salary'], function(result) {
		return chrome.storage.sync.set({ salary: addSalary });
	});
}

function setCoef (coefficient) {
	chrome.storage.sync.get(['coefficient'], function(result) {
		return chrome.storage.sync.set({ coefficient: coefficient });
	});
}

function clearTimer() {
	chrome.storage.sync.remove(['startTime', 'totalTime'], () => {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
		} else {
			console.log('Specified keys cleared from chrome.storage.sync');
		}
	});
}

const customFunctions = {
	addTime: addTime,
	setClear: clearTimer,
	setSalary: setSalary,
	setCoef: setCoef,
};

const inputField = document.getElementById('inputField');

inputField.addEventListener('keydown', (event) => {
	if (event.key == 'Enter') {
		const input = event.target.value.trim();
		console.clear();

		const commands = input.split('/');
		commands.forEach(command => {
			if (command) {
				const [funcName, ...args] = command.trim().split(' ');

				if (funcName in customFunctions) {
					const result = customFunctions[funcName](...args.map(arg => parseFloat(arg)));
				}
			}
		});

		event.target.value = '';
	}
});
let bookButton = document.getElementById('book');
bookButton.addEventListener('click', function () {
	let bookWrapper = document.getElementsByClassName('book-wrapper')[0];
	if (bookWrapper.style.display == "none") {
		bookWrapper.style.display = "block";
	} else {
		bookWrapper.style.display = "none";
	}
});

updateTimer(); // Вызов функции без обертки в DOMContentLoaded

setInterval(updateTimer, 1000); // Обновляем таймер каждую секунду
