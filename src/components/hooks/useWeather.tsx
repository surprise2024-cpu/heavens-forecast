import React, { useEffect, useState } from 'react'

import { 
    getCurrentWeather, 
    getCurrentWeatherByCoords, 
    getWeatherForecast } from '../Services/WeatherAPI'

export type CurrentWeather = {
    name: string;    weather?: {
    main: string;
    description?: string;
    }[];
    dt?: number;
    sys?: {
        country?: string;
    };
    main?: {
        temp?: number;
        temp_min?: number;
        temp_max?: number;
    };    
};

export type UseWeatherReturn = {
    currentWeather: CurrentWeather | null;
    forecast: unknown | null;
    loading: boolean;
    error: string | null;
    unit: string;
    fetchWeatherByCity: (city: string) => Promise<void>;
    fetchWeatherByLocation: () => Promise<void>;
    toggleUnit: () => void;
};

export const useWeather = (): UseWeatherReturn => {

    const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [unit, setUnit] = useState('C');

    const fetchWeatherByCity = async (city: string) => {
        setLoading(true);
        setError(null);
        
        try {
            const [weatherData, forecast] = await Promise.all([
                getCurrentWeather(city),
                getWeatherForecast(city),
            ]);

            setCurrentWeather(weatherData);
            setForecast(forecast);
            
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
                setError('Unable to retrieve your location. Please allow location access and try again.');
                setLoading(false);
            }
        );

    };

    const toggleUnit = () => {
    setUnit(unit === 'C' ? 'F' : 'C');
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
