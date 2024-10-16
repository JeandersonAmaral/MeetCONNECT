// Função assíncrona para listar as salas disponíveis
async function listRooms() {
    // Obtém o token de autenticação do localStorage
    const token = localStorage.getItem('token');

    try {
        // Faz uma requisição GET para obter as salas
        const response = await fetch('http://localhost:3000/api/rooms', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Inclui o token no cabeçalho da requisição
            },
        });

        // Verifica se a resposta não foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao buscar salas.');
        }

        // Converte a resposta em JSON
        const rooms = await response.json();
        const roomContainer = document.getElementById('roomContainer');
        roomContainer.innerHTML = ''; // Limpa a lista anterior

        // Verifica se existem salas
        if (rooms.length === 0) {
            roomContainer.innerHTML = '<div class="text-center">Nenhuma sala disponível</div>';
            return; // Retorna se não houver salas
        }

        // Percorre cada sala e cria um card
        rooms.forEach(room => {
            const card = document.createElement('div');
            card.className = 'bg-neutral-800 p-4 rounded-md shadow-lg';
            
            // Define a palavra "usuário" no singular ou plural
            const userCapacityText = room.capacity === 1 ? 'usuário' : 'usuários';

            // Adiciona o conteúdo do card
            card.innerHTML = `
                <h3 class="font-bold text-2xl mb-2">${room.name}</h3>
                <span class="font-bold">Descrição:</span> ${room.description || 'N/A'}
                <br>
                <span class="font-bold">Capacidade:</span> ${room.capacity} ${userCapacityText}
                <br>
                <span class="font-bold">Status: </span> 
                <span class="${room.isActive ? 'text-green-500' : 'text-red-500'} italic">
                    ${room.isActive ? 'Ativa' : 'Inativa'}
                </span>
                <br>
                <br>
                <button onclick="joinRoom('${room._id}')" class="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-md">Entrar</button>
                <button onclick="deleteRoom('${room._id}')" class="bg-red-600 hover:bg-red-500 text-white p-2 rounded-md">Excluir</button>
            `;
            // Adiciona o card ao contêiner
            roomContainer.appendChild(card);
        });
    } catch (error) {
        // Trata erros na busca de salas
        console.error('Erro ao listar salas:', error);
        alert('Ocorreu um erro ao carregar as salas.'); 
    }
}

// Função assíncrona para criar uma nova sala
async function createRoom() {
    // Obtém o token de autenticação do localStorage
    const token = localStorage.getItem('token');
    // Obtém os valores dos campos do formulário
    const roomName = document.getElementById('roomName').value;
    const roomDescription = document.getElementById('roomDescription').value;
    const roomCapacity = document.getElementById('roomCapacity').value;

    try {
        // Faz uma requisição POST para criar a sala
        const response = await fetch('http://localhost:3000/api/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Define o tipo de conteúdo como JSON
                'Authorization': `Bearer ${token}`, // Inclui o token no cabeçalho da requisição
            },
            body: JSON.stringify({
                name: roomName, // Nome da sala
                description: roomDescription, // Descrição da sala
                capacity: roomCapacity // Capacidade da sala
            }),
        });

        // Verifica se a resposta não foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao criar a sala.');
        }

        // Converte a resposta em JSON
        const newRoom = await response.json();
        alert(newRoom.message); // Exibe a mensagem de sucesso
        listRooms(); // Atualiza a lista de salas após a criação
        document.getElementById('createRoomModal').classList.add('hidden'); // Fecha o modal
        document.getElementById('createRoomForm').reset(); // Reseta o formulário
    } catch (error) {
        // Trata erros na criação da sala
        console.error('Erro ao criar sala:', error);
        alert('Ocorreu um erro ao criar a sala.'); 
    }
}

// Função para fazer logout do usuário
function logout() {
    // Remove o token do localStorage
    localStorage.removeItem('token');
    // Redireciona para a tela de login
    alert('Você será desconectado. Faça login novamente para ver as salas.'); // Alerta de logout
    window.location.href = '../html/login.html'; // Ajuste o caminho conforme necessário
}

// Função para verificar se o usuário está logado
function checkAuthentication() {
    const token = localStorage.getItem('token');
    // Se não houver token, alerta o usuário e redireciona para login
    if (!token) {
        alert('Você precisa fazer login novamente.'); // Alerta para login
        window.location.href = '../html/login.html'; // Ajuste o caminho conforme necessário
    }
}

// Chama a função de verificação de autenticação ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication(); // Verifica se o usuário está autenticado
    listRooms(); // Lista as salas após a verificação
});

// Adiciona um event listener ao botão de logout
document.getElementById('logoutBtn').addEventListener('click', logout);
