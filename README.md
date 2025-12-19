<p align="center">
  <img src="images/banner.jpg" alt="Global Weather Explorer Banner" width="100%"/>
</p>

<h1 align="center">🌤️ Global Weather Explorer</h1>

<p align="center">
  <strong>Explore weather forecasts for 170+ cities worldwide</strong><br>
  Beautiful, responsive, and built with pure JavaScript
</p>

<p align="center">
  <a href="https://weather-forecast-global.onrender.com" target="_blank">
    <img src="https://img.shields.io/badge/🌍%20Live%20Demo-Visit%20Site-blue?style=for-the-badge"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-Vanilla-yellow?style=flat-square&logo=javascript"/>
  <img src="https://img.shields.io/badge/CSS3-Modern-blue?style=flat-square&logo=css3"/>
  <img src="https://img.shields.io/badge/API-7timer-green?style=flat-square"/>
  <img src="https://img.shields.io/badge/Geocoding-Open--Meteo-orange?style=flat-square"/>
  <img src="https://img.shields.io/badge/Maps-Leaflet-lightgrey?style=flat-square&logo=leaflet"/>
  <img src="https://img.shields.io/badge/Cities-170+-purple?style=flat-square"/>
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌍 **170+ Global Cities** | Explore weather across Europe, Americas, Asia, Africa, Middle East & Oceania |
| 🔍 **Smart City Search** | Search any city worldwide with real-time geocoding |
| 📅 **7-Day Forecasts** | Powered by the free **7timer.info** weather API |
| 🎨 **Dynamic Backgrounds** | City-themed images with smooth crossfade transitions |
| 🗺️ **Interactive Maps** | Integrated with **Leaflet** and **OpenStreetMap** |
| 💎 **Glassmorphism UI** | Modern design with soft blurs and golden accents |
| 📱 **Fully Responsive** | Optimized for desktop, tablet, and mobile |
| 📬 **City Request Form** | Users can request missing city backgrounds |
| ⚡ **Lightweight** | No frameworks — pure vanilla JavaScript |

---

## 🖼️ Screenshots

<p align="center">
  <img src="images/screenshot-hero.jpg" alt="Hero Section" width="80%"/>
</p>

<p align="center">
  <img src="images/screenshot-forecast.jpg" alt="Weather Forecast" width="80%"/>
</p>

---

## 🌍 Supported Regions

### 🇪🇺 Europe (60+ cities)
Paris • London • Berlin • Rome • Madrid • Amsterdam • Vienna • Prague • Stockholm • and more...

### 🇺🇸 North America (25+ cities)
New York • Los Angeles • Chicago • Toronto • Vancouver • Mexico City • Miami • and more...

### 🌎 South America (15+ cities)
São Paulo • Buenos Aires • Rio de Janeiro • Lima • Bogotá • Santiago • and more...

### 🌏 Asia (30+ cities)
Tokyo • Singapore • Bangkok • Seoul • Hong Kong • Dubai • Mumbai • and more...

### 🌍 Africa (20+ cities)
Cairo • Cape Town • Lagos • Nairobi • Casablanca • Johannesburg • and more...

### 🇦🇺 Oceania (10+ cities)
Sydney • Melbourne • Auckland • Brisbane • Wellington • and more...

---

## 🏗️ Architecture Overview

### 🟡 Pure Vanilla JavaScript
- No React, Vue, or bundlers
- Event-driven structure
- Dynamic weather card generation
- Custom background transition engine
- Real-time city search with debouncing

### 🌐 API Integration

#### **7timer Weather API**
```javascript
const url = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;