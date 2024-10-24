let wsConnection;
let currentConsultaId = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
let selectedFile = null;


// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const filePreview = document.getElementById('filePreview');
const fileName = document.getElementById('fileName');
const removeFile = document.getElementById('removeFile');
const messageInput = document.getElementById('message-input');
const mainChat = document.getElementById('main-chat');
const submitBtn = document.getElementById('submitBtn');

function joinChatRoom(consultaId) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'join',
            consultaId: consultaId,
            usuarioId: window.usuarioId
        }));
    }
}
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelection(files[0]);
    }
});

// Evento de seleção de arquivo pelo input
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelection(e.target.files[0]);
    }
});

// Remover arquivo selecionado
removeFile.addEventListener('click', () => {
    clearFileSelection();
});

// Função para lidar com a seleção de arquivo
function handleFileSelection(file) {
    selectedFile = file;
    fileName.textContent = file.name;
    filePreview.style.display = 'flex';
}

// Função para limpar a seleção de arquivo
function clearFileSelection() {
    selectedFile = null;
    fileName.textContent = '';
    filePreview.style.display = 'none';
    fileInput.value = '';
}

submitBtn.addEventListener('click', async () => {
    const message = messageInput.value.trim();
    
    if (!message && !selectedFile) return;
    
    try {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('arquivo', selectedFile);
            formData.append('consultaId', currentConsultaId);
            formData.append('remetenteId', window.usuarioId);
            
            const response = await fetch('/api/upload', {  // Removido o parâmetro da URL
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Notificar via WebSocket
                wsConnection.send(JSON.stringify({
                    type: 'novo_arquivo',
                    consultaId: currentConsultaId, // Corrigido para usar currentConsultaId
                    remetenteId: window.usuarioId,
                    arquivo: data.arquivo
                }));
                
                clearFileSelection();
            } else {
                console.error('Erro ao enviar arquivo:', data.error);
            }
        }
        
        if (message) {
            // Seu código existente para enviar mensagens de texto
            messageInput.value = '';
        }
    } catch (error) {
        console.error('Erro ao enviar:', error);
    }
});

async function openChatSession(consultaId) {
    if (!consultaId) {
        console.error('ID da consulta não definido');
        return;
    }

    try {
        const response = await fetch(`/sessao-chat/${consultaId}`);
        if (!response.ok) {
            throw new Error(`Erro ao carregar sessão: ${response.status}`);
        }

        const data = await response.json();
        
        // Atualiza o ID da consulta atual
        currentConsultaId = consultaId;
        
        // Atualiza a interface
        const profileImg = document.getElementById('current-profile-img');
        const psychologistName = document.getElementById('current-psychologist-name');
        const chatArea = document.getElementById('chat-area');
        
        psychologistName.textContent = data.psicologo.nome;
        chatArea.style.display = 'block';

        // Limpa as mensagens antigas
        const mainChat = document.getElementById('main-chat');
        mainChat.innerHTML = '';

        // Renderiza as novas mensagens
        if (Array.isArray(data.mensagens)) {
            data.mensagens.forEach(msg => appendMessage(msg));
        }
        
        initializeWebSocket();
    } catch (error) {
        console.error('Erro ao abrir sessão:', error);
        alert('Não foi possível abrir a sessão de chat. Por favor, tente novamente.');
    }
}

// Modifique a função openChatSession existente
async function handleSendMessage() {
    const message = messageInput.value.trim();
    if (!message || !currentConsultaId) return;

    try {
        // Criar objeto da mensagem
        const messageData = {
            type: 'nova_mensagem',
            consultaId: currentConsultaId,
            mensagem: {
                conteudo: message,
                nomeRemetente: '<%= usuarioNome %>',
                dataCriacao: new Date().toISOString(),
                remetenteId: window.usuarioId
            }
        };

        // Verificar estado do WebSocket
        if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
            wsConnection.send(JSON.stringify(messageData));
        } else {
            console.warn('WebSocket não está conectado. Reconectando...');
            initializeWebSocket();
            // Tentar enviar após reconexão
            setTimeout(() => {
                if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
                    wsConnection.send(JSON.stringify(messageData));
                }
            }, 1000);
        }

        // Exibir mensagem imediatamente
        appendMessage(messageData.mensagem);
        scrollToBottom();
        
        // Limpar input
        messageInput.value = '';

        // Salvar no banco de dados
        const response = await fetch('/enviar-mensagem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                consultaId: currentConsultaId,
                conteudo: message,
                remetenteId: '<%= usuarioNome %>'
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar mensagem');
        }

        // Atualizar preview na lista de chats
        updateChatPreview(currentConsultaId, messageData.mensagem);

    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        alert('Erro ao enviar mensagem. Tente novamente.');
    }
}

// Função auxiliar para rolar para o fim do chat
function scrollToBottom() {
    mainChat.scrollTop = mainChat.scrollHeight;
}

