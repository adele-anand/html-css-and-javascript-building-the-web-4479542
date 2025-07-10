"use strict";
let selectedDays = [0, 0, 0, 0, 0, 0, 0];
const daysButtons = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
let alarms_list = [];
const themes = ['root', 'theme1', 'theme2', 'theme3'];
let isEditing = false;
const body = document.body;
const nameInput = document.getElementById("alarm-name");
const dateInput = document.getElementById("date");
const hourElem = document.getElementById('hour');
const minuteElem = document.getElementById('minute');
const ampmElem = document.getElementById('ampm');
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
function updatecurrentTime() {
    const now = new Date();
    document.getElementById('display-date').textContent = now.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('display-time').textContent = now.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    return now;
}
function changetheme() {
    let currentThemeIndex = themes.indexOf(body.className);
    body.classList.remove(themes[currentThemeIndex]);
    body.classList.add(themes[(currentThemeIndex + 1) % themes.length]);
}
function addAlarm() {
    if (isEditing == true) {
        deleteAlarm(editingAlarm);
    }
    isEditing = false;
    let alarm_name = nameInput.value;
    let alarm_days = getDays();
    let alarm_date = new Date(dateInput.value);
    if (alarm_days.length > 0) {
        alarm_date = getNextDay(alarm_days);
    }
    let alarm_hours = parseInt(hourElem.innerHTML);
    let alarm_minutes = parseInt(minuteElem.innerHTML);
    let alarm_ampm = ampmElem.value;
    let alarm = {
        name: alarm_name,
        days: alarm_days,
        date: alarm_date,
        hours: alarm_hours,
        minutes: alarm_minutes,
        ampm: alarm_ampm
    };
    alarms_list.push(alarm);
    displayAlarms();
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
function getNextDay(dayNames) {
    let minDiff = 8;
    let date = new Date();
    let now = date.getDay();
    for (let dayName of dayNames) {
        let day = daysButtons.indexOf(dayName);
        let diff = day - now;
        diff = diff < 1 ? 7 + diff : diff;
        if (diff < minDiff) {
            minDiff = diff;
        }
    }
    let nextDayTimestamp = new Date(date.getTime() + (1000 * 60 * 60 * 30 * minDiff));
    alert(nextDayTimestamp);
    return nextDayTimestamp;
}
;
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
    sortAlarms();
    const parentElem = document.getElementById("side-by-side");
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
        editButton === null || editButton === void 0 ? void 0 : editButton.addEventListener('click', editAlarm);
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
    alarms_list.sort((a, b) => a.date.getTime() - b.date.getTime() || a.ampm.localeCompare(b.ampm)
        || a.hours - b.hours || a.minutes - b.minutes);
}
function editAlarm() {
    isEditing = true;
    let id = parseInt(this.id.replace(/\D/g, ''));
    const alarmDivs = document.getElementsByClassName("newAlarm");
    for (const div of alarmDivs) {
        div.style.outline = "none";
    }
    const editingAlarm = document.getElementById("alarm" + id.toString());
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
        dateInput.value = alarms_list[id].date.toString();
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
    displayAlarms();
}
function reset() {
    hourElem.textContent = "6";
    minuteElem.textContent = "00";
    nameInput.value = "";
    checkbox.checked = false;
    repeatAlarm();
    let today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    dateInput.value = `${year}-${month}-${day}`;
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
