import React, { useState } from 'react'

import styles from './WeatherDashboard.module.css'

import {
    Search,
    Wind, 
    CloudSun, 
    List, 
    Map as MapIcon,
    Settings,
    Sun, 
    Cloud,
    CloudRain, 
    CloudLightning,
    Droplet,
    Gauge, 
    Thermometer,
    Icon,
} from 'lucide-react'

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

const navItems = [
    {icon: CloudSun, label: 'Weather', active: true},
    {icon: List, label: 'Cities', active: false},
    {icon: MapIcon, label: 'Map', active: false},
    {icon: Settings, label: 'Settings', active: false},
];

function ConditionIcon ({
    condition, 
    size = 22, 
    className=''
}: {
    condition: Condition;
    size?: number;
    className?: string
}) {
    const common = { size, strokeWidth: 1.75 };

    switch (condition) {
        case 'sunny': 
            return <Sun {...common} className={`text-amber-400 ${className}`} />
        case 'cloudy': 
            return <Cloud {...common} className={`text-slate-300 ${className}`} />
        case 'rainy': 
            return <CloudRain {...common} className={`text-sky-300 ${className}`} />
        case 'storm': 
            return (
                <CloudLightning {...common} className={`text-amber-300 ${className}`} />
            );
        }
}

function conditionLabel(c: Condition) {
    return c === 'sunny'
    ? 'sunny'
    : c === 'cloudy'
    ? 'Cloudy'
    : c === 'rainy'
    ? 'rainy'
    : 'Storm';
}

export const WeatherDashboard = () => {
    const [query, setQuery] = useState('');
    const city = 'Madrid';
    const currentTemp = 31;
    const chanceOfRain = 0;
    const realFeel = 30;
    const wind = '0.2 km/h';
    const uvIndex = 3


  return (
    <div className={styles['weather-app']}>

        <div className={styles['weather-panel']}>

            <div className={styles['weather-grid']}>

                             {/*Sidebar*/}
                <aside className={styles['nav']}>

                    <div className={styles['nav-logo']}>
                        <Wind size={20} strokeWidth={1.75}/>
                    </div>

                    {
                        navItems.map(({ icon: Icon, label, active }) => (
                            <button key={label} className={`nav-item ${active ? 'active' : ''}`}>
                                <Icon size={20} strokeWidth={1.75} />
                                <span>{label}</span>
                            </button>
                        ))
                    }

                </aside>
                
                {/*Searchbar */}
                <div className={styles['search-bar']} >
                    <Search size={16} />
                    <input value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder='Search for cities'
                    />
                </div>

                {/*Hero */}
                <div className={styles['hero']}>
                    <div>
                        <h1 className={styles['hero-city']} >{city}</h1>
                        <p className={styles['hero-subtext']}>Chance of rain: {chanceOfRain}%</p>
                        <p className={styles['hero-temp']}>{currentTemp}*</p>
                    </div>
                    <Sun size={110} strokeWidth={1.25} className={styles['hero-icon']}/>
                </div>
                
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
                                        <span className={styles['hourly-temp']}>{h.temp}</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    
                    {/*Air condition */}
                    <div className={styles['card']}>
                        <div className={styles['card-header-tow']}>
                            <p className={styles['card-label']}>Air CONDITIONS</p>
                            <button className={styles['see-more-btn']}>See  more</button>
                        </div>
                        <div className={styles['condition-grid']}>
                            <div className={styles['consdition-item']}>
                                <Thermometer size={16} strokeWidth={1.75}/>
                                <div>
                                    <p className={styles['condition-label']}>Real Feel</p>
                                    <p className={styles['consition-value']}>{realFeel}*</p>
                                </div>
                            </div>
                            <div className={styles['consdition-item']}>
                                <Wind size={16} strokeWidth={1.75}/>
                                <div>
                                    <p className={styles['condition-label']}>Wind</p>
                                    <p className={styles['consition-value']}>{wind}*</p>
                                </div>
                            </div>
                            <div className={styles['consdition-item']}>
                                <Droplet size={16} strokeWidth={1.75}/>
                                <div>
                                    <p className={styles['condition-label']}>Chance of rain</p>
                                    <p className={styles['consition-value']}>{chanceOfRain}*</p>
                                </div>
                            </div>
                            <div className={styles['consdition-item']}>
                                <Gauge size={16} strokeWidth={1.75}/>
                                <div>
                                    <p className={styles['condition-label']}>UV Index</p>
                                    <p className={styles['consition-value']}>{uvIndex}*</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/*7 day forsecast */}
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
                                            <span className={styles['low']}>{d.low}</span>

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
