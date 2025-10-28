console.log("✅ script.js with comprehensive CORS solutions");

// ===== Weather API Functions (Multiple CORS Solutions) =====
async function fetchWeatherWithFallbacks(lon, lat) {
    const methods = [
        () => fetchWeatherCorsproxy(lon, lat),
        () => fetchWeatherProxyRS(lon, lat), 
        () => fetchWeatherAllOrigins(lon, lat),
        () => fetchWeatherHeroku(lon, lat),
        () => fetchWeatherDirect(lon, lat)
    ];
    
    for (let i = 0; i < methods.length; i++) {
        try {
            console.log(`🔄 Trying weather fetch method ${i + 1}/${methods.length}`);
            const data = await methods[i]();
            console.log(`✅ Weather fetch method ${i + 1} succeeded`);
            return data;
        } catch (error) {
            console.warn(`⚠️ Weather fetch method ${i + 1} failed:`, error.message);
            if (i === methods.length - 1) {
                throw new Error('All weather fetch methods failed');
            }
        }
    }
}

// Method 1: corsproxy.io (most reliable)
async function fetchWeatherCorsproxy(lon, lat) {
    const response = await fetch(`https://corsproxy.io/?https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`);
    if (!response.ok) throw new Error(`Corsproxy error: ${response.status}`);
    const text = await response.text();
    return parseWeatherJSON(text);
}

// Method 2: proxy.cors.sh (reliable alternative)
async function fetchWeatherProxyRS(lon, lat) {
    const response = await fetch(`https://proxy.cors.sh/https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`);
    if (!response.ok) throw new Error(`Proxy.cors.sh error: ${response.status}`);
    const text = await response.text();
    return parseWeatherJSON(text);
}

// Method 3: AllOrigins with JSON wrapper
async function fetchWeatherAllOrigins(lon, lat) {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`)}`);
    if (!response.ok) throw new Error(`AllOrigins error: ${response.status}`);
    const wrapper = await response.json();
    return parseWeatherJSON(wrapper.contents);
}

// Method 4: Heroku CORS proxy
async function fetchWeatherHeroku(lon, lat) {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
    });
    if (!response.ok) throw new Error(`Heroku CORS error: ${response.status}`);
    const text = await response.text();
    return parseWeatherJSON(text);
}

// Method 5: Direct API call (fallback)
async function fetchWeatherDirect(lon, lat) {
    const response = await fetch(`https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`);
    if (!response.ok) throw new Error(`Direct API error: ${response.status}`);
    const text = await response.text();
    return parseWeatherJSON(text);
}

