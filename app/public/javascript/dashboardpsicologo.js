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
  gotoBtn = document.querySelector(".goto-btn"),
  markAvailableBtn = document.querySelector(".mark-available-btn"),
  cancelSelectionBtn = document.querySelector(".cancel-selection-btn");

let today = new Date();
let activeDay = today.getDate();
let month = today.getMonth();
let year = today.getFullYear();
let availableDays = [];
let selectingDays = false;
let selectedDays = [];
let mode = 'add';
let removingDays = false;

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Função para inicializar o calendário
function initCalendar() {
  console.log("Inicializando calendário");
  activeDay = today.getDate();
  renderCalendar();
  getActiveDay(activeDay);
}

// Renderiza o calendário e aplica a visualização dos dias disponíveis e selecionados
function renderCalendar() {
  console.log("Renderizando o calendário com selectedDays:", selectedDays);
  console.log("Renderizando o calendário com availableDays:", availableDays);

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
    const isAvailable = availableDays.some(d => d.mes === month + 1 && d.dias.includes(i));
    const isSelected = selectedDays.includes(i);
    days += `<div class="day ${i === activeDay ? 'active' : ''} ${isAvailable ? 'available' : ''} ${isSelected ? 'selected' : ''}">${i}</div>`;
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;
  addListeners();
}

// Configura os event listeners para os botões
markAvailableBtn.addEventListener("click", handleMarkButtonClick);
cancelSelectionBtn.addEventListener("click", handleCancelButtonClick);

async function loadAvailableDays() {
  try {
    console.log("Carregando dias disponíveis do backend");
    const response = await fetch('/dashboardpsicologo/dias-disponiveis');
    const data = await response.json();

    if (data.success) {
      availableDays = data.diasDisponiveis;
      console.log("Dias carregados:", availableDays);
      renderCalendar();
    }
  } catch (error) {
    console.error("Erro ao carregar dias disponíveis:", error);
  }
}

function handleMarkButtonClick() {
  if (selectingDays && mode === 'add') {
    console.log("Confirmando a marcação dos dias no banco...");
    confirmSelection();
  } else {
    mode = 'add';
    selectingDays = true;
    selectedDays = [];
    markAvailableBtn.textContent = "Confirmar Marcação";
    cancelSelectionBtn.disabled = true;
    console.log("Modo de marcação ativado. Aguardando seleção de dias.");
  }
}

function handleCancelButtonClick() {
  if (selectingDays && mode === 'remove') {
    console.log("Confirmando a remoção dos dias no banco...");
    confirmSelection();
  } else {
    mode = 'remove';
    selectingDays = true;
    selectedDays = [];
    cancelSelectionBtn.textContent = "Confirmar Remoção";
    markAvailableBtn.disabled = true;
    console.log("Modo de remoção ativado. Aguardando seleção de dias.");
  }
}

function toggleDaySelection(dayElement, dayNumber) {
  if (!selectingDays) {
    console.log("A seleção não está ativa. Ignorando clique.");
    return;
  }

  if (dayElement.classList.contains("prev-date") || dayElement.classList.contains("next-date")) {
    alert("Selecione apenas dias do mês atual.");
    return;
  }

  console.log(`Modo: ${mode}, Dia Selecionado: ${dayNumber}`);
  if (mode === 'add') {
    if (!selectedDays.includes(dayNumber)) {
      selectedDays.push(dayNumber);
      dayElement.classList.add("selected");
      console.log("Dia adicionado para marcação:", dayNumber);
    } else {
      selectedDays = selectedDays.filter(day => day !== dayNumber);
      dayElement.classList.remove("selected");
      console.log("Dia removido da seleção para marcação:", dayNumber);
    }
  } else if (mode === 'remove') {
    const isAvailable = availableDays.some(d => d.mes === month + 1 && d.dias.includes(dayNumber));
    if (isAvailable) {
      if (!selectedDays.includes(dayNumber)) {
        selectedDays.push(dayNumber);
        dayElement.classList.add("selected");
        console.log("Dia adicionado para remoção:", dayNumber);
      } else {
        selectedDays = selectedDays.filter(day => day !== dayNumber);
        dayElement.classList.remove("selected");
        console.log("Dia removido da seleção para remoção:", dayNumber);
      }
    } else {
      console.log("Dia não disponível para remoção:", dayNumber);
    }
  }
}