// Função para formatar mensagem no chat
function appendMessage(msg) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('mensagem-box');
    
    // Adiciona classe 'sent' se a mensagem for do usuário atual
    if (msg.remetenteId === window.usuarioId) {
        messageElement.classList.add('sent');
    }
    
    const time = new Date(msg.dataCriacao).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    messageElement.innerHTML = `
        <div class="mensagem-content-wrapper">
            <div class="sender-name">
                ${msg.remetenteId === window.usuarioId ? 'Você' : msg.nomeRemetente}
            </div>
            <div class="mensagem-content">
                ${msg.conteudo}
                <div class="message-time">${time}</div>
            </div>
        </div>
    `;
    
    mainChat.appendChild(messageElement);
    scrollToBottom();
}

// Função para rolar o chat para baixo
function scrollToBottom() {
    mainChat.scrollTop = mainChat.scrollHeight;
}

// Função para configurar o evento de envio
function setupEventListeners() {
    submitBtn.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    });
}

async function loadChatSessions() {
    try {
        const response = await fetch('/carregar-sessoes-chat');
        console.log('Response status for chat sessions:', response.status);
        if (!response.ok) throw new Error('Erro ao carregar sessões de chat');
        const sessions = await response.json();
        renderChatSessions(sessions);
        // Initialize WebSocket connection
        initializeWebSocket();
    } catch (error) {
        console.error('Erro ao carregar sessões de chat:', error);
    }
}
function initializeWebSocket() {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}`;
    
    wsConnection = new WebSocket(wsUrl);

    wsConnection.onopen = () => {
        console.log('WebSocket conectado');
        // Entrar na sala de chat atual se existir
        if (currentConsultaId) {
            wsConnection.send(JSON.stringify({
                type: 'join',
                consultaId: currentConsultaId,
                usuarioId: window.usuarioId
            }));
        }
    };

    wsConnection.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log('Mensagem recebida:', data);

            if (data.type === 'nova_mensagem' && data.consultaId === currentConsultaId) {
                // Só append se não for nossa própria mensagem
                if (data.mensagem.remetenteId !== window.usuarioId) {
                    appendMessage(data.mensagem);
                    scrollToBottom();
                    // Atualizar preview na lista de chats
                    updateChatPreview(data.consultaId, data.mensagem);
                }
            
            }
            else if (data.type === 'novo_arquivo') {
                // Exibir o arquivo no chat
                const chatBox = document.getElementById('chatBox');
                const arquivoUrl = `/uploads/${data.arquivo}`; // Caminho do arquivo no servidor
        
                if (data.arquivo.endsWith('.jpg') || data.arquivo.endsWith('.png') || data.arquivo.endsWith('.gif')) {
                    chatBox.innerHTML += `<div><img src="${arquivoUrl}" alt="Imagem Enviada" /></div>`;
                } else if (data.arquivo.endsWith('.pdf')) {
                    chatBox.innerHTML += `<div><a href="${arquivoUrl}" target="_blank">Visualizar PDF</a></div>`;
                }
            }
        } catch (error) {
            console.error('Erro ao processar mensagem:', error);
        }
    };

    wsConnection.onclose = () => {
        console.log('WebSocket desconectado');
        // Tentar reconectar após 3 segundos
        setTimeout(() => {
            if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                console.log('Tentando reconectar...');
                initializeWebSocket();
                reconnectAttempts++;
            }
        }, 3000);
    };

    wsConnection.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
    };
}

function renderChatSessions(sessions) {
    const contactList = document.getElementById('contact-list');
    contactList.innerHTML = ''; // Limpa sessões anteriores

    sessions.forEach(session => {
        const sessionItem = document.createElement('div');
        sessionItem.className = 'session-item';
        sessionItem.dataset.consultaId = session.consultaId;

        sessionItem.innerHTML = `
            <img src="${session.psicologoAvatar}" alt="Avatar" class="session-avatar">
            <div class="session-info">
                <h3>${session.psicologoNome}</h3>
                <p>${session.ultimaMensagem || 'Iniciar conversa'}</p>
            </div>
            <span class="session-time">${session.ultimaAtualizacao}</span>
        `;

        sessionItem.addEventListener('click', () => {
            if (session.consultaId) {
                openChatSession(session.consultaId);
            } else {
                console.error('Consulta ID está indefinido');
            }
        });
        contactList.appendChild(sessionItem);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const usuarioId = document.querySelector('meta[name="usuario-id"]').content;
    if (!usuarioId) {
        console.error('ID do usuário não encontrado');
        return;
    }

    window.usuarioId = usuarioId; // Tornar disponível globalmente
    loadChatSessions();
    setupEventListeners();
    initializeWebSocket();
});

function updateChatPreview(consultaId, mensagem) {
    const sessionItem = document.querySelector(`.session-item[data-consulta-id="${consultaId}"]`);
    if (sessionItem) {
        const previewElement = sessionItem.querySelector('.session-info p');
        if (previewElement) {
            const preview = mensagem.conteudo.length > 50 
                ? mensagem.conteudo.substring(0, 47) + '...'
                : mensagem.conteudo;
            previewElement.textContent = preview;
        }
        
        // Atualizar horário
        const timeElement = sessionItem.querySelector('.session-time');
        if (timeElement) {
            const time = new Date(mensagem.dataCriacao).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            timeElement.textContent = time;
        }
    }
}