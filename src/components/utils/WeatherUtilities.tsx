import { 
    CloudDrizzleIcon, 
    CloudFogIcon, 
    CloudIcon, 
    CloudLightning, 
    CloudMoon,
    CloudRain, 
    CloudRainWind, 
    CloudSnowIcon, 
    HazeIcon, 
    Hourglass, 
    Moon,
    Sun,
    TornadoIcon,
    Wind, 
    type LucideIcon,
} from 'lucide-react';

// describes the minimum weather information
// needed to choose the correct weather icon.
interface WeatherIconInput {

    // main weather condition returned by the api
    main: string;

    // optional openWeather icon code.
    // this is also used to determine day or night.
    icon?: string;

}

// maps daytime weather conditions
// to their matching lucide-icons.
const dayIconMap = {
    Clear: Sun,
    Clouds: CloudIcon,
    Rain: CloudRain,
    Drizzle: CloudDrizzleIcon,
    Thunderstorm: CloudLightning,
    Snow: CloudSnowIcon,
    Mist: CloudFogIcon,
    Fog: CloudFogIcon,
    Haze: HazeIcon,
    Dust: CloudRainWind,
    Sand: Hourglass,
    Squall: Wind,
    Tornado: TornadoIcon,
} as const;

// replaces selected daytime icons with
// night time versions where appropriate.
const nightIconOverrides: Partial<

    Record<
        keyof typeof dayIconMap, 
        LucideIcon
    >

> = {

    Clear: Moon,
    Clouds: CloudMoon,

};

// checks whther an openWeather icon code
// represents night time weather.
export const isNightTime = (

    iconCode?: string

): boolean => {

    // openWeather night time icon codes end in 'n'
    // example: '01n'
    return iconCode?.endsWith('n') ?? false;

};

// returns the correct lucide icon
// for the supplied weather condition.
export const getWeatherIcon = (

    weather: WeatherIconInput

) => {

    // treat the api's main condition as one
    // of the known icon-map keys.
    const iconKey = 
        weather.main as keyof typeof dayIconMap;
    
    // determine whether the weather
    // condition represents night time
    const isNight = 
        isNightTime(weather.icon);

    // use the night time version when one exists.
    if (

        isNight && 
        nightIconOverrides[iconKey]

    ) {

        return nightIconOverrides[iconKey]!;

    }

    // use the matching daytime icon
    // fall back to a generic cloud icon
    // if the condition is not recognisd.
    return dayIconMap[iconKey] || CloudIcon;

};

// formats a temperature using the 
// user's selected temperature unit.
export const formatTemperature = (

    temp: number, 
    unit: string

) => {

    // Convert Celsius to Fahrenheit.
    if (unit === 'F') {

        return Math.round((temp * 9) / 5 + 32);
    }

    // Celsius values only need to be rounded.
    return Math.round(temp)
};

// Converts a Unix timestamp into
// a human-readable time.
export const formatTime = (

    timestamp: number

) => {

    // Unix timestamps use seconds,
    // while JavaScript Date expects milliseconds.
    return new Date(

        timestamp * 1000
    
    ).toLocaleTimeString('en-US', {

        hour: '2-digit',
        minute: '2-digit',

    });

};

// Converts a Unix timestamp into
// a human-readable date.
export const formatDate = (

    timestamp: number

) => {
    return new Date(

        timestamp * 1000
    
    ).toLocaleDateString('en-US', {

        weekday: 'short',
        month: 'short',
        day: 'numeric',

    });
};

// Converts wind direction in degrees
// into a compass direction.
export const getWindDirection = (

    deg: number

) => {

    // 16-point compass directions.
    const directions = [
        'N' ,
        'NNE' ,
        'NE',
        'ENE',
        'E',
        'ESE',
        'SE',
        'SSE',
        'S',
        'SSW',
        'SW',
        'WSW',
        'W',
        'WNW',
        'NW',
        'NNW',
    ];

    // A full circle contains 360 degrees.
    // 360 / 16 = 22.5 degrees per direction.
    return directions[Math.round(deg / 22.5) % 16];

};

{/* simplified weather conditions used throughout the UI */}
export type Condition = 
    | 'sunny' 
    | 'cloudy' 
    | 'rainy' 
    | 'storm' 
    | 'night'

// converts openweather condition names into the
// simplified condition types used by the application
export function mapCondition(main: string): Condition{
    switch (main) {

        case 'Clear': 
            return 'sunny';

        case 'Clouds': 
            return 'cloudy';

        case 'Rain': 
        case 'Drizzle': 
            return 'rainy';

        case 'Thunderstorm': 
            return 'storm';

        default: 
            return 'cloudy';
    }
}