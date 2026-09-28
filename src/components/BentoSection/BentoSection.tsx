import React from 'react'

import styles from './BentoSection.module.css'
import { Text } from '../Text/Text'

// Weather and condition icons used throughout the bento cards.
import {
    Sun, 
    Cloud,
    CloudRain, 
    CloudLightning,
    Moon,
    CloudMoon,
    Wind,
    Thermometer,
    Droplets,
    CloudRainIcon,
} from 'lucide-react'

// API response types for the current weather and forecast data.
import type { 
    CurrentWeatherResponse, 
    ForecastResponse 
} from '../Services/WeatherAPI'

//Utitlity functions used for temperature and day/night detection.
import { formatTemperature, isNightTime } from '../utils/WeatherUtilities'

// used by the application's weather icons.
import { mapCondition } from '../Forecast/Forecast'
import type { Condition } from '../Forecast/Forecast' 

// Current weathetype returned by the custom useWeather hook.
import type { CurrentWeather } from '../hooks/useWeather'

// Represents one weahter entry displayed in the hourly forecast.
interface HourlyPoint {
    time: string;
    condition: Condition;
    temp: number;
    isNight: boolean;
}

// Props required by the BentoScection component.
interface BentoSectionProps {

    // Current weather data returned by the weather API.
    currentWeather: CurrentWeatherResponse | null;

    // Forecast data containing upcoming weather information.
    forecast: ForecastResponse | null;

    // Temperature unit selected by the user
    unit: string;

    // Weather data used to determine whether it  is currently day or night
    weather?: CurrentWeather | null; 
}

// Maps each weather condition to its matching css icon class
const iconClassMap: Record<Condition, string> = {
    night: 'icon-moon',
    sunny: 'icon-sunny',
    cloudy: 'icon-cloudy',
    rainy: 'icon-rainy',
    storm: 'icon-storm',
}

// displays the correct icon based on the weather condition.
function ConditionIcon ({
    condition, 
    size = 22,
    isNight = false,
    className = '', 
}: {
    condition: Condition;
    size?: number;
    isNight?: boolean;
    className?: string
}) {

    // Shared properties applied to every weather icon
    const common = { 
        size, 
        strokeWidth: 1.75,
        className: `${styles[iconClassMap[condition]]} ${className}`.trim(),
    };

    // Replace daytime icons with their nitght time equivalent when needed.
    if (isNight) {
        if (condition === 'sunny') {
            return <Moon {...common}/>
        }

        if (condition === 'cloudy') {
            return <CloudMoon {...common}/>
        }
    }

    // Returns the orrect icon for the current weather condition
    switch (condition) {
        case 'sunny': 
            return <Sun {...common} />
        case 'cloudy': 
            return <Cloud {...common} />
        case 'rainy': 
            return <CloudRain {...common} />
        case 'storm': 
        return (
            <CloudLightning {...common} />
        );
    }
}

// Converts raw forecast API data into a smaller structure.
// that is easier for the UI to display
function buildHourly(forecast: ForecastResponse): HourlyPoint[] {

    // Only display the first six forecast entries.
    return forecast.list.slice(0, 6).map((item) => {

        // Convert the Unix timestamp into a readable time.
        const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
        });

        return {
            time, 

            // Convert Openweather's condition into our applications condition type.
            condition: mapCondition(item.weather[0]?.main ?? 'Clouds'),

            // Round the temperature to aoid displaying unnecessary decimals
            temp: Math.round(item.main.temp),

            // determine whether this forecast entry represents night time.
            isNight: isNightTime(item.weather[0]?.icon),
        };
    
    });
}

