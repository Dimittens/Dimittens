// Seleção dos elementos do DOM
const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
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
let isEditing = false;
let eventToEdit = null;

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

let eventsArr = [];

async function initCalendar() {
  await fetchEvents();
  renderCalendar();
}

async function fetchEvents() {
  try {
    const response = await fetch('/calendario/listar-sessao');
    const data = await response.json();
    console.log("Dados recebidos do servidor:", data);

    eventsArr = data.map(event => ({
      id: event.id || '',
      day: event.day,
      month: event.month,
      year: event.year,
      nota: event.nota,
      horarioInicio: event.horarioInicio,
      horarioFim: event.horarioFim,
    }));

    renderCalendar();
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
  }
}

function renderCalendar() {
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
    const hasEvent = eventsArr.some(event =>
      event.day === i && event.month === month + 1 && event.year === year
    );

    if (i === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      days += hasEvent 
        ? `<div class="day today active event">${i}</div>` 
        : `<div class="day today active">${i}</div>`;
    } else {
      days += hasEvent 
        ? `<div class="day event">${i}</div>` 
        : `<div class="day">${i}</div>`;
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;
  addListeners();
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
  const events = eventsArr.filter(event =>
    event.day === day && event.month === month + 1 && event.year === year
  );

  let eventsHTML = events.map((event) => 
    `<div class="event" data-event-id="${event.id}">
      <div class="title">
        <span class="event-title">${event.nota}</span>
        <div class="box-icone-editar">
          <i class="fa-solid fa-pen" data-event-id="${event.id}"></i>
        </div>
      </div>
      <div class="time">
        ${event.horarioInicio.slice(0, 5)} - ${event.horarioFim.slice(0, 5)}
      </div>
    </div>`
  ).join("");

  eventsContainer.innerHTML = eventsHTML || `<div class="no-event">Sem Eventos</div>`;
}

addEventSubmit.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!addEventNote.value || !addEventFrom.value || !addEventTo.value) {
    alert("Preencha todos os campos!");
    return;
  }

  const updatedEvent = {
    id: isEditing ? eventToEdit.id : null,
    day: activeDay,
    month: month + 1,
    year: year,
    nota: addEventNote.value,
    horarioInicio: `${addEventFrom.value}:00`,
    horarioFim: `${addEventTo.value}:00`,
  };

  const method = isEditing ? "PUT" : "POST";
  const url = isEditing 
    ? `/calendario/editar/${updatedEvent.id}` 
    : "/calendario/salvar";

  try {
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEvent),
    });

    const data = await response.json();
    if (data.success) {
      alert("Evento atualizado com sucesso!");

      if (isEditing) {
        const index = eventsArr.findIndex(e => e.id === updatedEvent.id);
        if (index !== -1) {
          eventsArr[index] = updatedEvent;
        }
      } else {
        eventsArr.push(updatedEvent);
      }

      updateEvents(activeDay);
      clearForm();
      addEventWrapper.classList.remove("active");
    } else {
      alert("Erro ao salvar o evento.");
    }
  } catch (error) {
    console.error("Erro ao salvar evento:", error);
    alert("Erro interno ao salvar o evento.");
  }
});

function clearForm() {
  addEventNote.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
  eventToEdit = null;
  isEditing = false;
}

prev.addEventListener("click", () => {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  renderCalendar();
});

next.addEventListener("click", () => {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  renderCalendar();
});

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  renderCalendar();
});

document.addEventListener("click", (e) => {
  const icon = e.target.closest(".fa-pen");
  if (icon) {
    const eventId = icon.dataset.eventId;
    editEvent(eventId);
  }
});

initCalendar();
