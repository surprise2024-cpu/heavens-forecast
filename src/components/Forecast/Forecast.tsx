import React, { useEffect, useState } from 'react'

import styles from './Forecast.module.css'
import { Text } from '../Text/Text'

import {
    Sun, 
    Cloud,
    CloudRain, 
    CloudLightning,
    Moon,
    CloudMoon,
} from 'lucide-react'

import type { 
    ForecastResponse, 
    ForecastListItem 
} from '../Services/WeatherAPI'

import { formatTemperature, isNightTime } from '../utils/WeatherUtilities' 
import type { CurrentWeather } from '../hooks/useWeather'

{/* simplified weather conditions used throughout the UI */}
export type Condition = 
    | 'sunny' 
    | 'cloudy' 
    | 'rainy' 
    | 'storm' 
    | 'night'

// represents one dat inside the daily forecast.
export interface DailyPoint {

    // label displayed to the user such as: "Today" or "Mon"
    day: string;

    // simplified weather conditon for the day.
    condition: Condition;
    // highest temperature recorded for the day.
    high: number;

    // lowest temperature recorded for the day.
    low: number;

    // indicates whether the representative forecast occurs at night.
    isNight: boolean;

    // forecast entry used to represent the day's main weather
    representative: ForecastListItem;

    // all forecast entries that belong to this day.
    items: ForecastListItem[];
}

// props required by the forecast component.
interface ForecastProps {

    // forecast data returned by the weather API.
    forecast: ForecastResponse | null;

    // temperature unit selected by the user.
    unit: string;

    // current weather data used for day/night styling.
    weather: CurrentWeather | null;

    // optional callback that runs when a forecast day is selected.
    onSelectDay?: (
        day: DailyPoint, 
        index: number
    ) => void;

}

// converts the internal condition value into
// a user-friendly text label.
function conditionLabel(c: Condition) {

    return c === 'sunny'
    ? 'Sunny'
    : c === 'cloudy'
    ? 'Cloudy'
    : c === 'rainy' 
    ? 'Rainy'
    : c === 'storm' 
    ? 'Storm'
    : 'Night';
}

// maps weather conditions to their matching css icon classes.
const iconClassMap: Record<Condition, string> = {
    sunny: 'icon-sunny',
    cloudy: 'icon-cloudy',
    rainy: 'icon-rainy',
    storm: 'icon-storm',
    night: 'icon-moon'
};

// converts openweather condition names into the
// simplified condition types used by the application
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

// groups the API's individual forecast entries into days.
//
// openweather provides multiple forecast entries per day.
// so this function combines them into one dailypoint.
function groupForecastByDay(

    list: ForecastListItem[]

): DailyPoint[] {

    // each map entry stores one date together with
    // all forecast entries belonging to that date
    const byDate = new Map<
        string, 
        ForecastListItem[]
    >();

    // group each forecast item by its date
    for (const item of list) {

        // extract only the date from:
        // "YYYY-MM-DD HH:mm:ss"
        const dateKey = item.dt_txt.split(' ')[0];

        // get existing entries for the date,
        // or start with an empty array.
        const existing = byDate.get(dateKey) ?? [];

        existing.push(item);

        byDate.set(dateKey, existing);

    }

    // short labels used for upcoming days.
    const dayLabels = [
        'Sun', 
        'Mon', 
        'Tue', 
        'Wed', 
        'Thu', 
        'Fri', 
        'Sat'
    ];

    // convert each grouped date into one dailypoint.
    return Array.from(byDate.entries()).map(

        ([dateKey, items], index) => {

            // collect all maximum temperatures for the day.
            const highs = items.map(
                (i) => i.main.temp_max
            );

            // collect all minimum temperatures for the day.
            const lows = items.map(
                (i) => i.main.temp_min
            );

            // choose the forecast entry closest to midday.
            //
            // this gives us one representative weather
            // condition for the entire day.
            const midday = items.reduce(
                (closest, current) => {

                    const currentHour = Number(
                        current.dt_txt
                            .split(' ')[1]
                            ?.split(':')[0] ?? 0
                    );

                    const closestHour = Number(
                        closest.dt_txt
                            .split(' ')[1]
                            ?.split(':')[0] ?? 0
                    );

                    // keep whichever forecast entry  is
                    // closer to 12:00
                    return Math.abs(currentHour - 12) 
                        < Math.abs(closestHour - 12) 
                            ? current 
                            : closest;
            }, items[0]);

            // convert the grouped date into a Javacript date.
            const date = new Date(dateKey);

            // the first forecast day is shown as "Today".
            // remaining days use abbreviated weekdays.
            const label = 
                index === 0 
                    ? 'Today' 
                    : dayLabels[date.getDay()];


            return {

                day: label,

                // use the midday forecast to represent
                // the day's weather condition.
                condition: mapCondition(
                    midday.weather[0]?.main ?? 'Clouds'
                ),

                // highest temperature across all entries.
                high: Math.round(
                    Math.max(...highs)
                ),

                // lowest temperature across all entries.
                low: Math.round(
                    Math.min(...lows)
                ),

                // determine whether the representative
                // forecast entry occurs at night.
                isNight: isNightTime(
                    midday.weather[0]?.icon
                ),
                
                // keep the representative entry for
                // components that need more detailed data.
                representative: midday,

                // kep every forecast entry for the day
                items,
            };
        }
    );
}

