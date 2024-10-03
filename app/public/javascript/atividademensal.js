let currentIndex = 0; // Posição inicial

const mesesContainer = document.querySelector('.meses');
const meses = document.querySelectorAll('.meses input');
const totalMeses = meses.length;

const showMonths = () => {
    // Só exibe 3 meses por vez
    const offset = currentIndex * 150; // Cada mês tem largura de 150px
    mesesContainer.style.transform = `translateX(-${offset}px)`;
}

const nextMonth = () => {
    if (currentIndex < totalMeses - 3) {
        currentIndex++;
    } else {
        currentIndex = 0; // Voltar para o início
    }
    showMonths();
}

const prevMonth = () => {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = totalMeses - 3; // Ir para o final
    }
    showMonths();
}

document.getElementById('nextBtn').addEventListener('click', nextMonth);
document.getElementById('prevBtn').addEventListener('click', prevMonth);

// Inicializar o carrossel
showMonths();