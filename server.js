const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); 

let users = [];

app.post('/register', (req, res) => {
    const { email, password, phone } = req.body;
    
    const newUser = {
        id: users.length + 1, 
        email,
        password, 
        phone,
        token: `valid_token_${users.length + 1}` 
    };
    
    users.push(newUser);

    res.status(200).json({ message: 'Пользователь зарегистрирован', token: newUser.token });

});


app.listen(5000, () => {
    console.log('Сервер запущен на http://localhost:5000');
});


app.get('/profile', (req, res) => {
    const authToken = req.headers.authorization;

    const user = users.find(u => `Bearer ${u.token}` === authToken);
    if (!user) {
        return res.status(401).json({ message: 'Неавторизован' });
    }


    res.status(200).json({
        user: {
            email: user.email,
            phone: user.phone,
            totalAds: 0 
        }
    });
});

