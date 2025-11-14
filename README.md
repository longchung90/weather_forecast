# 🌤️ European Weather Explorer

A beautiful, fully responsive vanilla JavaScript web app that delivers 7-day weather forecasts for major European cities.  
Built with **pure HTML, CSS, and JavaScript** — no frameworks, no build tools.

![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow)
![CSS3](https://img.shields.io/badge/CSS3-Modern-blue)
![API](https://img.shields.io/badge/API-7timer-green)
![Map](https://img.shields.io/badge/Maps-Leaflet%20%2B%20OpenStreetMap-lightgrey)

---

## ✨ Features

- 🌍 **20 Popular European Cities**  
  Paris, London, Vienna, Rome, Stockholm, and more

- 📅 **7-Day Forecasts**  
  Powered by the free **7timer.info** weather API

- 🎨 **City-Themed Dynamic Backgrounds**  
  Smooth crossfades using custom transition logic

- 🗺️ **Interactive Maps**  
  Integrated with **Leaflet** and **OpenStreetMap**

- 💎 **Modern Glassmorphism UI**  
  Soft blurs, golden accents, and elegant typography

- 📱 **Fully Responsive Design**  
  Optimized for desktop, tablet, and mobile

- ⚡ **Fast, Lightweight & Framework-Free**  
  Just vanilla JS with async/await and ES6 modules

---

## 🏗️ Architecture Overview

### 🟡 Pure Vanilla JavaScript
- No React, Vue, or bundlers  
- Event-driven structure  
- Weather card generator  
- Custom background transition engine  

### 🌐 API Integration
#### **7timer Weather API**
- Civil weather product  
- Returns cloud cover, temperature, wind, precipitation, and conditions  

#### **Leaflet + OpenStreetMap**
- Highly responsive interactive maps  
- Smooth panning & marker updates  

### 🎨 Design System

```css
:root {
  --bg: #0b1420;
  --gold: #c9a464;
  --glass: rgba(255, 255, 255, 0.08);
  --shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
}


🚀 Getting Started
1. Clone the Repository
git clone https://github.com/longchung90/weather_forecast.git
cd weather_forecast

2. Run a Local Server
python3 -m http.server 8000
# or
npx serve .
# or
php -S localhost:8000

3. Open Your Browser

Visit:

http://localhost:8000

🌍 Supported Cities
Western Europe

🇫🇷 Paris • 🇬🇧 London • 🇧🇪 Brussels • 🇳🇱 Amsterdam • 🇨🇭 Geneva

Central Europe

🇩🇪 Berlin • 🇦🇹 Vienna • 🇨🇿 Prague • 🇭🇺 Budapest • 🇵🇱 Warsaw

Southern Europe

🇮🇹 Rome • 🇪🇸 Madrid • 🇬🇷 Athens • 🇵🇹 Lisbon • 🇷🇴 Bucharest

Northern Europe

🇸🇪 Stockholm • 🇫🇮 Helsinki • 🇩🇰 Copenhagen • 🇮🇪 Dublin • 🇸🇰 Bratislava

📁 Project Structure
weather-forecast/
├── index.html
├── script.js
├── css/
│   ├── style.css
│   ├── hero.css
│   └── button.css
├── images/
│   ├── eu.jpg
│   └── [city].jpg
└── README.md

🎨 UI Highlights
✨ Background Transition Engine

Custom JavaScript fade-in and crossfade animation using requestAnimationFrame and image preloading.

✨ Weather Cards

Golden headers

Large temperature typography

Animated entry (@keyframes fadeSlideUp)

Emoji-based weather icons mapped to real 7timer API codes

✨ Breakpoints

>1024px: desktop layout

900px: stacked controls

560px: compact card layout

600px: mobile map optimization

🧠 Error Handling

The app gracefully manages:

Network failures

API outage

Incorrect coordinates

Missing temperature values (temp2m = -9999)

Image load errors

🧩 Add a New City
Step 1 — Add to HTML
<option value="lat,lon" data-bg="citykey" data-name="City" data-flag="🇫🇷">
  City 🇫🇷
</option>

Step 2 — Add Background Mapping
cityBG.citykey = "images/citykey.jpg";

Step 3 — Add the image

Place citykey.jpg in /images.

🌐 API Reference
📘 7timer API
const url =
  `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;

🗺️ Leaflet Map
const map = L.map("map").setView([lat, lon], 7);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

🔧 Performance Considerations

Hardware-accelerated opacity transitions

Preloaded images for smoother background changes

Minimal DOM inserts

Lazy update of map marker instead of re-initializing

🔍 Browser Compatibility

Chrome 88+

Firefox 78+

Safari 14+

Edge 88+

Uses:

CSS Grid

CSS Custom Properties

ES6 Modules

Async/Await

🤝 Contributing

Fork this repo

Create a branch

Commit your changes

Push and open a PR

📄 License

This project is licensed under the MIT License.

🙏 Acknowledgements

7timer.info — free weather data

Leaflet & OpenStreetMap — interactive maps

Google Fonts — Playfair Display

🌐 Connect with Me
<p align="center"> <a href="https://github.com/longchung90" target="_blank"> <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"/> </a> <a href="https://lcportfolio.org" target="_blank"> <img src="https://img.shields.io/badge/Portfolio-0A66C2?style=for-the-badge&logo=about.me&logoColor=white"/> </a> <a href="#" target="_blank"> <img src="https://img.shields.io/badge/Coursera-0056D2?style=for-thebadge&logo=coursera&logoColor=white"/> </a> </p> <p align="center"> <em>Inspired by adventure. Powered by code.</em><br> © 2025 <strong>Long Hoa Chung</strong> </p> ```