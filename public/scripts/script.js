console.log("API URL:", url);
console.log("Raw API response:", text);
console.log("Parsed data:", data);
console.log("First dataseries item:", data.dataseries?.[0]);

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

const ICONS_IOS = {
    // === BASE CODES (what API actually returns) ===
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

    // === YOUR EXISTING DAY/NIGHT VARIANTS ===
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
    lightsnowday: "🌨️",
    lightsnownight: "🌨️",
    snowday: "❄️",
    snownight: "❄️",
    rainsnowday: "🌧️❄️",
    rainsnownight: "🌧️❄️",
    humidday: "🌫️",
    humidnight: "🌫️",
    default: "❓"
};

const WEATHER_DETAILS = {
    // === BASE CODES ===
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

    // === YOUR EXISTING DAY/NIGHT VARIANTS ===
    clearday: "Clear",
    clearnight: "Clear",
    // ... rest of your existing entries
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
// BACKGROUND FADE
// ===============================================================
const CONFIG = { TRANSITION: 900 };

function changeBackground(newBg) {
    // Use the path as-is, don't force leading slash
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
}
// ✅ ADD ERROR HANDLER to prevent silent failures
img.onerror = () => {
    console.error("Failed to load background image:", newBg);
};
}
// ===============================================================
// UPDATE CITY (called on <select> change)
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
// LEAFLET MAP
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

// ===============================================================
// LOAD WEATHER
// ===============================================================
async function loadWeather(lat, lon) {
    // ✅ FIX 1: Use "civil" product instead of "meteo"
    const url = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;

    let text;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        text = await res.text();
    } catch (err) {
        console.error("Fetch error:", err);
        elements.grid.innerHTML = `<div class="error-box">Unable to fetch weather data.</div>`;
        return;
    }

    let data;
    try {
        data = JSON.parse(text);
    } catch {
        elements.grid.innerHTML = `<div class="error-box">Invalid weather data returned.</div>`;
        return;
    }

    elements.grid.innerHTML = "";

    if (!data.dataseries || data.dataseries.length === 0) {
        elements.grid.innerHTML = `<div class="error-box">No forecast available.</div>`;
        return;
    }

    // Determine if it's currently day or night (for icon selection)
    const currentHour = new Date().getHours();
    const isDay = currentHour >= 6 && currentHour < 18;
    const timeSuffix = isDay ? "day" : "night";

    data.dataseries.slice(0, 7).forEach((day, index) => {
        if (day.temp2m == null) return;

        const d = new Date();
        d.setDate(d.getDate() + index);
        const weekday = d.toLocaleString("en-US", { weekday: "short" });
        const month = d.toLocaleString("en-US", { month: "short" });
        const dateString = `${month} ${d.getDate()}`;

        // ✅ FIX 2: Handle API weather code properly
        const rawCode = day.weather ?? "default";

        // ✅ FIX 3: Correct regex with grouping
        const baseCode = rawCode.replace(/(day|night)$/i, "");

        // Debug logging (remove in production)
        console.log(`Day ${index}: rawCode="${rawCode}", baseCode="${baseCode}"`);

        // ✅ FIX 4: Better fallback chain
        const icon =
            ICONS_IOS[rawCode] ||
            ICONS_IOS[baseCode + timeSuffix] ||
            ICONS_IOS[baseCode + "day"] ||
            ICONS_IOS[baseCode] ||
            ICONS_IOS.default;

        const label =
            WEATHER_DETAILS[rawCode] ||
            WEATHER_DETAILS[baseCode + timeSuffix] ||
            WEATHER_DETAILS[baseCode + "day"] ||
            WEATHER_DETAILS[baseCode] ||
            WEATHER_DETAILS.default;

        const temp = Number(day.temp2m);
        const high = temp + 2;
        const low = temp - 2;

        const windSpeed = Number(day.wind10m?.speed ?? 0);
        const windDir = day.wind10m?.direction ?? "N";

        // Rain probability based on weather code
        const rainyConditions = ["rain", "lightrain", "oshower", "ishower", "ts", "rainsnow"];
        const rain = rainyConditions.includes(baseCode) ? Math.round(((day.cloudcover ?? 5) / 9) * 100) : 0;

        const humidityRaw = day.rh2m ?? "";
        let humidity = null;
        if (typeof humidityRaw === "string" && humidityRaw.trim() !== "") {
            humidity = Number(humidityRaw.replace("%", "").trim());
        } else if (typeof humidityRaw === "number") {
            humidity = humidityRaw;
        }

        const snowyCodes = ["snow", "lightsnow", "rainsnow"];
        const snowChance = snowyCodes.includes(baseCode) ? Math.round(((day.cloudcover ?? 5) / 9) * 100) : 0;

        const card = document.createElement("div");
        card.className = "weather-card";
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
// HANDLE "GET FORECAST"
// ===============================================================
async function handleGet() {
    const val = elements.select.value;
    if (!val) return alert("Please select a destination!");

    const [lat, lon] = val.split(",").map(Number);

    elements.overlay.classList.add("active");
    elements.section.classList.remove("hidden");

    initLeafletMap(lat, lon);
    await loadWeather(lat, lon);

    elements.overlay.classList.remove("active");
}

// ===============================================================
// INITIALIZE
// ===============================================================
window.addEventListener("load", () => {
    elements.select.addEventListener("change", updateCity);
    elements.btn.addEventListener("click", handleGet);

    document.getElementById("changeCityBtn").addEventListener("click", () => {
        elements.section.classList.add("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});
