import React, { useState } from 'react'

import styles from './WeatherDashboard.module.css'

import {
    Wind, 
    Sun, 
    Cloud,
    CloudRain, 
    CloudLightning,
    Droplet,
    Gauge, 
    Thermometer,
} from 'lucide-react'
import { Navbar } from '../Navbar/Navbar';
import { Searchbar } from '../Searchbar/Searchbar';
import { HeroSection } from '../HeroSection/HeroSection';

//Types

type Condition = 'sunny' | 'cloudy' | 'rainy' | 'storm' 

interface HourlyPoint {
    time: string;
    condition: Condition;
    temp: number;
}

interface DailyPoint {
    day: string;
    condition: Condition;
    high: number;
    low: number;
}

//Data
const hourly: HourlyPoint[] = [
    {time: '6:00 AM', condition: 'cloudy', temp: 25},
    {time: '9:00 AM', condition: 'cloudy', temp: 28},
    {time: '12:00 PM', condition: 'sunny', temp: 33},
    {time: '3:00 PM', condition: 'sunny', temp: 34},
    {time: '6:00 PM', condition: 'sunny', temp: 32},
    {time: '9:00 PM', condition: 'cloudy', temp: 30},
];

const daily: DailyPoint[] = [
    {day: 'Today', condition: 'sunny', high: 36, low: 22},
    {day: 'Tue', condition: 'sunny', high: 37, low: 21},
    {day: 'Wed', condition: 'sunny', high: 37, low: 21},
    {day: 'Thu', condition: 'cloudy', high: 37, low: 21},
    {day: 'Fri', condition: 'cloudy', high: 37, low: 21},
    {day: 'Sat', condition: 'rainy', high: 37, low: 21},
    {day: 'Sun', condition: 'storm', high: 37, low: 21},
];

const iconClassMap: Record<Condition, string> = {
    sunny: 'icon-sunny',
    cloudy: 'icon-cloudy',
    rainy: 'icon-rainy',
    storm: 'icon-storm',
};

function ConditionIcon ({
    condition, 
    size = 22, 
}: {
    condition: Condition;
    size?: number;
}) {
    const common = { size, strokeWidth: 1.75,className: styles[iconClassMap[condition]] };

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

function conditionLabel(c: Condition) {
    return c === 'sunny'
    ? 'Sunny'
    : c === 'cloudy'
    ? 'Cloudy'
    : c === 'rainy'
    ? 'Rainy'
    : 'Storm';
}

export const WeatherDashboard = () => {

    const chanceOfRain = 0;
    const realFeel = 30;
    const wind = '0.2 km/h';
    const uvIndex = 3


  return (
    <div className={styles['weather-app']}>

        <div className={styles['weather-panel']}>

            <div className={styles['weather-grid']}>

                {/*Sidebar*/}
                <Navbar />
                
                {/*Searchbar */}
                <Searchbar />

                {/*Hero */}
                <HeroSection />
                
                {/*bento */}
                <div className={styles['bento-col']}>

                    {/*todays forecast strip */}
                    <div className={styles['card']}>
                        <p className={styles['card-label']}>TODAY'S FORECAST</p>
                        <div className={styles['hourly-grid']}>
                            {
                                hourly.map((h) => (
                                    <div key={h.time} className={styles['hourly-item']}> 

                                        <span className={styles['hourly-time']}>{h.time}</span>

                                        <ConditionIcon condition={h.condition} size={26}/>

                                        <span className={styles['hourly-temp']}>{h.temp}*</span>
                                    
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    
                    {/*Air condition */}
                    <div className={styles['card']}>
                        <div className={styles['card-header-row']}>
                            <p className={styles['card-label']}>AIR CONDITIONS</p>
                            <button className={styles['see-more-btn']}>See  more</button>
                        </div>
                        <div className={styles['condition-grid']}>
                            <div className={styles['condition-item']}>
                                <Thermometer size={16} strokeWidth={1.75}/>
                                <div>
                                    <p className={styles['condition-label']}>Real Feel</p>
                                    <p className={styles['condition-value']}>{realFeel}*</p>
                                </div>
                            </div>
                            <div className={styles['condition-item']}>
                                <Wind size={16} strokeWidth={1.75}/>
                                <div>
                                    <p className={styles['condition-label']}>Wind</p>
                                    <p className={styles['condition-value']}>{wind}</p>
                                </div>
                            </div>
                            <div className={styles['condition-item']}>
                                <Droplet size={16} strokeWidth={1.75}/>
                                <div>
                                    <p className={styles['condition-label']}>Chance of rain</p>
                                    <p className={styles['condition-value']}>{chanceOfRain}%</p>
                                </div>
                            </div>
                            <div className={styles['condition-item']}>
                                <Gauge size={16} strokeWidth={1.75}/>
                                <div>
                                    <p className={styles['condition-label']}>UV Index</p>
                                    <p className={styles['condition-value']}>{uvIndex}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/*7 day forecast */}
                <div className={styles['forecast-col']}>
                    <p className={styles['card-label']}>DAY FORECAST</p>
                    <div className={styles['forecast-list']}>
                            {
                                daily.map((d) => (
                                    <div className={styles['forecast-row']}>

                                        <span className={styles['forecast-day']}>{d.day}</span>

                                        <div className={styles['forecast-condition']}>

                                            <ConditionIcon condition={d.condition} size={18} />

                                            <span>{conditionLabel(d.condition)}</span>

                                        </div>

                                        <span className={styles['forecast-temps']}>

                                            {d.high}
                                            <span className={styles['low']}>/{d.low}</span>

                                        </span>
                                    </div>
                                ))
                            }
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
}
