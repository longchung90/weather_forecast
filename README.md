# European Weather Explorer 🌤️

A beautiful, responsive vanilla JavaScript weather application that provides 7-day forecasts for iconic European cities. Built with pure HTML, CSS, and JavaScript - no frameworks or build process required.

![European Weather Explorer](https://img.shields.io/badge/JavaScript-Vanilla-yellow) ![CSS3](https://img.shields.io/badge/CSS3-Modern-blue) ![API](https://img.shields.io/badge/API-7timer-green)

## ✨ Features

- **20 European Cities**: From Paris to Stockholm, explore weather across Europe
- **7-Day Forecasts**: Detailed weather predictions using 7timer.info API
- **Dynamic Backgrounds**: City-specific background transitions with crossfade effects
- **Interactive Maps**: Static Yandex Maps integration for city visualization
- **Responsive Design**: Mobile-first approach with smooth animations
- **Glass Morphism UI**: Modern design with backdrop blur effects
- **Accessibility**: Keyboard navigation and reduced motion support

## 🏗️ Architecture

### Pure Vanilla JavaScript
- No frameworks, no build process
- Modern ES6+ features with async/await
- Modular CSS architecture
- Event-driven design patterns

### API Integration
- **7timer.info**: Free weather API with CORS support
- **Yandex Maps**: Static map images for city visualization
- Robust error handling and data validation

### Design System
```css
:root {
  --bg: #0b1420;           /* Deep midnight base */
  --gold: #c9a464;         /* Luxury accent color */
  --glass: rgba(255, 255, 255, 0.08);  /* Glass morphism */
  --shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
}
```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/longchung90/weather_forecast.git
cd weather_forecast
```

### 2. Start Local Server
```bash
# Choose one method:
python3 -m http.server 8000
# or
npx serve .
# or
php -S localhost:8000
```

### 3. Open Browser
Navigate to `http://localhost:8000`

## 🌍 Supported Cities

### Western Europe
- Paris 🇫🇷, London 🇬🇧, Brussels 🇧🇪, Amsterdam 🇳🇱, Geneva 🇨🇭

### Central Europe  
- Berlin 🇩🇪, Vienna 🇦🇹, Prague 🇨🇿, Budapest 🇭🇺, Warsaw 🇵🇱

### Southern Europe
- Rome 🇮🇹, Madrid 🇪🇸, Athens 🇬🇷, Lisbon 🇵🇹, Bucharest 🇷🇴

### Northern Europe
- Stockholm 🇸🇪, Helsinki 🇫🇮, Copenhagen 🇩🇰, Oslo 🇳🇴, Dublin 🇮🇪

## 📁 Project Structure

```
weather-forcast/
├── index.html              # Main HTML file
├── script.js               # Core JavaScript logic
├── css/
│   ├── style.css          # Main styles & weather cards
│   ├── hero.css           # Hero section & animations
│   └── Button.css         # Interactive button styles
├── images/
│   ├── eu.jpg            # Default background
│   └── [city].jpg        # City-specific backgrounds
└── README.md
```

## 🎨 Key Features

### Background Transition System
Smooth crossfade transitions between city-specific backgrounds using optimized JavaScript animations.

### Weather Card Generation
Dynamic CSS gradients and emoji icons based on weather conditions from the 7timer API.

### Responsive Breakpoints
- **1024px**: Grid layout adaptation
- **900px**: Mobile controls stacking
- **560px**: Typography scaling
- **600px**: Footer optimizations

### Error Handling
Comprehensive error handling for:
- Network connectivity issues
- API rate limits
- Missing weather data (-9999 values)
- Image loading failures

## 🔧 Adding New Cities

1. **HTML**: Add option to `#citySelect`
```html
<option value="lat,lon" data-bg="citykey">City Name 🇫🇱</option>
```

2. **JavaScript**: Add to `cityBackgrounds` object
```javascript
cityBackgrounds.citykey = 'images/citykey.jpg';
```

3. **Assets**: Add `citykey.jpg` to `images/` directory

## 🌐 API Reference

### 7timer Weather API
```javascript
const url = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;
```

**Data Validation**: Always filter out `temp2m === -9999` (missing data indicator)

### Yandex Maps API
Static map images generated with coordinates and custom styling for each city location.

## 🎯 Performance Optimizations

- **Hardware Acceleration**: CSS transforms and opacity for smooth animations
- **Image Preloading**: Background images load before transitions
- **Efficient DOM**: Minimal DOM manipulation with event delegation
- **Async Operations**: Non-blocking API calls with proper error boundaries

## 🔍 Browser Support

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

Modern JavaScript features used:
- ES6 modules, async/await, CSS Grid, CSS Custom Properties

## 📱 Mobile Experience

Fully responsive design with:
- Touch-friendly interface
- Optimized typography scaling
- Smooth scroll behavior
- Reduced motion support

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **7timer.info** for free weather API access
- **Yandex Maps** for static map imagery
- **Font Awesome** for iconography
- **Google Fonts** for Playfair Display typography

---

## 🌐 Connect with Me

<p align="center">
  <a href="https://github.com/longhoachung" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Badge"/>
  </a>
  <a href="https://lcportfolio.org" target="_blank">
    <img src="https://img.shields.io/badge/Portfolio-0A66C2?style=for-the-badge&logo=about.me&logoColor=white" alt="Portfolio Badge"/>
  </a>
  <a href="https://www.coursera.org/user/your-coursera-username" target="_blank">
    <img src="https://img.shields.io/badge/Coursera-0056D2?style=for-the-badge&logo=coursera&logoColor=white" alt="Coursera Badge"/>
  </a>
</p>

<p align="center">
  <em>Inspired by adventure. Powered by code.</em>  
  <br>
  © 2025 <strong>Long Hoa Chung</strong> — All Rights Reserved.
</p>

*Inspired by adventure. Powered by code.*
