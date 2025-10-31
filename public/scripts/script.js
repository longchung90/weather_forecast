
// ===== 0. GOOGLE MAPS INTEGRATION =====
window.initMap = function () {
    // This is called by Google Maps API
    console.log('🗺️ Google Maps callback triggered');

    // Initialize your map
    const mapElement = document.querySelector('gmp-map');
    if (mapElement) {
        mapElement.addEventListener('gmp-click', (event) => {
            console.log('Map clicked:', event.detail.latLng);
        });
    }
};

// Wait for Google Maps before initializing app
function waitForGoogleMaps() {
    return new Promise((resolve) => {
        if (window.googleMapsLoaded) {
            resolve();
        } else {
            const checkInterval = setInterval(() => {
                if (window.googleMapsLoaded) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
        }
    });
}





// ===== 1. CONFIGURATION =====
const CONFIG = {
    DEFAULT_LAT: 48.85,
    DEFAULT_LON: 2.35,
    TRANSITION_DURATION: 1500,
    OVERLAY_CLEANUP_DELAY: 200
};
// ===== 2. DOM ELEMENTS ===== (✅ Same concept, organized differently)
const elements = {
    getForecastBtn: document.getElementById("getForecastBtn"),
    citySelect: document.getElementById("citySelect"),
    mainContent: document.querySelector("main"),
    forecastCityName: document.getElementById("forecastCityName"),
    weatherGrid: document.getElementById("weatherGrid"),
    forecastHeading: document.getElementById("forecastHeading"),
    forecastCityIcon: document.getElementById("forecastCityIcon"),
    mapContainer: document.querySelector(".map-container"),
    hero: document.querySelector(".hero")
};

// ===== 3. STATE ===== (✅ Same variables, grouped)
let map;
let marker;
let isLoading = false; // 🆕 Added loading state



// ===== 4. City Backgrounds =====

const cityBackgrounds = {
    paris: "images/paris.jpg",
    london: "images/london.jpg",
    berlin: "images/berlin.jpg",
    rome: "images/rome.jpg",
    madrid: "images/madrid.jpg",
    amsterdam: "images/amsterdam.jpg",
    vienna: "images/vienna.jpg",
    prague: "images/prague.jpg",
    budapest: "images/budapest.jpg",
    warsaw: "images/warsaw.jpg",
    athens: "images/athens.jpg",
    lisbon: "images/lisbon.jpg",
    bucharest: "images/bucharest.jpg",
    stockholm: "images/stockholm.jpg",
    helsinki: "images/helsinki.jpg",
    copenhagen: "images/copenhagen.jpg",
    oslo: "images/oslo.jpg",
    dublin: "images/dublin.jpg",
    geneva: "images/geneva.jpg",
    brussels: "images/brussels.jpg"
};


//=====5. Utility Functions======//
function showError(message) {
    console.error(message);
    // Optional: Add toast notification or error banner
    // You could add a simple error display here if needed
}

function setLoadingState(loading) {
    isLoading = loading;
    if (elements.getForecastBtn) {
        elements.getForecastBtn.disabled = loading;
        elements.getForecastBtn.textContent = loading ? 'Loading...' : 'Get Forecast';
    }
}

// =====6. City  Background Transition =====
function crossfadeBackground(newBg) {
    if (!newBg) return Promise.reject('No background provided'); // 🆕 Promise-based

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const overlay = document.createElement("div");
            overlay.style.cssText = `
                position: fixed;
                inset: 0;
                background: url('${newBg}') center/cover no-repeat;
                opacity: 0;
                z-index: -2;
                transition: opacity ${CONFIG.TRANSITION_DURATION}ms ease; // 🆕 Configurable
            `;

            document.body.appendChild(overlay);

            requestAnimationFrame(() => {
                overlay.style.opacity = "1";
                setTimeout(() => {
                    document.documentElement.style.setProperty("--hero-img", `url('${newBg}')`);
                    setTimeout(() => {
                        if (document.body.contains(overlay)) { // 🆕 Safety check
                            document.body.removeChild(overlay);
                        }
                        resolve(); // 🆕 Promise resolution
                    }, CONFIG.OVERLAY_CLEANUP_DELAY);
                }, CONFIG.TRANSITION_DURATION - 200);
            });
        };
        img.onerror = () => reject('Failed to load background image'); // 🆕 Error handling
        img.src = newBg;
    });
}


