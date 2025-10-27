console.log("✅ script.js fully fixed and optimized");

// ===== DOM =====
const getForecastBtn = document.getElementById("getForecastBtn");
const citySelect = document.getElementById("citySelect");
const mainContent = document.querySelector("main");
const weatherGrid = document.getElementById("weatherGrid");
const mapImage = document.getElementById("mapImage");
const mapOverlay = document.getElementById("mapOverlay");

// ===== City backgrounds =====
const cityBackgrounds = {
    paris: "images/paris.jpg",
    london: "images/london.jpg",
    berlin: "images/berlin.jpg",
    rome: "images/rome.jpg",
    madrid: "images/madrid.jpg",
    amsterdam: "images/amsterdam.jpg",
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
    oslo: "images/oslo.jpg",
    dublin: "images/dublin.jpg"
};

// Update hero + full-page bg
function applyCityBackground() {
    const bgKey = citySelect.options[citySelect.selectedIndex].dataset.bg;
    const newBg = cityBackgrounds[bgKey];
    if (newBg) {
        document.documentElement.style.setProperty('--hero-img', `url('${newBg}')`);
        document.documentElement.style.setProperty('--city-bg', `url('${newBg}')`);
    }
}

// Set initial background and on change
window.addEventListener("DOMContentLoaded", applyCityBackground);
citySelect.addEventListener("change", applyCityBackground);

// ===== Wind Direction Utilities =====
function getWindRotation(direction) {
    const directions = {
        'N': 0, 'NNE': 22.5, 'NE': 45, 'ENE': 67.5,
        'E': 90, 'ESE': 112.5, 'SE': 135, 'SSE': 157.5,
        'S': 180, 'SSW': 202.5, 'SW': 225, 'WSW': 247.5,
        'W': 270, 'WNW': 292.5, 'NW': 315, 'NNW': 337.5
    };
    return directions[direction] || 0;
}

// ===== Fetch weather + animate tiles =====
getForecastBtn.addEventListener("click", async () => {
    const selectedCity = citySelect.value;
    if (!selectedCity) {
        alert("Please select a city first");
        return;
    }

    const [lat, lon] = selectedCity.split(",");

    // Update background immediately for the chosen city
    applyCityBackground();

    // ---- Map (async fade-in) ----
    try {
        const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lon}&zoom=9&size=600x400&markers=${lat},${lon},lightblue1`;
        mapOverlay.textContent = "Loading map…";
        mapImage.style.opacity = 0;
        mapImage.src = mapUrl;
        mapImage.onload = () => {
            mapOverlay.classList.add("hidden");
            mapImage.style.opacity = 1;
        };
        mapImage.onerror = () => {
            mapOverlay.textContent = "Map unavailable";
            mapOverlay.classList.remove("hidden");
        };
    } catch (err) {
        console.error("❌ Map load error:", err);
        mapOverlay.textContent = "Map failed to load.";
        mapOverlay.classList.remove("hidden");
    }

    // ---- Weather ----
    // ---- Weather ----
    try {
        // ✅ Reliable CORS proxy (allorigins)
        let apiUrl = `https://api.allorigins.win/raw?url=https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;

        let response = await fetch(apiUrl);

        // If proxy fails, fallback to backup
        if (!response.ok) {
            apiUrl = `https://thingproxy.freeboard.io/fetch/https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;
            response = await fetch(apiUrl);
        }

        if (!response.ok) throw new Error("Weather API error");

        const data = await response.json();

        // Validate data before using it
        const series = Array.isArray(data.dataseries) ? data.dataseries.slice(0, 7) : [];
        if (series.length === 0) throw new Error("No data returned");

        // Clear old forecast
        weatherGrid.innerHTML = "";

        // Build forecast cards
        series.forEach((day, i) => {
            const card = document.createElement("div");
            card.className = "weather-card";
            card.style.animationDelay = `${i * 0.1}s`;

            const condition = (day.weather || "clear").toLowerCase();
            const iconMap = {
                clear: "☀️", pcloudy: "⛅", mcloudy: "🌤️", cloudy: "☁️",
                humid: "🌫️", lightrain: "🌦️", rain: "🌧️", snow: "❄️", tsrain: "⛈️"
            };
            const icon = iconMap[condition] || "☀️";

            const windDir = day.wind10m?.direction || "N";
            const windSpeed = day.wind10m?.speed || 0;

            const date = new Date();
            date.setDate(date.getDate() + i);
            const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
            const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

            const rot = getWindRotation(windDir);

            card.innerHTML = `
      <div class="weather-day">${weekday}</div>
      <div class="weather-icon">${icon}</div>
      <div class="weather-condition">${condition}</div>
      <div class="weather-temp">${Math.round(day.temp2m)}°C</div>
      <div class="weather-date">${dateStr}</div>
      <div class="wind-compass">
        <div class="wind-arrow" style="--rot:${rot}deg"></div>
        <span class="wind-label n">N</span>
        <span class="wind-label s">S</span>
        <span class="wind-label e">E</span>
        <span class="wind-label w">W</span>
      </div>
      <div class="wind-speed-text">${windSpeed} m/s</div>
    `;
            weatherGrid.appendChild(card);
        });

        // ✅ Transition: hero → forecast
        document.querySelector(".hero").classList.add("fade-out");
        setTimeout(() => {
            mainContent.classList.add("show");
            weatherGrid.scrollIntoView({ behavior: "smooth" });
        }, 800);

    } catch (err) {
        console.error("❌ Weather fetch error:", err);
        mapOverlay.textContent = "Weather data unavailable.";
        mapOverlay.classList.remove("hidden");
    }
