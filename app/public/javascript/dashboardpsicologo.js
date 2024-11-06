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
  renderCalendar();
}

// Renderiza o calendário e aplica a visualização dos dias disponíveis e selecionados
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
    const isSelected = selectedDays.includes(i);
    days += `<div class="day ${i === activeDay ? 'active' : ''} ${isAvailable ? 'available' : ''} ${isSelected ? 'selected' : ''}">${i}</div>`;
  }

  // Dias do próximo mês
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;
  addListeners();
}

// Carrega dias disponíveis ao iniciar a página
async function loadAvailableDays() {
  try {
    const response = await fetch('/dashboardpsicologo/dias-disponiveis');
    const data = await response.json();

    if (data.success) {
      availableDays = data.diasDisponiveis;
      console.log("Dias disponíveis carregados:", availableDays); // Verificar dados recebidos
      renderCalendar();
    }
  } catch (error) {
    console.error("Erro ao carregar dias disponíveis:", error);
  }
}

// Atualiza o estado do botão com base no modo de seleção
function updateMarkAvailableButton() {
  if (selectingDays) {
    markAvailableBtn.textContent = mode === 'add' ? "Confirmar Marcação" : "Confirmar Remoção";
  } else {
    markAvailableBtn.textContent = "Marcar Disponível";
  }
}


function toggleDaySelection(dayElement, dayNumber) {
  if (selectedDays.includes(dayNumber)) {
    selectedDays = selectedDays.filter(day => day !== dayNumber); // Remove da seleção
    dayElement.classList.remove("selected");
  } else {
    selectedDays.push(dayNumber); // Adiciona à seleção
    dayElement.classList.add("selected");
  }
}

// Alterna entre modos de seleção para marcar e remover dias
markAvailableBtn.addEventListener("click", async () => {
  if (selectingDays) {
    if (selectedDays.length === 0) {
      alert("Nenhum dia selecionado para marcar.");
      return;
    }
    confirmDaySelection(); 
  } else {
    selectingDays = true;
    markAvailableBtn.textContent = "Confirmar marcação";
    enableDaySelection("mark"); // Habilita a seleção de dias para marcação
  }
});

async function confirmDaySelection() {
  if (selectedDays.length === 0) {
    alert("Nenhum dia selecionado para marcar como disponível.");
    return;
  }
  await saveAvailableDays(selectedDays, month + 1);
  selectingDays = false;
  selectedDays = [];
  markAvailableBtn.textContent = "Disponibilizar consulta";
  alert("Dias selecionados marcados com sucesso!");
  loadAvailableDays();
}

async function confirmCancelSelection() {
  if (selectedDays.length === 0) {
    alert("Nenhum dia selecionado para cancelar.");
    return;
  }

  await removeAvailableDays(selectedDays, month + 1); // Ajuste para múltiplos dias
  removingDays = false;
  selectedDays = []; // Limpa a seleção
  cancelSelectionBtn.textContent = "Cancelar"; // Restaura o botão
  alert("Cancelamento de dias selecionados concluído com sucesso."); // Confirmação
  loadAvailableDays(); // Atualiza o calendário
}

