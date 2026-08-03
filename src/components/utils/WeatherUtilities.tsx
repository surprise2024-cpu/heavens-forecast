import { 
    CloudDrizzleIcon, 
    CloudFogIcon, 
    CloudIcon, 
    CloudLightning, 
    CloudRain, 
    CloudRainWind, 
    CloudSnowIcon, 
    HazeIcon, 
    Hourglass, 
    SunIcon, 
    TornadoIcon,
    Wind, 
 } from 'lucide-react';

export const getWeatherIcon = (weather: { main: string}) => {

    const iconMap = {
        Clear: SunIcon, 
        Clouds: CloudIcon,
        Rain: CloudRain ,
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
    };

  return iconMap[weather.main] || 'Cloud';

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
    return new Date(timestamp + 1000).toLocaleTimeString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
};

export const getwindDirection = (deg) => {
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



