import React from 'react'

const API_KEY = '3d555e3f7afc3df8ec94c2202cbbb0fe'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0'

export const getCurrentWeather = async (city: string) => {
    try {
        const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);

        if(!response.ok) {

            if(response.status === 404) {
                throw new Error(
                `City ${city} not found, please check the spelling and try again`
            ); 
            }
            else if (response.status === 401) {
                throw new Error(
                    'Invalid API key. Please check your API key and try again.'
                );
            }

        }
        else {
            throw new Error(
                'Weather service is temporarily unavailable. Please try again later.'
            );
        }

        const data = await response.json();

        //makes sure we have the current timestamp if its not provided
        if(!data.dt) {
            data.dt = Math.floor(Date.now() / 1000);
        }

        return data;


    } catch (error) {
        
        if(error instanceof TypeError && error.message.includes('fetch')) {

            throw new Error('Network error: Unable to reach the weather service. Please check your internet connection and try again.');
        }

        throw error;
    }
        
}

export const getCurrentWeatherByCoords = async (lat: number, long: number) => {
    try {
        const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`);

        if(!response.ok) {

            if (response.status === 401) {
                throw new Error(
                    'Invalid API key. Please check your API key and try again.'
                );
            }

        }
        else {
            throw new Error(
                'Weather service is temporarily unavailable. Please try again later.'
            );
        }

        const data = await response.json();

        //makes sure we have the current timestamp if its not provided
        if(!data.dt) {
            data.dt = Math.floor(Date.now() / 1000);
        }

        return data;


    } catch (error) {
        
        if(error instanceof TypeError && error.message.includes('fetch')) {

            throw new Error('Network error: Unable to reach the weather service. Please check your internet connection and try again.');
        }

        throw error;
    }
        
}

export const getWeatherForecast = async (city: string) => {
    try {
        const response = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);

        if(!response.ok) {

            if(response.status === 404) {
                throw new Error(
                `City ${city} not found, please check the spelling and try again`
            ); 
            }
            else if (response.status === 401) {
                throw new Error(
                    'Invalid API key. Please check your API key and try again.'
                );
            }

        }
        else {
            throw new Error(
                'Weather service is temporarily unavailable. Please try again later.'
            );
        }

        return await response.json();


    } catch (error) {
        
        if(error instanceof TypeError && error.message.includes('fetch')) {

            throw new Error('Network error: Unable to reach the weather service. Please check your internet connection and try again.');
        }

        throw error;
    }
        
}

interface GeoCity {
    name: string;
    country: string;
    lat: number;
    lon: number;
    state?: string;
}

export const searchCities = async (query: string) => {
    try {

        const response = await fetch(`
            ${GEO_URL}/direct?q=${query}&limit=5&appid=${API_KEY}`
        );

        if(!response.ok) {

            if (response.status === 401) {
                throw new Error(
                    'Invalid API key. Please check your API key and try again.'
                );
            }
            else {
            throw new Error(
                'Weather service is temporarily unavailable. Please try again later.'
            );
        }

        }
        

        const data: GeoCity[] = await response.json();

        //transorms geolocation data into a more usable format

        return data.map((city) => ({
            name: city.name,
            country: city.country,
            lat: city.lat,
            lon: city.lon,
            state: city.state || '',
        }));


    } catch (error) {
        
        if(error instanceof TypeError && error.message.includes('fetch')) {

            throw new Error('Network error: Unable to reach the weather service. Please check your internet connection and try again.');
        }

        throw error;
    }
        
}


