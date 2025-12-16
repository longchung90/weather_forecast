// ===============================================================
// DOM ELEMENTS
// ===============================================================
const elements = {
    btn: document.getElementById("getForecastBtn"),
    select: document.getElementById("citySelect"),
    section: document.getElementById("forecastSection"),
    grid: document.getElementById("weatherGrid"),
    cityName: document.getElementById("forecastCityName"),
    cityIcon: document.getElementById("forecastCityIcon"),
    overlay: document.getElementById("loadingOverlay")
};

// ===============================================================
// WEATHER ICONS
// ===============================================================
const ICONS_IOS = {
    clear: "☀️",
    pcloudy: "⛅",
    mcloudy: "🌥️",
    cloudy: "☁️",
    humid: "🌫️",
    lightrain: "🌦️",
    oshower: "🌦️",
    ishower: "🌦️",
    rain: "🌧️",
    lightsnow: "🌨️",
    snow: "❄️",
    rainsnow: "🌧️❄️",
    ts: "⛈️",
    tsrain: "⛈️",
    windy: "💨",
    clearday: "☀️",
    clearnight: "🌕",
    pcloudyday: "⛅",
    pcloudynight: "🌥️",
    mcloudyday: "🌥️",
    mcloudynight: "☁️",
    cloudyday: "☁️",
    cloudynight: "☁️",
    humidday: "🌫️",
    humidnight: "🌫️",
    lightrainday: "🌦️",
    lightrainnight: "🌧️",
    oshowerday: "🌦️",
    oshowernight: "🌧️",
    ishowerday: "🌦️",
    ishowernight: "🌧️",
    rainday: "🌧️",
    rainnight: "🌧️",
    lightsnowday: "🌨️",
    lightsnownight: "🌨️",
    snowday: "❄️",
    snownight: "❄️",
    rainsnowday: "🌧️❄️",
    rainsnownight: "🌧️❄️",
    tsday: "⛈️",
    tsnight: "⛈️",
    tsrainday: "⛈️",
    tsrainnight: "⛈️",
    default: "❓"
};

// ===============================================================
// WEATHER LABELS
// ===============================================================
const WEATHER_DETAILS = {
    clear: "Clear",
    pcloudy: "Partly Cloudy",
    mcloudy: "Mostly Cloudy",
    cloudy: "Cloudy",
    humid: "Humid",
    lightrain: "Light Rain",
    oshower: "Showers",
    ishower: "Showers",
    rain: "Rain",
    lightsnow: "Light Snow",
    snow: "Snow",
    rainsnow: "Rain & Snow",
    ts: "Thunderstorm",
    tsrain: "Thunderstorm",
    windy: "Windy",
    clearday: "Clear",
    clearnight: "Clear",
    pcloudyday: "Partly Cloudy",
    pcloudynight: "Partly Cloudy",
    mcloudyday: "Mostly Cloudy",
    mcloudynight: "Mostly Cloudy",
    cloudyday: "Cloudy",
    cloudynight: "Cloudy",
    humidday: "Humid",
    humidnight: "Humid",
    lightrainday: "Light Rain",
    lightrainnight: "Light Rain",
    oshowerday: "Showers",
    oshowernight: "Showers",
    ishowerday: "Showers",
    ishowernight: "Showers",
    rainday: "Rain",
    rainnight: "Rain",
    lightsnowday: "Light Snow",
    lightsnownight: "Light Snow",
    snowday: "Snow",
    snownight: "Snow",
    rainsnowday: "Rain & Snow",
    rainsnownight: "Rain & Snow",
    tsday: "Thunderstorm",
    tsnight: "Thunderstorm",
    tsrainday: "Thunderstorm",
    tsrainnight: "Thunderstorm",
    default: "Unknown"
};

// ===============================================================
// CITY BACKGROUNDS
// ===============================================================
const cityBG = {
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
    bratislava: "images/bratislava.jpg",
    dublin: "images/dublin.jpg"
};

