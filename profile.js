async function loadUserProfile() {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        alert('Пожалуйста, войдите в систему');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const profileData = await response.json();
            displayProfile(profileData.user);
        } else {
            alert('Ошибка при загрузке профиля. Пожалуйста, войдите снова.');
            localStorage.removeItem('authToken');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
        alert('Ошибка сети, попробуйте позже');
    }
}

function displayProfile(user) {
    document.getElementById('email').textContent = user.email;
    document.getElementById('phone').textContent = user.phone;
    document.getElementById('total-ads').textContent = user.totalAds;
}

document.addEventListener('DOMContentLoaded', loadUserProfile);



function renderUserAds(ads) {
    const adsContainer = document.querySelector('.user-ads');
    adsContainer.innerHTML = ''; 

    ads.forEach(ad => {
        const adItem = document.createElement('div');
        adItem.classList.add('ad-item');
        adItem.innerHTML = `
            <p><strong>Район:</strong> ${ad.location}</p>
            <p><strong>Дата добавления:</strong> ${ad.dateAdded}</p>
            <p><strong>Порода:</strong> ${ad.breed}</p>
            <button class="edit-button">Редактировать</button>
            <button class="delete-button">Удалить</button>
        `;
        adsContainer.appendChild(adItem);
    });
}




function renderUserAds(ads) {
    const adsContainer = document.querySelector('.user-ads');
    adsContainer.innerHTML = ''; 

    ads.forEach(ad => {
        const adItem = document.createElement('div');
        adItem.classList.add('ad-item');
        adItem.innerHTML = `
            <p><strong>Район:</strong> ${ad.location}</p>
            <p><strong>Дата добавления:</strong> ${ad.dateAdded}</p>
            <p><strong>Тип животного:</strong> ${ad.animalType}</p>
            <p><strong>Описание:</strong> ${ad.additionalInfo}</p>
            <button onclick="editAd('${ad.id}')">Редактировать</button>
            <button onclick="deleteAd('${ad.id}')">Удалить</button>
        `;
        adsContainer.appendChild(adItem);
    });
}


