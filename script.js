console.log("✅ script.js optimized version loaded");

// ===============================
// Wind Direction Utilities
// ===============================
function getWindRotation(direction) {
    const directions = {
        'N': 0, 'NNE': 22.5, 'NE': 45, 'ENE': 67.5,
        'E': 90, 'ESE': 112.5, 'SE': 135, 'SSE': 157.5,
        'S': 180, 'SSW': 202.5, 'SW': 225, 'WSW': 247.5,
        'W': 270, 'WNW': 292.5, 'NW': 315, 'NNW': 337.5
    };
    return directions[direction] || 0;
}

// ===============================
// Weather Condition Name Mapping
// ===============================
function getReadableWeatherName(weatherCode) {
    const weatherNames = {
        'clear': 'Clear',
        'clearday': 'Clear Day',
        'clearnight': 'Clear Night',
        'cloudy': 'Cloudy',
        'cloudyday': 'Cloudy Day',
        'cloudynight': 'Cloudy Night',
        'pcloudy': 'Partly Cloudy',
        'pcloudyday': 'Partly Cloudy',
        'pcloudynight': 'Partly Cloudy',
        'mcloudy': 'Mostly Cloudy',
        'mcloudyday': 'Mostly Cloudy',
        'mcloudynight': 'Mostly Cloudy',
        'rain': 'Rain',
        'lightrain': 'Light Rain',
        'lightrainday': 'Light Rain',
        'lightrainnight': 'Light Rain',
        'oshower': 'Occasional<br>Showers',
        'oshowerday': 'Occasional<br>Showers',
        'oshowernight': 'Occasional<br>Showers',
        'ishower': 'Isolated<br>Showers',
        'ishowerday': 'Isolated<br>Showers',
        'ishowernight': 'Isolated<br>Showers',
        'snow': 'Snow',
        'ts': 'Thunderstorm'
    };
    
    return weatherNames[weatherCode.toLowerCase()] || weatherCode;
}

function createWindCompass(direction, speed) {
    const rotation = getWindRotation(direction);
    return `
        <div class="wind-info">
            <div class="wind-compass">
                <div class="compass-directions">
                    <div class="compass-n">N</div>
                    <div class="compass-s">S</div>
                    <div class="compass-e">E</div>
                    <div class="compass-w">W</div>
                </div>
                <div class="wind-arrow" style="transform: rotate(${rotation}deg)"></div>
            </div>
            <div class="wind-speed-text">${speed} km/h</div>
            <div class="wind-direction-text">${direction}</div>
        </div>
    `;
}

// ===============================
// Weather Icon Mapping
// ===============================
const iconMap = {
    // Clear conditions
    clear: "☀️",
    clearday: "☀️",
    clearnight: "🌙",

    // Cloudy conditions
    cloudy: "☁️",
    cloudyday: "☁️",
    cloudynight: "☁️",
    pcloudy: "⛅",
    pcloudyday: "⛅",
    pcloudynight: "⛅",
    mcloudy: "🌤️",
    mcloudyday: "🌤️",
    mcloudynight: "🌤️",

    // Rain conditions
    rain: "🌧️",
    lightrain: "🌦️",
    lightrainday: "🌦️",
    lightrainnight: "🌦️",

    // Shower conditions
    oshower: "🌦️",
    oshowerday: "🌦️",
    oshowernight: "🌦️",
    ishower: "🌧️",
    ishowerday: "🌧️",
    ishowernight: "🌧️",

    // Severe weather
    snow: "❄️",
    ts: "⛈️",

    // Default fallback
    default: "🌈"
};

