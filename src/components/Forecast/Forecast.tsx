import React from 'react'

import styles from './Forecast.module.css'

import {
    Sun, 
    Cloud,
    CloudRain, 
    CloudLightning,
} from 'lucide-react'

type Condition = 'sunny' | 'cloudy' | 'rainy' | 'storm' 

interface DailyPoint {
    day: string;
    condition: Condition;
    high: number;
    low: number;
}

const daily: DailyPoint[] = [
    {day: 'Today', condition: 'sunny', high: 36, low: 22},
    {day: 'Tue', condition: 'sunny', high: 37, low: 21},
    {day: 'Wed', condition: 'sunny', high: 37, low: 21},
    {day: 'Thu', condition: 'cloudy', high: 37, low: 21},
    {day: 'Fri', condition: 'cloudy', high: 37, low: 21},
    {day: 'Sat', condition: 'rainy', high: 37, low: 21},
    {day: 'Sun', condition: 'storm', high: 37, low: 21},
];

function conditionLabel(c: Condition) {
    return c === 'sunny'
    ? 'Sunny'
    : c === 'cloudy'
    ? 'Cloudy'
    : c === 'rainy'
    ? 'Rainy'
    : 'Storm';
}

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

export const Forecast = () => {
  return (
    <>
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
    </>
  )
}
