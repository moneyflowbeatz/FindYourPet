
function validateRegistrationForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const phone = document.getElementById('phone').value;

    if (!email || !password || !confirmPassword || !phone) {
        alert("Пожалуйста, заполните все поля");
        return false;
    }

    if (password !== confirmPassword) {
        alert("Пароли не совпадают");
        return false;
    }

    
    if (password.length < 6) {
        alert("Пароль должен быть не менее 6 символов");
        return false;
    }

    return true; 
}


function validateLoginForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert("Пожалуйста, заполните все поля");
        return false;
    }

    return true; 
}




function saveAuthToken(token) {
    localStorage.setItem('authToken', token);
}


async function submitLoginForm(event) {
    event.preventDefault();

    if (!validateLoginForm()) return;

    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };

    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
            saveAuthToken(result.token); 
            alert('Вход выполнен успешно!');
            window.location.href = 'profile.html'; 
        } else {
            alert(`Ошибка входа: ${result.message}`);
        }
    } catch (error) {
        console.error('Ошибка при отправке формы:', error);
        alert('Ошибка сети, попробуйте еще раз.');
    }
}


async function submitRegistrationForm(event) {
    event.preventDefault();

    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        phone: document.getElementById('phone').value
    };

    try {
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('authToken', result.token); 
            alert('Регистрация прошла успешно!');
            window.location.href = 'profile.html'; 
        } else {
            alert(`Ошибка регистрации: ${result.message}`);
        }
    } catch (error) {
        console.error('Ошибка при отправке формы:', error);
        alert('Ошибка сети, попробуйте еще раз.');
    }
}