// ===============================
// Background Images
// ===============================
const cityBackgrounds = {
    paris: "images/paris.jpg",
    london: "images/london.jpg",
    brussels: "images/brussels.jpg",
    amsterdam: "images/amsterdam.jpg",
    geneva: "images/geneva.jpg",
    berlin: "images/berlin.jpg",
    vienna: "images/vienna.jpg",
    prague: "images/prague.jpg",
    budapest: "images/budapest.jpg",
    warsaw: "images/warsaw.jpg",
    rome: "images/rome.jpg",
    madrid: "images/madrid.jpg",
    athens: "images/athens.jpg",
    lisbon: "images/lisbon.jpg",
    bucharest: "images/bucharest.jpg",
    stockholm: "images/stockholm.jpg",
    helsinki: "images/helsinki.jpg",
    copenhagen: "images/copenhagen.jpg",
    oslo: "images/oslo.jpg",
    dublin: "images/dublin.jpg"
};

// ===============================
// Elements
// ===============================
const citySelect = document.getElementById("citySelect");
const getForecastBtn = document.getElementById("getForecastBtn");
const forecastContainer = document.getElementById("forecast");
const mapContainer = document.getElementById("mapContainer");

let currentBg = "images/eu.jpg";
// Set initial background
document.body.style.backgroundImage = `url('${currentBg}')`;
document.body.style.backgroundSize = 'cover';
document.body.style.backgroundPosition = 'center';
document.body.style.backgroundAttachment = 'fixed';
document.body.style.backgroundRepeat = 'no-repeat';

// ===============================
// Fade Transition for Backgrounds
// ===============================
function crossfadeBackground(newBg) {
    // Prevent unnecessary transitions if same background
    if (currentBg === newBg) {
        console.log("Same background, skipping transition");
        return;
    }

    const img = new Image();
    img.src = newBg;
    img.onload = () => {
        // Create overlay for smooth transition
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.inset = "0";
        overlay.style.background = `url('${newBg}') center/cover no-repeat`;
        overlay.style.backgroundAttachment = "fixed";
        overlay.style.opacity = "0";
        overlay.style.transition = "opacity 1.2s ease-in-out";
        overlay.style.zIndex = "-1";
        overlay.style.pointerEvents = "none";
        document.body.appendChild(overlay);

        // Fade in new background
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                overlay.style.opacity = "1";
            });
        });

        // After transition, update main background and remove overlay
        setTimeout(() => {
            document.body.style.backgroundImage = `url('${newBg}')`;
            overlay.remove();
            currentBg = newBg;
            console.log(`Background changed to: ${newBg}`);
        }, 1200);
    };
    img.onerror = () => {
        console.warn(`Failed to load background image: ${newBg}`);
    };
}

