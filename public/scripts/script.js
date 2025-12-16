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
    // Base codes (what 7timer API returns)
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

    // Day/night variants
    clearday: "☀️",
    clearnight: "🌕",
    pclearday: "🌤️",
    pclearnight: "🌙",
    pcloudyday: "⛅",
    pcloudynight: "🌥️",
    mcloudyday: "🌥️",
    mcloudynight: "☁️",
    cloudyday: "☁️",
    cloudynight: "☁️",
    lightrainday: "🌦️",
    lightrainnight: "🌧️",
    ishowerday: "🌦️",
    ishowernight: "🌧️",
    oshowerday: "🌦️",
    oshowernight: "🌧️",
    rainday: "🌧️",
    rainnight: "🌧️",
    tsday: "⛈️",
    tsnight: "⛈️",
    tsrainday: "⛈️",
    tsrainnight: "⛈️",
    lightsnowday: "🌨️",
    lightsnownight: "🌨️",
    snowday: "❄️",
    snownight: "❄️",
    rainsnowday: "🌧️❄️",
    rainsnownight: "🌧️❄️",
    humidday: "🌫️",
    humidnight: "🌫️",
    windyday: "💨",
    windynight: "💨",
    default: "❓"
};

// ===============================================================
// WEATHER LABELS
// ===============================================================
const WEATHER_DETAILS = {
    // Base codes
    clear: "Clear",
    pcloudy: "Partly Cloudy",
    mcloudy: "Mostly Cloudy",
    cloudy: "Cloudy",
    humid: "Humid",
    lightrain: "Light Rain",
    oshower: "Occasional Showers",
    ishower: "Intermittent Showers",
    rain: "Rain",
    lightsnow: "Light Snow",
    snow: "Snow",
    rainsnow: "Rain & Snow",
    ts: "Thunderstorm",
    tsrain: "Thunderstorm",
    windy: "Windy",

    // Day/night variants
    clearday: "Clear",
    clearnight: "Clear",
    pclearday: "Mostly Clear",
    pclearnight: "Mostly Clear",
    pcloudyday: "Partly Cloudy",
    pcloudynight: "Partly Cloudy",
    mcloudyday: "Mostly Cloudy",
    mcloudynight: "Mostly Cloudy",
    cloudyday: "Cloudy",
    cloudynight: "Cloudy",
    lightrainday: "Light Rain",
    lightrainnight: "Light Rain",
    ishowerday: "Intermittent Showers",
    ishowernight: "Intermittent Showers",
    oshowerday: "Occasional Showers",
    oshowernight: "Occasional Showers",
    rainday: "Rain",
    rainnight: "Rain",
    tsday: "Thunderstorm",
    tsnight: "Thunderstorm",
    tsrainday: "Thunderstorm",
    tsrainnight: "Thunderstorm",
    lightsnowday: "Light Snow",
    lightsnownight: "Light Snow",
    snowday: "Snow",
    snownight: "Snow",
    rainsnowday: "Rain & Snow",
    rainsnownight: "Rain & Snow",
    humidday: "Humid",
    humidnight: "Humid",
    windyday: "Windy",
    windynight: "Windy",
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
    TRANSITION: 900,
    API_PRODUCT: "civil"
};

// ===============================================================
// BACKGROUND FADE
// ===============================================================
function changeBackground(newBg) {
    const img = new Image();
    img.src = newBg;

    img.onload = () => {
        const layer = document.createElement("div");
        layer.style.cssText = `
            position: fixed;
            inset: 0;
            background: url('${newBg}') center/cover no-repeat;
            opacity: 0;
            transition: opacity ${CONFIG.TRANSITION}ms ease;
            z-index: -20;
            pointer-events: none;
        `;
        document.body.appendChild(layer);

        requestAnimationFrame(() => (layer.style.opacity = 1));

        setTimeout(() => {
            document.documentElement.style.setProperty("--hero-img", `url('${newBg}')`);
            layer.remove();
        }, CONFIG.TRANSITION);
    };

    // ✅ FIXED: Error handler is now INSIDE the function
    img.onerror = () => {
        console.error("Failed to load background image:", newBg);
    };
}

