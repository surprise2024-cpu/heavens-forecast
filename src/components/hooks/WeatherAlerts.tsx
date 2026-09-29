
import type { CurrentWeatherResponse } from '../Services/WeatherAPI';

// defines the available alert priority levels.
export type AlertSeverity = 
    | 'severe' 
    | 'warning';

    // represents a weather alert shown to the user.
export interface WeatherAlert {
    id: string;
    severity: AlertSeverity;
    title: string;
    message: string;
}

// weather conditions considered severe
const SEVERE_CONDITIONS = 
    new Set([
        'Thunderstorm', 
        'Tornado', 
        'Squall'
    ]);

// temperature and wind thresholds used
// to declare when alerts should be created.
const EXTREME_HEAT_C = 40;
const EXTREME_COLD_C = -10;
const HIGH_WIND_KMH = 60;

// checks the current weather and returns
// the first matching weather alert.
//
// if no alert conditions are mt,
// the function returns null.
export function getWeatherAlerts(weather: CurrentWeatherResponse | null): WeatherAlert | null {

    // no weather data means there is
    // nothing available to evalute.
    if(!weather) {
        return null
    };

    // get the main weather condition
    const condition = weather.weather?.[0]?.main;

    // use the more detailed description when available.
    // fallback to the main condition if needed.
    const description = weather.weather?.[0]?.description ?? condition;
    
    // current temperature in celsius.
    const tempC = weather.main.temp;

    // openweather wind speed is in meteres per second.
    // so multiplying by 3.6 gives up km/h.
    const wind = weather.wind.speed * 3.6;

    // city name used in alert messags and IDs
    const city = weather.name;

    // severe conditios take the highest priority.
    if (
        condition && 
        SEVERE_CONDITIONS.has(condition)
    ) {
        return {
            id: `${city}-condition-${condition}`,
            severity: 'severe',
            title: `Severe weather in ${city}`,
            message: `${condition} condition reported (${description}). Take precautions.`
        };
    }

    // creates a warning when the temperature 
    // reaches the extreme heat threshold.
    if (
        tempC >= EXTREME_HEAT_C
    ) {
        return {
            id: `${city}-heat-${Math.round(tempC)}`,
            severity: 'warning',
            title: `Extreme heat in ${city}`,
            message: `Temperature is ${Math.round(tempC)}°C. Stay hydrated and avoid long exposure to the sun.`
        };
    }

    // creates a warning when the temperature 
    // reaches the extreme cold threshold.
    if (
        tempC <= EXTREME_COLD_C
    ) {
        return {
            id: `${city}-cold-${Math.round(tempC)}`,
            severity: 'warning',
            title: `Extreme cold in ${city}`,
            message: `Temperature is ${Math.round(tempC)}°C. Risk of frostbite/hypothermia with prolonged exposure.`
        };
    }

    // creates a warning when the temperature 
    // reaches the high-win threshold.
    if (
        wind >= HIGH_WIND_KMH
    ) {
        return {
            id: `${city}-wind-${condition}`,
            severity: 'warning',
            title: `High winds in ${city}`,
            message: `Wind speeds around (${Math.round(wind)}) km/h. Don't get blown away.`
        };
    }

    // no alert condition was triggered.
    return null;
  
}
