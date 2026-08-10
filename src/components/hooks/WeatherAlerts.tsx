
import type { CurrentWeatherResponse } from '../Services/WeatherAPI';

export type AlertSeverity = 'severe' | 'warning';

export interface WeatherAlert {
    id: string;
    severity: AlertSeverity;
    title: string;
    message: string;
}

const SEVERE_CONDITIONS = new Set(['Thunderstorm', 'Tornado', 'Squall']);

const EXTREME_HEAT_C = 40;
const EXTREME_COLD_C = -10;
const HIGH_WIND_KMH = 60;


export function getWeatherAlerts(weather: CurrentWeatherResponse | null): WeatherAlert | null {

    if(!weather) return null;

    const condition = weather.weather?.[0].main;
    const description = weather.weather?.[0]?.description ?? condition;
    const tempC = weather.main.temp;
    const wind = weather.wind.speed * 3.6;
    const city = weather.name;

    if (condition && SEVERE_CONDITIONS.has(condition)) {
        return {
            id: `${city}-condition-${condition}`,
            severity: 'severe',
            title: `Severe weather in ${city}`,
            message: `${condition} condition reported (${description}). Take precautions.`
        };
    }

    if (tempC >= EXTREME_HEAT_C) {
        return {
            id: `${city}-heat-${Math.round(tempC)}`,
            severity: 'warning',
            title: `Extreme heat in ${city}`,
            message: `Temperature is ${Math.round(tempC)}°C. Stay hydrated and avoid long exposure to the sun.`
        };
    }

    if (tempC <= EXTREME_COLD_C) {
        return {
            id: `${city}-cold-${Math.round(tempC)}`,
            severity: 'warning',
            title: `Extreme cold in ${city}`,
            message: `Temperature is ${Math.round(tempC)}°C. Risk of frostbite/hyporthermia with prolonged exposure.`
        };
    }

    if (wind >= HIGH_WIND_KMH) {
        return {
            id: `${city}-wind-${condition}`,
            severity: 'warning',
            title: `High winds in ${city}`,
            message: `Wind speeds around (${Math.round(wind)}) km.h. Don't get blown away.`
        };
    }

    return null;
  
}
