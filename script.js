console.log(`hello`)

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
document.querySelector('.system-button').addEventListener('click', function() {
    const statusElement = this.querySelector('.system-status');
    const currentStatus = statusElement.textContent;
    
    if (currentStatus === 'OFF') {
        statusElement.textContent = 'COOLING';
        this.className = 'system-button cooling-cooling'; 
    } else if (currentStatus === 'COOLING') {
        statusElement.textContent = 'HEATING';
        this.className = 'system-button cooling-heating'; 
    } else {
        statusElement.textContent = 'OFF';
        this.className = 'system-button cooling-off'; 
    }
});

document.querySelector('.fan-button').addEventListener('click', function() {
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
    let currentTemp = parseInt(tempElement.textContent.replace('°C', ''));
    currentTemp += change;
    tempElement.textContent = currentTemp + '°C';
}

document.querySelectorAll('.spec-con').forEach(function(container) {
    container.querySelector('.decrease-temp').addEventListener('click', function() {
        updateTemperature(container, -1); 
    });

    container.querySelector('.increase-temp').addEventListener('click', function() {
        updateTemperature(container, 1);
    });
});

