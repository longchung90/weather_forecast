// ---------------------------------------------------------------
// 0. WAIT FOR GOOGLE MAPS
// ---------------------------------------------------------------
window.initGoogleMaps = function () {
    window.googleMapsLoaded = true;
};

function waitForGoogleMaps() {
    return new Promise(resolve => {
        if (window.googleMapsLoaded) return resolve();
        const check = setInterval(() => {
            if (window.googleMapsLoaded) {
                clearInterval(check);
                resolve();
            }
        }, 100);
    });
}

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
    grid: document.getElementById("weatherGrid")
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
// 5. UPDATE CITY (background + label)
// ---------------------------------------------------------------
function updateCity() {
    const opt = elements.select.options[elements.select.selectedIndex];
    if (!opt) return;

    elements.icon.textContent = opt.dataset.flag;
    elements.name.textContent = opt.dataset.name;

    const bg = cityBG[opt.dataset.bg];
    if (bg) changeBackground(bg);
}

// ---------------------------------------------------------------
// 6. MAP
// ---------------------------------------------------------------
function updateMap(lat, lon) {
    const map = document.querySelector("gmp-map");

    if (!map) return;

    map.setAttribute("center", `${lat},${lon}`);
    map.setAttribute("zoom", 6);

    let marker = document.getElementById("marker");
    if (!marker) {
        marker = document.createElement("gmp-advanced-marker");
        marker.id = "marker";
        map.appendChild(marker);
    }
    marker.setAttribute("position", `${lat},${lon}`);
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
async function handleClick() {
    const val = elements.select.value;
    if (!val) return alert("Select a city first!");

    const [lat, lon] = val.split(",");

    elements.section.classList.remove("hidden");
    elements.hero.classList.add("fade-out");

    elements.section.scrollIntoView({ behavior: "smooth" });

    updateMap(parseFloat(lat), parseFloat(lon));
    loadWeather(parseFloat(lat), parseFloat(lon));
}

// ---------------------------------------------------------------
// 9. INIT
// ---------------------------------------------------------------
async function init() {
    await waitForGoogleMaps();

    elements.select.addEventListener("change", updateCity);
    elements.btn.addEventListener("click", handleClick);

    updateMap(48.85, 2.35);

    console.log("✅ Weather app initialized");
}

document.addEventListener("DOMContentLoaded", init);
