"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function updateCurrentTime() {
    var now = new Date();
    document.getElementById('display-date').textContent = now.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('display-time').textContent = now.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}
function callStopWatch() {
    if (window.tick)
        clearInterval(window.tick);
    window.tick = setInterval(measureStopWatch, 1000);
}
function measureStopWatch() {
    var hoursElement = document.getElementById('hours');
    var minutesElement = document.getElementById('minutes');
    var secondsElement = document.getElementById('seconds');
    var hours = parseInt(hoursElement.textContent || '0', 10);
    var minutes = parseInt(minutesElement.textContent || '0', 10);
    var seconds = parseInt(secondsElement.textContent || '0', 10);
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes < 59) {
            minutes = 0;
            hours++;
        }
    }
}