// =====7. City selection =====
function updateCitySelection() {
    if (!elements.citySelect) return; // 🆕 Safety check

    const selectedOption = elements.citySelect.options[elements.citySelect.selectedIndex];
    const bgKey = selectedOption?.dataset?.bg; // 🆕 Optional chaining
    const cityName = selectedOption?.dataset?.name;
    const flag = selectedOption?.dataset?.flag;

    if (elements.forecastCityIcon && flag) { // ✅ Same logic
        elements.forecastCityIcon.textContent = flag;
    }
    if (elements.forecastCityName && cityName) { // ✅ Same logic
        elements.forecastCityName.textContent = cityName;
    }

    const newBg = cityBackgrounds[bgKey]; // ✅ Same lookup
    if (newBg) {
        crossfadeBackground(newBg).catch(err => showError(`Background update failed: ${err}`)); // 🆕 Error handling
    }
}



//======8. MAP==================//
// ===============================
//  Google Maps Dynamic Initialization
// ===============================
let map;
let marker;

function initMap(lat = 48.85, lon = 2.35, zoomLevel = 8) {
    const mapEl = document.querySelector("gmp-map");

    if (!mapEl) {
        console.warn("Map element not found");
        return;
    }

    // Set attributes for the gmp-map Web Component
    mapEl.setAttribute("center", `${lat},${lon}`);
    mapEl.setAttribute("zoom", zoomLevel.toString());

    // Update or create marker
    let markerEl = document.querySelector("#marker");
    if (!markerEl) {
        markerEl = document.createElement("gmp-advanced-marker");
        markerEl.id = "marker";
        mapEl.appendChild(markerEl);
    }
    markerEl.setAttribute("position", `${lat},${lon}`);
}

// ===============================
// WEATHER CODE + ICON MAPS
// ===============================
const weatherMap = {
    clear: "Clear",
    pcloudy: "Partly Cloudy",
    mcloudy: "Mostly Cloudy",
    cloudy: "Overcast",
    humid: "Humid / Hazy",
    lightrain: "Light Rain",
    oshower: "Occasional Showers",
    ishower: "Isolated Showers",
    rain: "Rain",
    lightsnow: "Light Snow",
    snow: "Snow",
    rainsnow: "Rain / Snow",
    tsrain: "Thunderstorm + Rain",
    ts: "Thunderstorm",
    haze: "Hazy",
    fog: "Fog",
    windy: "Windy",
    icy: "Icy Conditions",
    frzr: "Freezing Rain",
    dust: "Dusty / Sandy",
};

const iconMap = {
    clear: "☀️",
    pcloudy: "🌤️",
    mcloudy: "⛅",
    cloudy: "☁️",
    rain: "🌧️",
    lightrain: "🌦️",
    oshower: "🌦️",
    ishower: "🌦️",
    lightsnow: "🌨️",
    snow: "❄️",
    rainsnow: "🌨️",
    tsrain: "⛈️",
    ts: "⚡️",
    fog: "🌫️",
    humid: "💧",
    windy: "🌬️",
    haze: "🌁",
    icy: "🧊",
    frzr: "🌨️",
    dust: "💨",
};

const readable = weatherMap[dayData.weather];

const icon = iconMap[dayData.weather];

// ===============================
// WEATHER UTILITIES
// ===============================
function degToCompass(deg) {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S',
        'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return dirs[Math.round(deg / 22.5) % 16];
}

function msToKmh(ms) {
    return Math.round(ms * 3.6);
}