// ===============================================================
// CONFIGURATION
// ===============================================================
const CONFIG = {
    TRANSITION: 800,
    API_PRODUCT: "civil"
};

// ===============================================================
// CHANGE BACKGROUND - Fixed version
// ===============================================================
function changeBackground(imagePath) {
    console.log("Changing background to:", imagePath);

    // Preload the image
    const img = new Image();
    img.src = imagePath;

    img.onload = () => {
        console.log("Image loaded successfully:", imagePath);

        // Create fade layer
        const fadeLayer = document.createElement("div");
        fadeLayer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('${imagePath}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            opacity: 0;
            transition: opacity ${CONFIG.TRANSITION}ms ease;
            z-index: -50;
            pointer-events: none;
        `;
        document.body.appendChild(fadeLayer);

        // Trigger fade in
        requestAnimationFrame(() => {
            fadeLayer.style.opacity = "1";
        });

        // After transition, update CSS variable and remove layer
        setTimeout(() => {
            document.documentElement.style.setProperty("--hero-img", `url('${imagePath}')`);
            fadeLayer.remove();
            console.log("Background updated to:", imagePath);
        }, CONFIG.TRANSITION);
    };

    img.onerror = () => {
        console.error("Failed to load image:", imagePath);
    };
}

// ===============================================================
// UPDATE CITY (called on <select> change)
// ===============================================================
function updateCity() {
    const opt = elements.select.options[elements.select.selectedIndex];
    if (!opt || !opt.value) return;

    console.log("City selected:", opt.dataset.name);

    // Update city name and flag
    if (elements.cityName) {
        elements.cityName.textContent = opt.dataset.name;
    }
    if (elements.cityIcon) {
        elements.cityIcon.textContent = opt.dataset.flag;
    }

    // Change background
    const bgKey = opt.dataset.bg;
    const bgPath = cityBG[bgKey];

    console.log("Background key:", bgKey, "Path:", bgPath);

    if (bgPath) {
        changeBackground(bgPath);
    }
}

// ===============================================================
// LEAFLET MAP
// ===============================================================
let map = null;
let marker = null;

function initLeafletMap(lat, lon) {
    const mapContainer = document.getElementById("map");
    if (!mapContainer) {
        console.error("Map container not found!");
        return;
    }

    if (!map) {
        map = L.map("map").setView([lat, lon], 7);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
            attribution: "© OpenStreetMap"
        }).addTo(map);

        marker = L.marker([lat, lon]).addTo(map);
    } else {
        map.setView([lat, lon], 7);
        marker.setLatLng([lat, lon]);
    }

    // Fix map size after section becomes visible
    setTimeout(() => {
        map.invalidateSize();
    }, 400);
}

// ===============================================================
// LOAD WEATHER
// ===============================================================
async function loadWeather(lat, lon) {
    const url = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=${CONFIG.API_PRODUCT}&output=json`;

    console.log("Fetching weather:", url);

    let response, text, data;

    try {
        response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        text = await response.text();
    } catch (err) {
        console.error("Fetch error:", err);
        elements.grid.innerHTML = `<div class="error-box">Unable to fetch weather data.</div>`;
        return;
    }

    try {
        data = JSON.parse(text);
        console.log("Weather data:", data);
    } catch {
        elements.grid.innerHTML = `<div class="error-box">Invalid data received.</div>`;
        return;
    }

    // Clear grid
    elements.grid.innerHTML = "";

    if (!data.dataseries || data.dataseries.length === 0) {
        elements.grid.innerHTML = `<div class="error-box">No forecast available.</div>`;
        return;
    }

    // Day or night?
    const hour = new Date().getHours();
    const suffix = (hour >= 6 && hour < 18) ? "day" : "night";

    // Create cards for 7 days
    data.dataseries.slice(0, 7).forEach((day, i) => {
        if (day.temp2m == null) return;

        // Date
        const date = new Date();
        date.setDate(date.getDate() + i);
        const weekday = date.toLocaleString("en-US", { weekday: "short" });
        const monthDay = date.toLocaleString("en-US", { month: "short", day: "numeric" });

        // Weather code
        const rawCode = day.weather || "default";
        const baseCode = rawCode.replace(/(day|night)$/i, "");

        // Get icon and label
        const icon = ICONS_IOS[rawCode] || ICONS_IOS[baseCode + suffix] || ICONS_IOS[baseCode] || ICONS_IOS.default;
        const label = WEATHER_DETAILS[rawCode] || WEATHER_DETAILS[baseCode + suffix] || WEATHER_DETAILS[baseCode] || WEATHER_DETAILS.default;

        // Temperature
        const temp = Math.round(day.temp2m);
        const high = temp + 2;
        const low = temp - 2;

        // Wind
        const windSpeed = day.wind10m?.speed || 0;
        const windDir = day.wind10m?.direction || "N";

        // Rain/Snow chances
        const rainy = ["rain", "lightrain", "oshower", "ishower", "ts", "tsrain", "rainsnow"];
        const snowy = ["snow", "lightsnow", "rainsnow"];
        const rainChance = rainy.includes(baseCode) ? Math.round((day.cloudcover || 5) / 9 * 100) : 0;
        const snowChance = snowy.includes(baseCode) ? Math.round((day.cloudcover || 5) / 9 * 100) : 0;

        // Humidity
        let humidity = "—";
        if (day.rh2m) {
            humidity = typeof day.rh2m === "number" ? day.rh2m + "%" : day.rh2m;
        }

        // Create card
        const card = document.createElement("div");
        card.className = "weather-card weather-animate";
        card.style.animationDelay = `${i * 0.1}s`;

        card.innerHTML = `
            <div class="w-day">${weekday}</div>
            <div class="w-date">${monthDay}</div>
            <div class="w-icon">${icon}</div>
            <div class="w-temp">${temp}<sup>°C</sup></div>
            <div class="w-cond">${label}</div>
            <div class="w-hilo">H: ${high}° · L: ${low}°</div>
            <div class="w-extra">
                <div><strong>Humidity</strong><span>${humidity}</span></div>
                <div><strong>Wind</strong><span>${windSpeed} km/h</span></div>
                <div><strong>Rain</strong><span>${rainChance}%</span></div>
                ${snowChance > 0 ? `<div><strong>Snow</strong><span>${snowChance}%</span></div>` : ""}
            </div>
        `;

        elements.grid.appendChild(card);
    });
}

// ===============================================================
// HANDLE GET FORECAST CLICK
// ===============================================================
async function handleGet() {
    const val = elements.select.value;
    if (!val) {
        alert("Please select a city first!");
        return;
    }

    const [lat, lon] = val.split(",").map(Number);
    console.log("Getting forecast for:", lat, lon);

    // Show loading
    elements.overlay.classList.add("active");

    // Show forecast section
    elements.section.classList.remove("hidden");

    // Scroll to forecast
    setTimeout(() => {
        elements.section.scrollIntoView({ behavior: "smooth" });
    }, 100);

    // Load map and weather
    initLeafletMap(lat, lon);
    await loadWeather(lat, lon);

    // Hide loading
    elements.overlay.classList.remove("active");
}

// ===============================================================
// INITIALIZE
// ===============================================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("🌤️ European Weather Explorer initialized");

    // Check elements
    Object.entries(elements).forEach(([key, el]) => {
        if (el) {
            console.log(`✅ ${key}`);
        } else {
            console.error(`❌ ${key} not found`);
        }
    });

    // Event: City selection changed
    if (elements.select) {
        elements.select.addEventListener("change", updateCity);
    }

    // Event: Get Forecast clicked
    if (elements.btn) {
        elements.btn.addEventListener("click", handleGet);
    }

    // Event: Change City clicked
    const changeBtn = document.getElementById("changeCityBtn");
    if (changeBtn) {
        changeBtn.addEventListener("click", () => {
            elements.section.classList.add("hidden");
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});