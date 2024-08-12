// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('cadastroBtn');
    const closeLoginBtn = document.getElementById('closeLoginBtn');
    const closeRegisterBtn = document.getElementById('closeRegisterBtn');
    const loginOverlay = document.getElementById('loginOverlay');
    const registerOverlay = document.getElementById('cadastroOverlay');
  
    // Exibe o overlay de login
    loginBtn.addEventListener('click', () => {
      loginOverlay.classList.remove('hidden');
    });
  
    // Exibe o overlay de cadastro
    registerBtn.addEventListener('click', () => {
      registerOverlay.classList.remove('hidden');
    });
  
    // Oculta o overlay de login
    closeLoginBtn.addEventListener('click', () => {
      loginOverlay.classList.add('hidden');
    });
  
    // Oculta o overlay de cadastro
    closeRegisterBtn.addEventListener('click', () => {
      registerOverlay.classList.add('hidden');
    });
  
    // Opcional: Ocultar o overlay ao clicar fora do modal
    [loginOverlay, registerOverlay].forEach(overlay => {
      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
          overlay.classList.add('hidden');
        }
      });
    });
  });
  
  