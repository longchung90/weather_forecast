# European Weather Explorer - Copilot Instructions

## Architecture Overview

This is a **pure vanilla JavaScript weather application** with no build process or frameworks. The app fetches 7-day forecasts for European cities using the 7timer.info API and displays them with dynamic background transitions.

### Core Components
- **Single Page Application**: `index.html` with modular CSS in `css/` directory
- **Weather Service**: Direct fetch to `https://www.7timer.info/bin/api.pl` (JSON format)
- **Map Integration**: Static Yandex Maps API for city visualization
- **Background System**: Dynamic city-specific background images with crossfade transitions

## Key Technical Patterns

### API Integration Pattern
```javascript
// 7timer API expects lat,lon format with specific parameters
const url = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;
```
- **Always validate** `temp2m !== null` and `!== -9999` (7timer uses -9999 for missing data)
- **Filter dataseries** before displaying to avoid broken weather cards
- **Handle CORS**: API works directly from frontend (no proxy needed)

### CSS Architecture (Modular)
- `style.css`: Core theming, layout grid, weather cards
- `hero.css`: Hero section with Ken Burns animation
- `Button.css`: Gold-themed interactive buttons
- **CSS Variables**: Consistent theming via `:root` custom properties (`--gold`, `--glass`, etc.)

### Design System Variables
```css
:root {
  --bg: #0b1420;           /* Deep midnight base */
  --gold: #c9a464;         /* Luxury accent color */
  --glass: rgba(255, 255, 255, 0.08);  /* Glass morphism */
  --shadow: 0 12px 40px rgba(0, 0, 0, 0.45);  /* Consistent shadows */
  --radius: 16px;          /* Border radius system */
}
```
- **Glass morphism**: Consistent `backdrop-filter: blur()` with alpha transparency
- **Gold accent system**: Three-tier gold colors for hover/active states
- **Shadow hierarchy**: Consistent depth with `--shadow` variable

### Background Transition System
The app uses a sophisticated crossfade mechanism in `script.js`:
```javascript
function crossfadeBackground(newBg) {
  // Creates overlay div for smooth 1.5s transition
  // Updates body background after animation completes
}
```
- City backgrounds stored in `cityBackgrounds` object mapping to `images/` files
- Each option has `data-bg` attribute linking to background key

### Weather Card Generation
- **Dynamic CSS**: Background gradients assigned per weather condition in `bgColors` object
- **Icon Mapping**: Emoji-based weather icons via `iconMap` object
- **Grid Layout**: Auto-fit grid with 180px minimum card width

## Development Workflow

### Testing the Application
```bash
# Simple HTTP server (any of these work)
python3 -m http.server 8000
npx serve .
php -S localhost:8000
```

### Adding New Cities
1. Add option to `#citySelect` in `index.html` with `value="lat,lon"` and `data-bg="citykey"`
2. Add corresponding image to `images/citykey.jpg`
3. Add entry to `cityBackgrounds` object in `script.js`

### Weather Condition Styling
Weather cards use both emoji icons (`iconMap`) and CSS gradients (`bgColors`). Always add both when supporting new weather conditions from 7timer API.

## Common Issues & Solutions

### API Data Validation
7timer API sometimes returns incomplete data:
- Check `day.weather && day.temp2m !== null && day.temp2m !== -9999`
- Use `.filter()` before `.slice(0, 7)` to ensure 7 valid forecasts

### Background Loading
Images must preload via `new Image()` before crossfade to prevent flash:
```javascript
const img = new Image();
img.onload = () => { /* start transition */ };
img.src = newBg;
```

### Main Content Visibility
Main section starts hidden (`opacity: 0`) and shows via `.show` class after city selection. This creates smooth reveal animation.

### CORS Considerations
7timer API allows direct frontend requests. If switching APIs, consider CORS policies and potential need for backend proxy.

## File Structure Logic
- `images/`: City backgrounds + default `eu.jpg`
- `css/`: Modular stylesheets (never combine into single file)
- Root level: Core HTML/JS files only

## Error Handling Patterns

### Robust API Error Handling
The app includes comprehensive error handling for different failure modes:
```javascript
catch (error) {
  let errorMessage = "Unable to load weather data. ";
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    errorMessage += "This might be a network connectivity issue or CORS restriction.";
  } else if (error.message.includes('HTTP error')) {
    errorMessage += `Server responded with error: ${error.message}`;
  }
}
```

### Image Loading Safety
All dynamic images (backgrounds, maps) include error handlers:
```javascript
img.onerror = () => {
  console.warn(`Failed to load background image: ${newBg}`);
};
```

## Event-Driven Architecture

### Single Event Handler Pattern
The app uses one main event listener on `getForecastBtn` that orchestrates:
1. Background transition
2. Map loading
3. Weather data fetch
4. UI state updates
5. Smooth scrolling to results

### Async/Await Pattern
All asynchronous operations use modern async/await with proper error boundaries.

## Responsive Design Strategy

### Mobile-First Breakpoints
- **1024px**: Grid layout switches from 2-column to single column
- **900px**: Controls stack vertically, button becomes full width  
- **560px**: Typography scaling for mobile
- **600px**: Footer icon sizing adjustments

### Accessibility Features
- `prefers-reduced-motion` media query disables animations
- `focus-visible` styles for keyboard navigation
- Semantic HTML structure with proper ARIA labels

## Debugging & Development

### Console Logging Strategy
- **Success indicators**: `✅ script.js optimized version loaded`
- **API debugging**: Logs response status and data structure
- **Error tracking**: Detailed error messages with context

### Local Development Setup
```bash
# Quick server options (no build process needed)
python3 -m http.server 8000    # Python
npx serve .                    # Node.js
php -S localhost:8000          # PHP
```

## Performance Notes
- Static map images (Yandex) load faster than interactive maps
- CSS animations use `transform` and `opacity` for hardware acceleration
- Background transitions are optimized with `requestAnimationFrame`
- Images preloaded before transitions to prevent visual glitches