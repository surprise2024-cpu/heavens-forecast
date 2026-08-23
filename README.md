# Heavens Forecast

A location-first weather dashboard built with **React**, **TypeScript** and the **OpenWeatherMap API**. On first load, the app asks for your current location and shows live conditions, an hourly forecast and a daily outlook.

---

## Screenshots


![Dark themed dashboard](/src/assets/dashboard.png)

![Light themed dashboard](/src/assets/white%20dashboard.png)

![Saved cities](/src/assets/cities.png)


> Screenshots are taken from active development builds.

---

## Features

### Real-Time Weather

- Current temperature, "Real feel", wind speed and humidity.
- Hourly forecast strip (next several 3-hour intervals)
- 6-day daily forecast - click any day to view its details in the dashboard.

### Location-Based Forecasting

- Requests the users current location on load (with permission).
- Debounced city search, powered by OpenWeatherMap's Geocoding API.
- Clear, actionable error messages if location Access is denied or times out - always with a fallback to search manually. 

### Weather ALerts

- Heuristic severe-weather detection (thunderstorms, tornadoes, extreme heat/cold, high winds) derived from live data.
- In-app alert banner, dismissible per-alert.

### Multiple Locations

- Bookmark any city from the dashboard.
- Dedicated Cities page with a live mini weather preview for each saved location.
- Click a saved city to make it the active dashboard view.
- Persisted to `localStorage`.

### Customization

- Light / Dark theme toggle.
- Celsius / Fahrenheit unit toggle.

### Offline Access

- Last successfully fetched weather is cached to `localStorage`.
- Automatically falls back to cached data when offline.

### Navigation

- Real client-side routing (`react-router-dom`) - `/`, `/cities`.
- Sidebar highlights the active route automatically.

---

## Tech Stack

| Category | Choice |
|---|---|
| Framework | React + TypeScript (Vite) |
| Routing | react-router-dom |
| Styling | CSS Modules |
| Icons | lucide-react |
| Weather Data | OpenWeatherMap API |
| Browser APIs | Geoloaction |
| Persistence | `localStorage` |

---

## Project Structure

```
src/
    assets/
    components/
        BentoSection/
            BentoSection.module.css
            BentoSection.tsx
        Cities/
            Cities.module.css
            Cities.tsx
        ErrorMessage/
            ErrorMessage.module.css
            ErrorMessage.tsx
        Forecast/
            Forecast.module.css
            Forecast.tsx
        HeroSection/
            HeroSection.module.css
            HeroSection.tsx
        hooks/
            UseNotificationPermission.tsx
            UseOnlineStatus.tsx
            useSavedLocation.tsx
            useWeather.tsx
            WeatherAlertNotifier.tsx
            WeatherAlerts.tsx
            WeatherCache.tsx
        Navbar/
            Navbar.module.css
            Navbar.tsx
        Offline/
            OfflineBanner.module.css
            OfflineBanner.tsx
        SaveLocationButton/
            SaveLocationButton.module.css
            SaveLocationButton.tsx
        Searchbar/
            Searchbar.module.css
            Searchbar.tsx
        Services/
            WeatherAPI.tsx
        TemperatureToggle
            TemperatureToggle.module.css
            TemperatureToggle.tsx
        Text/
            Text.module.css
            Text.tsx
        ThemeToggle/
            ThemeToggle.module.css
            ThemeToggle.tsx
        utils/
            WeatherUtilities.tsx
        WeatherAlertBanner/
            WeatherAlertBanner.module.css
            WeatherrAlertBanner.tsx
        WeatherDashboard/
            WeatherDashboard.module.css
            WeatherDashboard.tsx
            WeatherView.tsx
    App.css
    App.tsx
    index.css
    main.tsx
    theme.css
.env
.gitignore
eslint.config.js
index.html
package-lock.json
package.json
README.md
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts

```

---

## Getting Started

### Prerequisites

- Node.js 18+
- An [OpenWeatherMap API key](https://openweathermap.org/api) (free tier works fine)

### Setup

```bash

# clone the repo

git clone https://github.com/surprise2024-cpu/heavens-forecast.git

cd heavens-forecast

# install dependencies

npm install

# add yout API key

cp .env.example .env

# then edit .env and set VITE_OWN_API_KEY

# start the dev server
npm run dev

```

The app runs at `http://localhost:5173` by default.

### Environment Variables

| Variable | Description |
|---|---|
| `VITE_OWN_API_KEY` | Your OpenWeatherMap API key |

> Nevere commit `.env` it's gitignored. For security.

---

## Routes

| Path | Page |
|---|---|
| `/` | Main weather dashboard|
| `/cities` | Saved locations |
| `/map` | currently unavailable |
| `/settings` | currently unavailable |

## Known Limitations & Roadmap

- **Weather alerts are heuristic, not official.** OpenWeatherMap's free tier doesn't include severe weather alert data - alerts here are derived from condition type, temperature and wind speed thresholds, not an actual source.
- **Notifications are foreground only.** True background push would require a backend push server and service worker: the current implementation uses the browser's native `Notification` API while the app is open.
- **Map view is a placeholder** An interactive map is planned for the future.