// ===============================
// Forecast Button Logic
// ===============================
getForecastBtn.addEventListener("click", async () => {
    const selectedOption = citySelect.selectedOptions[0];
    if (!selectedOption) return;

    const [lat, lon] = selectedOption.value.split(",");
    const bgKey = selectedOption.dataset.bg;
    const city = selectedOption.textContent;

    if (!lat || !lon || !cityBackgrounds[bgKey]) return;

    // Update the forecast separator title with selected city
    const separator = document.querySelector('.forecast-separator');
    if (separator) {
        separator.setAttribute('data-city', city);
    }
    
    // Show main content area
    const mainElement = document.querySelector('main');
    mainElement.classList.add('show');

    const newBg = cityBackgrounds[bgKey];
    crossfadeBackground(newBg);

    // ===============================
    // 🗺️ Fast Static Map (Yandex)
    // ===============================
    const mapUrl = `https://static-maps.yandex.ru/1.x/?ll=${lon},${lat}&z=6&size=650,350&l=map&pt=${lon},${lat},pm2rdm&lang=en_US`;

    mapContainer.innerHTML = `<div class="map-overlay">Loading map...</div>`;
    const overlay = mapContainer.querySelector(".map-overlay");

    const mapImg = new Image();
    mapImg.src = mapUrl;
    mapImg.onload = () => {
        overlay.classList.add("hidden");
        mapContainer.appendChild(mapImg);
        mapImg.classList.add("fade-in");
    };
    mapImg.onerror = () => {
        overlay.textContent = "Failed to load map.";
    };

    // ===============================
    // ☁️ Fetch Forecast
    // ===============================
    forecastContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: white;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">⏳</div>
            <p>Loading weather forecast...</p>
        </div>
    `;

    const url = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;

    console.log("Fetching weather data from:", url);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get response as text first to fix malformed JSON
        const responseText = await response.text();
        
        // Fix malformed JSON by replacing missing values
        const fixedJson = responseText
            .replace(/"temp2m"\s*:\s*,/g, '"temp2m": null,')
            .replace(/"rh2m"\s*:\s*,/g, '"rh2m": null,')
            .replace(/"prec_amount"\s*:\s*,/g, '"prec_amount": 0,')
            .replace(/,\s*}/g, '}')  // Remove trailing commas
            .replace(/,\s*]/g, ']'); // Remove trailing commas in arrays

        const data = JSON.parse(fixedJson);
        console.log("Weather data received:", data);

        if (!data || !data.dataseries) {
            throw new Error("Invalid data structure received from API");
        }

        displayForecast(data);

        setTimeout(() => {
            document.querySelector('main').scrollIntoView({ behavior: "smooth", block: "start" });
        }, 1800);
    } catch (error) {
        console.error("Error fetching weather data:", error);

        let errorMessage = "Unable to load weather data. ";
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage += "This might be a network connectivity issue or CORS restriction.";
        } else if (error.message.includes('HTTP error')) {
            errorMessage += `Server responded with error: ${error.message}`;
        } else {
            errorMessage += error.message;
        }

        forecastContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #ff6b6b; background: rgba(255, 107, 107, 0.1); border-radius: 10px; margin: 1rem;">
                <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
                <p><strong>Error:</strong> ${errorMessage}</p>
                <p style="font-size: 0.9rem; color: #ffcccc; margin-top: 1rem;">
                    Please try again or check your internet connection.
                </p>
            </div>
        `;
    }
});