// ===============================================================
// UPDATE CITY (called on <select> change)
// ===============================================================
function updateCity() {
    const opt = elements.select.options[elements.select.selectedIndex];
    if (!opt || !opt.value) return;

    elements.cityName.textContent = opt.dataset.name;
    elements.cityIcon.textContent = opt.dataset.flag;

    const titleEl = document.querySelector(".forecast-title");
    if (titleEl) titleEl.classList.add("show");

    const bgPath = cityBG[opt.dataset.bg];
    if (bgPath) changeBackground(bgPath);
}

// ===============================================================
// LEAFLET MAP
// ===============================================================
let map, marker;

function initLeafletMap(lat, lon) {
    const mapContainer = document.getElementById("map");
    if (!mapContainer) {
        console.error("Map container #map not found!");
        return;
    }

    if (!map) {
        map = L.map("map").setView([lat, lon], 7);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        marker = L.marker([lat, lon]).addTo(map);
    } else {
        map.setView([lat, lon], 7);
        marker.setLatLng([lat, lon]);
    }

    // ✅ ADDED: Fix map rendering after container becomes visible
    setTimeout(() => {
        map.invalidateSize();
    }, 300);
}

// ===============================================================
// LOAD WEATHER FROM 7TIMER API
// ===============================================================
async function loadWeather(lat, lon) {
    const url = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=${CONFIG.API_PRODUCT}&output=json`;

    // ✅ FIXED: Debug logs are now INSIDE the function where variables exist
    console.log("API URL:", url);

    let text;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        text = await res.text();
        console.log("Raw API response:", text.substring(0, 200) + "..."); // Truncated for readability
    } catch (err) {
        console.error("Fetch error:", err);
        elements.grid.innerHTML = `<div class="error-box">Unable to fetch weather data. Please try again.</div>`;
        return;
    }

    let data;
    try {
        data = JSON.parse(text);
        console.log("Parsed data:", data);
        console.log("First dataseries item:", data.dataseries?.[0]);
    } catch {
        console.error("JSON parse error");
        elements.grid.innerHTML = `<div class="error-box">Invalid weather data returned.</div>`;
        return;
    }

    // Clear previous cards
    elements.grid.innerHTML = "";

    if (!data.dataseries || data.dataseries.length === 0) {
        elements.grid.innerHTML = `<div class="error-box">No forecast available for this location.</div>`;
        return;
    }

    // Determine day/night for icon selection
    const currentHour = new Date().getHours();
    const isDay = currentHour >= 6 && currentHour < 18;
    const timeSuffix = isDay ? "day" : "night";

    // Process each day in the forecast
    data.dataseries.slice(0, 7).forEach((day, index) => {
        if (day.temp2m == null) return;

        // Calculate date
        const d = new Date();
        d.setDate(d.getDate() + index);
        const weekday = d.toLocaleString("en-US", { weekday: "short" });
        const month = d.toLocaleString("en-US", { month: "short" });
        const dateString = `${month} ${d.getDate()}`;

        // Get weather code and normalize it
        const rawCode = day.weather ?? "default";
        const baseCode = rawCode.replace(/(day|night)$/i, "");

        console.log(`Day ${index}: rawCode="${rawCode}", baseCode="${baseCode}"`);

        // Icon lookup with fallback chain
        const icon =
            ICONS_IOS[rawCode] ||
            ICONS_IOS[baseCode + timeSuffix] ||
            ICONS_IOS[baseCode + "day"] ||
            ICONS_IOS[baseCode] ||
            ICONS_IOS.default;

        // Label lookup with fallback chain
        const label =
            WEATHER_DETAILS[rawCode] ||
            WEATHER_DETAILS[baseCode + timeSuffix] ||
            WEATHER_DETAILS[baseCode + "day"] ||
            WEATHER_DETAILS[baseCode] ||
            WEATHER_DETAILS.default;

        // Temperature calculations
        const temp = Number(day.temp2m);
        const high = temp + 2;
        const low = temp - 2;

        // Wind data
        const windSpeed = Number(day.wind10m?.speed ?? 0);
        const windDir = day.wind10m?.direction ?? "N";

        // Rain probability based on weather type
        const rainyConditions = ["rain", "lightrain", "oshower", "ishower", "ts", "tsrain", "rainsnow"];
        const rain = rainyConditions.includes(baseCode)
            ? Math.round(((day.cloudcover ?? 5) / 9) * 100)
            : 0;

        // Humidity
        const humidityRaw = day.rh2m ?? "";
        let humidity = null;
        if (typeof humidityRaw === "string" && humidityRaw.trim() !== "") {
            humidity = Number(humidityRaw.replace("%", "").trim());
        } else if (typeof humidityRaw === "number") {
            humidity = humidityRaw;
        }

        // Snow probability
        const snowyCodes = ["snow", "lightsnow", "rainsnow"];
        const snowChance = snowyCodes.includes(baseCode)
            ? Math.round(((day.cloudcover ?? 5) / 9) * 100)
            : 0;

        // Create weather card with animation
        const card = document.createElement("div");
        card.className = "weather-card weather-animate";
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="w-day">${weekday}</div>
            <div class="w-date">${dateString}</div>
            <div class="w-icon">${icon}</div>
            <div class="w-temp">${temp}<sup>°C</sup></div>
            <div class="w-cond">${label}</div>
            <div class="w-hilo">H: ${high}° • L: ${low}°</div>
            <div class="w-extra">
                <div><strong>Humidity:</strong> ${humidity !== null ? humidity + "%" : "—"}</div>
                <div><strong>Wind:</strong> ${windSpeed} km/h ${windDir}</div>
                <div><strong>Rain:</strong> ${rain}%</div>
                <div><strong>Snow:</strong> ${snowChance}%</div>
            </div>
        `;

        elements.grid.appendChild(card);
    });
}

