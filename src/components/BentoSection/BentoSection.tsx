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
} from 'lucide-react'

import type { 
    CurrentWeatherResponse, 
    ForecastResponse } from '../Services/WeatherAPI'

import { formatTemperature, isNightTime } from '../utils/WeatherUtilities'
import { mapCondition } from '../Forecast/Forecast'
import type { Condition } from '../Forecast/Forecast' 

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
}

const iconClassMap: Record<Condition, string> = {
    sunny: 'icon-sunny',
    cloudy: 'icon-cloudy',
    rainy: 'icon-rainy',
    storm: 'icon-storm',
}

function ConditionIcon ({
    condition, 
    size = 22,
    isNight = false, 
}: {
    condition: Condition;
    size?: number;
    isNight?: boolean;
}) {
    const common = { 
        size, 
        strokeWidth: 1.75,
        className: styles[iconClassMap[condition]] 
    };



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

export const BentoSection: React.FC<BentoSectionProps> = ({ currentWeather, forecast, unit }) => {

    if (!currentWeather || !forecast) {
        return (
            <div className={styles['bento-col']}>
                <div className={styles['card']}>
                    <Text variant='p' className={styles['card-label']}>TODAY'S FORECAST</Text>
                    <div className={styles['bento-loading']}>Loading....</div>
                </div>
            </div>
        );
    }

    const hourly = buildHourly(forecast);

    const realFeel = Math.round(currentWeather.main.feels_like);
    const windKmh = (currentWeather.wind.speed * 3.6).toFixed(1);

    const chanceOfRain = Math.round((forecast.list[0]?.pop ?? 0) * 100);

  return (
    <>
        <div className={styles['bento-col']}>

            {/*todays forecast strip */}
            <div className={styles['card']}>
                <Text variant='p' className={styles['card-label']}>TODAY'S FORECAST</Text>
                <div className={styles['hourly-grid']}>
                    {
                        hourly.map((h) => (
                            <div key={h.time} className={styles['hourly-item']}> 

                                <Text variant='span' className={styles['hourly-time']}>{h.time}</Text>

                                <ConditionIcon 
                                    condition={h.condition} 
                                    size={26}
                                    isNight={h.isNight}
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
                    <button className={styles['see-more-btn']}>See more</button>

                </div>

                <div className={styles['condition-grid']}>

                    <div className={styles['condition-item']}>

                        <Thermometer size={16} strokeWidth={1.75}/>

                        <div>

                            <Text variant='p' className={styles['condition-label']}>Real Feel</Text>
                            <Text variant='p' className={styles['condition-value']}>{formatTemperature(realFeel, unit)}°{unit}</Text>
                        
                        </div>
                    </div>
                    
                    <div className={styles['condition-item']}>
                        
                        <Wind size={16} strokeWidth={1.75}/>
                        
                        <div>
                            
                            <Text variant='p' className={styles['condition-label']}>Wind</Text>
                            <Text variant='p' className={styles['condition-value']}>{windKmh} km/h</Text>
                        
                        </div>
                    </div>
                    
                    <div className={styles['condition-item']}>
                        
                        <Droplet size={16} strokeWidth={1.75}/>
                        
                        <div>
                            
                            <Text variant='p' className={styles['condition-label']}>Chance of rain</Text>
                            <Text variant='p' className={styles['condition-value']}>{chanceOfRain}%</Text>
                        </div>
                    </div>
                    
                    <div className={styles['condition-item']}>
                        
                        <Gauge size={16} strokeWidth={1.75}/>
                        
                        <div>
                            
                            <Text variant='p' className={styles['condition-label']}>UV Index</Text>
                            <Text variant='p' className={styles['condition-value']}>N/A</Text>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}
