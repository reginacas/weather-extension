// Replace with your actual OpenWeatherMap API key
const API_KEY = '84ac3d9744ab7fba2763aa67ee5e202a';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM elements
const form = document.querySelector('form');
const input = document.querySelector('.enter');
const tempElement = document.querySelector('#temp p');
const imageElement = document.querySelector('.img-container img');
const infoDiv = document.querySelector('.info');

// Weather condition mappings for images
const weatherImages = {
    'clear': 'img/sunny.png',
    'clouds': 'img/cloudy.png',
    'rain': 'img/rainy.png',
    'drizzle': 'img/rainy.png',
    'thunderstorm': 'img/rainy.png',
    'snow': 'img/snowy.png',
    'mist': 'img/cloudy.png',
    'smoke': 'img/cloudy.png',
    'haze': 'img/cloudy.png',
    'dust': 'img/cloudy.png',
    'fog': 'img/cloudy.png',
    'sand': 'img/cloudy.png',
    'ash': 'img/cloudy.png',
    'squall': 'img/rainy.png',
    'tornado': 'img/rainy.png'
};

// Function to get weather data
async function getWeatherData(cityName) {
    try {
        const response = await fetch(`${API_URL}?q=${cityName}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

// Function to show weather elements after first search
function showWeatherElements() {
    document.querySelector('.img-container').style.display = 'block';
}

// Function to update the UI with weather data
function updateWeatherUI(weatherData) {
    const temperature = Math.round(weatherData.main.temp);
    const weatherCondition = weatherData.weather[0].main.toLowerCase();
    const description = weatherData.weather[0].description;
    const highTemp = Math.round(weatherData.main.temp_max);
    const lowTemp = Math.round(weatherData.main.temp_min);
    const humidity = weatherData.main.humidity;
    const feelsLike = Math.round(weatherData.main.feels_like);
    const cityName = weatherData.name;
    const country = weatherData.sys.country;

    // Show weather elements
    showWeatherElements();

    // Update temperature display
    tempElement.textContent = temperature;

    // Update weather image
    const imagePath = weatherImages[weatherCondition] || 'img/sunny.png';
    imageElement.src = imagePath;
    imageElement.alt = `${description} weather`;

    // Update info section
    infoDiv.innerHTML = `
        <div class="location">
            <h3>${cityName}, ${country}</h3>
        </div>
        <div class="weather-details">
            <div class="detail-item">
                <span class="label">High/Low:</span>
                <span class="value">${highTemp}° / ${lowTemp}°</span>
            </div>
            <div class="detail-item">
                <span class="label">Feels like:</span>
                <span class="value">${feelsLike}°C</span>
            </div>
            <div class="detail-item">
                <span class="label">Humidity:</span>
                <span class="value">${humidity}%</span>
            </div>
            <div class="detail-item">
                <span class="label">Condition:</span>
                <span class="value">${description.charAt(0).toUpperCase() + description.slice(1)}</span>
            </div>
        </div>
    `;

    // Show the info section
    infoDiv.style.display = 'block';
}

// Function to show error message
function showError(message) {
    infoDiv.innerHTML = `
        <div class="error">
            <p>❌ ${message}</p>
        </div>
    `;
    infoDiv.style.display = 'block';
}

// Function to show loading state
function showLoading() {
    infoDiv.innerHTML = `
        <div class="loading">
            <p>🔄 Loading weather data...</p>
        </div>
    `;
    infoDiv.style.display = 'block';
}

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const cityName = input.value.trim();
    
    if (!cityName) {
        showError('Please enter a city name');
        return;
    }

    // Check if API key is set
    if (API_KEY === 'YOUR_API_KEY') {
        showError('Please set your OpenWeatherMap API key in the code');
        return;
    }

    showLoading();

    try {
        const weatherData = await getWeatherData(cityName);
        updateWeatherUI(weatherData);
    } catch (error) {
        if (error.message.includes('404')) {
            showError('City not found. Please check the spelling and try again.');
        } else if (error.message.includes('401')) {
            showError('Invalid API key. Please check your OpenWeatherMap API key.');
        } else if (error.message.includes('429')) {
            showError('API limit exceeded. Please try again later.');
        } else {
            showError('Failed to fetch weather data. Please try again.');
        }
    }
});


// Initialize
window.addEventListener('load', () => {
    // You can uncomment the line below to load a default city on startup
    input.value = 'Berlin';
    form.dispatchEvent(new Event('submit'));
});