// displays the correct icon for a weather condition.
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

    // shared properties used by every weather icon.
    const common = { 
        size, 
        strokeWidth: 1.75, 
        className: `${styles[iconClassMap[condition]]} ${className}`.trim(),
    };

    // replace daytime clear/cloudy icons
    // wth night time versions when required.
    if (isNight) {

        if (condition === 'sunny') {
            return <Moon {...common}/>
        }

        if (condition === 'cloudy') {
            return <CloudMoon {...common}/>
        }
    }

    // return the correct icon for the condition.
    switch (condition) {

        case 'sunny': 
            return <Sun {...common} />

        case 'cloudy': 
            return <Cloud {...common} />

        case 'rainy': 
            return <CloudRain {...common} />

        case 'storm': 
            return <CloudLightning {...common} />

    }
}

// diplays the multi-day weather forecast.
export const Forecast: React.FC<ForecastProps> = ({

    forecast, 
    unit, 
    //weather, 
    onSelectDay 

}) => {

    // determine whether the current weather is at night.
    // this is used for the overall forecast icon styling.
    {/*const isNight = isNightTime(
        weather?.weather?.[0]?.icon
    );*/}

    // tracks which forecast day is currently selected.
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {

        // reset the selected day whenever
        // a new forecast is loaded.
        setSelectedIndex(0);

    }, [forecast]);

    // display a loading state until forecast data is available
    if (!forecast) {

        return (
            
            <div className={styles['forecast-col']}>

                <Text 
                    variant='p' 
                    className={styles['card-label']}
                >
                    DAILY FORECAST
                </Text>

                <div 
                    className={styles['forecast-loading']}
                > 
                    Loading forecast....
                </div>

            </div>
        );
    }

    //  convert  the API forecast list into daily forecast entries.
    const daily = groupForecastByDay(
        forecast.list
    );

    // handles selection of a forecast day.
    const handleSelect = (

        day: DailyPoint, 
        index: number

    ) => {

        // update the selected row locally
        setSelectedIndex(index);

        // notify the parent component if a callback was supplied
        onSelectDay?.(day, index);
    };
    
  return (
    <>
        <div className={styles['forecast-col']}>

            <Text 
                variant='p' 
                className={styles['card-label']}
            >
                DAILY FORECAST
            </Text>

            <div className={styles['forecast-list']}>
                {
                    daily.map((d, index) => (

                        <button  
                            key={`${d.day}-${index}`} 
                            type='button'
                            onClick={() => 
                                handleSelect(d, index)
                            }

                            // helps screen readers understand
                            // which forecast day is selected.
                            aria-pressed={index === selectedIndex}
                            className={`
                                ${styles['forecast-row']} 
                                ${
                                    index === selectedIndex 
                                    ? styles['selected'] 
                                    : ''
                                    }
                                `}
                            >

                            {/* forecast day */}
                            <Text 
                                variant='span' 
                                className={styles['forecast-day']}
                            >
                                {d.day}
                            </Text>

                            {/* weather condition and icon */}
                            <div className={styles['forecast-condition']}>

                                <ConditionIcon 
                                    condition={d.condition} 
                                    size={18} 
                                    isNight={d.isNight} 
                                    className={
                                        styles[
                                            d.isNight 
                                            ? 'fore-icon-night' 
                                            : 'fore-icon'
                                        ]
                                    }

                                />

                                <Text 
                                    variant='span'
                                >
                                    {conditionLabel(d.condition)}
                                </Text>

                            </div>

                            {/* Daily high and low temperatures */}
                            <Text 
                                variant='span' 
                                className={styles['forecast-temps']}
                            >

                                {formatTemperature(d.high, unit)}
                                <Text 
                                    variant='span' 
                                    className={styles['low']}
                                >
                                    /
                                    {formatTemperature(d.low, unit)}
                                </Text>

                            </Text>

                        </button>

                    ))

                }

            </div>

        </div>

    </>

  );

}

