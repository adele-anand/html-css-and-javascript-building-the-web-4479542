declare global {
  interface Window {
    tick?: number;
  }
}

function pad2(num: number): string {
  return (num < 10 ? '0' : '') + num;
}

function callCountdown(): void {
  if (window.tick) clearInterval(window.tick);
  window.tick = setInterval(countdownTimer, 1000);
}

function countdownTimer(): void {
  const hoursElement = document.getElementById('hours') as HTMLHeadingElement;
  const minutesElement = document.getElementById('minutes') as HTMLHeadingElement;
  const secondsElement = document.getElementById('seconds') as HTMLHeadingElement;

  let hours: number = parseInt(hoursElement.textContent || '0', 10);
  let minutes: number = parseInt(minutesElement.textContent || '0', 10);
  let seconds: number = parseInt(secondsElement.textContent || '0', 10);

  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    alert('Please enter valid numbers for hours, minutes, and seconds.');
    hours = 0;
    minutes = 0;
    seconds = 0;
  }
  const clockDiv = document.getElementsByClassName('clockface');
  if (hours > 0 || minutes > 0 || seconds > 10) {
    for (let i = 0; i < clockDiv.length; i++) {
      (clockDiv[i] as HTMLElement).style.color = getComputedStyle(document.documentElement).getPropertyValue('--text_color');
    }
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

  if (hours === 0 && minutes === 0 && seconds === 0) {
    const audio = new Audio("./clock-alarm-8761.mp3")
    audio.play();
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

  hoursElement.textContent = pad2(hours);
  minutesElement.textContent = pad2(minutes);
  secondsElement.textContent = pad2(seconds);

  if (hours === 0 && minutes === 0 && seconds <= 10) {
    for (let i = 0; i < clockDiv.length; i++) {
      (clockDiv[i] as HTMLElement).style.color = 'red';
    }
  }
}

function clearTimer(): void{
  const hoursElement = document.getElementById('hours') as HTMLHeadingElement;
  const minutesElement = document.getElementById('minutes') as HTMLHeadingElement;
  const secondsElement = document.getElementById('seconds') as HTMLHeadingElement;

  hoursElement.textContent = '00';
  minutesElement.textContent = '00';
  secondsElement.textContent = '00';

  const clockDiv = document.getElementsByClassName('clockface');
  for (let i = 0; i < clockDiv.length; i++) {
    (clockDiv[i] as HTMLElement).style.color = getComputedStyle(document.documentElement).getPropertyValue('--text_color');
  }
  
  hoursElement.contentEditable = 'true';
  minutesElement.contentEditable = 'true';
  secondsElement.contentEditable = 'true';
}

function updateCurrentTime(): void{
  const now = new Date();
  document.getElementById('display-date')!.textContent = now.toLocaleString('en-US', 
    {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
  document.getElementById('display-time')!.textContent = now.toLocaleString('en-US', 
    {hour: '2-digit', minute: '2-digit', hour12: true});
}

function changeTheme(): void {
  const body = document.body;
  const themes = ['root', 'theme1', 'theme2', 'theme3'];
  let currentThemeIndex = themes.indexOf(body.className);
  body.classList.remove(themes[currentThemeIndex]);
  body.classList.add(themes[(currentThemeIndex + 1) % themes.length]);
}

export{};