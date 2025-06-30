declare global {
  interface Window {
    tick?: number;
  }
}

function updateCurrentTime(): void{
  const now = new Date();
  document.getElementById('display-date')!.textContent = now.toLocaleString('en-US', 
    {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
  document.getElementById('display-time')!.textContent = now.toLocaleString('en-US', 
    {hour: '2-digit', minute: '2-digit', hour12: true});
}

function callStopWatch(): void {
  if (window.tick) clearInterval(window.tick);
  window.tick = setInterval(measureStopWatch, 1000);
}

function measureStopWatch(): void {
  const hoursElement = document.getElementById('hours') as HTMLHeadingElement;
  const minutesElement = document.getElementById('minutes') as HTMLHeadingElement;
  const secondsElement = document.getElementById('seconds') as HTMLHeadingElement;

  let hours: number = parseInt(hoursElement.textContent || '0', 10);
  let minutes: number = parseInt(minutesElement.textContent || '0', 10);
  let seconds: number = parseInt(secondsElement.textContent || '0', 10);

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

export{};