// Dispays the hourly forecast and current air-condition information
export const BentoSection: React.FC<BentoSectionProps> = ({ 
    // weather, 
    currentWeather, 
    forecast, 
    unit 
}) => {

    // Determine whether the current weather is durig the night.
    // const isNight = isNightTime(weather?.weather?.[0]?.icon);

    // Dispaying a loading state while the weather data is being fetched.
    if (!currentWeather || !forecast) {
        return (
            <div className={styles['bento-col']}>
                <div className={styles['card']}>
                    <Text variant='p' className={styles['card-label']}>HOURLY FORECAST</Text>
                    <div className={styles['bento-loading']}>Loading....</div>
                </div>
            </div>
        );
    }

    // prepare the forecast entries used by the hourly forecast section.
    const hourly = buildHourly(forecast);

    // get the temoerature that the weather currently feels like.
    const realFeel = Math.round(currentWeather.main.feels_like);

    // openweather returns wind speed in metres per second.
    // multiplying by by 3.6 converts it to kilometres per hour.
    const windKmh = (currentWeather.wind.speed * 3.6).toFixed(1);

    // currrent humidity percentage
    const humidity = currentWeather.main.humidity;

    // forecast rain probability is returned between 0 and 1.
    // so multiply by 100 to convert it into a percentag.
    const chanceOfRain = Math.round((forecast.list[0]?.pop ?? 0) * 100);

  return (
    <>
        <div className={styles['bento-col']}>

            {/*hourly forecast strip */}
            <div className={styles['card']}>

                <Text 
                    variant='p' 
                    className={styles['card-label']}
                >
                    HOURLY FORECAST
                </Text>

                {/*<button className={styles['see-more-btn']}>See more</button>*/}
                
                {/* display each hourly forecast entry.*/}
                <div className={styles['hourly-grid']}>
                    {
                        hourly.map((h) => (
                            <div key={h.time} className={styles['hourly-item']}> 

                                <Text variant='span' className={styles['hourly-time']}>{h.time}</Text>

                                {/*Forecast weather icon */}
                                <ConditionIcon 
                                    condition={h.condition} 
                                    size={30}
                                    isNight={h.isNight}
                                    className={styles[h.isNight ? 'bento-icon-night' : 'bento-icon']}
                                />

                                {/*Forecast temperature */}
                                <Text variant='span' className={styles['hourly-temp']}>{formatTemperature(h.temp, unit)}°{unit}</Text>
                            
                            </div>
                        ))
                    }
                </div>
            </div>
            
            {/*Air condition */}
            <div className={styles['card']}>

                <div className={styles['card-header-row']}>

                    <Text variant='p' className={styles['card-label']}>AIR CONDITIONS</Text>
                    {/*<button className={styles['see-more-btn']}>See more</button>*/}

                </div>

                <div className={styles['condition-grid']}>

                    {/* Reel feel temperature */}
                    <div className={styles['condition-item']}>

                        <Thermometer size={18} strokeWidth={1.75}/>

                        <div>

                            <Text variant='p' className={styles['condition-label']}>Real Feel</Text>
                            <Text variant='p' className={styles['condition-value']}>{formatTemperature(realFeel, unit)}°{unit}</Text>
                        
                        </div>
                    </div>
                    
                    {/* Wind speed */}
                    <div className={styles['condition-item']}>
                        
                        <Wind size={18} strokeWidth={1.75}/>
                        
                        <div>
                            
                            <Text variant='p' className={styles['condition-label']}>Wind</Text>
                            <Text variant='p' className={styles['condition-value']}>{windKmh}km/h</Text>
                        
                        </div>
                    </div>
                    
                    {/* Chance of rain */}
                    <div className={styles['condition-item']}>
                        
                        <CloudRainIcon size={18} strokeWidth={1.75}/>
                        
                        <div>
                            
                            <Text variant='p' className={styles['condition-label']}>Chance of rain</Text>
                            <Text variant='p' className={styles['condition-value']}>{chanceOfRain}%</Text>
                        </div>
                    </div>
                    
                    {/* Humidity */}
                    <div className={styles['condition-item']}>
                        
                        <Droplets size={18} strokeWidth={1.75}/>
                        
                        <div>
                            
                            <Text variant='p' className={styles['condition-label']}>Humidity</Text>
                            <Text variant='p' className={styles['condition-value']}>{humidity}%</Text>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}
