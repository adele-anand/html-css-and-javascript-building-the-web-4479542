var shouldClearOnStart = false;
function updateCurrentTime() {
    var now = new Date();
    document.getElementById('display-date').textContent = now.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('display-time').textContent = now.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}
function callStopWatch() {
    if (window.tick) {
        clearInterval(window.tick);
        window.tick = undefined;
    }
    if (shouldClearOnStart) {
        clearTimer();
        shouldClearOnStart = false;
    }
    window.tick = setInterval(measureStopWatch, 10);
}
function measureStopWatch() {
    var hoursElement = document.getElementById('hours');
    var minutesElement = document.getElementById('minutes');
    var secondsElement = document.getElementById('seconds');
    var millisecondsElement = document.getElementById('milliseconds');
    var hours = parseInt(hoursElement.textContent || '0', 10);
    var minutes = parseInt(minutesElement.textContent || '0', 10);
    var seconds = parseInt(secondsElement.textContent || '0', 10);
    var milliseconds = parseInt(millisecondsElement.textContent || '0', 10);
    milliseconds++;
    if (milliseconds >= 100) {
        milliseconds = 0;
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
                hours++;
            }
        }
    }
    hoursElement.textContent = pad2(hours);
    minutesElement.textContent = pad2(minutes);
    secondsElement.textContent = pad2(seconds);
    millisecondsElement.textContent = pad2(milliseconds);
}
function pad2(num) {
    return num < 10 ? '0' + num : num.toString();
}
function clearTimer() {
    var hoursElement = document.getElementById('hours');
    var minutesElement = document.getElementById('minutes');
    var secondsElement = document.getElementById('seconds');
    var millisecondsElement = document.getElementById('milliseconds');
    hoursElement.textContent = '00';
    minutesElement.textContent = '00';
    secondsElement.textContent = '00';
    millisecondsElement.textContent = '00';
}
function stopStopWatch() {
    if (window.tick) {
        clearInterval(window.tick);
        window.tick = undefined;
    }
    shouldClearOnStart = true;
}
function changeTheme() {
    var body = document.body;
    var themes = ['root', 'theme1', 'theme2', 'theme3'];
    var currentThemeIndex = themes.indexOf(body.className);
    body.classList.remove(themes[currentThemeIndex]);
    body.classList.add(themes[(currentThemeIndex + 1) % themes.length]);
}
