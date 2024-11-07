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
  console.log("Inicializando calendário");  // Adicione este log
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
    
    if (isAvailable) {
      console.log("Aplicando classe 'available' no dia:", i);
    }
    if (isSelected) {
      console.log("Aplicando classe 'selected' no dia:", i);
    }
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
    console.log("Carregando dias disponíveis do backend");  // Log para verificar a carga de dias
    const response = await fetch('/dashboardpsicologo/dias-disponiveis');
    const data = await response.json();

    if (data.success) {
      availableDays = data.diasDisponiveis;
      console.log("Dias carregados:", availableDays);  // Log para verificar dias carregados
      renderCalendar();
    }
  } catch (error) {
    console.error("Erro ao carregar dias disponíveis:", error);
  }
}
function handleMarkButtonClick() {
  if (selectingDays && mode === 'add') {
    console.log("Confirmando a marcação dos dias no banco...");
    confirmSelection();  // Confirma a seleção dos dias no banco de dados
    resetSelection();  // Restaura o estado inicial dos botões
    alert("Dias selecionados foram marcados com sucesso!");
  } else {
    mode = 'add';
    selectingDays = true;
    markAvailableBtn.textContent = "Marcar Consulta"; // Atualiza o botão para salvar
    cancelSelectionBtn.disabled = true; // Desabilita o botão "Cancelar" enquanto a seleção está ativa
    console.log("Modo de marcação ativado. Aguardando seleção de dias.");
  }
}

function handleCancelButtonClick() {
  if (selectingDays && mode === 'remove') {
    console.log("Confirmando a remoção dos dias no banco...");
    confirmSelection();  // Confirma a remoção dos dias no banco de dados
    resetSelection();  // Restaura o estado inicial dos botões
    alert("Dias selecionados foram removidos com sucesso!");
  } else {
    mode = 'remove';
    selectingDays = true;
    cancelSelectionBtn.textContent = "Confirmar Remoção"; // Atualiza o botão para confirmar a remoção
    markAvailableBtn.disabled = true; // Desabilita o botão "Disponibilizar Consulta" enquanto a remoção está ativa
    console.log("Modo de remoção ativado. Aguardando seleção de dias.");
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
  if (!selectingDays) {
    console.log("A seleção não está ativa. Ignorando clique.");
    return; // Impede a seleção se `selectingDays` não estiver ativo
  }

  console.log(`Modo: ${mode}, Dia Selecionado: ${dayNumber}`);
  if (mode === 'add') {
    if (!selectedDays.includes(dayNumber)) {
      selectedDays.push(dayNumber);
      dayElement.classList.add("selected"); // Adiciona classe visual de seleção
      console.log("Dia adicionado para marcação:", dayNumber);
    } else {
      selectedDays = selectedDays.filter(day => day !== dayNumber);
      dayElement.classList.remove("selected");
      console.log("Dia removido da seleção para marcação:", dayNumber);
    }
  } else if (mode === 'remove') {
    if (availableDays.some(d => d.mes === month + 1 && d.dias.includes(dayNumber))) {
      if (!selectedDays.includes(dayNumber)) {
        selectedDays.push(dayNumber);
        dayElement.classList.add("selected");
        console.log("Dia adicionado para remoção:", dayNumber);
      } else {
        selectedDays = selectedDays.filter(day => day !== dayNumber);
        dayElement.classList.remove("selected");
        console.log("Dia removido da seleção para remoção:", dayNumber);
      }
    }
  }
}

// Alterna entre modos de seleção para marcar e remover dias
markAvailableBtn.addEventListener("click", () => {
  if (selectingDays && mode === 'add') {
    confirmSelection();  // Confirma a marcação
    resetSelection();
  } else {
    mode = 'add';
    selectingDays = true;
    markAvailableBtn.textContent = "Confirmar Marcação";
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
async function saveAvailableDays(days, month) {
  try {
    console.log("Enviando dias para salvar:", days, month);
    const response = await fetch('/dashboardpsicologo/marcar-disponivel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days, month })
    });
    const data = await response.json();
    console.log("Resposta do backend ao salvar:", data);  // Log da resposta do backend
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
    console.log("Resposta do backend ao remover:", data);  // Log da resposta do backend
    if (!data.success) throw new Error(data.message);
  } catch (error) {
    console.error("Erro ao remover dias disponíveis:", error);
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

function addListeners() {
  const days = document.querySelectorAll(".day");

  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      const dayNumber = Number(day.innerHTML);

      // Adiciona a lógica de seleção de dias apenas para dias do mês atual
      if (!day.classList.contains("prev-date") && !day.classList.contains("next-date")) {
        console.log("Dia clicado:", dayNumber);
        toggleDaySelection(day, dayNumber);  // Chama diretamente toggleDaySelection
      }
    });
  });
}

async function confirmSelection() {
  const activeMonth = month + 1;
  if (selectedDays.length > 0) {
    if (mode === 'add') {
      await saveAvailableDays(selectedDays, activeMonth);
    } else if (mode === 'remove') {
      await removeAvailableDays(selectedDays, activeMonth);
    }
  }
  selectedDays = [];
  await loadAvailableDays(); // Atualiza os dias disponíveis do backend
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
  if (selectingDays && mode === 'remove') {
    confirmSelection();  // Confirma a remoção
    resetSelection();
  } else {
    mode = 'remove';
    selectingDays = true;
    cancelSelectionBtn.textContent = "Confirmar Remoção";
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
  mode = null;
  markAvailableBtn.textContent = "Disponibilizar Consulta";
  cancelSelectionBtn.textContent = "Cancelar";
  markAvailableBtn.disabled = false; // Reabilita o botão "Disponibilizar Consulta"
  cancelSelectionBtn.disabled = false; // Reabilita o botão "Cancelar"
  console.log("Estado de seleção resetado.");
  renderCalendar(); // Re-renderiza para limpar a interface
}




// Inicializa o calendário e carrega dias disponíveis
initCalendar();
loadAvailableDays(); // Carrega os dias disponíveis ao carregar a página