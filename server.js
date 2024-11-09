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

let ads = [];

app.post('/ads', (req, res) => {
    const authToken = req.headers.authorization;
    const user = users.find(u => `Bearer ${u.token}` === authToken);
    if (!user) {
        return res.status(401).json({ message: 'Неавторизован' });
    }

    const { animalType, location, additionalInfo } = req.body;
    const newAd = {
        id: ads.length + 1,
        userId: user.id,
        animalType,
        location,
        additionalInfo,
        dateAdded: new Date().toISOString(),
    };

    ads.push(newAd);
    res.status(201).json({ message: 'Объявление добавлено', ad: newAd });
});

app.get('/ads', (req, res) => {
    const authToken = req.headers.authorization;
    const user = users.find(u => `Bearer ${u.token}` === authToken);
    if (!user) {
        return res.status(401).json({ message: 'Неавторизован' });
    }

    const userAds = ads.filter(ad => ad.userId === user.id);
    res.status(200).json(userAds);
});

app.patch('/ads/:id', (req, res) => {
    const authToken = req.headers.authorization;
    const user = users.find(u => `Bearer ${u.token}` === authToken);
    if (!user) {
        return res.status(401).json({ message: 'Неавторизован' });
    }

    const adId = parseInt(req.params.id);
    const ad = ads.find(ad => ad.id === adId && ad.userId === user.id);
    if (!ad) {
        return res.status(404).json({ message: 'Объявление не найдено' });
    }

    ad.additionalInfo = req.body.additionalInfo || ad.additionalInfo;
    res.status(200).json({ message: 'Объявление обновлено', ad });
});

app.delete('/ads/:id', (req, res) => {
    const authToken = req.headers.authorization;
    const user = users.find(u => `Bearer ${u.token}` === authToken);
    if (!user) {
        return res.status(401).json({ message: 'Неавторизован' });
    }

    const adId = parseInt(req.params.id);
    const adIndex = ads.findIndex(ad => ad.id === adId && ad.userId === user.id);
    if (adIndex === -1) {
        return res.status(404).json({ message: 'Объявление не найдено' });
    }

    ads.splice(adIndex, 1);
    res.status(204).end();
});

