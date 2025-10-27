console.log("✅ script.js fully fixed and optimized");

// ===== DOM =====
const getForecastBtn = document.getElementById("getForecastBtn");
const citySelect = document.getElementById("citySelect");
const mainContent = document.querySelector("main");
const weatherGrid = document.getElementById("weatherGrid");
const mapImage = document.getElementById("mapImage");
const mapOverlay = document.getElementById("mapOverlay");
const forecastHeading = document.getElementById("forecastHeading");
const forecastCityIcon = document.getElementById("forecastCityIcon");
const forecastCityName = document.getElementById("forecastCityName");
const hero = document.querySelector(".hero");

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
    dublin: "images/dublin.jpg",
    geneva: "images/geneva.jpg",
    brussels: "images/brussels.jpg"
};

// ===== Background Transition Function =====
function crossfadeBackground(newBg) {
    if (!newBg) return;

    // Preload the new image
    const img = new Image();
    img.onload = () => {
        // Create an overlay div for smooth transition
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: url('${newBg}') center/cover no-repeat;
            opacity: 0;
            z-index: -2;
            transition: opacity 1.5s ease;
        `;
        document.body.appendChild(overlay);

        // Start the crossfade
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';

            // Update CSS variables after transition starts
            setTimeout(() => {
                document.documentElement.style.setProperty('--hero-img', `url('${newBg}')`);
                document.documentElement.style.setProperty('--city-bg', `url('${newBg}')`);

                // Remove overlay after transition completes
                setTimeout(() => {
                    document.body.removeChild(overlay);
                }, 200);
            }, 1300);
        });
    };
    img.onerror = () => {
        console.warn(`Failed to load background image: ${newBg}`);
    };
    img.src = newBg;
}

// ===== Update city selection =====
function updateCitySelection() {
    const selectedOption = citySelect.options[citySelect.selectedIndex];
    const bgKey = selectedOption.dataset.bg;
    const cityName = selectedOption.dataset.name;
    const flag = selectedOption.dataset.flag;
    
    // Only update if a valid city is selected (not the placeholder)
    if (!bgKey || !cityName || !flag) {
        return; // Don't update anything for placeholder option
    }
    
    // Update forecast heading elements
    if (forecastCityIcon) forecastCityIcon.textContent = flag;
    if (forecastCityName) forecastCityName.textContent = cityName;
    
    // Update background
    const newBg = cityBackgrounds[bgKey];
    if (newBg) {
        crossfadeBackground(newBg);
    }
}// ===== Wind Direction Utilities =====
function getWindRotation(direction) {
    const directions = {
        'N': 0, 'NNE': 22.5, 'NE': 45, 'ENE': 67.5,
        'E': 90, 'ESE': 112.5, 'SE': 135, 'SSE': 157.5,
        'S': 180, 'SSW': 202.5, 'SW': 225, 'WSW': 247.5,
        'W': 270, 'WNW': 292.5, 'NW': 315, 'NNW': 337.5
    };
    return directions[direction] || 0;
}

// ===== Initialize =====
window.addEventListener("DOMContentLoaded", () => {
    // Set initial background
    updateCitySelection();
});

// ===== City selection change =====
citySelect.addEventListener("change", updateCitySelection);

// ===== Fetch weather + animate transitions =====
getForecastBtn.addEventListener("click", async () => {
    const selectedValue = citySelect.value;
    if (!selectedValue) {
        alert("Please select a city first");
        return;
    }

    const [lat, lon] = selectedValue.split(",");
    const selectedOption = citySelect.options[citySelect.selectedIndex];
    const cityName = selectedOption.dataset.name;
    const flag = selectedOption.dataset.flag;
    const bgKey = selectedOption.dataset.bg;

    // ---- JavaScript takes control: Set city background permanently ----
    const cityBg = cityBackgrounds[bgKey];
    if (cityBg) {
        // Set background immediately on body and hero
        document.documentElement.style.setProperty('--hero-img', `url('${cityBg}')`);
        document.documentElement.style.setProperty('--city-bg', `url('${cityBg}')`);
        
        // Also set directly on body as backup
        document.body.style.background = `url('${cityBg}') center/cover fixed no-repeat`;
    }

    // ---- Update city info ----
    if (forecastCityIcon) forecastCityIcon.textContent = flag;
    if (forecastCityName) forecastCityName.textContent = cityName;

    // ---- Direct transition: hero to main (no fade-out) ----
    setTimeout(() => {
        mainContent.classList.add("show");
        
        // Smooth scroll to the content
        setTimeout(() => {
            mainContent.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    }, 300); // Shorter delay for snappier transition

    // ---- Map loading (floating on background) ----
    setTimeout(() => {
        try {
            const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lon}&zoom=9&size=600x400&markers=${lat},${lon},lightblue1`;
            mapOverlay.textContent = "Loading map…";
            mapOverlay.classList.remove("hidden");
            mapImage.style.opacity = 0;

            mapImage.onload = () => {
                mapOverlay.classList.add("hidden");
                mapImage.style.opacity = 1;
            };
            mapImage.onerror = () => {
                mapOverlay.textContent = "Map unavailable";
                mapOverlay.classList.remove("hidden");
            };
            mapImage.src = mapUrl;
        } catch (err) {
            console.error("❌ Map load error:", err);
            mapOverlay.textContent = "Map failed to load.";
            mapOverlay.classList.remove("hidden");
        }
    }, 400); // Start loading after main content begins showing

    // ---- Weather data fetch (floating on background) ----
    setTimeout(async () => {
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

        // Validate and filter data
        const validSeries = Array.isArray(data.dataseries)
            ? data.dataseries.filter(day =>
                day.weather &&
                day.temp2m !== null &&
                day.temp2m !== -9999
            ).slice(0, 7)
            : [];

        if (validSeries.length === 0) throw new Error("No valid weather data returned");

        // Clear old forecast
        weatherGrid.innerHTML = "";

        // Build forecast cards
        validSeries.forEach((day, i) => {
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
                <div class="weather-date">${dateStr}</div>
                <div class="weather-icon">${icon}</div>
                <div class="weather-condition">${condition}</div>
                <div class="weather-temp">${Math.round(day.temp2m)}°C</div>
                <div class="wind-compass">
                    <div class="wind-arrow" style="--rot:${rot}deg; transform: translate(-50%, -100%) rotate(${rot}deg);"></div>
                    <span class="wind-label n">N</span>
                    <span class="wind-label s">S</span>
                    <span class="wind-label e">E</span>
                    <span class="wind-label w">W</span>
                </div>
                <div class="wind-speed-text">${windSpeed} m/s ${windDir}</div>
            `;
            weatherGrid.appendChild(card);
        });

    } catch (err) {
        console.error("❌ Weather fetch error:", err);
        weatherGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #fff;">
                <p style="font-size: 1.2rem; margin-bottom: 1rem;">⚠️ Weather data unavailable</p>
                <p style="opacity: 0.8;">${err.message}</p>
            </div>
        `;
    }
    }, 500); // Start weather loading slightly after map
});