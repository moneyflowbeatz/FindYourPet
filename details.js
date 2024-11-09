
function getAdIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}


async function loadAdDetails() {
    const adId = getAdIdFromUrl();
    if (!adId) {
        alert('ID объявления не найден');
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`/api/ads/${adId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const adDetails = await response.json();
        if (response.ok) {
            displayAdDetails(adDetails);
        } else {
            alert(`Ошибка загрузки данных: ${adDetails.message}`);
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Ошибка при загрузке объявления:', error);
        alert('Ошибка сети, попробуйте снова');
    }
}

function displayAdDetails(ad) {
    const adDetailsContainer = document.getElementById('ad-details');
    adDetailsContainer.innerHTML = `
        <p><strong>Район:</strong> ${ad.location}</p>
        <p><strong>Дата находки:</strong> ${ad.dateFound}</p>
        <p><strong>Вид животного:</strong> ${ad.animalType}</p>
        <p><strong>Порода:</strong> ${ad.breed || 'Не указано'}</p>
        <p><strong>Описание:</strong> ${ad.additionalInfo || 'Нет описания'}</p>
        <div class="photos">
            ${ad.photos.map(photo => `<img src="${photo.url}" alt="Фото животного">`).join('')}
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', loadAdDetails);
