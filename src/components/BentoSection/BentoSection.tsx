import React from 'react'

import styles from './BentoSection.module.css'
import { Text } from '../Text/Text'

import {
    Sun, 
    Cloud,
    CloudRain, 
    CloudLightning,
    Moon,
    CloudMoon,
    Wind,
    Droplet,
    Gauge, 
    Thermometer,
    Droplets,
    CloudRainIcon,
} from 'lucide-react'

import type { 
    CurrentWeatherResponse, 
    ForecastResponse 
} from '../Services/WeatherAPI'

import { formatTemperature, isNightTime } from '../utils/WeatherUtilities'
import { mapCondition } from '../Forecast/Forecast'
import type { Condition } from '../Forecast/Forecast' 
import type { CurrentWeather } from '../hooks/useWeather'

interface HourlyPoint {
    time: string;
    condition: Condition;
    temp: number;
    isNight: boolean;
}

interface BentoSectionProps {
    currentWeather: CurrentWeatherResponse | null;
    forecast: ForecastResponse | null;
    unit: string;
    weather?: CurrentWeather | null; 
}

const iconClassMap: Record<Condition, string> = {
    night: 'icon-moon',
    sunny: 'icon-sunny',
    cloudy: 'icon-cloudy',
    rainy: 'icon-rainy',
    storm: 'icon-storm',
}

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
    const common = { 
        size, 
        strokeWidth: 1.75,
        className: `${styles[iconClassMap[condition]]} ${className}`.trim(),
    };

    if (isNight) {
        if (condition === 'sunny') return <Moon {...common}/>
        if (condition === 'cloudy') return <CloudMoon {...common}/>
    }

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

function buildHourly(forecast: ForecastResponse): HourlyPoint[] {
    return forecast.list.slice(0, 6).map((item) => {
        const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
        });

        return {
            time, 
            condition: mapCondition(item.weather[0]?.main ?? 'Clouds'),
            temp: Math.round(item.main.temp),
            isNight: isNightTime(item.weather[0]?.icon),
        };
    
    });
}

export const BentoSection: React.FC<BentoSectionProps> = ({ weather, currentWeather, forecast, unit }) => {

    const isNight = isNightTime(weather?.weather?.[0]?.icon);

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

    const hourly = buildHourly(forecast);

    const realFeel = Math.round(currentWeather.main.feels_like);
    const windKmh = (currentWeather.wind.speed * 3.6).toFixed(1);
    const humidity = currentWeather.main.humidity;
    const chanceOfRain = Math.round((forecast.list[0]?.pop ?? 0) * 100);

  return (
    <>
        <div className={styles['bento-col']}>

            {/*todays forecast strip */}
            <div className={styles['card']}>
                <Text variant='p' className={styles['card-label']}>HOURLY FORECAST</Text>

                {/*<button className={styles['see-more-btn']}>See more</button>*/}
                
                <div className={styles['hourly-grid']}>
                    {
                        hourly.map((h) => (
                            <div key={h.time} className={styles['hourly-item']}> 

                                <Text variant='span' className={styles['hourly-time']}>{h.time}</Text>

                                <ConditionIcon 
                                    condition={h.condition} 
                                    size={30}
                                    isNight={h.isNight}
                                    className={styles[isNight ? 'bento-icon-night' : 'bento-icon']}
                                />

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

                    <div className={styles['condition-item']}>

                        <Thermometer size={18} strokeWidth={1.75}/>

                        <div>

                            <Text variant='p' className={styles['condition-label']}>Real Feel</Text>
                            <Text variant='p' className={styles['condition-value']}>{formatTemperature(realFeel, unit)}°{unit}</Text>
                        
                        </div>
                    </div>
                    
                    <div className={styles['condition-item']}>
                        
                        <Wind size={18} strokeWidth={1.75}/>
                        
                        <div>
                            
                            <Text variant='p' className={styles['condition-label']}>Wind</Text>
                            <Text variant='p' className={styles['condition-value']}>{windKmh}km/h</Text>
                        
                        </div>
                    </div>
                    
                    <div className={styles['condition-item']}>
                        
                        <CloudRainIcon size={18} strokeWidth={1.75}/>
                        
                        <div>
                            
                            <Text variant='p' className={styles['condition-label']}>Chance of rain</Text>
                            <Text variant='p' className={styles['condition-value']}>{chanceOfRain}%</Text>
                        </div>
                    </div>
                    
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
