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
// 4. BACKGROUND FADE TRANSITION
// ---------------------------------------------------------------
function changeBackground(newBg) {
    const layer = document.createElement("div");
    layer.style.cssText = `
        position: fixed;
        inset: 0;
        background: url('${newBg}') center/cover no-repeat;
        opacity: 0;
        z-index: -3;
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
// 5. UPDATE UI WHEN CITY CHANGES
// ---------------------------------------------------------------
function updateCity() {
    const opt = elements.select.options[elements.select.selectedIndex];
    if (!opt.dataset.bg) return;

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
// 7. WEATHER FETCH
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
// 8. BUTTON CLICK → LOAD FORECAST
// ---------------------------------------------------------------
async function handleGetForecast() {
    const val = elements.select.value;
    if (!val) return alert("Please select a destination!");

    const [lat, lon] = val.split(",").map(Number);

    elements.section.classList.remove("hidden");
    elements.section.scrollIntoView({ behavior: "smooth" });

    initLeafletMap(lat, lon);
    await loadWeather(lat, lon);

    // hide overlay AFTER everything loads
    elements.overlay.style.display = "none";
}

// ---------------------------------------------------------------
// 9. INITIALIZE ON PAGE LOAD
// ---------------------------------------------------------------
function initializeApp() {
    // hide overlay on load
    elements.overlay.style.display = "none";

    elements.select.addEventListener("change", updateCity);
    elements.btn.addEventListener("click", handleGetForecast);

    // initialize map at default city
    initLeafletMap(CONFIG.DEFAULT_LAT, CONFIG.DEFAULT_LON);

    console.log("🌍 App initialized with Leaflet");
}

// Start App
window.addEventListener("load", initializeApp);
