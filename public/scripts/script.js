// ---------------------------------------------------------------
// 1. CONFIG
// ---------------------------------------------------------------
const CONFIG = {
    TRANSITION_DURATION: 1200
};

// ---------------------------------------------------------------
// 2. DOM ELEMENTS
// ---------------------------------------------------------------
const elements = {
    btn: document.getElementById("getForecastBtn"),
    select: document.getElementById("citySelect"),
    section: document.getElementById("forecastSection"),
    hero: document.querySelector(".hero"),
    icon: document.getElementById("forecastCityIcon"),
    name: document.getElementById("forecastCityName"),
    heading: document.getElementById("forecastHeading"),
    grid: document.getElementById("weatherGrid"),
    overlay: document.getElementById("loadingOverlay")
};

// ---------------------------------------------------------------
// 3. CITY BACKGROUNDS
// ---------------------------------------------------------------
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
const WEATHER_MAP = {
    clearday: { label: "Clear", icon: "☀️" },
    clearnight: { label: "Clear Night", icon: "🌙" },
    cloudyday: { label: "Cloudy", icon: "☁️" },
    cloudynight: { label: "Cloudy Night", icon: "☁️" },
    lightrainday: { label: "Light Rain", icon: "🌦️" },
    lightrainnight: { label: "Light Rain", icon: "🌧️" },
    rain: { label: "Rain", icon: "🌧️" },
    snow: { label: "Snow", icon: "❄️" },
    ts: { label: "Thunderstorm", icon: "⛈️" },
    fog: { label: "Fog", icon: "🌫️" }
};
const WIND_ANGLE = {
    N: 0,
    NE: 45,
    E: 90,
    SE: 135,
    S: 180,
    SW: 225,
    W: 270,
    NW: 315
};

// ---------------------------------------------------------------
// 4. SELECTING A CITY (NO BACKGROUND CHANGE)
// ---------------------------------------------------------------
function updateCity() {
    const opt = elements.select.options[elements.select.selectedIndex];
    if (!opt.value) return;

    elements.icon.textContent = opt.dataset.flag;
    elements.name.textContent = opt.dataset.name;
}

// ---------------------------------------------------------------
// 5. BACKGROUND FADE WHEN FORECAST IS REQUESTED
// ---------------------------------------------------------------
function changeBackground(newBg) {
    const layer = document.createElement("div");
    layer.style.cssText = `
        position: fixed;
        inset: 0;
        background: url('${newBg}') center/cover no-repeat;
        opacity: 0;
        z-index: -1;
        transition: opacity ${CONFIG.TRANSITION_DURATION}ms ease;
    `;
    document.body.appendChild(layer);

    requestAnimationFrame(() => layer.style.opacity = 1);

    setTimeout(() => {
        document.body.style.backgroundImage = `url('${newBg}')`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        layer.remove();
    }, CONFIG.TRANSITION_DURATION);
}


// ---------------------------------------------------------------
// 6. LEAFLET MAP
// ---------------------------------------------------------------
let map;
let marker;

function initLeafletMap(lat, lon) {
    if (!map) {
        map = L.map('map').setView([lat, lon], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        marker = L.marker([lat, lon]).addTo(map);
    } else {
        map.setView([lat, lon], 6);
        marker.setLatLng([lat, lon]);
    }
}

// ---------------------------------------------------------------
// 7. WEATHER FETCH
// ---------------------------------------------------------------
async function loadWeather(lat, lon) {
    const res = await fetch(`https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`);
    const data = await res.json();

    elements.grid.innerHTML = "";

    data.dataseries.slice(0, 7).forEach((day, index) => {

        // SAFETY GUARDS — prevent crashes
        if (!day || !day.weather) return;
        if (!day.temp2m) day.temp2m = 0;
        if (!day.wind10m) day.wind10m = { direction: "N", speed: 1 };

        // Day label
        const date = new Date();
        date.setDate(date.getDate() + index);
        const dayName = date.toLocaleString("en-US", { weekday: "short" });

        // Weather info
        const w = WEATHER_MAP[day.weather] || { icon: "❓", label: day.weather };
        const icon = w.icon;
        const cond = w.label;
        const temp = day.temp2m;

        // Wind info
        const rawDir = day.wind10m.direction || "N";
        const rawSpeed = day.wind10m.speed || 1;

        const windDir = WIND_DIRECTION[rawDir] || rawDir;
        const windSpeed = WIND_SPEED[rawSpeed] || 0;
        const angle = WIND_ANGLE[rawDir] || 0;

        // Create tile
        const div = document.createElement("div");
        div.className = "weather-card";

        div.innerHTML = `
        <div class="weather-day">${dayName}</div>
        <div class="weather-icon">${icon}</div>
        <div class="weather-temp">${temp}°C</div>
        <div class="weather-cond">${cond}</div>

        <div class="wind-box">
            <div class="wind-title">Wind</div>

            <div class="wind-compass">
                <div class="compass-circle">
                    <div class="compass-arrow" style="transform: rotate(${angle}deg)"></div>
                    <div class="compass-center">${windSpeed}<span class="unit">km/h</span></div>

                    <span class="compass-dir n">N</span>
                    <span class="compass-dir e">E</span>
                    <span class="compass-dir s">S</span>
                    <span class="compass-dir w">W</span>
                </div>
            </div>

            <div class="wind-direction-text">${windDir}</div>
        </div>
    `;

        elements.grid.appendChild(div);
    });


    // ---------------------------------------------------------------
    // 8. BUTTON CLICK → SHOW FORECAST + CHANGE BACKGROUND
    // ---------------------------------------------------------------
    async function handleGet() {
        const val = elements.select.value;
        if (!val) return alert("Pick a destination!");

        const [lat, lon] = val.split(",").map(Number);
        const opt = elements.select.options[elements.select.selectedIndex];

        // heading
        elements.heading.innerHTML = `Here is your 7-day forecast for <strong>${opt.dataset.name}</strong>`;

        // fade hero
        elements.hero.classList.add("fade-out");

        // change background now
        const newBg = cityBG[opt.dataset.bg];
        if (newBg) changeBackground(newBg);

        // show forecast section
        elements.section.classList.remove("hidden");

        initLeafletMap(lat, lon);
        await loadWeather(lat, lon);

        elements.overlay.classList.add("hidden");
        elements.section.scrollIntoView({ behavior: "smooth" });
    }

    // ---------------------------------------------------------------
    // 9. INIT
    // ---------------------------------------------------------------
    window.addEventListener("load", () => {
        elements.overlay.classList.add("hidden");
        elements.select.addEventListener("change", updateCity);
        elements.btn.addEventListener("click", handleGet);
    });
