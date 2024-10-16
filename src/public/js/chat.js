//src/public/js/chat.js
const token = localStorage.getItem('token'); // Pega o token do localStorage

// Verifica se o token existe
if (!token) {
    console.error('Token não encontrado. O usuário deve estar logado.');
    window.location.href = 'login.html';
}

// Busca o nome do usuário no backend
let userName = ''; // Variável para armazenar o nome do usuário

fetch('http://localhost:3000/api/user', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}` // Envia o token no cabeçalho
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error('Erro ao obter informações do usuário');
    }
    return response.json();
})
.then(data => {
    userName = data.name; // Obtém o nome do usuário
    console.log(`Usuário logado: ${userName}`);
    
    // Aqui você deve chamar a função joinRoom com o roomId apropriado
    const roomId = new URLSearchParams(window.location.search).get('room');
    socket.emit('joinRoom', roomId); // Usuário entra na sala
})
.catch(error => console.error('Erro:', error));

const socket = io('http://localhost:3000', {
    auth: {
        token: token, // Envia o token na autenticação
    }
});

// Pegar elementos do DOM
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const chatWindow = document.getElementById('chatWindow');

// Enviar mensagem ao enviar o formulário
messageForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita o recarregamento da página
    const message = messageInput.value.trim(); // Remove espaços em branco
    
    if (message) { // Verifica se a mensagem não está vazia
        const roomId = new URLSearchParams(window.location.search).get('room'); // Pega o roomId da URL
        socket.emit('sendMessage', { room: roomId, message }); // Envia a mensagem junto com a sala
        
        // Limpar o campo de entrada
        messageInput.value = '';
    }
});


// Receber mensagens do servidor
socket.on('receiveMessage', (data) => {
    const messageElement = document.createElement('div');
    const isCurrentUser = data.sender === userName; // Verifica se a mensagem foi enviada pelo usuário atual

    // Cria um elemento para o nome do remetente
    const senderElement = document.createElement('div');
    senderElement.textContent = data.sender;
    senderElement.classList.add('text-xs', 'text-gray-600'); // Tamanho pequeno e cor cinza

    // Cria um elemento para a mensagem
    const textElement = document.createElement('div');
    textElement.textContent = data.message;

    // Estilo da mensagem
    if (isCurrentUser) {
        messageElement.classList.add('text-right', 'bg-green-200', 'text-black', 'rounded-lg', 'p-2', 'mb-2', 'ml-auto', 'max-w-xs');
    } else {
        messageElement.classList.add('text-left', 'bg-blue-200', 'text-black', 'rounded-lg', 'p-2', 'mb-2', 'mr-auto', 'max-w-xs');
    }

    // Adiciona os elementos ao messageElement
    messageElement.appendChild(senderElement);
    messageElement.appendChild(textElement);

    chatWindow.appendChild(messageElement);

    // Rola para o final do chat para ver a nova mensagem
    chatWindow.scrollTop = chatWindow.scrollHeight;
});


// Escutar quando um novo usuário entra na sala
socket.on('userJoined', (userName) => {
    const notificationElement = document.createElement('div');
    notificationElement.textContent = `${userName} entrou na sala!`; // Mensagem de notificação
    notificationElement.classList.add('text-center', 'text-sm', 'text-gray-500', 'italic', 'mb-2'); // Estilo da notificação

    chatWindow.appendChild(notificationElement);

    // Rolar para o final do chat para ver a nova notificação
    chatWindow.scrollTop = chatWindow.scrollHeight;
});
