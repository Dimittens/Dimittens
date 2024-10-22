const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper"),
  addEventCloseBtn = document.querySelector(".close"),
  addEventNote = document.querySelector(".event-note"),
  addEventFrom = document.querySelector(".event-time-from"),
  addEventTo = document.querySelector(".event-time-to"),
  addEventSubmit = document.querySelector(".add-event-btn");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const eventsArr = [];
getEvents();

function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = `${months[month]} ${year}`;

  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    let event = eventsArr.some(eventObj =>
      eventObj.day === i && eventObj.month === month + 1 && eventObj.year === year
    );

    if (i === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      days += event ? `<div class="day today active event">${i}</div>` :
                      `<div class="day today active">${i}</div>`;
    } else {
      days += event ? `<div class="day event">${i}</div>` :
                      `<div class="day">${i}</div>`;
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;
  addListeners();
}

function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

function addListeners() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      activeDay = Number(e.target.innerHTML);
      getActiveDay(activeDay);
      updateEvents(activeDay);
      days.forEach((d) => d.classList.remove("active"));
      e.target.classList.add("active");
    });
  });
}

function getActiveDay(day) {
  const selectedDay = new Date(year, month, day);
  const dayName = selectedDay.toLocaleDateString("pt-BR", { weekday: "long" });
  eventDay.innerHTML = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  eventDate.innerHTML = `${day} ${months[month]} ${year}`;
}

function updateEvents(day) {
  let events = "";
  eventsArr.forEach((eventObj) => {
    if (eventObj.day === day && eventObj.month === month + 1 && eventObj.year === year) {
      eventObj.events.forEach((event) => {
        const [from, to] = event.time.split(" - ");
        events += `<div class="event">
          <div class="title">
            <h3>${event.note}</h3>
          </div>
          <div class="time">${formatTime(from)} - ${formatTime(to)}</div>
        </div>`;
      });
    }
  });

  eventsContainer.innerHTML = events || `<div class="no-event">Sem Eventos</div>`;
}

addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

addEventSubmit.addEventListener("click", (e) => {
  e.preventDefault();

  if (!addEventNote.value || !addEventFrom.value || !addEventTo.value) {
    alert("Preencha todos os campos!");
    return;
  }

  const usuarioId = 1; // Ajuste conforme sua lógica

  const evento = {
    data: `${year}-${month + 1}-${activeDay}`,
    nota: addEventNote.value,
    horarioInicio: addEventFrom.value,
    horarioFim: addEventTo.value,
    usuarioId,
  };

  fetch('/calendario/salvar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(evento),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert(data.message);
        updateEvents(activeDay);
      } else {
        alert("Erro ao salvar o evento.");
      }
    })
    .catch((error) => {
      console.error('Erro:', error);
    });

  addEventWrapper.classList.remove("active");
  addEventNote.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
});

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

function getEvents() {
  const storedEvents = JSON.parse(localStorage.getItem("events"));
  if (storedEvents) eventsArr.push(...storedEvents);
}

function formatTime(time) {
  const [hour, minute] = time.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  return `${hour < 10 ? "0" + hour : hour}:${minute < 10 ? "0" + minute : minute} ${period}`;
}

[addEventFrom, addEventTo].forEach((input) => {
  input.addEventListener("input", (e) => {
    input.value = input.value.replace(/[^0-9:]/g, "");
    if (input.value.length === 2) input.value += ":";
    if (input.value.length > 5) input.value = input.value.slice(0, 5);
  });
});

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);
todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

initCalendar();
