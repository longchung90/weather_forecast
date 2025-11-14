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
    icon: document.getElementById("forecastCityIcon"),
    name: document.getElementById("forecastCityName"),
    grid: document.getElementById("weatherGrid")
};

// ---------------------------------------------------------------
// 3. BACKGROUND IMAGES
// ---------------------------------------------------------------
const cityBG = {
    paris: "/images/paris.jpg",
    london: "/images/london.jpg",
    brussels: "/images/brussels.jpg",
    amsterdam: "/images/amsterdam.jpg",
    geneva: "/images/geneva.jpg",
    berlin: "/images/berlin.jpg",
    vienna: "/images/vienna.jpg",
    prague: "/images/prague.jpg",
    budapest: "/images/budapest.jpg",
    warsaw: "/images/warsaw.jpg",
    athens: "/images/athens.jpg",
    lisbon: "/images/lisbon.jpg",
    bucharest: "/images/bucharest.jpg",
    stockholm: "/images/stockholm.jpg",
    helsinki: "/images/helsinki.jpg",
    copenhagen: "/images/copenhagen.jpg",
    bratislava: "/images/bratislava.jpg",
    dublin: "/images/dublin.jpg"
};

// ---------------------------------------------------------------
// 4. FADE BACKGROUND
// ---------------------------------------------------------------
function changeBackground(newBg) {
    const layer = document.createElement("div");
    layer.style.cssText = `
        position: fixed;
        inset: 0;
        background: url('${newBg}') center/cover no-repeat;
        opacity: 0;
        z-index: -2;
        transition: opacity ${CONFIG.TRANSITION_DURATION}ms linear;
    `;
    document.body.appendChild(layer);

    requestAnimationFrame(() => layer.style.opacity = 1);

    setTimeout(() => {
        document.documentElement.style.setProperty("--hero-img", `url('${newBg}')`);
        layer.remove();
    }, CONFIG.TRANSITION_DURATION);
}

// ---------------------------------------------------------------
// 5. UPDATE UI WHEN CHOOSING A CITY
// ---------------------------------------------------------------
function updateCity() {
    const opt = elements.select.options[elements.select.selectedIndex];
    if (!opt || !opt.dataset.bg) return;

    elements.icon.textContent = opt.dataset.flag;
    elements.name.textContent = opt.dataset.name;

    const bg = cityBG[opt.dataset.bg];
    if (bg) changeBackground(bg);
}

// ---------------------------------------------------------------
// 6. LEAFLET MAP
// ---------------------------------------------------------------
let map;
let mapMarker;

function initLeafletMap(lat = CONFIG.DEFAULT_LAT, lon = CONFIG.DEFAULT_LON) {
    if (!map) {
        map = L.map('map').setView([lat, lon], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18
        }).addTo(map);

        mapMarker = L.marker([lat, lon]).addTo(map);
    } else {
        map.setView([lat, lon], 6);
        mapMarker.setLatLng([lat, lon]);
    }
}

// ---------------------------------------------------------------
// 7. WEATHER
// ---------------------------------------------------------------
async function loadWeather(lat, lon) {
    const url = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;

    const res = await fetch(url);
    const data = await res.json();

    elements.grid.innerHTML = "";

    data.dataseries.slice(0, 7).forEach(day => {
        const div = document.createElement("div");
        div.className = "weather-card";
        div.innerHTML = `
            <div class="weather-icon">🌤️</div>
            <div>${day.weather}</div>
        `;
        elements.grid.appendChild(div);
    });
}

// ---------------------------------------------------------------
// 8. BUTTON CLICK
// ---------------------------------------------------------------
function handleGetForecast() {
    const val = elements.select.value;
    if (!val) return alert("Please select a destination!");

    const [lat, lon] = val.split(",").map(Number);

    elements.section.classList.remove("hidden");
    elements.hero.classList.add("fade-out");

    elements.section.scrollIntoView({ behavior: "smooth" });

    initLeafletMap(lat, lon);
    loadWeather(lat, lon);
}

// ---------------------------------------------------------------
// 9. INITIALIZE APP
// ---------------------------------------------------------------
function initializeApp() {
    elements.select.addEventListener("change", updateCity);
    elements.btn.addEventListener("click", handleGetForecast);

    document.documentElement.style.setProperty("--hero-img", "url('./images/eu.jpg')");


    // Start map
    initLeafletMap(CONFIG.DEFAULT_LAT, CONFIG.DEFAULT_LON);

    console.log("🌍 App initialized with Leaflet");
}

// Start App
initializeApp();
