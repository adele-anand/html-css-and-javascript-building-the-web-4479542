"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function pad2(num) {
    return (num < 10 ? '0' : '') + num;
}
function callCountdown() {
    if (window.tick)
        clearInterval(window.tick);
    window.tick = setInterval(countdownTimer, 1000);
}
function countdownTimer() {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    let hours = parseInt(hoursElement.textContent || '0', 10);
    let minutes = parseInt(minutesElement.textContent || '0', 10);
    let seconds = parseInt(secondsElement.textContent || '0', 10);
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        alert('Please enter valid numbers for hours, minutes, and seconds.');
        hours = 0;
        minutes = 0;
        seconds = 0;
    }
    const clockDiv = document.getElementsByClassName('clockface');
    if (hours > 0 || minutes > 0 || seconds > 10) {
        for (let i = 0; i < clockDiv.length; i++) {
            clockDiv[i].style.color = getComputedStyle(document.documentElement).getPropertyValue('--text_color');
        }
    }
    if (hours === 0 && minutes === 0 && seconds === 0) {
        clearTimer();
        if (window.tick) {
            clearInterval(window.tick);
            window.tick = undefined;
        }
        return;
    }
    else {
        hoursElement.contentEditable = 'false';
        minutesElement.contentEditable = 'false';
        secondsElement.contentEditable = 'false';
    }
    seconds--;
    if (seconds < 0) {
        seconds = 59;
        minutes--;
        if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
                hours = 0;
                minutes = 0;
                seconds = 0;
            }
        }
    }
    hoursElement.textContent = pad2(hours);
    minutesElement.textContent = pad2(minutes);
    secondsElement.textContent = pad2(seconds);
    if (hours === 0 && minutes === 0 && seconds <= 10) {
        for (let i = 0; i < clockDiv.length; i++) {
            clockDiv[i].style.color = 'red';
        }
    }
}
function clearTimer() {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    hoursElement.textContent = '00';
    minutesElement.textContent = '00';
    secondsElement.textContent = '00';
    const clockDiv = document.getElementsByClassName('clockface');
    for (let i = 0; i < clockDiv.length; i++) {
        clockDiv[i].style.color = getComputedStyle(document.documentElement).getPropertyValue('--text_color');
    }
    hoursElement.contentEditable = 'true';
    minutesElement.contentEditable = 'true';
    secondsElement.contentEditable = 'true';
}
function updateCurrentTime() {
    const now = new Date();
    document.getElementById('display-date').textContent = now.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('display-time').textContent = now.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}
function changeTheme() {
    const body = document.body;
    const themes = ['root', 'theme1', 'theme2', 'theme3'];
    let currentThemeIndex = themes.indexOf(body.className);
    body.classList.remove(themes[currentThemeIndex]);
    body.classList.add(themes[(currentThemeIndex + 1) % themes.length]);
}
