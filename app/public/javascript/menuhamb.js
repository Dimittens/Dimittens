const botao = document.getElementById('menu-smart');
        const item = document.getElementById('menubox');

        // adiciona um evento de clique ao botão
        botao.addEventListener('click', () => {
            // alterna a visibilidade do item
            if (item.style.display === 'none') {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });