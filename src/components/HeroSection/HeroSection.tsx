import React from 'react'

import styles from './HeroSection.module.css'

import { 
  Droplet, 
  Eye, 
  Gauge, 
  MapPin, 
  Sun, 
  Thermometer, 
  Wind 
} from 'lucide-react'

import { getWeatherIcon } from '../utils/WeatherUtilities'
import * as LucideIcons from 'lucide-react'
import type { CurrentWeather } from '../hooks/useWeather'

interface HeroSectionProps {
  weather: CurrentWeather;
  unit: string
}

export const HeroSection: React.FC<HeroSectionProps> = ({ weather, unit }) => {
  
  const iconName = getWeatherIcon(weather?.weather?.[0] ?? { main: 'Clear' });
  const Icon = iconName;

  const cityName = weather?.name ?? 'Madrid';
  const country = weather?.sys?.country ?? 'US';
    
    const city = 'Madrid';
    const country = 'US';
    const chanceOfRain = 0;

  return (
    <>  
        <div className={styles['hero']}>
                   
          {/*header */}
          <div className={styles['section1']}>

            <div className={styles['section1-info']}>

              <div className={styles['section1-pin']}>

                <MapPin size={16} className={styles['pin']}/>

              </div>

              <div className={styles['']}>

                <h2 className={styles['hero-city']} >{weather.name}</h2>
                <p className={styles['hero-country']}>{city}</p>
        
              </div>

            </div>

            {/*<div className={styles['dynamic']}>

              {/*display dynamic date */}
              {/*<div className={styles['dynamic-date1']}>
                {
                  new Date(weather.dt * 1000).toLocaleDateString('en-US', {
                    weekday: 'long', 
                    month: 'short',
                    day: 'numeric',
                  })
                }
              </div>*/}

              {/*display dynamic date */}
             {/*} <div className={styles['dynamic-date2']}>
                  {
                    new Date(weather.dt * 1000).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  }
              </div>
            </div>*/}
          </div>

          {/*Weather display */}
          <div className={styles['section2']}>

              <div className={styles['temp-cont']}>
                <div className={styles['main-temp']}>

                  main temp

                </div>
                <div className={styles['weather-desc']}>
                  weather description
                </div>
                <div className={styles['temps']}>
                  <span>max temp</span>
                  <span>min temp</span>
                </div>
              </div>

          </div>
          <div className={styles['dynamic2']}>
              {/*display dynamic date */}
              d
          </div>
            
          <Icon size={110} strokeWidth={1.25} className={styles['hero-icon']}/>
        
        </div>
    </>
  )
}
