// ===============================
// Wind Direction Utilities
// ===============================
function getWindRotation(direction) {
    const directions = {
        'N': 0, 'NNE': 22.5, 'NE': 45, 'ENE': 67.5,
        'E': 90, 'ESE': 112.5, 'SE': 135, 'SSE': 157.5,
        'S': 180, 'SSW': 202.5, 'SW': 225, 'WSW': 247.5,
        'W': 270, 'WNW': 292.5, 'NW': 315, 'NNW': 337.5
    };
    return directions[direction] || 0;
}

console.log("✅ script.js fully fixed and optimized");

// ===============================
// DOM ELEMENTS
// ===============================
const getForecastBtn = document.getElementById("getForecastBtn");
const citySelect = document.getElementById("citySelect");
const mainContent = document.querySelector("main");
const weatherGrid = document.getElementById("weatherGrid");
const mapContainer = document.getElementById("mapContainer");

// ===============================
// CITY BACKGROUNDS (for future use if you re-enable)
// ===============================
// ===============================
// Backgrounds for Each City
// ===============================
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

const bgKey = citySelect.options[citySelect.selectedIndex].dataset.bg;
const newBg = cityBackgrounds[bgKey];
if (newBg) {
    // Update both hero and full-page background
    document.documentElement.style.setProperty('--hero-img', `url('${newBg}')`);
    document.documentElement.style.setProperty('--city-bg', `url('${newBg}')`);
}

}

// ===============================
// WEATHER GRADIENT COLORS & ICONS
// ===============================
const bgColors = {
    clear: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    pcloudy: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
    mcloudy: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    cloudy: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
    humid: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    lightrain: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    rain: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    snow: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
    tsrain: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
};

const iconMap = {
    clear: "☀️",
    pcloudy: "⛅",
    mcloudy: "🌤️",
    cloudy: "☁️",
    humid: "🌫️",
    lightrain: "🌦️",
    rain: "🌧️",
    snow: "❄️",
    tsrain: "⛈️",
};

// ===============================
// DEFAULT HERO BACKGROUND (static eu.jpg)
// ===============================
window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".hero").style.backgroundImage = "url('images/eu.jpg')";
});

// ===============================
// FETCH WEATHER + ANIMATE TILES
// ===============================
getForecastBtn.addEventListener("click", async () => {
    const selectedCity = citySelect.value;
    if (!selectedCity) {
        alert("Please select a city first");
        return;
    }

    const [lat, lon] = selectedCity.split(",");
    const cityName = citySelect.options[citySelect.selectedIndex].text;

    const mapImage = document.getElementById("mapImage");

    try {
        const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lon}&zoom=9&size=600x400&markers=${lat},${lon},lightblue1`;

        mapImage.src = mapUrl;
        mapImage.onload = () => {
            mapOverlay.classList.add("hidden");   // hide overlay
            mapImage.style.opacity = 1;           // fade in
        };
        mapImage.onerror = () => {
            mapOverlay.textContent = "Map unavailable";
        };
    } catch (err) {
        console.error("❌ Map load error:", err);
        mapOverlay.textContent = "Map failed to load.";
    }



    // 🌤️ Fetch forecast
    try {
        // --- Primary + fallback proxy setup ---
        let apiUrl = `https://corsproxy.io/?https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;
        console.log("Fetching weather from:", apiUrl);

        let response;

        try {
            response = await fetch(apiUrl);
            console.log("Primary proxy status:", response.status);

            // If the main proxy fails (e.g. 403, 404, 408), try fallback
            if (!response.ok) {
                console.warn("Primary proxy failed — switching to fallback proxy...");
                apiUrl = `https://thingproxy.freeboard.io/fetch/https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;
                response = await fetch(apiUrl);
            }
        } catch (proxyError) {
            console.warn("Primary proxy unreachable — retrying with fallback proxy...");
            apiUrl = `https://thingproxy.freeboard.io/fetch/https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;
            response = await fetch(apiUrl);
        }

        console.log("✅ Final fetch status:", response.status);

        if (!response.ok) throw new Error("Weather API error");

        const data = await response.json();
        console.log("✅ Data received:", data);


        const series = data.dataseries?.slice(0, 7) || [];
        if (series.length === 0) throw new Error("No data returned");

        // Clear old cards
        weatherGrid.innerHTML = "";
        series.forEach((day, i) => {
            const card = document.createElement("div");
            card.className = "weather-card";
            card.style.animationDelay = `${i * 0.1}s`;

            const condition = (day.weather || "clear").toLowerCase();
            const icon = iconMap[condition] || "☀️";
            const bg = bgColors[condition] || bgColors.clear;
            const windDir = day.wind10m?.direction || "N";
            const windSpeed = day.wind10m?.speed || 0;

            const date = new Date();
            date.setDate(date.getDate() + i);
            const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
            const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

            card.innerHTML = `
                <div class="weather-day">${weekday}</div>
                <div class="weather-icon">${icon}</div>
                <div class="weather-condition">${condition}</div>
                <div class="weather-temp">${Math.round(day.temp2m)}°C</div>
                <div class="weather-date">${dateStr}</div>
                <div class="wind-compass">
                    <div class="wind-arrow" style="transform: rotate(${getWindRotation(windDir)}deg);"></div>
                    <span class="wind-label n">N</span>
                    <span class="wind-label s">S</span>
                    <span class="wind-label e">E</span>
                    <span class="wind-label w">W</span>
                </div>
                <div class="wind-speed-text">${windSpeed} m/s</div>
            `;
            weatherGrid.appendChild(card);
        });

        // Fade out hero → reveal forecast
        const hero = document.querySelector('.hero');
        hero.classList.add('fade-out');
        setTimeout(() => {
            mainContent.classList.add("show");
            weatherGrid.scrollIntoView({ behavior: "smooth" });
        }, 1000);



    } catch (err) {
        console.error("❌ Weather fetch error:", err);
        alert("Unable to load weather data. Please try again later.");
    }
}); // ✅ closes the event listener properly
