// Временное хранилище данных
let works = JSON.parse(localStorage.getItem('works'));

// Если данных нет, добавим тестовые
if (!works || works.length === 0) {
    works = [
        {
            city: 'Москва',
            streets: ['Ленина', 'Пушкина'],
            houses: ['1', '2', '3'],
            isEmergency: true,
            startDate: '2024-03-20 10:00',
            endDate: '2024-03-21 18:00'
        },
        {
            city: 'Санкт-Петербург',
            streets: ['Невский проспект'],
            houses: ['10', '12'],
            isEmergency: false,
            startDate: '2024-03-22 09:00',
            endDate: '2024-03-22 20:00'
        }
    ];
    // Сохраняем тестовые данные в localStorage
    saveWorks();
}

let users = [
    { username: 'Админ', password: '12345', role: 'admin' },
    { username: 'specialist', password: 'spec123', role: 'specialist', cities: ['moscow'] }
];

// Заполняем список областей при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const regionSelect = document.getElementById('region');
    
    // Собираем все области из всех округов
    const allRegions = [];
    for (const district of Object.values(russianRegions)) {
        for (const [key, region] of Object.entries(district.regions)) {
            allRegions.push({ key, ...region });
        }
    }
    
    // Сортируем по алфавиту
    allRegions.sort((a, b) => a.name.localeCompare(b.name));
    
    // Добавляем в select
    allRegions.forEach(region => {
        const option = document.createElement('option');
        option.value = region.key;
        option.textContent = region.name;
        regionSelect.appendChild(option);
    });
});

function updateCities() {
    const regionSelect = document.getElementById('region');
    const citySelect = document.getElementById('city');
    
    citySelect.innerHTML = '<option value="">Выберите город</option>';
    
    const selectedRegion = regionSelect.value;
    if (!selectedRegion) return;
    
    // Ищем выбранную область во всех округах
    let cities = [];
    for (const district of Object.values(russianRegions)) {
        if (district.regions[selectedRegion]) {
            cities = district.regions[selectedRegion].cities;
            break;
        }
    }
    
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.toLowerCase().replace(/\s+/g, '_');
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
}

function closeLoginForm() {
    document.getElementById('loginForm').style.display = 'none';
}

function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        if (user.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'specialist.html';
        }
    } else {
        alert('Неверное имя пользователя или пароль');
    }
}

// Функция для сохранения данных в localStorage
function saveWorks() {
    localStorage.setItem('works', JSON.stringify(works));
}

// Обновляем существующую функцию searchWorks
function searchWorks(event) {
    event.preventDefault();
    const federalDistrict = document.getElementById('federalDistrict').value;
    const region = document.getElementById('region').value;
    const city = document.getElementById('city').value;
    const street = document.getElementById('streetSearch').value;
    const house = document.getElementById('houseSearch').value;

    // Загружаем актуальные данные из localStorage
    works = JSON.parse(localStorage.getItem('works')) || [];

    const selectedCity = document.querySelector('#city option:checked').textContent;

    const results = works.filter(work => {
        return work.city.toLowerCase() === selectedCity.toLowerCase() && 
               work.streets.includes(street) && 
               work.houses.includes(house);
    });

    displayResults(results);
}

function displayResults(results) {
    const container = document.getElementById('searchResults');
    container.innerHTML = '';

    if (results.length === 0) {
        container.innerHTML = '<p>Ремонтные работы не найдены</p>';
        return;
    }

    results.forEach(work => {
        const div = document.createElement('div');
        div.className = `work-item ${work.isEmergency ? 'emergency' : ''} ${work.resolved ? 'resolved' : ''}`;
        
        const status = work.resolved ? 'Отключение устранено' : 
                      work.isEmergency ? 'Внеплановое отключение' : 'Плановое отключение';
        
        div.innerHTML = `
            <h3>${status}</h3>
            <p>Город: ${work.city}</p>
            <p>Улица: ${work.streets.join(', ')}</p>
            <p>Дома: ${work.houses.join(', ')}</p>
            <p>${work.isEmergency ? 'Время поступления заявки' : 'Время отключения'}: ${work.startDate}</p>
            ${work.endDate ? `<p>Планируемое время окончания: ${work.endDate}</p>` : ''}
        `;
        
        container.appendChild(div);
    });
} 