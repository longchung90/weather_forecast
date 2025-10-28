console.log("✅ script.js fully fixed and optimized");

// ===== DOM =====
const getForecastBtn = document.getElementById("getForecastBtn");
const citySelect = document.getElementById("citySelect");
const mainContent = document.querySelector("main");

// ===== MAP ELEMENTS =====
let map;      // declare here; will be initialized by Google Maps callback
let marker;   // same
const forecastCityName = document.getElementById("forecastCityName");

// ===== WEATHER =====
const weatherGrid = document.getElementById("weatherGrid");
const forecastHeading = document.getElementById("forecastHeading");
const forecastCityIcon = document.getElementById("forecastCityIcon");
const hero = document.querySelector(".hero");

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
    const img = new Image();
    img.onload = () => {
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
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            setTimeout(() => {
                document.documentElement.style.setProperty('--hero-img', `url('${newBg}')`);
                setTimeout(() => document.body.removeChild(overlay), 200);
            }, 1300);
        });
    };
    img.src = newBg;
}

// ===== City selection =====
function updateCitySelection() {
    const selectedOption = citySelect.options[citySelect.selectedIndex];
    const bgKey = selectedOption.dataset.bg;
    const cityName = selectedOption.dataset.name;
    const flag = selectedOption.dataset.flag;

    if (forecastCityIcon) forecastCityIcon.textContent = flag;
    if (forecastCityName) forecastCityName.textContent = cityName;
    const newBg = cityBackgrounds[bgKey];
    if (newBg) crossfadeBackground(newBg);
}

// ===== Google Maps init =====
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 48.8566, lng: 2.3522 },
        zoom: 6,
        mapId: "DEMO_MAP_ID"
    });

    marker = new google.maps.Marker({
        position: { lat: 48.8566, lng: 2.3522 },
        map,
        title: "Paris"
    });
}
window.initMap = initMap;

// ===== Update Map Function =====
function updateMap(lat, lon, cityName) {
    if (!map || !marker) return;
    map.setCenter({ lat, lng: lon });
    map.setZoom(8);
    marker.setPosition({ lat, lng: lon });
    marker.setTitle(cityName);
}

// ===== Event Listeners =====
citySelect.addEventListener("change", updateCitySelection);
getForecastBtn.addEventListener("click", () => {
    const [lat, lon] = citySelect.value.split(",");
    const cityName = citySelect.options[citySelect.selectedIndex].text;
    forecastCityName.textContent = cityName;
    updateMap(parseFloat(lat), parseFloat(lon), cityName);
});
