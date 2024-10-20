console.log(`test`)

let systemStatus = 'OFF';

// function for conversion C -> F, F -> C
const tempSwitchButton = document.getElementById('temp-switch-button');
const tempElements = document.querySelectorAll('.comp-func');

function celsiusToFahrenheit(celsius) {
    return Math.round((celsius * 9 / 5) + 32);
}

function fahrenheitToCelsius(fahrenheit) {
    return Math.round((fahrenheit - 32) * 5 / 9);
}

tempSwitchButton.addEventListener('click', function () {
    const isCelsiusMode = this.textContent === '°C';
    this.textContent = isCelsiusMode ? '°F' : '°C';

    tempElements.forEach(function (tempElement) {
        const degreeSpan = tempElement.querySelector('#inside-celsius');
        let tempValue;

        if (degreeSpan) {
            tempValue = parseInt(tempElement.childNodes[0].nodeValue.trim());
        } else {
            tempValue = parseInt(tempElement.textContent.trim());
        }

        if (isCelsiusMode) {
            const newTemp = celsiusToFahrenheit(tempValue);
            if (degreeSpan) {
                tempElement.innerHTML = `${newTemp}<span id="inside-celsius">°F</span>`;
            } else {
                tempElement.textContent = `${newTemp}°F`;
            }
        } else {
            const newTemp = fahrenheitToCelsius(tempValue);
            if (degreeSpan) {
                tempElement.innerHTML = `${newTemp}<span id="inside-celsius">°C</span>`;
            } else {
                tempElement.textContent = `${newTemp}°C`;
            }
        }
    });

    const insideTemp = document.querySelector('#inside-temp');
    if (insideTemp) {
        let insideTempValue = parseInt(insideTemp.childNodes[0].nodeValue.trim());
        if (isCelsiusMode) {
            const newInsideTemp = celsiusToFahrenheit(insideTempValue);
            insideTemp.innerHTML = `${newInsideTemp}<span id="inside-celsius">°F</span>`;
        } else {
            const newInsideTemp = fahrenheitToCelsius(insideTempValue);
            insideTemp.innerHTML = `${newInsideTemp}<span id="inside-celsius">°C</span>`;
        }
    }
});



// for time
function updateTime() {
    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    document.getElementById('current-time').innerHTML = `${hours}:${minutes}:<span id="current-seconds">${seconds}</span> ${ampm}`;
    const formattedDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    document.getElementById('current-date').textContent = formattedDate;
}

setInterval(updateTime, 1000);
updateTime();


// for system controls
document.querySelector('.system-button').addEventListener('click', function () {
    const statusElement = this.querySelector('.system-status');
    const currentStatus = statusElement.textContent;

    if (currentStatus === 'OFF') {
        statusElement.textContent = 'COOLING';
        systemStatus = 'COOLING';
        this.className = 'system-button cooling-cooling';
    } else if (currentStatus === 'COOLING') {
        statusElement.textContent = 'HEATING';
        systemStatus = 'HEATING';
        this.className = 'system-button cooling-heating';
    } else {
        statusElement.textContent = 'OFF';
        systemStatus = 'OFF';
        this.className = 'system-button cooling-off';
    }
    updateSimulation();
});

document.querySelector('.fan-button').addEventListener('click', function () {
    const statusElement = this.querySelector('.system-status');
    const currentStatus = statusElement.textContent;

    if (currentStatus === 'OFF') {
        statusElement.textContent = 'ON';
        this.className = 'fan-button fan-on';
    } else if (currentStatus === 'ON') {
        statusElement.textContent = 'AUTO';
        this.className = 'fan-button fan-auto';
    } else {
        statusElement.textContent = 'OFF';
        this.className = 'fan-button fan-off';
    }
});

// for specific control system
function updateTemperature(container, change) {
    const tempElement = container.querySelector('.spec-con-temp');
    let currentTemp = parseInt(tempElement.textContent);
    const isCelsius = tempElement.textContent.includes('°C');

    currentTemp += change;
    if (isCelsius) {
        tempElement.textContent = currentTemp + '°C';
    } else {
        tempElement.textContent = currentTemp + '°F';
    }
}

document.querySelectorAll('.spec-con').forEach(function (container) {
    container.querySelector('.decrease-temp').addEventListener('click', function () {
        updateTemperature(container, -1);
    });

    container.querySelector('.increase-temp').addEventListener('click', function () {
        updateTemperature(container, 1);
    });
});

//fetch current outside temp
const apiKey = '127ad69f71a90ab67d887d632c5283fd';
const city = 'City of Digos';
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},PH&appid=${apiKey}&units=metric`;


function fetchTemperature() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            let temperature = data.main.temp;
            roundedTemp = Math.round(temperature);
            document.querySelector('#outside-temp-text').textContent = `${roundedTemp}°C`;

            const insideTempElement = document.querySelector('#inside-temp');
            insideTempElement.innerHTML = `${roundedTemp}<span id="inside-celsius">°C</span>`;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('outside-temp').textContent = 'Err';
        });
}

fetchTemperature();
setInterval(fetchTemperature, 3600000);

// for calendar
const days = document.querySelectorAll('.calendar-days');
days.forEach(day => {
    day.addEventListener('click', function () {
        days.forEach(d => d.classList.remove('current-day'));
        this.classList.add('current-day');
    });
});


// For simulation

function updateSimulation() {
    clearInterval(window.simulationInterval);
    if (systemStatus === 'OFF') {
        window.simulationInterval = setInterval(simulationOff, 10000);
    } else {
        console.log('status on')
        window.simulationInterval = setInterval(simulationOn, 5000);
    }
}

function simulationOff() {
    const insideTempElementSim = document.querySelector('#inside-temp');
    const currentTemp = parseInt(insideTempElementSim.textContent);

    insideTempElementSim.innerHTML = `${currentTemp - 1}<span id="inside-celsius">°C</span>`;
}

function simulationOn() {
    const insideTempElementSim = document.querySelector('#inside-temp');
    const currentTemp = parseInt(insideTempElementSim.textContent);

    if (systemStatus === 'COOLING') {
        insideTempElementSim.innerHTML = `${currentTemp - 1}<span id="inside-celsius">°C</span>`;
    } else if (systemStatus === 'HEATING') {
        insideTempElementSim.innerHTML = `${currentTemp + 1}<span id="inside-celsius">°C</span>`;
    }
}

updateSimulation();

//custom cursor
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', e => {
    cursor.setAttribute("style", "top: " + (e.pageY - 10) + "px; left: " + (e.pageX - 10) + "px;")
})
