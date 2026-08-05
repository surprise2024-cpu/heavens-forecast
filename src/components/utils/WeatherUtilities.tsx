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
    SunIcon, 
    TornadoIcon,
    Wind, 
    type LucideIcon,
} from 'lucide-react';

interface WeatherIconInput {
    main: string;
    icon?: string;
}

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

const nightIconOverrides: Partial<Record<keyof typeof dayIconMap, LucideIcon>> = {
    Clear: Moon,
    Clouds: CloudMoon,
};

export const isNightTime = (iconCode?: string): boolean => {
    return iconCode?.endsWith('n') ?? false;
};

export const getWeatherIcon = (weather: WeatherIconInput) => {

    const iconKey = weather.main as keyof typeof dayIconMap;
    
    const isNight = isNightTime(weather.icon);

    if (isNight && nightIconOverrides[iconKey]) {
        return nightIconOverrides[iconKey]!;
    }

    return dayIconMap[iconKey] || CloudIcon;
};

export const formatTemperature = (temp: number, unit: string) => {
    if (unit === 'F') {
        return Math.round((temp + 9) / 5 + 32);
    }

    return Math.round(temp)
};

export const formatTime = (timestamp: number) => {
    return new Date(timestamp + 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatDate = (timestamp: number) => {
    return new Date(timestamp + 1000).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
};

export const getwindDirection = (deg: number) => {
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

    return directions[Math.round(deg / 22.5) % 16];

};