// Função para salvar dias disponíveis
async function saveAvailableDays(days, month) {
  try {
    const response = await fetch('/dashboardpsicologo/marcar-disponivel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days, month })
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
  } catch (error) {
    console.error("Erro ao salvar dias disponíveis:", error);
  }
}
// Alterna para o modo de remover dias
function enableRemoveMode() {
  selectingDays = true;
  selectedDays = [];
  mode = 'remove';
  markAvailableBtn.textContent = "Confirmar Remoção";
  renderCalendar();
}

// Função para remover dias disponíveis
async function removeAvailableDays(days, month) {
  try {
    const response = await fetch('/dashboardpsicologo/remover-disponiveis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days, month })
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
  } catch (error) {
    console.error("Erro ao remover dias disponíveis:", error);
  }
}

function addListeners() {
  const days = document.querySelectorAll(".day");

  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      const target = e.target;
      const dayNumber = Number(target.innerHTML);

      // Navegação permitida quando a função de seleção de marcação está desativada
      if (!selectingDays) {
        if (target.classList.contains("prev-date")) {
          month = month === 0 ? 11 : month - 1;
          year = month === 11 ? year - 1 : year;
          activeDay = dayNumber;
          renderCalendar();
          getActiveDay(activeDay); // Atualiza `today-date`
        } else if (target.classList.contains("next-date")) {
          month = month === 11 ? 0 : month + 1;
          year = month === 0 ? year + 1 : year;
          activeDay = dayNumber;
          renderCalendar();
          getActiveDay(activeDay); // Atualiza `today-date`
        } else {
          activeDay = dayNumber;
          getActiveDay(activeDay); // Atualiza `today-date`
          days.forEach((d) => d.classList.remove("active"));
          target.classList.add("active");
        }
      } else if (target.classList.contains("prev-date") || target.classList.contains("next-date")) {
        alert("Finalize a seleção de dias do mês atual antes de navegar para outro mês.");
      }
    });
  });
}

// Função para confirmar a seleção dos dias e salvar ou remover
async function confirmSelection() {
  const activeMonth = month + 1;
  if (selectedDays.length > 0) {
    if (mode === 'add') {
      await saveAvailableDays(selectedDays, activeMonth);
      alert(`Dias ${selectedDays.join(", ")} marcados como disponíveis.`);
    } else {
      await removeAvailableDays(selectedDays, activeMonth);
      alert(`Disponibilidade dos dias ${selectedDays.join(", ")} removida.`);
    }
    loadAvailableDays();
  }
}

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

cancelSelectionBtn.addEventListener("click", () => {
  if (removingDays) {
    if (selectedDays.length === 0) {
      alert("Nenhum dia selecionado para cancelar.");
      return;
    }
    confirmCancelSelection(); // Confirma o cancelamento dos dias selecionados
  } else {
    if (availableDays.length === 0) {
      alert("Nenhum dia marcado como disponível para cancelar.");
      return;
    }
    removingDays = true;
    cancelSelectionBtn.textContent = "Confirmar cancelamento";
    enableDaySelection("cancel"); // Habilita a seleção dos dias a serem removidos
  }
});

function confirmCancelSelection() {
  if (selectedDays.length === 0) {
    alert("Nenhum dia selecionado para cancelar.");
    return;
  }

  selectedDays.forEach(async (day) => {
    await removeAvailableDays(day, month + 1);
  });

  removingDays = false;
  selectedDays = []; // Limpa a seleção
  cancelSelectionBtn.textContent = "Cancelar"; // Restaura o botão
  alert("Cancelamento de dias selecionados concluído com sucesso."); // Confirmação
  loadAvailableDays(); // Atualiza o calendário
}

function enableDaySelection(mode) {
  const days = document.querySelectorAll(".day");
  days.forEach((dayElement) => {
    const dayNumber = Number(dayElement.innerHTML);
    const isAvailable = availableDays.some(d => d.mes === month + 1 && d.dias.includes(dayNumber));

    dayElement.addEventListener("click", () => {
      if (mode === "mark") {
        if (!dayElement.classList.contains("prev-date") && !dayElement.classList.contains("next-date")) {
          toggleDaySelection(dayElement, dayNumber);
        } else {
          alert("Selecione apenas dias do mês atual.");
        }
      } else if (mode === "cancel" && isAvailable) {
        toggleDaySelection(dayElement, dayNumber);
      } else if (mode === "cancel") {
        alert("Este dia não possui disponibilidade para cancelar.");
      }
    });
  });
}

function resetSelection() {
  selectingDays = false;
  selectedDays = [];
  document.querySelectorAll(".selected").forEach(day => day.classList.remove("selected"));
  renderCalendar(); // Atualiza a interface
}

// Inicializa o calendário e carrega dias disponíveis
initCalendar();
loadAvailableDays(); // Carrega os dias disponíveis ao carregar a página