// Robust JSON parser that handles 7Timer's malformed JSON
function parseWeatherJSON(text) {
    try {
        // Clean up common 7Timer JSON issues
        let cleanedText = text
            .replace(/,\s*}/g, '}')  // Remove trailing commas
            .replace(/,\s*]/g, ']')  // Remove trailing commas in arrays
            .replace(/:\s*,/g, ': null,')  // Replace empty values with null
            .replace(/"\s*:\s*,/g, '": null,')  // Fix missing values
            .trim();
        
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error('JSON parsing failed, raw response:', text);
        throw new Error(`Invalid JSON response: ${error.message}`);
    }
}

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
    paris: "../images/paris.jpg",
    london: "../images/london.jpg",
    berlin: "../images/berlin.jpg",
    rome: "../images/rome.jpg",
    madrid: "../images/madrid.jpg",
    amsterdam: "../images/amsterdam.jpg",
    vienna: "../images/vienna.jpg",
    prague: "../images/prague.jpg",
    budapest: "../images/budapest.jpg",
    warsaw: "../images/warsaw.jpg",
    athens: "../images/athens.jpg",
    lisbon: "../images/lisbon.jpg",
    bucharest: "../images/bucharest.jpg",
    stockholm: "../images/stockholm.jpg",
    helsinki: "../images/helsinki.jpg",
    copenhagen: "../images/copenhagen.jpg",
    oslo: "../images/oslo.jpg",
    dublin: "../images/dublin.jpg",
    geneva: "../images/geneva.jpg",
    brussels: "../images/brussels.jpg"
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
            transition: opacity 2.5s ease;
        `;
        document.body.appendChild(overlay);

        // Start the crossfade
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';

            // Update CSS variables after transition starts
            setTimeout(() => {
                document.documentElement.style.setProperty('--hero-img', `url('${newBg}')`);
                document.documentElement.style.setProperty('--city-bg', `url('${newBg}')`);
                
                // Remove overlay after longer transition
                setTimeout(() => {
                    if (overlay && overlay.parentNode) {
                        document.body.removeChild(overlay);
                    }
                }, 2500);
            }, 100);
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

    // ---- Map loading (Multiple free map services) ----
    setTimeout(async () => {
        try {
            console.log("🗺️ Starting map load for:", cityName, lat, lon);
            mapOverlay.textContent = "Loading map…";
            mapOverlay.classList.remove("hidden");
            mapImage.style.opacity = 0;

            // Try multiple free map services in order of preference
            const mapServices = [
                // 1. OpenStreetMap with MapBox style (free, no API key)
                `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-l+ff0000(${lon},${lat})/${lon},${lat},10,0/600x400@2x?access_token=pk.eyJ1IjoidGVzdCIsImEiOiJjazBiNjVzM`,
                
                // 2. Yandex Maps Static API (free, works without API key for basic usage)
                `https://static-maps.yandex.ru/1.x/?ll=${lon},${lat}&size=600,400&z=10&l=map&pt=${lon},${lat},pm2rdm`,
                
                // 3. OpenStreetMap with custom tile server
                `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${lon},${lat}&zoom=10&marker=lonlat:${lon},${lat};color:%23ff0000;size:medium&apiKey=demo`,
                
                // 4. MapTiler (free tier, basic usage)
                `https://api.maptiler.com/maps/streets-v2/static/${lon},${lat},10/600x400.png?key=get_your_own_OpIi9ZULNHzrESv6T2vL`,
                
                // 5. Simple fallback with coordinates display
                null // This triggers the fallback display
            ];

            let mapLoaded = false;
            
            for (let i = 0; i < mapServices.length && !mapLoaded; i++) {
                const mapUrl = mapServices[i];
                
                if (!mapUrl) {
                    // Fallback: Show elegant location info instead of map
                    console.log("🔄 Using fallback location display");
                    mapOverlay.innerHTML = `
                        <div style="
                            display: flex; 
                            flex-direction: column; 
                            align-items: center; 
                            justify-content: center;
                            height: 100%;
                            text-align: center; 
                            color: #fff; 
                            background: linear-gradient(135deg, rgba(201,164,100,0.2), rgba(201,164,100,0.1));
                            backdrop-filter: blur(10px);
                            border-radius: 12px;
                            border: 1px solid rgba(255,255,255,0.1);
                        ">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">📍</div>
                            <div style="font-size: 1.3rem; margin-bottom: 0.5rem; font-weight: 500;">${cityName}</div>
                            <div style="font-size: 1rem; color: #c9a464; margin-bottom: 0.5rem;">
                                ${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'}, 
                                ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}
                            </div>
                            <div style="font-size: 0.9rem; color: #ccc; margin-top: 1rem; max-width: 280px; line-height: 1.4;">
                                Elegant weather tracking for this beautiful European destination
                            </div>
                        </div>
                    `;
                    mapOverlay.classList.remove("hidden");
                    mapImage.style.opacity = 0;
                    mapLoaded = true;
                    break;
                }
                
                try {
                    console.log(`🌐 Trying map service ${i + 1}: ${mapUrl.split('?')[0]}`);
                    
                    // Test if map loads
                    await new Promise((resolve, reject) => {
                        const testImg = new Image();
                        const timeout = setTimeout(() => {
                            reject(new Error('Map service timeout'));
                        }, 5000);
                        
                        testImg.onload = () => {
                            clearTimeout(timeout);
                            console.log(`✅ Map service ${i + 1} loaded successfully`);
                            
                            // Set the working map URL
                            mapImage.onload = () => {
                                mapOverlay.classList.add("hidden");
                                mapImage.style.opacity = 1;
                                mapLoaded = true;
                            };
                            mapImage.src = mapUrl;
                            resolve();
                        };
                        
                        testImg.onerror = () => {
                            clearTimeout(timeout);
                            reject(new Error(`Map service ${i + 1} failed`));
                        };
                        
                        testImg.src = mapUrl;
                    });
                    
                    break; // If we get here, the map loaded successfully
                    
                } catch (error) {
                    console.warn(`⚠️ Map service ${i + 1} failed:`, error.message);
                    continue; // Try next service
                }
            }
            
        } catch (err) {
            console.error("❌ All map services failed:", err);
            // Final fallback with enhanced design
            mapOverlay.innerHTML = `
                <div style="
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    justify-content: center;
                    height: 100%;
                    text-align: center; 
                    color: #fff; 
                    background: linear-gradient(135deg, rgba(201,164,100,0.15), rgba(0,0,0,0.3));
                    backdrop-filter: blur(15px);
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.1);
                ">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🌍</div>
                    <div style="font-size: 1.2rem; margin-bottom: 0.5rem; font-weight: 500;">${cityName || 'Selected Location'}</div>
                    <div style="font-size: 0.9rem; color: #c9a464;">
                        ${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'}, 
                        ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}
                    </div>
                    <div style="font-size: 0.8rem; color: #aaa; margin-top: 1rem; max-width: 300px; line-height: 1.4;">
                        European destination ready for weather exploration
                    </div>
                </div>
            `;
            mapOverlay.classList.remove("hidden");
            mapImage.style.opacity = 0;
        }
    }, 400); // Start loading after main content begins showing

    // ---- Weather data fetch (multiple CORS solutions) ----
    setTimeout(async () => {
        try {
            const data = await fetchWeatherWithFallbacks(lon, lat);

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