// ===============================
// Display Forecast Cards
// ===============================
function displayForecast(data) {
    console.log("displayForecast called with data:", data);

    if (!data || !data.dataseries) {
        console.error("Invalid data structure:", data);
        forecastContainer.innerHTML = `<p style="color:red;">Invalid weather data received</p>`;
        return;
    }

    forecastContainer.innerHTML = "";

    // Filter out invalid entries and get first 7 valid ones
    const validForecasts = data.dataseries.filter(day => {
        const hasWeather = day.weather && typeof day.weather === 'string';
        const hasValidTemp = day.temp2m !== null && 
                           day.temp2m !== undefined && 
                           day.temp2m !== '' && 
                           day.temp2m !== -9999 && 
                           typeof day.temp2m === 'number' &&
                           !isNaN(day.temp2m);
        
        return hasWeather && hasValidTemp;
    }).slice(0, 7);

    console.log("Processing valid forecasts:", validForecasts);

    if (validForecasts.length === 0) {
        forecastContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #ff6b6b;">
                <p>No valid weather data available for this location.</p>
            </div>
        `;
        return;
    }

    const bgColors = {
        // Clear conditions
        clear: "linear-gradient(145deg, #f6d365 0%, #fda085 100%)",
        clearday: "linear-gradient(145deg, #f6d365 0%, #fda085 100%)",
        clearnight: "linear-gradient(145deg, #1e3c72 0%, #2a5298 100%)",

        // Cloudy conditions
        cloudy: "linear-gradient(145deg, #667db6 0%, #0082c8 100%)",
        cloudyday: "linear-gradient(145deg, #667db6 0%, #0082c8 100%)",
        cloudynight: "linear-gradient(145deg, #4a6fa5 0%, #166ba0 100%)",
        pcloudy: "linear-gradient(145deg, #89f7fe 0%, #66a6ff 100%)",
        pcloudyday: "linear-gradient(145deg, #89f7fe 0%, #66a6ff 100%)",
        pcloudynight: "linear-gradient(145deg, #667db6 0%, #3a5998 100%)",
        mcloudy: "linear-gradient(145deg, #757f9a 0%, #d7dde8 100%)",
        mcloudyday: "linear-gradient(145deg, #757f9a 0%, #d7dde8 100%)",
        mcloudynight: "linear-gradient(145deg, #5a6c8a 0%, #c0c7d8 100%)",

        // Rain conditions
        rain: "linear-gradient(145deg, #4b79a1 0%, #283e51 100%)",
        lightrain: "linear-gradient(145deg, #6a11cb 0%, #2575fc 100%)",
        lightrainday: "linear-gradient(145deg, #6a11cb 0%, #2575fc 100%)",
        lightrainnight: "linear-gradient(145deg, #4b79a1 0%, #283e51 100%)",

        // Shower conditions
        oshower: "linear-gradient(145deg, #667db6 0%, #0082c8 100%)",
        oshowerday: "linear-gradient(145deg, #667db6 0%, #0082c8 100%)",
        oshowernight: "linear-gradient(145deg, #4b79a1 0%, #283e51 100%)",
        ishower: "linear-gradient(145deg, #4b79a1 0%, #283e51 100%)",
        ishowerday: "linear-gradient(145deg, #667db6 0%, #0082c8 100%)",
        ishowernight: "linear-gradient(145deg, #4b79a1 0%, #283e51 100%)",

        // Severe weather
        snow: "linear-gradient(145deg, #83a4d4 0%, #b6fbff 100%)",
        ts: "linear-gradient(145deg, #141E30 0%, #243B55 100%)"
    };

    validForecasts.forEach((day, i) => {
        // Create wrapper div for day title + card
        const dayWrapper = document.createElement("div");
        dayWrapper.classList.add("forecast-day");
        
        // Create date title
        const dayTitle = document.createElement("div");
        dayTitle.classList.add("day-title");
        
        const date = new Date();
        date.setDate(date.getDate() + i);
        
        dayTitle.textContent = date.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short"
        });
        
        // Create weather card
        const card = document.createElement("div");
        card.classList.add("weather-card");
        
        // Add staggered animation delay
        card.style.animationDelay = `${i * 0.15}s`;

        const bgStyle =
            bgColors[day.weather.toLowerCase()] ||
            "linear-gradient(145deg, #434343 0%, #000000 100%)";

        card.style.background = bgStyle;

        const weatherIcon = iconMap[day.weather.toLowerCase()] || iconMap.default || "🌈";
        const readableWeather = getReadableWeatherName(day.weather);
        
        console.log(`Weather: ${day.weather}, Icon: ${weatherIcon}, Readable: ${readableWeather}`);

        // Safe wind data handling with km/h conversion
        const windDirection = day.wind10m?.direction || 'N';
        const windSpeedMS = day.wind10m?.speed || 0;
        const windSpeedKMH = Math.round(windSpeedMS * 3.6); // Convert m/s to km/h
        
        console.log(`Wind data for day ${i}:`, {
            direction: windDirection,
            speed: windSpeedMS,
            speedKMH: windSpeedKMH,
            rotation: getWindRotation(windDirection),
            wind10m: day.wind10m
        });

        const windCompass = createWindCompass(windDirection, windSpeedKMH);

        card.innerHTML = `
      <div class="weather-icon">${weatherIcon}</div>
      <strong>${readableWeather}</strong>
      <p>${day.temp2m} °C</p>
      ${windCompass}
    `;

        // Append title and card to wrapper
        dayWrapper.appendChild(dayTitle);
        dayWrapper.appendChild(card);
        
        // Append wrapper to forecast container
        forecastContainer.appendChild(dayWrapper);
    });

    // Remove any existing fade-in class and let individual cards animate
    forecastContainer.classList.remove("fade-in");
    setTimeout(() => forecastContainer.classList.remove("fade-in"), 1500);
}
