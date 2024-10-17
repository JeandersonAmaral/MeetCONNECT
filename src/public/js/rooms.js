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
            roomContainer.innerHTML = '<div class="text-center text-white">Nenhuma sala disponível</div>';
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

function renderRoom(room) {
    const roomContainer = document.getElementById('roomContainer');
    const card = document.createElement('div');
    card.className = 'bg-neutral-800 p-4 rounded-md shadow-lg flex flex-col justify-between mb-4 relative';

    // Define a palavra "usuário" no singular ou plural
    const userCapacityText = room.capacity === 1 ? 'usuário' : 'usuários';

    // Criar o HTML do card com o toggle switch
    card.innerHTML = `
        <h3 class="font-bold text-2xl mb-2 text-white">${room.name}</h3>
        <div class="mb-2">
            <span class="font-bold text-gray-300">Descrição:</span> ${room.description.length > 100 ? room.description.substring(0, 100) + '...' : room.description}
        </div>
        <div class="mb-2">
            <span class="font-bold text-gray-300">Capacidade:</span> ${room.capacity} ${userCapacityText}
        </div>
        <div class="mb-2">
            <span class="font-bold text-gray-300">Status:</span> <span id="status-${room._id}" class=" italic text-${room.isActive ? 'green' : 'red'}-500">${room.isActive ? 'Ativa' : 'Inativa'}</span>
        </div>
        <div class="absolute top-4 right-4">
            <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" ${room.isActive ? 'checked' : ''} onchange="toggleRoomStatus('${room._id}', this.checked)" />
                <div class="w-11 h-6 bg-neutral-600 rounded-full peer-checked:bg-green-600 transition-colors duration-200"></div>
                <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 peer-checked:translate-x-5"></div>
            </label>
        </div>
        <div class="flex space-x-2">
            <button onclick="openEditModal('${room._id}', '${room.name}', '${room.description}', ${room.capacity})" class="bg-yellow-600 hover:bg-yellow-500 text-white p-2 rounded-md">Editar</button>
            <button onclick="openConfirmationModal('${room.name}', '${room._id}')" class="bg-red-600 hover:bg-red-500 text-white p-2 rounded-md">Excluir</button>
            <button onclick="joinRoom('${room._id}')" class="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-md">Entrar</button>
        </div>
    `;

    roomContainer.appendChild(card);
}

async function toggleRoomStatus(roomId, newStatus) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:3000/api/rooms/${roomId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao mudar o status da sala.');
        }

        const data = await response.json();

        // Atualizar o status da sala no front-end
        const statusElement = document.getElementById(`status-${roomId}`);
        statusElement.textContent = newStatus ? 'Ativa' : 'Inativa';
        statusElement.classList.toggle('text-green-500', newStatus);
        statusElement.classList.toggle('text-red-500', !newStatus);

        // Atualiza a lista de salas para refletir a mudança, se necessário
        // listRooms();
    } catch (error) {
        console.error('Erro ao mudar o status da sala:', error);
        // Removi o alerta, agora só loga no console
    }
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

// Função para abrir o modal de edição com as informações atuais da sala
function openEditModal(roomId, roomName, roomDescription, roomCapacity) {
    document.getElementById('editRoomName').value = roomName;
    document.getElementById('editRoomDescription').value = roomDescription;
    document.getElementById('editRoomCapacity').value = roomCapacity;

    const editRoomForm = document.getElementById('editRoomForm');
    editRoomForm.setAttribute('data-room-id', roomId); // Armazena o ID da sala no formulário

    document.getElementById('editRoomModal').classList.remove('hidden');
}

// Função para fechar o modal de edição
function closeEditModal() {
    document.getElementById('editRoomModal').classList.add('hidden');
}

// Função para salvar as alterações da sala
document.getElementById('editRoomForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const roomId = this.getAttribute('data-room-id'); // Pega o ID da sala do formulário
    const roomName = document.getElementById('editRoomName').value;
    const roomDescription = document.getElementById('editRoomDescription').value;
    const roomCapacity = document.getElementById('editRoomCapacity').value;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:3000/api/rooms/${roomId}`, {
            method: 'PUT',
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
            throw new Error('Erro ao editar a sala.');
        }

        const updatedRoom = await response.json();
        alert('Sala editada com sucesso!');
        closeEditModal(); // Fecha o modal
        listRooms(); // Atualiza a lista de salas
    } catch (error) {
        console.error('Erro ao editar sala:', error);
        alert('Ocorreu um erro ao editar a sala.');
    }
});

// Função para abrir o modal de confirmação
function openConfirmationModal(roomName, roomId) {
    const modal = document.getElementById('confirmationModal');
    const modalMessage = document.getElementById('modalMessage');
    const confirmButton = document.getElementById('confirmDeleteButton');

    modalMessage.textContent = `Tem certeza que deseja excluir a sala "${roomName}"?`;
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
    const modal = document.getElementById('logoutModal');
    modal.classList.remove('hidden'); // Abre o modal
}

// Função para confirmar logout
document.getElementById('confirmLogout').addEventListener('click', () => {
    // Remove o token do localStorage
    localStorage.removeItem('token');
    closeLogoutModal(); // Fecha o modal
    window.location.href = '../html/login.html'; // Redireciona para a tela de login
});

// Função para fechar o modal de logout
function closeLogoutModal() {
    const modal = document.getElementById('logoutModal');
    modal.classList.add('hidden');
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
