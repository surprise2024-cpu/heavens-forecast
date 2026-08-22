
import type { CurrentWeatherResponse, ForecastResponse } from '../Services/WeatherAPI';

const CACHE_KEY = 'weather-app:last-weather-cache';

export interface WeatherCache {
    city: string;
    currentWeather: CurrentWeatherResponse;
    forecast: ForecastResponse;
    cachedAt: number; // timestamp for cached data
}

export function saveWeatherCache(
    city: string,
    currentWeather: CurrentWeatherResponse,
    forecast: ForecastResponse
): void {
    try {

        const payload: WeatherCache = { 
            city, 
            currentWeather, 
            forecast,
            cachedAt: Date.now() 
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
    }
    catch (err) {
        console.error('Failed to cache weather data: ', err)
    }
}

export function loadWeatherCache(): WeatherCache | null {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as WeatherCache;
    }
    catch (err) {
        console.error('Failed to load cached weather data:', err);
        return null;
    }
}

export function formatCacheAge(cachedAt: number): string {
    const diffMs = Date.now() - cachedAt;
    const mins = Math.round(diffMs / 60000);

    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;

    const hours = Math.round(mins / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

    const days = Math.round(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`
}
