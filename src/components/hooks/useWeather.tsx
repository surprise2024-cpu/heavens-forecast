import { useCallback, useEffect, useState } from 'react'

import { 
    getCurrentWeather, 
    getCurrentWeatherByCoords, 
    getWeatherForecast, 
    type CurrentWeatherResponse, 
    type ForecastResponse
} from '../Services/WeatherAPI'
import { formatCacheAge, loadWeatherCache, saveWeatherCache } from './WeatherCache';
import { useOnlineStatus } from './UseOnlineStatus';

// Re-export the API current weather type under
// a shorter application-specific name.
export type CurrentWeather = CurrentWeatherResponse;

// describes everything returned by the useWeather hook
export type UseWeatherReturn = {

    // current weather information
    currentWeather: CurrentWeather | null;

    // multi-day weather forecast
    forecast: ForecastResponse | null;

    // indicates whether weathr data is currently loading
    loading: boolean;

    // stores any-userfacing weather error message.
    error: string | null;

    // currentlt selected temperature unit.
    unit: string;

    // indicates whether the browser is currently online
    isOnline: boolean;

    // indicates whether the displa weatherr
    // came from local cache instea of API.
    usingCache: boolean;

    // human-readable age of the cached weather data.
    cacheAge: string | null;

    // fetch weather using a city name.
    fetchWeatherByCity: (
        city: string
    ) => Promise<void>;

    // fetch weather using the user's current location.
    fetchWeatherByLocation: () => Promise<void>;

    // switch between celsius and fahrenheit.
    toggleUnit: () => void;
};

