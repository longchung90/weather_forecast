const elements = {
    btn: document.getElementById("getForecastBtn"),
    select: document.getElementById("citySelect"),
    hero: document.getElementById("hero"),
    section: document.getElementById("forecastSection"),
    grid: document.getElementById("weatherGrid"),
    heading: document.getElementById("forecastHeading"),
    cityName: document.getElementById("forecastCityName"),
    cityIcon: document.getElementById("forecastCityIcon"),
    overlay: document.getElementById("loadingOverlay"),
};

const CONFIG = {
    TRANSITION: 900,
};

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
    clearday: { icon: "☀️", label: "Clear" },
    clearnight: { icon: "🌙", label: "Clear (Night)" },

    pcloudyday: { icon: "⛅", label: "Partly Cloudy" },
    pcloudynight: { icon: "🌙", label: "Partly Cloudy (Night)" },

    mcloudyday: { icon: "🌥️", label: "Mostly Cloudy" },
    mcloudynight: { icon: "☁️", label: "Mostly Cloudy (Night)" },

    cloudyday: { icon: "☁️", label: "Cloudy" },
    cloudynight: { icon: "☁️", label: "Cloudy (Night)" },

    lightrainday: { icon: "🌦️", label: "Light Rain" },
    lightrainnight: { icon: "🌧️", label: "Light Rain (Night)" },

    lightsnowday: { icon: "🌨️", label: "Light Snow" },
    lightsnownight: { icon: "🌨️", label: "Light Snow (Night)" },

    rainday: { icon: "🌧️", label: "Rain" },
    rainnight: { icon: "🌧️", label: "Rain (Night)" },

    snowday: { icon: "❄️", label: "Snow" },
    snownight: { icon: "❄️", label: "Snow (Night)" }
};

const WIND_DIRECTION = {
    N: "North", NE: "Northeast", E: "East", SE: "Southeast",
    S: "South", SW: "Southwest", W: "West", NW: "Northwest"
};

const WIND_ANGLE = {
    N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315
};

const WIND_SPEED = {
    1: 5, 2: 10, 3: 15, 4: 25, 5: 35, 6: 50, 7: 65
};

function changeBackground(newBg) {
    const layer = document.createElement("div");
    layer.style.cssText = `
        position: fixed;
        inset: 0;
        background: url('${newBg}') center/cover no-repeat;
        opacity: 0;
        transition: opacity ${CONFIG.TRANSITION}ms ease;
        z-index: -2;
    `;
    document.body.appendChild(layer);

    requestAnimationFrame(() => (layer.style.opacity = 1));

    setTimeout(() => {
        document.documentElement.style.setProperty("--hero-img", `url('../${newBg}')`);
        layer.remove();
    }, CONFIG.TRANSITION);
}

function updateCity() {
    const opt = elements.select.options[elements.select.selectedIndex];
    if (!opt) return;
    elements.cityIcon.textContent = opt.dataset.flag;
    elements.cityName.textContent = opt.dataset.name;
}

let map;
let marker;

function initLeafletMap(lat, lon) {
    if (!map) {
        map = L.map("map").setView([lat, lon], 7);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18 }).addTo(map);
        marker = L.marker([lat, lon]).addTo(map);
    } else {
        map.setView([lat, lon], 7);
        marker.setLatLng([lat, lon]);
    }
}

async function loadWeather(lat, lon) {
    const res = await fetch(
        `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`
    );
    const data = await res.json();

    elements.grid.innerHTML = "";

    data.dataseries.slice(0, 7).forEach((day, index) => {

        let key = day.weather.toLowerCase();
        if (!WEATHER_MAP[key]) {
            if (!key.includes("day") && !key.includes("night")) {
                key = key + "day";
            }
        }
        const weather = WEATHER_MAP[key] || { icon: "❓", label: day.weather };

        const temp = day.temp2m;
        const cloud = day.cloudcover || 0;
        const rainChance = Math.round((cloud / 10) * 100);

        const dir = WIND_DIRECTION[day.wind10m.direction] || "N";
        const speed = WIND_SPEED[day.wind10m.speed] || 5;
        const angle = WIND_ANGLE[day.wind10m.direction] || 0;

        const date = new Date();
        date.setDate(date.getDate() + index);
        const dayName = date.toLocaleString("en-US", { weekday: "short" });

        const card = document.createElement("div");
        card.className = "weather-card";

        card.innerHTML = `
            <div class="weather-day">${dayName}</div>
            <div class="weather-icon">${weather.icon}</div>
            <div class="weather-temp">${temp}°C</div>
            <div class="weather-cond">${weather.label}</div>
            <div class="rain-line">🌧️ ${rainChance}%</div>

            <div class="wind-box">
                <div class="wind-title">Wind</div>
                <div class="wind-compass">
                    <div class="compass-circle">
                        <div class="compass-arrow" style="transform: rotate(${angle}deg)"></div>
                        <div class="compass-center">${speed}<span class="unit">km/h</span></div>
                        <span class="compass-dir n">N</span>
                        <span class="compass-dir e">E</span>
                        <span class="compass-dir s">S</span>
                        <span class="compass-dir w">W</span>
                    </div>
                </div>
                <div class="wind-direction-text">${dir}</div>
            </div>
        `;

        elements.grid.appendChild(card);
    });
}

async function handleGet() {
    const val = elements.select.value;
    if (!val) return alert("Please select a destination!");

    const [lat, lon] = val.split(",").map(Number);
    const opt = elements.select.options[elements.select.selectedIndex];

    elements.cityName.textContent = opt.dataset.name;
    elements.cityIcon.textContent = opt.dataset.flag;

    elements.section.classList.remove("hidden");
    elements.overlay.classList.remove("hidden");

    const newBg = cityBG[opt.dataset.bg];
    if (newBg) changeBackground(newBg);

    initLeafletMap(lat, lon);
    await loadWeather(lat, lon);

    elements.overlay.classList.add("hidden");
    elements.hero.classList.add("fade-out");
    elements.section.scrollIntoView({ behavior: "smooth" });
}

window.addEventListener("load", () => {
    elements.select.addEventListener("change", updateCity);
    elements.btn.addEventListener("click", handleGet);
});
