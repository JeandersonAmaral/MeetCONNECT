const roomContainer = document.getElementById('roomContainer');

// Função para listar as salas
async function listRooms() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:3000/api/rooms', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar salas.');
        }

        const rooms = await response.json();
        roomContainer.innerHTML = ''; // Limpa a lista anterior

        // Verifica se existem salas
        if (rooms.length === 0) {
            roomContainer.innerHTML = '<div class="text-center">Nenhuma sala disponível</div>';
            return;
        }

        rooms.forEach(room => {
            renderRoom(room); // Chama a função para renderizar a sala
        });
    } catch (error) {
        console.error('Erro ao listar salas:', error);
        alert('Ocorreu um erro ao carregar as salas.');
    }
}

// Função para renderizar uma sala
function renderRoom(room) {
    const roomContainer = document.getElementById('roomContainer');
    const card = document.createElement('div');
    card.className = 'bg-neutral-800 p-4 rounded-md shadow-lg';

    // Define a palavra "usuário" no singular ou plural
    const userCapacityText = room.capacity === 1 ? 'usuário' : 'usuários';

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
        <button onclick="openConfirmationModal('${room.name}', '${room._id}')" class="bg-red-600 hover:bg-red-500 text-white p-2 rounded-md">Excluir</button>
    `;
    roomContainer.appendChild(card);
}

// Função para criar uma nova sala
async function createRoom() {
    const token = localStorage.getItem('token');
    const roomName = document.getElementById('roomName').value;
    const roomDescription = document.getElementById('roomDescription').value;
    const roomCapacity = document.getElementById('roomCapacity').value;

    try {
        const response = await fetch('http://localhost:3000/api/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: roomName,
                description: roomDescription,
                capacity: roomCapacity
            }),
        });

        if (!response.ok) {
            throw new Error('Erro ao criar a sala.');
        }

        const newRoom = await response.json();
        alert(newRoom.message);
        listRooms(); // Atualiza a lista de salas após a criação
        document.getElementById('createRoomModal').classList.add('hidden'); // Fecha o modal
        document.getElementById('createRoomForm').reset(); // Reseta o formulário
    } catch (error) {
        console.error('Erro ao criar sala:', error);
        alert('Ocorreu um erro ao criar a sala.');
    }
}

// Função para abrir o modal de confirmação
function openConfirmationModal(roomName, roomId) {
    const modal = document.getElementById('confirmationModal');
    const modalMessage = document.getElementById('modalMessage');
    const confirmButton = document.getElementById('confirmDeleteButton');

    modalMessage.textContent = `Tem certeza que deseja excluia a sala "${roomName}"?`;
    confirmButton.setAttribute('onclick', `deleteRoom('${roomId}')`); // Atualiza o botão de confirmação com o ID da sala
    modal.classList.remove('hidden');
}

// Função para fechar o modal de confirmação
function closeConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    modal.classList.add('hidden');
}

// Função de exclusão da sala
async function deleteRoom(roomId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:3000/api/rooms/${roomId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir a sala.');
        }

        alert('Sala excluída com sucesso!');
        closeConfirmationModal(); // Fecha o modal após a exclusão
        listRooms(); // Atualiza a lista de salas após a exclusão
    } catch (error) {
        console.error('Erro ao excluir sala:', error);
        alert('Ocorreu um erro ao excluir a sala.');
    }
}

document.getElementById('createRoomBtn').addEventListener('click', () => {
    document.getElementById('createRoomModal').classList.remove('hidden');
});

document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('createRoomModal').classList.add('hidden');
});

document.getElementById('createRoomForm').onsubmit = async (event) => {
    event.preventDefault();
    await createRoom(); // Chama a função de criar sala
};


// Função de logout
function logout() {
    // Remove o token do localStorage
    localStorage.removeItem('token');
    // Redireciona para a tela de login
    alert('Você será desconectado. Faça login novamente para ver as salas.'); // Alerta de logout
    window.location.href = '../html/login.html'; // Ajuste o caminho conforme necessário
}

// Verifica se o usuário está logado
function checkAuthentication() {
    const token = localStorage.getItem('token');
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
