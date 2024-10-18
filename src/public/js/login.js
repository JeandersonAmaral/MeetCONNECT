// src/js/login.js
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o envio padrão do formulário

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loadingIndicator = document.getElementById('loading');

    // Mostra o indicador de carregamento
    loadingIndicator.classList.remove('hidden');

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Salva o token no localStorage
            localStorage.setItem('token', data.token);
            
            // Verifica se o nome do usuário está disponível e salva
            if (data.name) { // Ajuste aqui
                localStorage.setItem('userName', data.name); // Salva o nome do usuário
            }

            // Aguarda segundos antes de ocultar o carregador e redirecionar
            setTimeout(() => {
                // Oculta o indicador de carregamento
                loadingIndicator.classList.add('hidden');
                
                // Redireciona para a tela de salas
                window.location.href = 'rooms.html';
            }, 500);
        } else {
            // Oculta o indicador de carregamento em caso de erro
            loadingIndicator.classList.add('hidden');
            
            // Exibe mensagem de erro
            document.getElementById('error-message').textContent = data.message;
            document.getElementById('error-message').classList.remove('hidden');
        }
    } catch (error) {
        console.error('Erro:', error);
        
        // Oculta o indicador de carregamento se ocorrer um erro
        loadingIndicator.classList.add('hidden');
    }
});
