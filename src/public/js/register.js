// src/js/register.js
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o envio padrão do formulário

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loadingIndicator = document.getElementById('loading');

    // Mostra o indicador de carregamento
    loadingIndicator.classList.remove('hidden');

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        // Oculta o indicador de carregamento após a resposta
        loadingIndicator.classList.add('hidden');

        if (response.ok) {
            alert('Usuário criado com sucesso!');
            setTimeout(() => {
                window.location.href = 'login.html'; // Redireciona para a página de login após cadastro
            }, 2000); // Tempo de delay de 2 segundos
        } else {
            document.getElementById('error-message').textContent = data.message;
            document.getElementById('error-message').classList.remove('hidden');
        }
    } catch (error) {
        console.error('Erro:', error);
        loadingIndicator.classList.add('hidden'); // Oculta o indicador de carregamento se ocorrer um erro
    }
});
