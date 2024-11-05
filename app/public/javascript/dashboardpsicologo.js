// Seleção dos elementos do DOM
const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  dateInput = document.querySelector(".date-input"),
  gotoBtn = document.querySelector(".goto-btn");
  markAvailableBtn = document.querySelector(".mark-available-btn");

let today = new Date();
let activeDay = today.getDate();
let month = today.getMonth();
let year = today.getFullYear();
let availableDays = [];


const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Função para inicializar o calendário
function initCalendar() {
  renderCalendar();
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

  // Dias do mês anterior
  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  // Dias do mês atual
  for (let i = 1; i <= lastDate; i++) {
    const isAvailable = availableDays.some(d => d.mes === month + 1 && d.dias.includes(i));
    days += `<div class="day ${i === activeDay ? 'active' : ''} ${isAvailable ? 'available' : ''}">${i}</div>`;
  }

  // Dias do próximo mês
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;
  updateMarkAvailableButton(); // Atualiza o botão após renderizar o calendário
  addListeners();
}

// Carrega dias disponíveis ao iniciar a página
async function loadAvailableDays() {
  try {
    const response = await fetch('/dashboardpsicologo/dias-disponiveis');
    const data = await response.json();
    if (data.success) {
      availableDays = data.diasDisponiveis;
      renderCalendar();
    }
  } catch (error) {
    console.error("Erro ao carregar dias disponíveis:", error);
  }
}

// Atualiza o estado do botão com base na disponibilidade
function updateMarkAvailableButton() {
  const activeMonth = month + 1;
  const isAvailable = availableDays.some(d => d.mes === activeMonth && d.dias.includes(activeDay));
  markAvailableBtn.textContent = isAvailable ? "Remover Disponibilidade" : "Marcar Disponível";
}

// Alterna entre marcar e remover disponibilidade
markAvailableBtn.addEventListener("click", async () => {
  const activeMonth = month + 1;

  if (!availableDays.some(d => d.mes === activeMonth && d.dias.includes(activeDay))) {
    await saveAvailableDay(activeDay, activeMonth);
    alert(`Dia ${activeDay} marcado como disponível para consultas.`);
  } else {
    await removeAvailableDay(activeDay, activeMonth);
    alert(`Disponibilidade do dia ${activeDay} removida.`);
    updateMarkAvailableButton(); // Atualiza o botão após renderizar o calendário
  }

  renderCalendar(); // Atualiza o calendário
});

// Salva o dia disponível no banco de dados
async function saveAvailableDay(day, month) {
  try {
    const response = await fetch('/dashboardpsicologo/marcar-disponivel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day, month })
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    loadAvailableDays(); // Atualiza dias disponíveis
  } catch (error) {
    console.error("Erro ao salvar dia disponível:", error);
  }
}

// Remove o dia disponível do banco de dados
async function removeAvailableDay(day, month) {
  try {
    const response = await fetch('/dashboardpsicologo/remover-disponivel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day, month })
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    loadAvailableDays(); // Atualiza dias disponíveis
  } catch (error) {
    console.error("Erro ao remover dia disponível:", error);
  }
}

// Função para adicionar os listeners aos dias
function addListeners() {
  const days = document.querySelectorAll(".day");

  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      const target = e.target;
      const dayNumber = Number(target.innerHTML);

      if (target.classList.contains("prev-date")) {
        month = month === 0 ? 11 : month - 1;
        year = month === 11 ? year - 1 : year;
        activeDay = dayNumber;
        renderCalendar();
      } else if (target.classList.contains("next-date")) {
        month = month === 11 ? 0 : month + 1;
        year = month === 0 ? year + 1 : year;
        activeDay = dayNumber;
        renderCalendar();
      } else {
        activeDay = dayNumber;
        getActiveDay(activeDay);
        days.forEach((d) => d.classList.remove("active"));
        target.classList.add("active");
      }
      updateMarkAvailableButton(); // Atualiza o botão após renderizar o calendário
    });
  });
}

// Atualiza a data exibida no calendário
function getActiveDay(day) {
  const selectedDay = new Date(year, month, day);
  const dayName = selectedDay.toLocaleDateString("pt-BR", { weekday: "long" });
  eventDay.innerHTML = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  eventDate.innerHTML = `${day} ${months[month]} ${year}`;
}

// Botão para voltar ao mês e dia atuais
todayBtn.addEventListener("click", () => {
  const today = new Date();
  activeDay = today.getDate();
  month = today.getMonth();
  year = today.getFullYear();
  
  renderCalendar();
});

// Botão para ir a uma data específica
gotoBtn.addEventListener("click", () => {
  const dateValue = dateInput.value.trim();

  // Verifica se a entrada está no formato "mm/yyyy"
  if (/^(0[1-9]|1[0-2])\/\d{4}$/.test(dateValue)) {
    const [inputMonth, inputYear] = dateValue.split("/").map(Number);

    // Atualiza o mês e o ano
    month = inputMonth - 1; // Ajuste para índice do mês (0 a 11)
    year = inputYear;

    // Renderiza o calendário com a nova data
    renderCalendar();
  } else {
    alert("Por favor, insira a data no formato mm/yyyy.");
  }
});

dateInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
  
  // Limita o input a no máximo 6 caracteres
  if (value.length > 6) value = value.slice(0, 6);

  // Formata automaticamente para mm/yyyy
  if (value.length >= 3) {
    value = `${value.slice(0, 2)}/${value.slice(2)}`;
  }
  
  e.target.value = value;
});

// Navegação pelos meses
prev.addEventListener("click", () => {
  month = month === 0 ? 11 : month - 1;
  year = month === 11 ? year - 1 : year;
  renderCalendar();
});

next.addEventListener("click", () => {
  month = month === 11 ? 0 : month + 1;
  year = month === 0 ? year + 1 : year;
  renderCalendar();
});

// Inicializa o calendário e carrega dias disponíveis
initCalendar();
loadAvailableDays(); // Carrega os dias disponíveis ao carregar a página