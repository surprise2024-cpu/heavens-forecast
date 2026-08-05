
const API_KEY = '3d555e3f7afc3df8ec94c2202cbbb0fe'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0'

//API response types

export interface WeatherCondition {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export interface CurrentWeatherResponse {
    coord: { lon: number; lat: number };
    weather: WeatherCondition[];
    base: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };
    visibility: number;
    wind: { speed: number; deg: number; gust?: number};
    clouds: { all: number };
    rain?: { '1h'?: number; '3h'?: number };
    snow?: { '1h'?: number; '3h'?: number };
    dt: number;
    sys: {
        type?: number;
        id?: number;
        country: string;
        sunrise: number;
        sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
}

export interface ForecastListItem {
    dt: number;
    main: CurrentWeatherResponse['main'];
    weather: WeatherCondition[];
    clouds: { all: number };
    wind: { speed: number; deg: number; gust?: number };
    visibility: number;
    pop: number;
    rain?: { '1h'?: number; '3h'?: number };
    snow?: { '1h'?: number; '3h'?: number };
    dt_txt: string;
}

export interface ForecastResponse {
    cod: string;
    message: number;
    cnt: number;
    list: ForecastListItem[];
    city: {
        id: number;
        name: string;
        coord: { lat: number; lon: number };
        country: string;
        population: number;
        timezone: number;
        sunrise: number;
        sunset: number;
    };
}


export interface GeoCity {
    name: string;
    country: string;
    lat: number;
    lon: number;
    state?: string;
}

//shared helpers

function handleErrorStatus(status: number, notFoundMessage?: string): never {
    if(status === 404 && notFoundMessage) {
        throw new Error(notFoundMessage);
    }
    else if (status === 401) {
        throw new Error('Invalid API key. Please check your API key and try again');
    }
    throw new Error('Weather service is temporarily unavailable. Please try again later.');
}

function isNetworkError(error: unknown): error is TypeError {
    return error instanceof TypeError && error.message.includes('fetch');
}

export const getCurrentWeather = async (city: string): Promise<CurrentWeatherResponse> => {
    try {
        const response = await fetch(
            `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);

        if(!response.ok) {
            handleErrorStatus(
                response.status,
                `City ${city} not found, please check the spelling and try again`
            );
        }
     

        const data: CurrentWeatherResponse = await response.json();

        //makes sure we have the current timestamp if its not provided
        if(!data.dt) {
            data.dt = Math.floor(Date.now() / 1000);
        }

        return data;


    } catch (error) {
        
        if(isNetworkError(error)) {

            throw new Error(
                'Network error: Unable to reach the weather service. Please check your internet connection and try again.');
        }

        throw error;
    }
        
}

export const getCurrentWeatherByCoords = async (lat: number, long: number): Promise<CurrentWeatherResponse> => {
    try {
        const response = await fetch(
            `${BASE_URL}/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`);

        if(!response.ok) {
            handleErrorStatus(response.status);
        }
        

        const data: CurrentWeatherResponse = await response.json();

        //makes sure we have the current timestamp if its not provided
        if(!data.dt) {
            data.dt = Math.floor(Date.now() / 1000);
        }

        return data;


    } catch (error) {
        
        if(isNetworkError(error)) {

            throw new Error(
                'Network error: Unable to reach the weather service. Please check your internet connection and try again.');
        }

        throw error;
    }
        
}

export const getWeatherForecast = async (city: string): Promise<ForecastResponse> => {
    try {
        const response = await fetch(
            `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);

        if(!response.ok) {
            handleErrorStatus(
                response.status,
                `City ${city} not found, please check the spelling and try again`
            );
        }
     

        return await response.json();


    } catch (error) {
        
        if(isNetworkError(error)) {

            throw new Error(
                'Network error: Unable to reach the weather service. Please check your internet connection and try again.');
        }

        throw error;
    }
        
}


export const searchCities = async (query: string): Promise<GeoCity[]> => {
    try {

        const response = await fetch(
            `${GEO_URL}/direct?q=${query}&limit=5&appid=${API_KEY}`
        );

        if(!response.ok) {
            handleErrorStatus(response.status);
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
        
        if(isNetworkError(error)) {

            throw new Error(
                'Network error: Unable to reach the weather service. Please check your internet connection and try again.');
        }

        throw error;
    }
        
}