// ===============================================================
// HANDLE "GET FORECAST" BUTTON CLICK
// ===============================================================
async function handleGet() {
    const val = elements.select.value;
    if (!val) {
        alert("Please select a destination!");
        return;
    }

    const [lat, lon] = val.split(",").map(Number);

    console.log("Getting forecast for coordinates:", lat, lon);

    // Show loading overlay
    elements.overlay.classList.add("active");

    // Show forecast section
    elements.section.classList.remove("hidden");

    // Scroll to forecast section smoothly
    setTimeout(() => {
        elements.section.scrollIntoView({ behavior: "smooth" });
    }, 100);

    // Initialize map and load weather data
    initLeafletMap(lat, lon);
    await loadWeather(lat, lon);

    // Hide loading overlay
    elements.overlay.classList.remove("active");
}

// ===============================================================
// INITIALIZE APP
// ===============================================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("🌤️ European Weather Explorer initialized");

    // Verify all required elements exist
    for (const [key, el] of Object.entries(elements)) {
        if (!el) {
            console.error(`❌ Required element not found: ${key}`);
        } else {
            console.log(`✅ Element found: ${key}`);
        }
    }

    // City select change listener
    if (elements.select) {
        elements.select.addEventListener("change", updateCity);
    }

    // Get Forecast button click listener
    if (elements.btn) {
        elements.btn.addEventListener("click", handleGet);
    }

    // Change City button click listener
    const changeCityBtn = document.getElementById("changeCityBtn");
    if (changeCityBtn) {
        changeCityBtn.addEventListener("click", () => {
            elements.section.classList.add("hidden");
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});