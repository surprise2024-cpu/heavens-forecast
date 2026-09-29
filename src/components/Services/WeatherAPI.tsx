// API keyloaded from the Vite environment variables
const API_KEY = import.meta.env.VITE_OPENWEATHER;

// base url for current weather and forecast requests.
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// base URL for openweathr's geocoding API
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// represents one weather condition returned by openweather.
export interface WeatherCondition {

    // numeric weather condition ID
    id: number;

    // main wether category such as Clear, Clouds or Rain
    main: string;

    // more detaild weather description
    description: string;

    // openweather icon code.
    icon: string;
}

// represents the response returned by 
// openweather's current weather endpoint.
export interface CurrentWeatherResponse {

    // geographic coordinates of the city
    coord: { lon: number; lat: number };

    // array constaining the current weather conditon.
    weather: WeatherCondition[];

    // internal openweather parameter
    base: string;

    // main temperature and atmosheric information.
    main: { 

        // current temperature
        temp: number;

        // temperature as it feels to the user.
        feels_like: number;

        // minimum recorded temperature.
        temp_min: number;

        // maximum recorded temperature.
        temp_max: number;

        // atmospheric pressure
        pressure: number;

        // humidity percentage.
        humidity: number;
    };

    // visibility distance in metres.
    visibility: number;

    // current wind information
    wind: { speed: number; deg: number; gust?: number};

    // percentage of clouf coverage.
    clouds: { all: number };

    // optional rain volume
    rain?: { '1h'?: number; '3h'?: number };

    // optional snow volume
    snow?: { '1h'?: number; '3h'?: number };

    // time when the weather data was calculated.
    // stored as a unix timestamp in seconds
    dt: number;

    // additional country and sunrise/sunset information.
    sys: {
        type?: number;
        id?: number;

        // country code
        country: string;

        // sunrise unix timestamp
        sunrise: number;

        // sunset unix timestamp
        sunset: number;
    };

    // shift from UTC in seconds
    timezone: number;
    id: number;
    name: string;

    // API response code status.
    cod: number;
}

// represents one entry inside the forecast repsonse.
export interface ForecastListItem {

    // forecast timestamp
    dt: number;
    main: CurrentWeatherResponse['main'];
    weather: WeatherCondition[];
    clouds: { all: number };
    wind: { speed: number; deg: number; gust?: number };
    visibility: number;

    // probabilit of precipitation.
    // returned as a value etween 0 and 1.
    pop: number;
    rain?: { '1h'?: number; '3h'?: number };
    snow?: { '1h'?: number; '3h'?: number };

    // human-readable forecast date and time
    dt_txt: string;
}

// represents the full response returned
//by openweather's forecast endpoint.
export interface ForecastResponse {

    // api respons code
    cod: string;

    // internal api mesae value.
    message: number;
    
    // number of forcast entries returned.
    cnt: number;

    // forecast entries.
    list: ForecastListItem[];

    // information about the forecast city
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

// represents one city returned by
// openweather's geocoding service.
export interface GeoCity {
    name: string;
    country: string;
    lat: number;
    lon: number;

    // state or province is not always supplied.
    state?: string;
}

//shared error helper used by all api requests.
// this keeps http error handling cnsistent
// instead of repeating it inside every function.
function handleErrorStatus(

    status: number, 
    notFoundMessage?: string

): never {

    // use a custom 404 message when one was supplied
    if(status === 404 && notFoundMessage) {
        
        throw new Error(notFoundMessage);

    }
    // for missing api key or invalid api key.
    else if (status === 401) {

        throw new Error('Invalid API key. Please check your API key and try again');

    }
    // generic fall back  for other http errors
    throw new Error('Weather service is temporarily unavailable. Please try again later.');
}

// checks whether an error appears to have been
// caused by the browser's fetvh request failing.
// this helps seperate network errors from api errors.
function isNetworkError(

    error: unknown

): error is TypeError {

    return (
        error instanceof TypeError && 
        error.message.includes('fetch')
    );

}

// fetches current weather using acity name
export const getCurrentWeather = async (

    city: string

): Promise<CurrentWeatherResponse> => {

    try {

        // send the current-weathr request.
        const response = await fetch(

            `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );

        // handle http erros before attempting
        // to use the response data.
        if(!response.ok) {

            handleErrorStatus(

                response.status,
                `City ${city} not found, please check the spelling and try again`

            );

        }
     

        // convert the json response into
        // my currenWeatherResponse type.
        const data: CurrentWeatherResponse = await response.json();

        // use the current timestamp as a fallback
        // if the api does not provide one
        if(!data.dt) {

            data.dt = 
                Math.floor(
                    Date.now() / 1000
                );

        }

        return data;


    } 
    catch (error) {
        
        // convert low-level fetch errors into
        // a clearer message for the user.
        if(isNetworkError(error)) {

            throw new Error(
                'Network error: Unable to reach the weather service. Please check your internet connection and try again.');
        }

        // re-throw api erros created above
        throw error;
    }
        
}

// fetches current weather using latitude and longitude
export const getCurrentWeatherByCoords = async (

    lat: number, 
    lon: number

): Promise<CurrentWeatherResponse> => {

    try {

        // request weather directly using coordinates.
        const response = await fetch(
            `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        // handle unsuccessful responses.
        if(!response.ok) {
            handleErrorStatus(response.status);
        }
        

        const data: CurrentWeatherResponse = await response.json();

        // add a fallback timestamp if required.
        if(!data.dt) {

            data.dt = 
                Math.floor(
                    Date.now() / 1000
                );

        }

        return data;


    } 
    catch (error) {
        
        if(isNetworkError(error)) {

            throw new Error(
                'Network error: Unable to reach the weather service. Please check your internet connection and try again.'
            );

        }

        throw error;
    }
        
}

// fetches the multi-day forecast for a city.
export const getWeatherForecast = async (

    city: string

): Promise<ForecastResponse> => {
    try {

        const response = await fetch(
            `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );

        // handles unsuccessful api responses.
        if(!response.ok) {
            handleErrorStatus(
                response.status,
                `City ${city} not found, please check the spelling and try again`
            );
        }
     

        // return the parsed forecast response.
        return await response.json();

    } 
    catch (error) {
        
        if(isNetworkError(error)) {

            throw new Error(
                'Network error: Unable to reach the weather service. Please check your internet connection and try again.'
            );

        }

        throw error;
    }
        
}

// searches openWeather's geocoding service
// for cities matching the user's query.
export const searchCities = async (

    query: string

): Promise<GeoCity[]> => {
    try {

        // search for up to five matching locations.
        const response = await fetch(
            `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
        );

        if(!response.ok) {
            handleErrorStatus(response.status);
        }
        
        // parse the geocoding responses
        const data: GeoCity[] = await response.json();

        //transform the api response into the
        // simplified city structured used by the app
        return data.map(
            (city) => ({

                name: city.name,
                country: city.country,
                lat: city.lat,
                lon: city.lon,

                // use an empty string when no state is provided.
                state: city.state || '',

            })

        );

    } 
    catch (error) {
        
        if(isNetworkError(error)) {

            throw new Error(
                'Network error: Unable to reach the weather service. Please check your internet connection and try again.'
            );
        }

        throw error;
    }
        
}


