"use strict";
let selectedDays = [0, 0, 0, 0, 0, 0, 0];
const daysButtons = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
let alarms_list = [];
const themes = ['root', 'theme1', 'theme2', 'theme3', 'theme4', 'theme5'];
let isEditing = false;
const body = document.body;
const nameInput = document.getElementById("alarm-name");
const dateInput = document.getElementById("date");
const hourElem = document.getElementById('hour');
const minuteElem = document.getElementById('minute');
const ampmElem = document.getElementById('ampm');
const nextDisplay = document.getElementById('countdown');
const parentElem = document.getElementById("side-by-side");
const ringDisplay = document.getElementById("timeUp");
let editingAlarm = document.getElementById("alarm0");
const monButton = document.getElementById("Mon");
const tueButton = document.getElementById("Tue");
const wedButton = document.getElementById("Wed");
const thuButton = document.getElementById("Thu");
const friButton = document.getElementById("Fri");
const satButton = document.getElementById("Sat");
const sunButton = document.getElementById("Sun");
const checkbox = document.getElementById("repeat");
const daysDisplay = document.getElementById("days");
let audio = new Audio("./clock-alarm-8761.mp3");
function updatecurrentTime() {
    const now = new Date();
    document.getElementById('display-date').textContent = now.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('display-time').textContent = now.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    let nextAlarm = timeUntilNext(alarms_list[0]);
    nextDisplay.textContent = "Next alarm in " +
        nextAlarm[0].toString() + " days, " + nextAlarm[1].toString() + " hours and " + nextAlarm[2].toString() + " minutes";
    if (nextAlarm[0] == 0 && nextAlarm[1] == 0 && nextAlarm[2] == 0) {
        alarmRing();
    }
    return now;
}
function changetheme() {
    let currentThemeIndex = themes.indexOf(body.className);
    body.classList.remove(themes[currentThemeIndex]);
    body.classList.add(themes[(currentThemeIndex + 1) % themes.length]);
}
function addAlarm() {
    if (isEditing == true) {
        const id = parseInt(editingAlarm.id.replace(/\D/g, ''));
        alarms_list.splice(id, 1);
        isEditing = false;
    }
    let alarm_name = nameInput.value;
    let alarm_days = getDays();
    let alarm_hours = parseInt(hourElem.innerHTML);
    let alarm_minutes = parseInt(minuteElem.innerHTML);
    let alarm_ampm = ampmElem.value;
    let alarm_date = new Date(dateInput.value);
    let alarm = {
        name: alarm_name,
        days: alarm_days,
        date: alarm_date,
        hours: alarm_hours,
        minutes: alarm_minutes,
        ampm: alarm_ampm,
        timeLeft: []
    };
    if (alarm_days.length > 0) {
        alarm.date = getNextDay(alarm);
    }
    alarm.date.setHours(0, 0, 0, 0);
    let alarm_timeLeft = timeUntilNext(alarm);
    alarm.timeLeft = alarm_timeLeft;
    if (alarm_timeLeft[0] <= 0 && alarm_timeLeft[1] <= 0 && alarm_timeLeft[2] <= 0) {
        alert("Alarm time cannot be in the past.");
    }
    else {
        alarms_list.push(alarm);
        localStorage.setItem('stored_alarms', JSON.stringify(alarms_list));
        displayAlarms();
    }
    reset();
}
function getDays() {
    let alarmDays = [];
    let checkboxState = repeatAlarm();
    if (checkboxState) {
        for (let i = 0; i < 7; i++) {
            if (selectedDays[i] % 2 != 0) {
                alarmDays.push(daysButtons[i]);
            }
        }
    }
    return alarmDays;
}
function getNextDay(alarm) {
    let minDiff = 8;
    let date = new Date();
    let now = date.getDay();
    let todayIndex = (now + 6) % 7;
    let dayNames = alarm.days;
    let hours = alarm.hours;
    if (alarm.ampm == "PM" && hours != 12) {
        hours += 12;
    }
    else if (alarm.ampm == "AM" && hours == 12) {
        hours = 0;
    }
    let nowHours = date.getHours();
    let nowMins = date.getMinutes();
    for (let dayName of dayNames) {
        let day = daysButtons.indexOf(dayName);
        let diff = day - todayIndex;
        diff = diff < 0 ? 7 + diff : diff;
        if (diff == 0) {
            if (hours <= nowHours && alarm.minutes <= nowMins) {
                diff += 7;
            }
        }
        if (diff < minDiff) {
            minDiff = diff;
        }
    }
    let nextDay = new Date(date);
    nextDay.setDate(date.getDate() + minDiff);
    nextDay.setHours(0, 0, 0, 0);
    return nextDay;
}
function dayClicked() {
    monButton === null || monButton === void 0 ? void 0 : monButton.addEventListener("click", clicked);
    tueButton === null || tueButton === void 0 ? void 0 : tueButton.addEventListener("click", clicked);
    wedButton === null || wedButton === void 0 ? void 0 : wedButton.addEventListener("click", clicked);
    thuButton === null || thuButton === void 0 ? void 0 : thuButton.addEventListener("click", clicked);
    friButton === null || friButton === void 0 ? void 0 : friButton.addEventListener("click", clicked);
    satButton === null || satButton === void 0 ? void 0 : satButton.addEventListener("click", clicked);
    sunButton === null || sunButton === void 0 ? void 0 : sunButton.addEventListener("click", clicked);
}
function clicked() {
    for (let i = 0; i < 7; i++) {
        if (this.id == daysButtons[i]) {
            selectedDays[i] += 1;
            highlightDay(i);
        }
    }
}
function highlightDay(index) {
    let clickedDay = document.getElementById(daysButtons[index]);
    if (selectedDays[index] % 2 == 0) {
        clickedDay.style.backgroundColor = "white";
        clickedDay.style.color = "black";
    }
    else {
        clickedDay.style.backgroundColor = "black";
        clickedDay.style.color = "white";
    }
}
function displayAlarms() {
    const existing_list = document.getElementById("list_alarms") || null;
    if (existing_list) {
        existing_list.remove();
    }
    alarms_list = JSON.parse(localStorage.getItem('stored_alarms') || '[]');
    sortAlarms();
    const list_alarms = document.createElement("div");
    list_alarms.id = "list_alarms";
    parentElem.append(list_alarms);
    for (let i = 0; i < alarms_list.length; i++) {
        const newAlarm = document.createElement("div");
        newAlarm.className = "newAlarm";
        newAlarm.id = "alarm" + i.toString();
        const newAlarmHeading = document.createElement("div");
        newAlarm.appendChild(newAlarmHeading);
        const newAlarmDetails = document.createElement("div");
        newAlarm.appendChild(newAlarmDetails);
        const newAlarmButtons = document.createElement("div");
        newAlarmDetails.style.justifyContent = "space-between";
        const newAlarmTime = document.createElement("h2");
        let hrs = alarms_list[i].hours;
        let min = alarms_list[i].minutes;
        let timeStr = hrs.toString() + ":" + (min < 10 ? '0' + min : min.toString()) + " " + alarms_list[i].ampm;
        newAlarmTime.textContent = timeStr;
        newAlarmHeading.appendChild(newAlarmTime);
        const newAlarmName = document.createElement("h2");
        newAlarmName.textContent = alarms_list[i].name;
        newAlarmHeading.appendChild(newAlarmName);
        if (alarms_list[i].days.length > 0) {
            const newAlarmDays = document.createElement("p");
            let daysStr = "";
            for (let n = 0; n < alarms_list[i].days.length; n++) {
                daysStr += alarms_list[i].days[n];
                if (n != alarms_list[i].days.length - 1) {
                    daysStr += ", ";
                }
            }
            newAlarmDays.textContent = daysStr;
            newAlarmDetails.appendChild(newAlarmDays);
        }
        else {
            const newAlarmDate = document.createElement("p");
            let alarmAsDate = new Date(alarms_list[i].date);
            newAlarmDate.textContent = alarmAsDate.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            newAlarmDetails.appendChild(newAlarmDate);
        }
        newAlarmDetails.append(newAlarmButtons);
        const editButton = document.createElement("button");
        editButton.textContent = "🖉";
        editButton.title = "Edit";
        editButton.id = "edit" + i.toString();
        editButton === null || editButton === void 0 ? void 0 : editButton.addEventListener('click', clickEdit);
        newAlarmButtons.appendChild(editButton);
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑";
        deleteButton.title = "Delete";
        deleteButton.id = "delete" + i.toString();
        deleteButton === null || deleteButton === void 0 ? void 0 : deleteButton.addEventListener('click', clickDelete);
        newAlarmButtons.appendChild(deleteButton);
        list_alarms.append(newAlarm);
    }
}
function sortAlarms() {
    alarms_list.sort((a, b) => a.timeLeft[0] - b.timeLeft[0] || a.timeLeft[1] - b.timeLeft[1]
        || a.timeLeft[2] - b.timeLeft[2]);
}
function timeUntilNext(nextAlarm) {
    let alarmDate = new Date(nextAlarm.date);
    let hour = nextAlarm.hours % 12 + (nextAlarm.ampm === "PM" ? 12 : 0);
    alarmDate.setHours(hour, nextAlarm.minutes + 1, 0, 0);
    let now = new Date();
    let diffMs = alarmDate.getTime() - now.getTime();
    if (diffMs < 0 && nextAlarm.days.length > 0) {
        alarmDate.setDate(alarmDate.getDate() + 7);
        diffMs = alarmDate.getTime() - now.getTime();
    }
    let days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    let hours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    let minutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
    return [days, hours, minutes];
}
function clickEdit() {
    let num = parseInt(this.id.replace(/\D/g, ''));
    editAlarm(num);
}
function editAlarm(id) {
    isEditing = true;
    const alarmDivs = document.getElementsByClassName("newAlarm");
    for (const div of alarmDivs) {
        div.style.outline = "none";
    }
    editingAlarm = document.getElementById("alarm" + id.toString());
    if (themes.indexOf(body.className) % 2 == 0) {
        editingAlarm.style.outline = "black solid 4px";
    }
    else {
        editingAlarm.style.outline = "white solid 4px";
    }
    nameInput.value = alarms_list[id].name;
    hourElem.textContent = alarms_list[id].hours.toString();
    let min = alarms_list[id].minutes;
    minuteElem.textContent = (min < 10 ? '0' + min : min.toString());
    ampmElem.value = alarms_list[id].ampm;
    if (alarms_list[id].days.length > 0) {
        checkbox.checked = true;
        selectedDays = [0, 0, 0, 0, 0, 0, 0];
        for (let day = 0; day < 7; day++) {
            for (let i = 0; i < alarms_list[id].days.length; i++) {
                if (alarms_list[id].days[i] == daysButtons[day]) {
                    selectedDays[day] = 1;
                }
                highlightDay(day);
            }
        }
        repeatAlarm();
    }
    else {
        let date = alarms_list[id].date;
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }
        dateInput.value = `${year}-${month}-${day}`;
    }
}
function clickDelete() {
    let id = parseInt(this.id.replace(/\D/g, ''));
    const deletedAlarm = document.getElementById("alarm" + id.toString());
    deleteAlarm(deletedAlarm);
}
function deleteAlarm(alarmToDelete) {
    let id = parseInt(alarmToDelete.id.replace(/\D/g, ''));
    alarms_list.splice(id, 1);
    localStorage.setItem('stored_alarms', JSON.stringify(alarms_list));
    displayAlarms();
}
function reset() {
    hourElem.textContent = "6";
    minuteElem.textContent = "00";
    ampmElem.value = "AM";
    nameInput.value = "";
    checkbox.checked = false;
    repeatAlarm();
    let today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    let tomorrow = day + 1;
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    dateInput.value = `${year}-${month}-${tomorrow}`;
    dateInput.min = `${year}-${month}-${day}`;
    selectedDays = [0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 7; i++) {
        highlightDay(i);
    }
}
function repeatAlarm() {
    if (checkbox.checked == true) {
        daysDisplay.style.display = "flex";
        dateInput.style.display = "none";
    }
    else {
        daysDisplay.style.display = "none";
        dateInput.style.display = "block";
    }
    return checkbox.checked;
}
function alarmRing() {
    audio.loop = true;
    audio.play();
    parentElem.style.display = "none";
    ringDisplay.style.display = "block";
}
function stopRing() {
    parentElem.style.display = "flex";
    ringDisplay.style.display = "none";
    audio.pause();
    audio.currentTime = 0;
    if (alarms_list[0].days.length == 0) {
        alarms_list.splice(0, 1);
        localStorage.setItem('stored_alarms', JSON.stringify(alarms_list));
        displayAlarms();
    }
    else {
        editAlarm(0);
        addAlarm();
    }
}
