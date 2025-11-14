// ===============================================================
//  iOS SVG ICON SET (INLINE)
// ===============================================================

// ☀ CLEAR
const ICON_SUN = `
<svg viewBox="0 0 100 100" fill="none">
  <circle cx="50" cy="50" r="20" stroke="currentColor" stroke-width="8"/>
</svg>`;

// 🌤 MOSTLY CLEAR
const ICON_PCLEAR = `
<svg viewBox="0 0 100 100" fill="none">
  <circle cx="40" cy="45" r="15" stroke="currentColor" stroke-width="8"/>
  <ellipse cx="62" cy="62" rx="22" ry="15" stroke="currentColor" stroke-width="8"/>
</svg>`;

// ⛅ PARTLY CLOUDY
const ICON_PCLOUDY = `
<svg viewBox="0 0 100 100" fill="none">
  <ellipse cx="40" cy="55" rx="22" ry="15" stroke="currentColor" stroke-width="8"/>
  <ellipse cx="65" cy="55" rx="22" ry="15" stroke="currentColor" stroke-width="8"/>
</svg>`;

// 🌥 MOSTLY CLOUDY
const ICON_MCLOUDY = `
<svg viewBox="0 0 100 100" fill="none">
  <ellipse cx="45" cy="55" rx="25" ry="16" stroke="currentColor" stroke-width="8"/>
  <ellipse cx="65" cy="55" rx="28" ry="18" stroke="currentColor" stroke-width="8"/>
</svg>`;

// ☁ CLOUDY
const ICON_CLOUD = `
<svg viewBox="0 0 100 100" fill="none">
  <ellipse cx="50" cy="55" rx="32" ry="18" stroke="currentColor" stroke-width="8"/>
</svg>`;

// 🌫 FOG
const ICON_FOG = `
<svg viewBox="0 0 100 100" fill="none">
  <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" stroke-width="8"/>
  <line x1="20" y1="65" x2="80" y2="65" stroke="currentColor" stroke-width="8"/>
</svg>`;

// 🌬 WIND
const ICON_WIND = `
<svg viewBox="0 0 100 100" fill="none">
  <path d="M20 55 H70 Q85 55 85 45" stroke="currentColor" stroke-width="8" fill="none"/>
  <path d="M20 70 H60 Q75 70 75 60" stroke="currentColor" stroke-width="8" fill="none"/>
</svg>`;

// 🌦 LIGHT RAIN
const ICON_LRAIN = `
<svg viewBox="0 0 100 100" fill="none">
  <ellipse cx="50" cy="40" rx="30" ry="16" stroke="currentColor" stroke-width="8"/>
  <line x1="40" y1="65" x2="40" y2="88" stroke="currentColor" stroke-width="8"/>
  <line x1="60" y1="65" x2="60" y2="88" stroke="currentColor" stroke-width="8"/>
</svg>`;

// 🌧 RAIN
const ICON_RAIN = `
<svg viewBox="0 0 100 100" fill="none">
  <ellipse cx="50" cy="40" rx="30" ry="18" stroke="currentColor" stroke-width="8"/>
  <line x1="35" y1="65" x2="35" y2="88" stroke="currentColor" stroke-width="8"/>
  <line x1="50" y1="65" x2="50" y2="88" stroke="currentColor" stroke-width="8"/>
  <line x1="65" y1="65" x2="65" y2="88" stroke="currentColor" stroke-width="8"/>
</svg>`;

// ⛈ THUNDERSTORM
const ICON_TS = `
<svg viewBox="0 0 100 100" fill="none">
  <ellipse cx="50" cy="40" rx="30" ry="18" stroke="currentColor" stroke-width="8"/>
  <polygon points="45,65 58,65 50,90" fill="currentColor"/>
  <polygon points="50,70 65,70 56,95" fill="currentColor"/>
</svg>`;

// 🌨 SNOW
const ICON_SNOW = `
<svg viewBox="0 0 100 100" fill="none">
  <ellipse cx="50" cy="40" rx="30" ry="18" stroke="currentColor" stroke-width="8"/>
  <circle cx="35" cy="75" r="4" fill="currentColor"/>
  <circle cx="50" cy="75" r="4" fill="currentColor"/>
  <circle cx="65" cy="75" r="4" fill="currentColor"/>
</svg>`;

// 🌧❄ RAIN-SNOW MIX
const ICON_RSNOW = `
<svg viewBox="0 0 100 100" fill="none">
  <ellipse cx="50" cy="40" rx="30" ry="18" stroke="currentColor" stroke-width="8"/>
  <line x1="40" y1="65" x2="40" y2="88" stroke="currentColor" stroke-width="8"/>
  <circle cx="60" cy="80" r="4" fill="currentColor"/>
</svg>`;

