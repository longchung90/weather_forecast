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

