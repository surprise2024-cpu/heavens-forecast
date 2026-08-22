import { useEffect, useState } from 'react'

import { 
    getCurrentWeather, 
    getCurrentWeatherByCoords, 
    getWeatherForecast, 
    type CurrentWeatherResponse, 
    type ForecastResponse
} from '../Services/WeatherAPI'
import { formatCacheAge, loadWeatherCache, saveWeatherCache } from './WeatherCache';
import { UseOnlineStatus } from './UseOnlineStatus';


export type CurrentWeather = CurrentWeatherResponse;

export type UseWeatherReturn = {
    currentWeather: CurrentWeather | null;
    forecast: ForecastResponse | null;
    loading: boolean;
    error: string | null;
    unit: string;

    isOnline: boolean;
    usingCache: boolean;
    cacheAge: string | null;

    fetchWeatherByCity: (city: string) => Promise<void>;
    fetchWeatherByLocation: () => Promise<void>;
    toggleUnit: () => void;
};

export const useWeather = (): UseWeatherReturn => {

    const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
    const [forecast, setForecast] = useState<ForecastResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [unit, setUnit] = useState('C');

    const [usingCache, setUsingCache] = useState(false);
    const [cacheAge, setCacheAge] = useState<string | null>(null);
    const isOnline = UseOnlineStatus();

    const loadFromCache = (): boolean => {
        const cached = loadWeatherCache();
        if (!cached) return false;

        setCurrentWeather(cached.currentWeather);
        setForecast(cached.forecast);
        setUsingCache(true);
        setCacheAge(formatCacheAge(cached.cachedAt));
        setError(null);
        return true;
    }
    
    const fetchWeatherByCity = async (city: string) => {
        setLoading(true);
        setError(null);

        if (!navigator.onLine) {
            const hadCache = loadFromCache();
            if (!hadCache) {
                setError('You are offline and no cached weather data is available yet');
            }

            setLoading(false);
            return;
        }
        
        try {
            const [weatherData, forecastData] = await Promise.all([
                getCurrentWeather(city),
                getWeatherForecast(city),
            ]);

            setCurrentWeather(weatherData);
            setForecast(forecastData);

            setUsingCache(false);
            setCacheAge(null);

            saveWeatherCache(city, weatherData, forecastData);
            
        }
        catch (err) {

            const hadCache = loadFromCache();

            if (!hadCache) {

                setError(
                    err instanceof Error ? err.message : 'Failed to fetch weather data'
                );
            }
            
        }
        finally {
            setLoading(false)
        }
    };

    const fetchWeatherByLocation = async () => {

        if(!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }
        
        setLoading(true);
        setError(null);

        if (!navigator.onLine) {
            const hadCache = loadFromCache();
            if (!hadCache) {
                setError('You are offline and no cached weather data is available yet');
            }

            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {

                try {

                    const {latitude, longitude} = position.coords;

                    const weatherData = await getCurrentWeatherByCoords(
                        latitude, 
                        longitude
                    );

                    setCurrentWeather(weatherData);

                    //fetch forecast for the current location
                    const forecastData = await getWeatherForecast(weatherData.name);
                    setForecast(forecastData);

                    setUsingCache(false);
                    setCacheAge(null);

                    saveWeatherCache(weatherData.name, weatherData, forecastData);

                }
                catch (err) {
                    const hadCache = loadFromCache();

                    if (!hadCache) {

                        setError(
                            err instanceof Error ? err.message : 'Failed to fetch weather data'
                        );
                    }
                }
                finally {
                    setLoading(false);
                }

            },
            (error) => {
                
                const message = error.code === error.PERMISSION_DENIED
                ? 'Location access was denied. Please allow location access and try again.'
                : error.code === error.TIMEOUT
                ? 'Location request timed out. Please try again.'
                : 'Unable to retrieve your location. Please allow location access and try again.'

                setError(message);
                setLoading(false);
            }
        );

    };

    const toggleUnit = () => {
    setUnit(prev => (prev === 'C' ? 'F' : 'C'));
    };


    return { 
        currentWeather, 
        forecast, 
        loading, 
        error, 
        unit, 

        isOnline,
        usingCache,
        cacheAge,

        fetchWeatherByCity, 
        fetchWeatherByLocation, 
        toggleUnit 
    };
 
};
