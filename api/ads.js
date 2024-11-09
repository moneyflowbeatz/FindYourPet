async function submitAdForm(event) {
    event.preventDefault();

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        alert('Пожалуйста, войдите в систему, чтобы добавить объявление');
        window.location.href = 'login.html';
        return;
    }

    const formData = new FormData();
    formData.append('contactPhone', document.getElementById('contact-phone').value);
    formData.append('contactEmail', document.getElementById('contact-email').value);
    formData.append('animalType', document.getElementById('animal-type').value);
    formData.append('additionalInfo', document.getElementById('additional-info').value);
    formData.append('location', document.getElementById('location').value);
    formData.append('dateFound', document.getElementById('date-found').value);

    const photos = document.getElementById('animal-photos').files;
    for (let i = 0; i < photos.length && i < 3; i++) {
        formData.append('photos', photos[i]);
    }

    try {
        const response = await fetch('/api/ads', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            alert('Объявление успешно добавлено!');
            window.location.href = 'profile.html'; 
        } else {
            alert(`Ошибка: ${result.message}`);
        }
    } catch (error) {
        console.error('Ошибка при добавлении объявления:', error);
        alert('Произошла ошибка, попробуйте еще раз');
    }
}



function renderAds(ads) {
    const adsContainer = document.getElementById('ads-container');
    adsContainer.innerHTML = ''; 

    ads.forEach(ad => {
        const adItem = document.createElement('div');
        adItem.classList.add('ad-item');
        adItem.innerHTML = `
            <p><strong>Район:</strong> ${ad.location}</p>
            <p><strong>Дата добавления:</strong> ${ad.dateAdded}</p>
            <p><strong>Вид:</strong> ${ad.animalType}</p>
            <p><strong>Порода:</strong> ${ad.breed}</p>
            <button onclick="viewAdDetails('${ad.id}')">Подробнее</button>
        `;
        adsContainer.appendChild(adItem);
    });
}


document.addEventListener('DOMContentLoaded', loadAds);


let allAds = [];


async function loadAds() {
    try {
        const response = await fetch('/api/ads', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const ads = await response.json();
        if (response.ok) {
            allAds = ads; 
            renderAds(ads);
        } else {
            alert(`Ошибка при загрузке объявлений: ${ads.message}`);
        }
    } catch (error) {
        console.error('Ошибка при загрузке объявлений:', error);
        alert('Ошибка сети, попробуйте позже');
    }
}

function filterAds() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredAds = allAds.filter(ad => ad.animalType.toLowerCase().includes(searchTerm));
    renderAds(filteredAds); 
}


function viewAdDetails(adId) {
    alert(`Подробная информация о объявлении ${adId}`);
    
}


function viewAdDetails(adId) {
    window.location.href = `details.html?id=${adId}`;
}

async function editAd(adId) {
    const authToken = localStorage.getItem('authToken');
    const updatedInfo = prompt("Введите новую информацию для объявления:");

    if (!updatedInfo || !authToken) return;

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
            alert('Объявление успешно обновлено!');
            loadUserProfile(); 
        } else {
            alert('Ошибка при обновлении объявления');
        }
    } catch (error) {
        console.error('Ошибка при редактировании объявления:', error);
    }
}

async function deleteAd(adId) {
    const authToken = localStorage.getItem('authToken');

    if (!confirm('Вы уверены, что хотите удалить это объявление?') || !authToken) return;

    try {
        const response = await fetch(`http://localhost:5000/ads/${adId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            alert('Объявление удалено');
            loadUserProfile(); 
        } else {
            alert('Ошибка при удалении объявления');
        }
    } catch (error) {
        console.error('Ошибка при удалении объявления:', error);
    }
}