function addListeners() {
  const days = document.querySelectorAll(".day");

  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      const target = e.target;
      const dayNumber = Number(target.innerHTML);

      if (selectingDays) {
        toggleDaySelection(target, dayNumber);
      } else {
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
      }
    });
  });
}

async function confirmSelection() {
  const activeMonth = month + 1;
  if (selectedDays.length > 0) {
    if (mode === 'add') {
      await saveAvailableDays(selectedDays, activeMonth);
      alert("Dias selecionados foram marcados com sucesso!");
    } else if (mode === 'remove') {
      await removeAvailableDays(selectedDays, activeMonth);
      alert("Dias selecionados foram removidos com sucesso!");
    }
  } else {
    alert("Nenhum dia selecionado.");
  }
  resetSelection();
  loadAvailableDays();
}

async function saveAvailableDays(days, month) {
  try {
    console.log("Enviando dias para salvar:", days, month);
    const response = await fetch('/dashboardpsicologo/marcar-disponivel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days, month })
    });
    const data = await response.json();
    console.log("Resposta do backend ao salvar:", data);
    if (!data.success) throw new Error(data.message);
  } catch (error) {
    console.error("Erro ao salvar dias disponíveis:", error);
  }
}

async function removeAvailableDays(days, month) {
  try {
    console.log("Enviando dias para remover:", days, month);
    const response = await fetch('/dashboardpsicologo/remover-disponiveis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days, month })
    });
    const data = await response.json();
    console.log("Resposta do backend ao remover:", data);
    if (!data.success) throw new Error(data.message);
  } catch (error) {
    console.error("Erro ao remover dias disponíveis:", error);
  }
}

function resetSelection() {
  selectingDays = false;
  selectedDays = [];
  mode = null;
  markAvailableBtn.textContent = "Marcar Disponível";
  cancelSelectionBtn.textContent = "Cancelar";
  markAvailableBtn.disabled = false;
  cancelSelectionBtn.disabled = false;
  renderCalendar();
}

function getActiveDay(day) {
  const selectedDay = new Date(year, month, day);
  const dayName = selectedDay.toLocaleDateString("pt-BR", { weekday: "long" });
  eventDay.innerHTML = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  eventDate.innerHTML = `${day} ${months[month]} ${year}`;
}

todayBtn.addEventListener("click", () => {
  const today = new Date();
  activeDay = today.getDate();
  month = today.getMonth();
  year = today.getFullYear();
  renderCalendar();
});

gotoBtn.addEventListener("click", () => {
  const dateValue = dateInput.value.trim();

  if (/^(0[1-9]|1[0-2])\/\d{4}$/.test(dateValue)) {
    const [inputMonth, inputYear] = dateValue.split("/").map(Number);

    month = inputMonth - 1;
    year = inputYear;

    renderCalendar();
  } else {
    alert("Por favor, insira a data no formato mm/yyyy.");
  }
});

dateInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 6) value = value.slice(0, 6);
  if (value.length >= 3) {
    value = `${value.slice(0, 2)}/${value.slice(2)}`;
  }
  e.target.value = value;
});

prev.addEventListener("click", () => {
  if (selectingDays) {
    alert("Conclua a seleção deste mês antes de mudar para outro mês.");
    return;
  }
  month = month === 0 ? 11 : month - 1;
  year = month === 11 ? year - 1 : year;
  renderCalendar();
});

next.addEventListener("click", () => {
  if (selectingDays) {
    alert("Conclua a seleção deste mês antes de mudar para outro mês.");
    return;
  }
  month = month === 11 ? 0 : month + 1;
  year = month === 0 ? year + 1 : year;
  renderCalendar();
});

// Inicializa o calendário e carrega dias disponíveis
initCalendar();
loadAvailableDays();