// 🌨💨 BLIZZARD
const ICON_BLIZZ = `
<svg viewBox="0 0 100 100" fill="none">
  <ellipse cx="50" cy="40" rx="30" ry="18" stroke="currentColor" stroke-width="8"/>
  <circle cx="35" cy="75" r="4" fill="currentColor"/>
  <circle cx="50" cy="75" r="4" fill="currentColor"/>
  <circle cx="65" cy="75" r="4" fill="currentColor"/>
  <path d="M20 90 H80" stroke="currentColor" stroke-width="6"/>
</svg>`;


// ===============================================================
// ICON MAP
// ===============================================================
const ICONS_IOS = {
    clearsky: ICON_SUN,
    pclear: ICON_PCLEAR,
    pcloudy: ICON_PCLOUDY,
    mcloudy: ICON_MCLOUDY,
    cloudy: ICON_CLOUD,

    fog: ICON_FOG,
    haze: ICON_FOG,
    humid: ICON_FOG,
    windy: ICON_WIND,

    drizzle: ICON_LRAIN,
    lightrain: ICON_LRAIN,
    ishower: ICON_LRAIN,
    oshower: ICON_LRAIN,

    rain: ICON_RAIN,

    ts: ICON_TS,
    tstorms: ICON_TS,

    lightsnow: ICON_SNOW,
    snow: ICON_SNOW,

    rainsnow: ICON_RSNOW,
    sleet: ICON_RSNOW,
    frain: ICON_RSNOW,

    blizzard: ICON_BLIZZ
};
// ===============================================================
// LABEL MAP
// ===============================================================
const WEATHER_DETAILS = {
    clearsky: "Clear",
    pclear: "Mostly Clear",
    pcloudy: "Partly Cloudy",
    mcloudy: "Mostly Cloudy",
    cloudy: "Cloudy",
    fog: "Fog",
    haze: "Haze",
    humid: "Humid",
    windy: "Windy",
    drizzle: "Drizzle",
    lightrain: "Light Rain",
    ishower: "Intermittent Showers",
    oshower: "Occasional Showers",
    rain: "Rain",
    ts: "Thunderstorm",
    tstorms: "Thunderstorms",
    lightsnow: "Light Snow",
    snow: "Snow",
    rainsnow: "Rain & Snow Mix",
    sleet: "Sleet",
    frain: "Freezing Rain",
    blizzard: "Blizzard"
};


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
// 7TIMER WEATHER LOADER (iOS Style SVG)
// ===============================================================

// ===============================================================
// WEATHER LOADER (FINAL WORKING VERSION)
// ===============================================================
async function loadWeather(lat, lon) {

    const res = await fetch(
        `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civillight&output=json`
    );

    const data = await res.json();

    elements.grid.innerHTML = "";

    const unknown = new Set();

    data.dataseries.slice(0, 7).forEach((day, index) => {

        const date = new Date();
        date.setDate(date.getDate() + index);

        const weekday = date.toLocaleString("en-US", { weekday: "short" });
        const month = date.toLocaleString("en-US", { month: "short" });
        const dayNum = date.getDate();
        const dateString = `${month} ${dayNum}`;

        const code = day.weather;

        if (!ICONS_IOS[code]) unknown.add(code);

        const iconSVG = ICONS_IOS[code] || ICON_SUN;
        const label = WEATHER_DETAILS[code] || "Unknown";

        const rainChance = Math.round((day.cloudcover / 10) * 100);

        const snowChance =
            ["snow", "lightsnow", "rainsnow", "sleet", "frain", "blizzard"].includes(code)
                ? rainChance
                : 0;

        const temp = day.temp2m;
        const high = temp + 2;
        const low = temp - 2;

        const windSpeed = day.wind10m?.speed || 0;
        const windDir = day.wind10m?.direction || "N";

        const card = document.createElement("div");
        card.classList.add("weather-card");

        card.innerHTML = `
      <div class="w-day">${weekday}</div>
      <div class="w-date">${dateString}</div>

      <div class="w-icon">${iconSVG}</div>

      <div class="w-temp">${temp}<sup>°C</sup></div>
      <div class="w-cond">${label}</div>

      <div class="w-hilo">
        H: ${high}° • L: ${low}°
      </div>

      <div class="w-extra">
        <div><strong>Wind:</strong> ${windSpeed} km/h ${windDir}</div>
        <div><strong>Rain:</strong> ${rainChance}%</div>
        <div><strong>Snow:</strong> ${snowChance}%</div>
      </div>
    `;

        elements.grid.appendChild(card);
    });

    if (unknown.size > 0) {
        console.warn("Unknown weather codes:", [...unknown]);
    }
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


