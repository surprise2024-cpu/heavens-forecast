import React from 'react'

import styles from './Forecast.module.css'

import {
    Sun, 
    Cloud,
    CloudRain, 
    CloudLightning,
} from 'lucide-react'

import type { ForecastResponse, ForecastListItem } from '../Services/WeatherAPI'
import { formatTemperature } from '../utils/WeatherUtilities' 

export type Condition = 'sunny' | 'cloudy' | 'rainy' | 'storm' 

interface DailyPoint {
    day: string;
    condition: Condition;
    high: number;
    low: number;
}

interface ForecastProps {
    forecast: ForecastResponse | null;
    unit: string;
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

const iconClassMap: Record<Condition, string> = {
    sunny: 'icon-sunny',
    cloudy: 'icon-cloudy',
    rainy: 'icon-rainy',
    storm: 'icon-storm',
};

export function mapCondition(main: string): Condition{
    switch (main) {
        case 'Clear': 
        return 'sunny';
        case 'Clouds': 
        return 'cloudy';
        case 'Rain': 
        case 'Drizzle': 
        return 'rainy';
        case 'Thunderstorm': 
        return 'storm';
        default: 
        return 'cloudy';
    }
}

function groupForecastByDay(list: ForecastListItem[]): DailyPoint[] {
    const byDate = new Map<string, ForecastListItem[]>();

    for (const item of list) {
        const dateKey = item.dt_txt.split(' ')[0]; //'yyyy-mmy-dd'
        const existing = byDate.get(dateKey) ?? [];
        existing.push(item);
        byDate.set(dateKey, existing);
    }

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return Array.from(byDate.entries()).map(([dateKey, items], index) => {
        const highs = items.map((i) => i.main.temp_max);
        const lows = items.map((i) => i.main.temp_min);

        const midday = items.reduce((closest, current) => {
            const currentHour = Number(current.dt_txt.split(' ')[1]?.split(':')[0] ?? 0);
            const closestHour = Number(closest.dt_txt.split(' ')[1]?.split(':')[0] ?? 0);

            return Math.abs(currentHour - 12) < Math.abs(closestHour - 12) ? current : closest;
        }, items[0]);

        const date = new Date(dateKey);
        const label = index === 0 ? 'Today' : dayLabels[date.getDay()];

        return {
            day: label,
            condition: mapCondition(midday.weather[0]?.main ?? 'Clouds'),
            high: Math.round(Math.max(...highs)),
            low: Math.round(Math.min(...lows))
        }
    });
}

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

export const Forecast: React.FC<ForecastProps> = ({ forecast, unit }) => {

    if (!forecast) {
        return (
            <div className={styles['forecast-col']}>
                <p className={styles['card-label']}>DAILY FORECAST</p>
                <div className={styles['forecast-loading']}> Loading forecast....</div>
            </div>
        );
    }

    const daily = groupForecastByDay(forecast.list)

  return (
    <>
        <div className={styles['forecast-col']}>
            <p className={styles['card-label']}>DAILY FORECAST</p>
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

                                {formatTemperature(d.high, unit)}
                                <span className={styles['low']}>/{formatTemperature(d.low, unit)}</span>

                            </span>
                        </div>
                    ))
                }
            </div>
        </div>
    </>
  )
}