// main custom hook responsible for managing
// weather data and weather-related state.
export const useWeather = (): UseWeatherReturn => {

    // stores the current display weather.
    const [currentWeather, setCurrentWeather] = 
        useState<CurrentWeather | null>(null);

    // stores the forecast for the selected location
    const [forecast, setForecast] = 
        useState<ForecastResponse | null>(null);

    // tracks whether a weather request is in progress.
    const [loading, setLoading] = 
        useState(false);

    // stores weather or location erros.
    const [error, setError] = 
        useState<string | null>(null);

    // stores the user's selected temperature unit
    const [unit, setUnit] = 
        useState('C');

    // tracks whether cached weather data is being shown.
    const [usingCache, setUsingCache] = 
        useState(false);

    // stores how old the cached weather information is
    const [cacheAge, setCacheAge] = 
        useState<string | null>(null);

    // wathc the browser's online/offline status.
    const isOnline = 
        useOnlineStatus();

    // attempts to restore previously saved weather
    // data from local cache.
    const loadFromCache = useCallback(
        (): boolean => {

            const cached = loadWeatherCache();

            // no cached weather is available
            if (!cached) {
                return false
            };

            // restore the cached weather and forecast
            setCurrentWeather(cached.currentWeather);
            setForecast(cached.forecast);

            // tell the UI that cached data is being used.
            setUsingCache(true);

            // convert the cache timestamp into
            // a radbale age such as "5 minutes"
            setCacheAge(formatCacheAge(cached.cachedAt));

            // cached weather is available
            // so clear the current error.
            setError(null);

            // let the calling function know
            // that the cache was successfully loaded
            return true;
        }, []

    );
    
    // fetch weather using a city enetered by the user.
    const fetchWeatherByCity = async (

        city: string

    ) => {

        setLoading(true);
        setError(null);

        // if the user is offline, try to display
        // previously cashed weather instead.
        if (!navigator.onLine) {

            const hadCache = 
                loadFromCache();

            // show an error only when there is
            // no cached data available
            if (!hadCache) {
                setError(
                    'You are offline and no cached weather data is available yet'
                );
            }

            setLoading(false);
            return;
        }
        
        try {

            // fetch current weather and forecast
            // at the ame time for better performance.
            const [
                weatherData, 
                forecastData
            ] = await Promise.all([

                getCurrentWeather(city),
                getWeatherForecast(city),

            ]);

            // store the newly fetche weather data.
            setCurrentWeather(weatherData);

            setForecast(forecastData);

            // live API data is no being used, 
            // so cached-data indicators can be cleared.
            setUsingCache(false);
            setCacheAge(null);

            // save the successful response so it can 
            // be used later when the user is offline.
            saveWeatherCache(city, weatherData, forecastData);
            
        }
        catch (err) {

            // if the API requests fails,
            // attempt to fall back to cached data
            const hadCache = loadFromCache();

            // only show the API error when 
            // cached data was not available.
            if (!hadCache) {

                setError(
                    err instanceof Error 
                    ? err.message 
                    : 'Failed to fetch weather data'
                );

            }
            
        }
        finally {
            // stop the loading state whether
            // the request succeeded or failed
            setLoading(false)
        }

    };

    // fetch weather using the user's current coordinates.
    const fetchWeatherByLocation = useCallback( async () => {

        // check whether the browser supports geolocation
        if(!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }
        
        setLoading(true);
        setError(null);

        // if offline, attempt to restore
        // the latest cached weather.
        if (!navigator.onLine) {

            const hadCache = 
                loadFromCache();

            if (!hadCache) {
                setError('You are offline and no cached weather data is available yet');
            }

            setLoading(false);
            return;
        }

        // ask the browser for the users current location.
        navigator.geolocation.getCurrentPosition(
            
            // runs when the user's location
            // is successfully retrieved.
            async (position) => {

                try {

                    // extract latitude and logitude 
                    // from the browser's location result.
                    const {
                        latitude, 
                        longitude
                    } = position.coords;

                    // fetch current weather directly
                    // using the user's coordinates.
                    const weatherData = 
                        await getCurrentWeatherByCoords(
                            latitude, 
                            longitude
                        );

                    setCurrentWeather(weatherData);

                    // use the returnd city ame to fetch
                    // the forecast for the same location.
                    const forecastData = 
                        await getWeatherForecast(
                            weatherData.name
                        );

                    setForecast(forecastData);

                    // live weather was successfully loaded
                    setUsingCache(false);
                    setCacheAge(null);

                    // save the successful weather response
                    // for future offline use.
                    saveWeatherCache(
                        weatherData.name, 
                        weatherData, 
                        forecastData
                    );

                }
                catch (err) {

                    // if fetching the weathr fails,
                    // try to restore cached data.
                    const hadCache = loadFromCache();

                    
                    if (!hadCache) {

                        setError(
                            err instanceof Error 
                                ? err.message 
                                : 'Failed to fetch weather data'
                        );
                    }
                }
                finally {
                    setLoading(false);
                }

            },
            // runs when geolocation fails
            (error) => {
                
                // provide a clearer message depending
                // on the geolocation error type.
                const message = 
                    error.code === error.PERMISSION_DENIED
                        ? 'Location access was denied. Please allow location access and try again.'
                        : error.code === error.TIMEOUT
                        ? 'Location request timed out. Please try again.'
                        : 'Unable to retrieve your location. Please allow location access and try again.'

                setError(message);
                setLoading(false);
            },

            // geolocation configuration
            {
                // stop waiting after 10 seconds
                timeout: 10000,

                // allow a location result that is 
                // no more than five minutes old
                maximumAge: 5 * 60 * 1000,

                // lower accuracy is faster and usually
                // sufficient for city-level weather
                enableHighAccuracy: false,
            }

        );

    }, [loadFromCache]);

    // toggle between celsius and fahrenheit
    const toggleUnit = () => {
        setUnit(
            (prev) => 
                prev === 'C' 
                    ? 'F' 
                    : 'C'
        );
    };

    useEffect(() => {
        
        // attempt to fetch weather for the user's 
        // current location when the hook first loads.
        fetchWeatherByLocation();

    }, [fetchWeatherByLocation]);


    // expose weather state and actions 
    // to components using this hook.
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
