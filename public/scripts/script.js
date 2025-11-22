// ===============================================================
// ELEMENTS that are found on HTML as IDs
// ===============================================================
const elements = {
    btn: document.getElementById("getForecastBtn"),
    select: document.getElementById("citySelect"),
    hero: document.querySelector(".hero"),
    section: document.getElementById("forecastSection"),
    grid: document.getElementById("weatherGrid"),
    cityName: document.getElementById("forecastCityName"),
    cityIcon: document.getElementById("forecastCityIcon"),
    overlay: document.getElementById("loadingOverlay"),
};

// =========================
// Weather label and Icons
// =======================
const ICONS_IOS = {
    clearday: "☀️",
    clearnight: "🌕",

    pclear: "🌤️",
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

    lightsnowday: "🌨️",
    lightsnownight: "🌨️",

    snowday: "❄️",
    snownight: "❄️",

    rainsnowday: "🌧️❄️",
    rainsnownight: "🌧️❄️",

    // Your duplication kept
    humidday: "🌫️",
    humidnight: "🌫️",

    humidday: "🌫️",
    humidnight: "🌫️",

    default: "❓"
};

// ===============================================================
// LABEL MAP
// ===============================================================
const WEATHER_DETAILS = {
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

    lightsnowday: "Light Snow",
    lightsnownight: "Light Snow",

    snowday: "Snow",
    snownight: "Snow",

    rainsnowday: "Rain & Snow",
    rainsnownight: "Rain & Snow",

    humidday: "Humid",
    humidnight: "Humid",

    default: "Unknown"
};

// ===============================================================
// WIND DATA
// ===============================================================
const WIND_DIRECTION = {
    N: "North", NE: "Northeast", E: "East", SE: "Southeast",
    S: "South", SW: "Southwest", W: "West", NW: "Northwest"
};

const WIND_SPEED = { 1: 5, 2: 10, 3: 15, 4: 25, 5: 35, 6: 50, 7: 65 };

// =======================
// Transition
// ========================
const CONFIG = { TRANSITION: 900 };

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
    dublin: "images/dublin.jpg",
};

// ===============================================================
// Background change
// ===============================================================
function changeBackground(newBg) {
    const fullPath = newBg.startsWith("/") ? newBg : "/" + newBg;

    const img = new Image();
    img.src = fullPath;

    img.onload = () => {
        const layer = document.createElement("div");
        layer.style.cssText = `
            position: fixed;
            inset: 0;
            background: url('${fullPath}') center/cover no-repeat;
            opacity: 0;
            transition: opacity ${CONFIG.TRANSITION}ms ease;
            z-index: -20;
            pointer-events: none;
        `;
        document.body.appendChild(layer);

        requestAnimationFrame(() => layer.style.opacity = 1);

        setTimeout(() => {
            document.documentElement.style.setProperty("--hero-img", `url('${fullPath}')`);
            layer.remove();
        }, CONFIG.TRANSITION);
    };
}

// ===============================================================
// Update City (background + text) when selecting
// ===============================================================
function updateCity() {
    const opt = elements.select.options[elements.select.selectedIndex];
    if (!opt) return;

    elements.cityName.textContent = opt.dataset.name;
    elements.cityIcon.textContent = opt.dataset.flag;

    document.querySelector(".forecast-title").classList.add("show");

    const bgPath = cityBG[opt.dataset.bg];
    if (bgPath) changeBackground(bgPath);
}

// ===============================================================
// Handle Get Forecast Button
// ===============================================================
async function handleGet() {
    const val = elements.select.value;
    if (!val) return alert("Please select a destination!");

    const [lat, lon] = val.split(",").map(Number);

    elements.section.classList.remove("hidden");

    initLeafletMap(lat, lon);
    await loadWeather(lat, lon);

    elements.overlay.classList.remove("active");

    document.getElementById("changeCityBtn").addEventListener("click", () => {
        elements.section.classList.add("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* ============================================================
   WEATHER LOADER (civil product)
============================================================ */
async function loadWeather(lat, lon) {
    const url = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=meteo&output=json`;

    let text;
    try {
        const res = await fetch(url);
        text = await res.text();
    } catch (err) {
        console.error("❌ Network Error:", err);
        elements.grid.innerHTML = `<div class="error-box">Unable to fetch weather data.</div>`;
        return;
    }

    let data;
    try {
        data = JSON.parse(text);
    } catch (err) {
        console.error("❌ JSON Parse Error:", err);
        elements.grid.innerHTML = `<div class="error-box">Weather data not available.</div>`;
        return;
    }

    elements.grid.innerHTML = "";

    if (!data.dataseries || !Array.isArray(data.dataseries)) {
        elements.grid.innerHTML = `<div class="error-box">No forecast data available.</div>`;
        return;
    }

    data.dataseries.slice(0, 7).forEach((day, index) => {
        if (day.temp2m == null) return;

        const d = new Date();
        d.setDate(d.getDate() + index);

        const weekday = d.toLocaleString("en-US", { weekday: "short" });
        const month = d.toLocaleString("en-US", { month: "short" });
        const dateString = `${month} ${d.getDate()}`;

        const code = day.weather ?? "default";
        const iconSVG = ICONS_IOS[code] || ICONS_IOS.default;
        const label = WEATHER_DETAILS[code] || WEATHER_DETAILS.default;

        const temp = Number(day.temp2m ?? 0);
        const high = temp + 2;
        const low = temp - 2;

        const windSpeed = Number(day.wind10m?.speed ?? 0);
        const windDir = day.wind10m?.direction ?? "N";

        const rainChance = Math.round(((day.cloudcover ?? 0) / 10) * 100);

        const humidityRaw = day.rh2m ?? "";
        let humidity = null;
        if (typeof humidityRaw === "string" && humidityRaw.trim() !== "") {
            humidity = Number(humidityRaw.replace("%", "").trim());
        }

        const snowyCodes = ["snow", "lightsnow", "frain", "rainsnow", "sleet", "blizzard"];
        const snowChance = snowyCodes.includes(code) ? rainChance : 0;

        const card = document.createElement("div");
        card.className = "weather-card";

        card.innerHTML = `
            <div class="w-day">${weekday}</div>
            <div class="w-date">${dateString}</div>
            <div class="w-icon">${iconSVG}</div>
            <div class="w-temp">${temp}<sup>°C</sup></div>
            <div class="w-cond">${label}</div>
            <div class="w-hilo">H: ${high}° • L: ${low}°</div>
            <div class="w-extra">
                <div><strong>Humidity:</strong> ${humidity !== null ? humidity + "%" : "—"}</div>
                <div><strong>Wind:</strong> ${windSpeed} km/h ${windDir}</div>
                <div><strong>Rain:</strong> ${rainChance}%</div>
                <div><strong>Snow:</strong> ${snowChance}%</div>
            </div>
        `;

        elements.grid.appendChild(card);
    });
}

// ===============================================================
// MAP
// ===============================================================
let map, marker;

function initLeafletMap(lat, lon) {
    if (!map) {
        map = L.map("map").setView([lat, lon], 7);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18
        }).addTo(map);

        marker = L.marker([lat, lon]).addTo(map);
    } else {
        map.setView([lat, lon], 7);
        marker.setLatLng([lat, lon]);
    }
}

//==============
// App Initialization
//==============
window.addEventListener("load", () => {
    elements.select.addEventListener("change", updateCity);
    elements.btn.addEventListener("click", handleGet);
});
