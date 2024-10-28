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
    eventsArr = data.map(event => ({
      id: event.id,
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
      days += hasEvent ? `<div class="day today active event">${i}</div>` :
                         `<div class="day today active">${i}</div>`;
    } else {
      days += hasEvent ? `<div class="day event">${i}</div>` :
                         `<div class="day">${i}</div>`;
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;
  addListeners();
}

function addListeners() {
  console.log("addListeners chamado"); // Verificar se foi chamado

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

  eventsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-pen")) {
      console.log("Ícone clicado:", e.target.dataset.eventId); // Verificar no console
      const eventId = e.target.dataset.eventId;
      editEvent(eventId);
    }
  });
}
  addEventBtn.addEventListener("click", () => {
    isEditing = false;
    addEventWrapper.classList.add("active");
  });

  addEventCloseBtn.addEventListener("click", () => {
    addEventWrapper.classList.remove("active");
  });

  [addEventFrom, addEventTo].forEach((input) => {
    input.addEventListener("input", (e) => {
      let value = input.value.replace(/[^0-9:]/g, "");
      if (value.length === 2 && !value.includes(":")) value += ":";
      input.value = value.slice(0, 5); 
    });

    input.addEventListener("blur", () => {
      const [hour, minute] = input.value.split(":").map(Number);
      if (
        isNaN(hour) || isNaN(minute) ||
        hour < 0 || hour > 23 || minute < 0 || minute > 59
      ) {
        alert("Por favor, insira um horário válido no formato HH:mm.");
        input.value = "";
      }
    });
  });


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

  let eventsHTML = events.map(event => `
    <div class="event">
      <div class="title">
        <span class="event-title">${event.nota}</span>
        <div class="box-icone-editar">
          <i class="fa-solid fa-pen" data-event-id="${event.id}"></i>
        </div>
      </div>
      <div class="time">${event.horarioInicio} - ${event.horarioFim}</div>
    </div>
  `).join("");

  eventsContainer.innerHTML = eventsHTML || `<div class="no-event">Sem Eventos</div>`;

  // Adiciona listeners para os ícones de edição após renderizar o HTML
  const editIcons = eventsContainer.querySelectorAll(".fa-pen");
  editIcons.forEach(icon => {
    icon.addEventListener("click", (e) => {
      const eventId = e.target.dataset.eventId;
      console.log("Ícone clicado:", eventId); // Verifique se aparece no console
      editEvent(eventId); // Chama a função de edição
    });
  });
}


function editEvent(eventId) {
  const event = eventsArr.find(e => e.id == eventId);
  if (event) {
    isEditing = true;
    eventToEdit = event;

    // Preenche o formulário de edição com os dados do evento
    addEventNote.value = event.nota;
    addEventFrom.value = event.horarioInicio;
    addEventTo.value = event.horarioFim;

    // Exibe o formulário de edição
    addEventWrapper.classList.add("active");
  } else {
    console.error("Evento não encontrado:", eventId);
  }
  console.log("Evento encontrado para edição:", event);
}





addEventSubmit.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!addEventNote.value || !addEventFrom.value || !addEventTo.value) {
    alert("Preencha todos os campos!");
    return;
  }

  const newEvent = {
    id: isEditing ? eventToEdit.id : null,
    day: activeDay,
    month: month + 1,
    year: year,
    nota: addEventNote.value,
    horarioInicio: addEventFrom.value,
    horarioFim: addEventTo.value,
  };

  const method = isEditing ? "PUT" : "POST";
  const url = isEditing ? `/calendario/editar/${newEvent.id}` : "/calendario/salvar";

  await saveEvent(newEvent, method, url);
  addEventWrapper.classList.remove("active");
  addEventNote.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
  isEditing = false;
});

async function saveEvent(event, method, url) {
  try {
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });

    const data = await response.json();
    if (data.success) {
      alert("Evento salvo com sucesso!");
      if (!isEditing) eventsArr.push(event);
      updateEvents(activeDay);
    } else {
      alert("Erro ao salvar o evento.");
    }
  } catch (error) {
    console.error("Erro ao salvar evento:", error);
  }
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

initCalendar();
