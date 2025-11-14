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
// 1. CONFIG
// ---------------------------------------------------------------
const CONFIG = {
    DEFAULT_LAT: 48.85,
    DEFAULT_LON: 2.35,
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
    heading: document.getElementById("forecastHeading"),
    icon: document.getElementById("forecastCityIcon"),
    name: document.getElementById("forecastCityName"),
    grid: document.getElementById("weatherGrid"),
    overlay: document.getElementById("loadingOverlay")
};

// ---------------------------------------------------------------
// 3. BACKGROUND IMAGES
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

// ---------------------------------------------------------------
// 4. SAFE BACKGROUND FADE
// ---------------------------------------------------------------
function changeBackground(newBg) {
    document.documentElement.style.setProperty("--hero-img", `url('${newBg}')`);
}

// ---------------------------------------------------------------
// 5. CHANGE CITY FLAG + NAME ON SELECT
// ---------------------------------------------------------------
function updateCity() {
    const opt = elements.select.options[elements.select.selectedIndex];
    if (!opt.dataset.bg) return;

    elements.icon.textContent = opt.dataset.flag;
    elements.name.textContent = opt.dataset.name;
}

// ---------------------------------------------------------------
// 6. LEAFLET MAP
// ---------------------------------------------------------------
let map;
let mapMarker;

function initLeafletMap(lat, lon) {
    if (!map) {
        map = L.map("map").setView([lat, lon], 8);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18
        }).addTo(map);

        mapMarker = L.marker([lat, lon]).addTo(map);
    } else {
        map.setView([lat, lon], 8);
        mapMarker.setLatLng([lat, lon]);
    }
}

// ---------------------------------------------------------------
// 7. WEATHER FETCH — ONLY WEATHER HERE
// ---------------------------------------------------------------
async function loadWeather(lat, lon) {
    const res = await fetch(`https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`);
    const data = await res.json();

    elements.grid.innerHTML = "";

    data.dataseries.slice(0, 7).forEach((day, index) => {
        if (!day) return;

        const date = new Date();
        date.setDate(date.getDate() + index);
        const dayName = date.toLocaleString("en-US", { weekday: "short" });

        const w = WEATHER_MAP[day.weather] || { icon: "❓", label: day.weather };
        const temp = day.temp2m || 0;

        const wind = day.wind10m || { direction: "N", speed: 1 };
        const windDir = WIND_DIRECTION[wind.direction] || wind.direction;
        const windSpeed = WIND_SPEED[wind.speed] || 0;
        const angle = WIND_ANGLE[wind.direction] || 0;

        const div = document.createElement("div");
        div.className = "weather-card";

        div.innerHTML = `
            <div class="weather-day">${dayName}</div>
            <div class="weather-icon">${w.icon}</div>
            <div class="weather-temp">${temp}°C</div>
            <div class="weather-cond">${w.label}</div>

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
}

// ---------------------------------------------------------------
// 8. CLICK BUTTON → SHOW FORECAST
// ---------------------------------------------------------------
async function handleGet() {
    const val = elements.select.value;
    if (!val) return alert("Select a destination!");

    const [lat, lon] = val.split(",").map(Number);
    const opt = elements.select.options[elements.select.selectedIndex];

    elements.heading.innerHTML = `Here is your 7-day forecast for <strong>${opt.dataset.name}</strong>`;

    // change background
    const newBg = cityBG[opt.dataset.bg];
    if (newBg) changeBackground(newBg);

    // hide hero
    elements.hero.classList.add("fade-out");

    // show forecast
    elements.section.classList.remove("hidden");

    initLeafletMap(lat, lon);
    await loadWeather(lat, lon);

    elements.overlay.classList.add("hidden");
    elements.section.scrollIntoView({ behavior: "smooth" });
}

// ---------------------------------------------------------------
// 9. INITIALIZATION
// ---------------------------------------------------------------
window.addEventListener("load", () => {
    elements.overlay.classList.add("hidden");
    elements.select.addEventListener("change", updateCity);
    elements.btn.addEventListener("click", handleGet);
});


