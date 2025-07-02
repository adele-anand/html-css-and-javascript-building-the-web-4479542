interface Window {
  tick?: number;
}

let shouldClearOnStart = false;

function updateCurrentTime(): void{
  const now = new Date();
  document.getElementById('display-date')!.textContent = now.toLocaleString('en-US', 
    {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
  document.getElementById('display-time')!.textContent = now.toLocaleString('en-US', 
    {hour: '2-digit', minute: '2-digit', hour12: true});
}

function callStopWatch(): void {
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

function measureStopWatch(): void {
  const hoursElement = document.getElementById('hours') as HTMLHeadingElement;
  const minutesElement = document.getElementById('minutes') as HTMLHeadingElement;
  const secondsElement = document.getElementById('seconds') as HTMLHeadingElement;
  const millisecondsElement = document.getElementById('milliseconds') as HTMLHeadingElement;

  let hours: number = parseInt(hoursElement.textContent || '0', 10);
  let minutes: number = parseInt(minutesElement.textContent || '0', 10);
  let seconds: number = parseInt(secondsElement.textContent || '0', 10);
  let milliseconds: number = parseInt(millisecondsElement.textContent || '0', 10)

  milliseconds++;
  if (milliseconds >= 100){
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

function pad2(num: number): string {
  return num < 10 ? '0' + num : num.toString();
}

function clearTimer(): void{
  const hoursElement = document.getElementById('hours') as HTMLHeadingElement;
  const minutesElement = document.getElementById('minutes') as HTMLHeadingElement;
  const secondsElement = document.getElementById('seconds') as HTMLHeadingElement;
  const millisecondsElement = document.getElementById('milliseconds') as HTMLHeadingElement;

  hoursElement.textContent = '00';
  minutesElement.textContent = '00';
  secondsElement.textContent = '00';
  millisecondsElement.textContent = '00';
}

function stopStopWatch(): void {
  if (window.tick) {
    clearInterval(window.tick);
    window.tick = undefined;
  }
  shouldClearOnStart = true;
}

function changeTheme(): void {
  const body = document.body;
  const themes = ['root', 'theme1', 'theme2', 'theme3'];
  let currentThemeIndex = themes.indexOf(body.className);
  body.classList.remove(themes[currentThemeIndex]);
  body.classList.add(themes[(currentThemeIndex + 1) % themes.length]);
}