async function submitAdForm(event) {
    event.preventDefault();
    console.log('Форма отправлена');
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        alert('Пожалуйста, войдите в систему');
        window.location.href = 'login.html';
        return;
    }

    const adData = {
        animalType: document.getElementById('animal-type').value,
        location: document.getElementById('location').value,
        additionalInfo: document.getElementById('additional-info').value,
    };

    try {
        const response = await fetch('http://localhost:5000/ads', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adData),
        });

        if (response.ok) {
            alert('Объявление успешно добавлено');
            loadUserAds(); 
        } else {
            const error = await response.json();
            alert(`Ошибка: ${error.message}`);
        }
    } catch (error) {
        console.error('Ошибка при добавлении объявления:', error);
        alert('Ошибка сети, попробуйте еще раз.');
    }
}

async function loadUserAds() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) return;

    try {
        const response = await fetch('http://localhost:5000/ads', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        const ads = await response.json();
        displayAds(ads);
    } catch (error) {
        console.error('Ошибка при загрузке объявлений:', error);
        alert('Ошибка сети, попробуйте позже.');
    }
}

function displayAds(ads) {
    const adsContainer = document.querySelector('.user-ads');
    adsContainer.innerHTML = ''; 

    ads.forEach(ad => {
        const adItem = document.createElement('div');
        adItem.classList.add('ad-item');
        adItem.innerHTML = `
            <p><strong>Район:</strong> ${ad.location}</p>
            <p><strong>Дата добавления:</strong> ${formatDate(ad.dateAdded)}</p>
            <p><strong>Тип животного:</strong> ${ad.animalType}</p>
            <p><strong>Описание:</strong> ${ad.additionalInfo}</p>
            <button onclick="editAd('${ad.id}')">Редактировать</button>
            <button onclick="deleteAd('${ad.id}')">Удалить</button>
        `;
        adsContainer.appendChild(adItem);
    });
}


async function editAd(adId) {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) return;

    const updatedInfo = prompt("Введите новую информацию для объявления:");
    if (!updatedInfo) return;

    try {
        const response = await fetch(`http://localhost:5000/ads/${adId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ additionalInfo: updatedInfo })
        });

        if (response.ok) {
            alert('Объявление успешно обновлено');
            loadUserAds(); // Обновляем список объявлений
        } else {
            alert('Ошибка при обновлении объявления');
        }
    } catch (error) {
        console.error('Ошибка при редактировании объявления:', error);
    }
}

async function deleteAd(adId) {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) return;

    if (!confirm('Вы уверены, что хотите удалить это объявление?')) return;

    try {
        const response = await fetch(`http://localhost:5000/ads/${adId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            alert('Объявление успешно удалено');
            loadUserAds(); 
        } else {
            alert('Ошибка при удалении объявления');
        }
    } catch (error) {
        console.error('Ошибка при удалении объявления:', error);
    }
}


function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    return date.toLocaleDateString('ru-RU', options).replace(',', ''); 
}