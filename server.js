const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); 


app.post('/register', (req, res) => {
    const { email, password } = req.body;

    console.log('Регистрация пользователя:', email);
    

    res.status(200).json({ message: 'Пользователь зарегистрирован' });
});


app.listen(5000, () => {
    console.log('Сервер запущен на http://localhost:5000');
});


app.get('/profile', (req, res) => {
    const authToken = req.headers.authorization;

    if (authToken !== 'Bearer valid_token') {
        return res.status(401).json({ message: 'Неавторизован' });
    }

    const userProfile = {
        email: 'user@example.com',
        phone: '+70000000000',
        totalAds: 2,
    };

    res.status(200).json({ user: userProfile });
});

