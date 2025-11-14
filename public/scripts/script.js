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
// 3. BACKGROUND TRANSITION
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
// 4. UPDATE CITY (background preview ONLY)
// ---------------------------------------------------------------
function updateCity() {
    const opt = elements.select.options[elements.select.selectedIndex];
    if (!opt || !opt.dataset.bg) return;

    elements.icon.textContent = opt.dataset.flag;
    elements.name.textContent = opt.dataset.name;

    // temporary preview background while selecting
    const bg = cityBG[opt.dataset.bg];
    if (bg) document.documentElement.style.setProperty("--hero-img", `url('${bg}')`);
}

// ---------------------------------------------------------------
// 5. LEAFLET MAP
// ---------------------------------------------------------------
let map;
let marker;

function initLeafletMap(lat, lon) {
    if (!map) {
        map = L.map('map').setView([lat, lon], 7);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18
        }).addTo(map);

        marker = L.marker([lat, lon]).addTo(map);

    } else {
        map.setView([lat, lon], 7);
        marker.setLatLng([lat, lon]);
    }
}

// ---------------------------------------------------------------
// 6. WEATHER FETCH
// ---------------------------------------------------------------
async function loadWeather(lat, lon) {
    const res = await fetch(`https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`);
    const data = await res.json();

    elements.grid.innerHTML = "";

    data.dataseries.slice(0, 7).forEach((day, index) => {
        if (!day) return;

        const date = new Date();
        date.setDate(date.getDate() + index);
        const name = date.toLocaleString("en-US", { weekday: "short" });

        const icon = "☀️"; // temp placeholder
        const temp = day.temp2m || 0;
        const cond = day.weather || "N/A";

        const div = document.createElement("div");
        div.className = "weather-card";

        div.innerHTML = `
            <div class="weather-day">${name}</div>
            <div class="weather-icon">${icon}</div>
            <div class="weather-temp">${temp}°C</div>
            <div class="weather-cond">${cond}</div>
        `;

        elements.grid.appendChild(div);
    });
}

// ---------------------------------------------------------------
// 7. BUTTON CLICK
// ---------------------------------------------------------------
async function handleGet() {
    const val = elements.select.value;
    if (!val) return alert("Pick a destination!");

    const [lat, lon] = val.split(",").map(Number);
    const opt = elements.select.options[elements.select.selectedIndex];

    // Replace background fully
    const bg = cityBG[opt.dataset.bg];
    if (bg) changeBackground(bg);

    // Set heading
    elements.heading.innerHTML = `Here is your 7-day forecast for <strong>${opt.dataset.name}</strong>`;

    // show forecast section
    elements.section.classList.remove("hidden");

    // load map + weather
    initLeafletMap(lat, lon);
    await loadWeather(lat, lon);

    // hide overlay
    elements.overlay.classList.add("hidden");

    elements.section.scrollIntoView({ behavior: "smooth" });
}

// ---------------------------------------------------------------
// 8. INIT
// ---------------------------------------------------------------
window.addEventListener("load", () => {
    elements.overlay.classList.add("hidden");
    elements.select.addEventListener("change", updateCity);
    elements.btn.addEventListener("click", handleGet);
});
