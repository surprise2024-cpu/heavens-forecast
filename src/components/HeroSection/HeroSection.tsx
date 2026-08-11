import React from 'react'

import styles from './HeroSection.module.css'
import * as LucideIcons from 'lucide-react'
import { Text } from '../Text/Text'

import { 
  MoonIcon,
} from 'lucide-react'

import { 
  formatTemperature, 
  getWeatherIcon, 
  isNightTime} from '../utils/WeatherUtilities'

import type { CurrentWeather } from '../hooks/useWeather'
import { SaveLocationButton } from '../SaveLocationButton/SaveLocationButton'

interface HeroSectionProps {
  weather: CurrentWeather | null;
  unit: string;
  saved?: boolean;
  onToggleSave?: () => void;
}

type LucideIconComponent = React.ComponentType<{
  size?: number;
  strokeWidth?: number;
  className?: string;
}>;

export const HeroSection: React.FC<HeroSectionProps> = ({ weather, unit, saved = false, onToggleSave }) => {

  const iconName = getWeatherIcon(weather?.weather?.[0] ?? { main: 'Clear', icon: '01d' });

  const isNight = isNightTime(weather?.weather?.[0]?.icon);

  const Icon: LucideIconComponent = 
  typeof iconName === 'string' 
  ? ((LucideIcons as unknown as Record<string, LucideIconComponent>)[iconName] ?? MoonIcon) 
  : iconName;

  const country = weather?.sys?.country ?? '';
  const temp = weather?.main?.temp ?? 0;
  const tempMax = weather?.main.temp_max ?? temp;
  const tempMin = weather?.main?.temp_min ?? temp;
    
  if (!weather) {
    return (
      <div className={styles['hero']}>
        <div className={styles['hero-loading']}>Loading weather....</div>
      </div>
    );
  }

  return ( 
    <div className={styles['hero']}>
                
      {/*header */}
      <div className={styles['section1']}>

        <div className={styles['section1-info']}>

          <div className={styles['hero-city-info']}>

            <div className={styles['hero-city-row']}>

              <div className={styles['hero-bookmark']}>
                {
                  onToggleSave && (
                    <SaveLocationButton 
                      saved={saved} 
                      onToggle={onToggleSave} 
                    />
                  )
                }
                <Text variant='p'>Bookmark</Text>
              </div>

              <div>
                <Text variant='h2' 
                  className={styles['hero-city']} >

                  {weather?.name}

                </Text>
              </div>
              
            </div>

              {country 
                && <Text variant='p' 
                  className={styles['hero-country']}>

                  {country}

                </Text>
              }
    
          </div>

          {/*Weather display */}
          <div className={styles['section2']}>

              <div className={styles['temp-cont']}>
                
                <div className={styles['main-temp']}>

                  <Text variant='span'>{formatTemperature(temp, unit)}°{unit}</Text>

                </div>

                <div className={styles['weather-desc']}>

                  <Text variant='span'>{weather?.weather?.[0]?.description}</Text>

                </div>

                <div className={styles['temps']}>

                  <Text variant='span'>H: {formatTemperature(tempMax, unit)}°{unit}</Text>
                  
                  <Text variant='span'>L: {formatTemperature(tempMin, unit)}°{unit}</Text>
                
                </div>
              </div>

          </div>

        </div>

        
        <div className={styles['dynamic2']}>
            {/*display dynamic date */}
            
        </div>

      </div>

      
      <div className={styles['dynamic']}>

        {/*display dynamic date */}
        <div className={styles['dynamic-date1']}>
          {
            new Date((weather?.dt ?? Date.now() / 1000) * 1000).toLocaleDateString('en-US', {
              weekday: 'long', 
              month: 'short',
              day: 'numeric',
            })
          }
        </div>

        {/*display dynamic date */}
        <div className={styles['dynamic-date2']}>
          <Text variant='p'>Last updated:</Text>
            {
              new Date((weather?.dt ?? Date.now() / 1000) * 1000).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })
            }
        </div>

        <div className={styles['the-sun']}>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
            <Icon 
              size={100} 
              strokeWidth={1.25} 
              className={styles[isNight ? 'hero-icon-night' : 'hero-icon']}
            />
        </div>
      </div>
    </div>
  )
}
