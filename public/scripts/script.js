// ===============================================================
// ELEMENTS
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
// WEATHER MAP (Corrected for 7timer API codes)
// ===============================================================

const WEATHER_DETAILS = {
    clearsky: { label: "Clear Sky", icon: "☀️" },
    pclear: { label: "Partly Clear", icon: "🌤️" },
    pcloudy: { label: "Partly Cloudy", icon: "⛅" },
    mcloudy: { label: "Mostly Cloudy", icon: "🌥️" },
    cloudy: { label: "Cloudy", icon: "☁️" },
    fog: { label: "Fog", icon: "🌫️" },

    // ☔ Rain
    lightrain: { label: "Light Rain", icon: "🌦️" },
    rain: { label: "Rain", icon: "🌧️" },

    // ❄ Snow
    lightsnow: { label: "Light Snow", icon: "🌨️" },
    snow: { label: "Snow", icon: "❄️" },
    rainsnow: { label: "Rain & Snow Mix", icon: "🌨️🌧️" },
    frzrainsnow: { label: "Freezing Rain & Snow", icon: "🧊❄️🌧️" },

    // ⚡ Storm
    ts: { label: "Thunderstorm", icon: "⛈️" },
    tsrain: { label: "Thunderstorm with Rain", icon: "⛈️🌧️" },

    default: { label: "Unknown Weather", icon: "❔" }
};

// ===========================================================
// WEATHER ICONS
// ===========================================================
const ICONS = {
    clearsky: "☀️",
    pcloudy: "⛅",
    mcloudy: "☁️",
    cloudy: "☁️",
    rain: "🌧️",
    lightrain: "🌦️",
    heavyrain: "🌧️💧",

    // SNOW SUPPORT
    lightsnow: "🌨️",
    snow: "❄️",
    heavysnow: "❄️🌨️",

    default: "🌍"
};





// ===============================================================
// WIND DATA
// ===============================================================
const WIND_DIRECTION = {
    N: "North", NE: "Northeast", E: "East", SE: "Southeast",
    S: "South", SW: "Southwest", W: "West", NW: "Northwest"
};

const WIND_SPEED = { 1: 5, 2: 10, 3: 15, 4: 25, 5: 35, 6: 50, 7: 65 };
// ===============================================================
// Background change
// ===============================================================

function changeBackground(newBg) {
    const fullPath = newBg.startsWith("/") ? newBg : "/" + newBg;

    // PRELOAD IMAGE FIRST
    const img = new Image();
    img.src = fullPath;

    img.onload = () => {
        // Create fade layer BELOW EVERYTHING
        const layer = document.createElement("div");
        layer.style.cssText = `
            position: fixed;
            inset: 0;
            background: url('${fullPath}') center/cover no-repeat;
            opacity: 0;
            transition: opacity ${CONFIG.TRANSITION}ms ease;
            z-index: -20;   /* ⭐ FIX HERE ⭐ */
            pointer-events: none;
        `;
        document.body.appendChild(layer);

        // Fade-in
        requestAnimationFrame(() => {
            layer.style.opacity = 1;
        });

        // After fade completes, update global background and remove layer
        setTimeout(() => {
            document.documentElement.style.setProperty("--hero-img", `url('${fullPath}')`);
            layer.remove();
        }, CONFIG.TRANSITION);
    };
}

// Background + city text changes ONLY when selecting a city
function updateCity() {
    const opt = elements.select.options[elements.select.selectedIndex];
    if (!opt) return;

    elements.cityName.textContent = opt.dataset.name;
    elements.cityIcon.textContent = opt.dataset.flag;

    // Update subtitle dynamically

    document.querySelector(".forecast-title").classList.add("show");


    const bgPath = cityBG[opt.dataset.bg];
    if (bgPath) changeBackground(bgPath);
}

document.getElementById("changeCityBtn").addEventListener("click", () => {
    elements.section.classList.add("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
});





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

// ===============================================================
// LOAD WEATHER (FULLY FIXED)
// ===============================================================
async function loadWeather(lat, lon) {
    const res = await fetch(
        `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`
    );
    const data = await res.json();

    elements.grid.innerHTML = "";

    data.dataseries.slice(0, 7).forEach((day, index) => {

        // --- DATE ---
        const date = new Date();
        date.setDate(date.getDate() + index);

        const weekday = date.toLocaleString("en-US", { weekday: "short" });
        const month = date.toLocaleString("en-US", { month: "short" });
        const dayNum = date.getDate();
        const dateString = `${month} ${dayNum}`;

        // --- WEATHER ---
        const key = day.weather.toLowerCase();   // e.g. "snow", "lightrain"
        const weather = WEATHER_MAP[key] || WEATHER_MAP.default;
        const icon = ICONS[key] || ICONS.default;

        // --- RAIN ---
        const rainChance = Math.round((day.cloudcover / 10) * 100);

        // --- WIND ---
        const windDir = WIND_DIRECTION[day.wind10m.direction] || "N";
        const windSpeed = WIND_SPEED[day.wind10m.speed] || 5;

        // --- CREATE CARD ---
        const card = document.createElement("div");
        card.classList.add("weather-card", "weather-animate");
        card.style.setProperty("--delay", `${index * 120}ms`);

        // --- BUILD HTML ---
        card.innerHTML = `
            <div class="w-day">${weekday}</div>
            <div class="w-date">${dateString}</div>

            <div class="w-icon">${icon}</div>

            <div class="w-temp">
                ${day.temp2m}<sup>°C</sup>
            </div>

            <div class="w-cond">${weather.label}</div>

            <div class="w-hilo">
                H: ${day.temp2m + 2}°C • L: ${day.temp2m - 2}°C
            </div>

            <div class="w-extra">
                <div><strong>Wind:</strong> ${windSpeed} km/h ${windDir}</div>
                <div><strong>Rain:</strong> ${rainChance}%</div>
            </div>
        `;

        elements.grid.appendChild(card);
    });
}






// ===============================================================
// HANDLE GET FORECAST
// ===============================================================
async function handleGet() {
    const val = elements.select.value;
    if (!val) return alert("Please select a destination!");

    const [lat, lon] = val.split(",").map(Number);

    elements.section.classList.remove("hidden");

    elements.overlay.classList.add("active");

    initLeafletMap(lat, lon);
    await loadWeather(lat, lon);

    elements.overlay.classList.remove("active");

    elements.section.scrollIntoView({ behavior: "smooth" });
}




window.addEventListener("load", () => {
    elements.select.addEventListener("change", updateCity);
    elements.btn.addEventListener("click", handleGet);
});


