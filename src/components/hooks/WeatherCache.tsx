
import type { CurrentWeatherResponse, ForecastResponse } from '../Services/WeatherAPI';

// key used to store the latst weather data in localStorage.
const CACHE_KEY = 'weather-app:last-weather-cache';

// describes the structure of the cached weather data.
export interface WeatherCache {
    city: string;
    currentWeather: CurrentWeatherResponse;
    forecast: ForecastResponse;
    cachedAt: number; // timestamp for cached data
}

// saves the latest successful weather response to localStorage.
export function saveWeatherCache(
    city: string,
    currentWeather: CurrentWeatherResponse,
    forecast: ForecastResponse
): void {
    try {

        // combine everything we want to cache
        // into one structured object.
        const payload: WeatherCache = { 
            city, 
            currentWeather, 
            forecast,

            // record when the cache was created.
            cachedAt: Date.now() 
        };

        // localStorage only stores strings,
        // so convert the object into json first.
        localStorage.setItem(CACHE_KEY, JSON.stringify(payload));

    }
    catch (err) {

        // prevent storage errors from crashing the app.
        console.error(
            'Failed to cache weather data: ', 
            err
        );

    }

}

// loads the latest weather cache from localStorage
export function loadWeatherCache(): WeatherCache | null {
    try {

        // read the stored json string
        const raw = 
            localStorage.getItem(CACHE_KEY);

        // no cache has been reated yet.
        if (!raw) {
            return null;
        }

        // convert the stored json back into 
        // a javascript object.
        return JSON.parse(raw) as WeatherCache;
    }
    catch (err) {

        // invalid json or localStorage errors
        // result in no usable cache.
        console.error(
            'Failed to load cached weather data:', 
            err
        );

        return null;
    }
}

// convert the cache timestamp into
// a human-readable age.
export function formatCacheAge(

    cachedAt: number

): string {

    // work out how much time has passed
    // since the weather data was cached.
    const diffMs = 
        Date.now() - cachedAt;

    // convert milliseconds into minutes
    const mins = 
        Math.floor(diffMs / 60000);

    // less than one minute old
    if (mins < 1) {
        return 'just now';
    }

    // less than one minute old
    if (mins < 60) {
        return `${mins} min${mins === 1 ? '' : 's'} ago`;
    }

    // covert minutes into hours.
    const hours = 
        Math.round(mins / 60);

    // less than one day old
    if (hours < 24) {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }

    // convert hours into days
    const days = 
        Math.round(hours / 24);
    
    return `${days} day${days === 1 ? '' : 's'} ago`;
        
}