// ===== 9. RENDER FUNCTIONS ===== (✅ Move this up here)
function createWeatherCard(dayData, index) {
    const card = document.createElement("div");
    card.className = "weather-card";

    // Date
    const date = new Date();
    date.setDate(date.getDate() + index);
    const dayName = date.toLocaleDateString("en-GB", { weekday: "short" });
    const dayNum = date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

    // Lookups
    const readable = weatherMap[dayData.weather] || "Unknown";
    const icon = iconMap[dayData.weather] || "☁️";
    const temp = dayData.temp2m ?? "N/A";
    const windDir = degToCompass(dayData.wind10m?.direction ?? 0);
    const windSpd = msToKmh(dayData.wind10m?.speed ?? 0);

    // Optional metrics
    const humidity = dayData.rh2m ? `${dayData.rh2m}%` : "—";
    const pressure = dayData.mslp ? `${dayData.mslp} hPa` : "—";

    // HTML template
    card.innerHTML = `
        <div class="weather-day">${dayName} ${dayNum}</div>
        <div class="weather-icon">${icon}</div>
        <div class="weather-temp">H: ${temp}°C &nbsp; L: ${temp}°C</div>
        <div class="weather-condition">${readable}</div>

        <div class="wind-info">
            <div class="wind-compass" style="--wind-direction: ${dayData.wind10m?.direction ?? 0}deg">
                <div class="wind-arrow"></div>
                <div class="wind-label n">N</div>
                <div class="wind-label s">S</div>
                <div class="wind-label e">E</div>
                <div class="wind-label w">W</div>
            </div>
            <div class="wind-speed-text">💨 ${windSpd} km/h</div>
            <div class="wind-direction-text">↗ ${windDir}</div>
        </div>

        <div class="weather-extra">
            <p>💧 Humidity: ${humidity}</p>
            <p>⏱ Pressure: ${pressure}</p>
        </div>
    `;

    return card;
}


function renderErrorState() {
    if (!elements.weatherGrid) return;

    elements.weatherGrid.innerHTML = `
        <div class="error-message">
            <p>Unable to load weather data. Please try again.</p>
        </div>
    `;
}

//=========10. Weather==========//
async function fetchWeather(lat, lon) {
    const url = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.dataseries || !Array.isArray(data.dataseries)) {
            throw new Error('Invalid weather data format');
        }

        renderWeatherCards(data.dataseries); // ✅ Now this function exists above
        return data;

    } catch (error) {
        showError(`Weather fetch failed: ${error.message}`);
        renderErrorState();
        throw error;
    }
}

//==============11. Event Handlers=================//
async function handleGetForecast() {
    if (isLoading || !elements.citySelect) return;

    const selectedValue = elements.citySelect.value;
    if (!selectedValue) {
        showError('Please select a city');
        return;
    }

    const [lat, lon] = selectedValue.split(",");
    const cityName = elements.citySelect.options[elements.citySelect.selectedIndex].text;

    setLoadingState(true);

    try {
        // ✅ 1. Update the city name
        if (elements.forecastCityName) {
            elements.forecastCityName.textContent = cityName;
        }

        // ✅ 2. Show the forecast section (reveal map, icons, etc.)
        const forecastSection = document.getElementById("forecastSection");
        if (forecastSection) {
            forecastSection.classList.remove("hidden");
            forecastSection.classList.add("visible");
        }

        // ✅ 3. Initialize map and fetch weather
        initMap(parseFloat(lat), parseFloat(lon), 9); // zoom=9 is great for cities

        // ✅ 4. Fade out hero section once data is ready
        if (elements.hero) {
            elements.hero.classList.add("fade-out");
        }

    } catch (error) {
        console.error('Forecast failed:', error);
    } finally {
        setLoadingState(false);
    }
}


// ===== 12. INITIALIZATION =====
// Show loading state
function setLoadingState(loading) {
    const btn = elements.getForecastBtn;
    if (loading) {
        btn.classList.add('loading');
        btn.disabled = true;
    } else {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}
async function initializeApp() {
    // Wait for Google Maps to load
    await waitForGoogleMaps();

    // Set up event listeners
    if (elements.citySelect) {
        elements.citySelect.addEventListener("change", updateCitySelection);
    }

    if (elements.getForecastBtn) {
        elements.getForecastBtn.addEventListener("click", handleGetForecast);
    }

    // Initialize map
    initMap();

    // Show main content
    if (elements.mainContent) {
        elements.mainContent.classList.add("show");
    }

    console.log("🌍 App initialized successfully");
}

// Make initializeApp global so HTML can call it
window.initializeApp = initializeApp;

// Only auto-initialize if Google Maps is already loaded
function initializeApp() {
    console.log("✅ App initialized");

    const overlay = document.getElementById("loadingOverlay");
    if (overlay) {
        overlay.classList.add("hidden");
    }

    // ... your existing initialization code ...
}


// ===== 13. APP START =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}