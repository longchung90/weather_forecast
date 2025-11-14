// ===============================================================
// ELEMENTS
// ===============================================================
const elements = {
    btn: document.getElementById("getForecastBtn"),
    select: document.getElementById("citySelect"),
    hero: document.getElementById("hero"),
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
const WEATHER_MAP = {
    clearday: { icon: "☀️", label: "Clear (Day)" },
    clearnight: { icon: "🌙", label: "Clear (Night)" },

    pcloudyday: { icon: "⛅", label: "Partly Cloudy (Day)" },
    pcloudynight: { icon: "🌙☁️", label: "Partly Cloudy (Night)" },

    mcloudyday: { icon: "🌥️", label: "Mostly Cloudy (Day)" },
    mcloudynight: { icon: "☁️", label: "Mostly Cloudy (Night)" },

    cloudyday: { icon: "☁️", label: "Cloudy (Day)" },
    cloudynight: { icon: "☁️", label: "Cloudy (Night)" },

    humidday: { icon: "💧", label: "Humid (Day)" },
    humidnight: { icon: "💧", label: "Humid (Night)" },

    lightrainday: { icon: "🌦️", label: "Light Rain (Day)" },
    lightrainnight: { icon: "🌧️", label: "Light Rain (Night)" },

    oshowerday: { icon: "🌦️", label: "Occasional Showers (Day)" },
    oshowernight: { icon: "🌧️", label: "Occasional Showers (Night)" },

    ishowerday: { icon: "🌦️", label: "Isolated Showers (Day)" },
    ishowernight: { icon: "🌧️", label: "Isolated Showers (Night)" },

    rainday: { icon: "🌧️", label: "Rain (Day)" },
    rainnight: { icon: "🌧️", label: "Rain (Night)" },

    lightsnowday: { icon: "🌨️", label: "Light Snow (Day)" },
    lightsnownight: { icon: "🌨️", label: "Light Snow (Night)" },

    snowday: { icon: "❄️", label: "Snow (Day)" },
    snownight: { icon: "❄️", label: "Snow (Night)" },

    rainsnowday: { icon: "🌧️❄️", label: "Rain + Snow (Day)" },
    rainsnownight: { icon: "🌧️❄️", label: "Rain + Snow (Night)" },

    tsday: { icon: "⛈️", label: "Thunderstorm (Day)" },
    tsnight: { icon: "⛈️", label: "Thunderstorm (Night)" },

    tsrainday: { icon: "🌩️", label: "Storm + Rain (Day)" },
    tsrainnight: { icon: "🌩️", label: "Storm + Rain (Night)" },

    default: { icon: "❓", label: "Unknown" }
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
// BACKGROUND TRANSITION (Corrected path)
// ===============================================================
function changeBackground(newBg) {
    document.documentElement.style.setProperty("--hero-img", `url('${newBg}')`);
}

// ===============================================================
// UPDATE CITY
// ===============================================================
function updateCity() {
    const opt = elements.select.options[elements.select.selectedIndex];
    if (!opt) return;
    elements.cityIcon.textContent = opt.dataset.flag;
    elements.cityName.textContent = opt.dataset.name;
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

        // Fix: date MUST be defined first
        const date = new Date();
        date.setDate(date.getDate() + index);

        const month = date.toLocaleString("en-US", { month: "short" });
        const dayNum = date.getDate();
        const dateString = `${month} ${dayNum}`;

        // Weather mapping
        const key = day.weather.toLowerCase();
        const weather = WEATHER_MAP[key] || WEATHER_MAP.default;

        // Rain
        const rainChance = Math.round((day.cloudcover / 10) * 100);

        // Wind
        const windDir = WIND_DIRECTION[day.wind10m.direction] || "N";
        const windSpeed = WIND_SPEED[day.wind10m.speed] || 5;

        const card = document.createElement("div");
        card.className = "weather-card";

        card.innerHTML = `
            <div class="weather-day">${date.toLocaleString("en-US", { weekday: "short" })}</div>
            <div class="weather-date">${dateString}</div>
            <div class="weather-icon">${weather.icon}</div>
            <div class="weather-temp">${day.temp2m}°C</div>
            <div class="weather-cond">${weather.label}</div>
            <div class="rain-line">🌧️ ${rainChance}%</div>

            <div class="wind-simple">
                💨 ${windSpeed} km/h<br>
                <span class="wind-dir">${windDir}</span>
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
    const opt = elements.select.options[elements.select.selectedIndex];

    elements.cityName.textContent = opt.dataset.name;
    elements.cityIcon.textContent = opt.dataset.flag;

    elements.section.classList.remove("hidden");
    elements.overlay.classList.remove("hidden");

    // Fix background
    const newBg = cityBG[opt.dataset.bg];
    if (newBg) changeBackground(newBg);

    initLeafletMap(lat, lon);
    await loadWeather(lat, lon);

    elements.overlay.classList.add("hidden");
    elements.hero.classList.add("fade-out");

    elements.section.scrollIntoView({ behavior: "smooth" });
}

// ===============================================================
// INIT
// ===============================================================
window.addEventListener("load", () => {
    elements.select.addEventListener("change", updateCity);
    elements.btn.addEventListener("click", handleGet);
});
