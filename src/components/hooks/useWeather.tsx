import { useEffect, useState } from 'react'

import { 
    getCurrentWeather, 
    getCurrentWeatherByCoords, 
    getWeatherForecast, 
    type CurrentWeatherResponse, 
    type ForecastResponse
} from '../Services/WeatherAPI'


export type CurrentWeather = CurrentWeatherResponse;

export type UseWeatherReturn = {
    currentWeather: CurrentWeather | null;
    forecast: ForecastResponse | null;
    loading: boolean;
    error: string | null;
    unit: string;

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

    const fetchWeatherByCity = async (city: string) => {
        setLoading(true);
        setError(null);
        
        try {
            const [weatherData, forecastData] = await Promise.all([
                getCurrentWeather(city),
                getWeatherForecast(city),
            ]);

            setCurrentWeather(weatherData);
            setForecast(forecastData);
            
        }
        catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to fetch weather data'
            );
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

                }
                catch (err) {
                    setError(
                        err instanceof Error ? err.message : 'Failed to fetch weather data'
                    );
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

    //load default weather data for a default city on initial render

    useEffect(() => {
        fetchWeatherByCity('Polokwane');
    },[])

    return { 
        currentWeather, 
        forecast, 
        loading, 
        error, 
        unit, 
        fetchWeatherByCity, 
        fetchWeatherByLocation, 
        toggleUnit 
    };
 
};
