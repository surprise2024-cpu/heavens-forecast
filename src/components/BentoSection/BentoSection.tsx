import React from 'react'

import styles from './BentoSection.module.css'

import {
    Sun, 
    Cloud,
    CloudRain, 
    CloudLightning,
    Wind,
    Droplet,
    Gauge, 
    Thermometer,
} from 'lucide-react'

type Condition = 'sunny' | 'cloudy' | 'rainy' | 'storm' 

interface HourlyPoint {
    time: string;
    condition: Condition;
    temp: number;
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

const iconClassMap: Record<Condition, string> = {
    sunny: 'icon-sunny',
    cloudy: 'icon-cloudy',
    rainy: 'icon-rainy',
    storm: 'icon-storm',
};

export const BentoSection = () => {

    const chanceOfRain = 0;
    const realFeel = 30;
    const wind = '0.2 km/h';
    const uvIndex = 3

  return (
    <>
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

                                <span className={styles['hourly-temp']}>{h.temp}°C</span>
                            
                            </div>
                        ))
                    }
                </div>
            </div>
            
            {/*Air condition */}
            <div className={styles['card']}>
                <div className={styles['card-header-row']}>
                    <p className={styles['card-label']}>AIR CONDITIONS</p>
                    <button className={styles['see-more-btn']}>See more</button>
                </div>
                <div className={styles['condition-grid']}>
                    <div className={styles['condition-item']}>
                        <Thermometer size={16} strokeWidth={1.75}/>
                        <div>
                            <p className={styles['condition-label']}>Real Feel</p>
                            <p className={styles['condition-value']}>{realFeel}</p>
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
    </>
  )
}
