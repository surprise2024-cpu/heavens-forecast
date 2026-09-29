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

// props required by the heroSection component
interface HeroSectionProps {

  // current weather information for the selected city.
  weather: CurrentWeather | null;

  // temperature uni currently selected by the user.
  unit: 'C' | 'F';

  // indicates whether the current locaton has already been save.
  saved?: boolean;

  // optional function used to save or remove the current location.
  onToggleSave?: () => void;

}

// descrbes the props expected by a lucide icon component.
type LucideIconComponent = React.ComponentType<{
  size?: number;
  strokeWidth?: number;
  className?: string;
}>;

// displays the main current-weather information for the selected city.
export const HeroSection: React.FC<HeroSectionProps> = ({

  weather, 
  unit, 
  saved = false, 
  onToggleSave 

}) => {

  // get the weather icon that matches the current condition.
  //
  // if weather data is not available yet, use a clear daytime
  // condition as a temporary fallback.
  const iconName = getWeatherIcon(

    weather?.weather?.[0] ?? { 
      main: 'Clear', 
      icon: '01d' 
    }

  );

  // determine whether the current weather occurs at night.
  const isNight = isNightTime(
    weather?.weather?.[0]?.icon
  );

  // getWeatherIcon can return either an icon component
  // or the name of a lucide icon.
  //
  // if it returns a string, look up that icon inside
  // the complete lucideIcons colletions.
  const Icon: LucideIconComponent = 
    typeof iconName === 'string' 
      ? (
          (
            LucideIcons as unknown as Record<
              string, 
              LucideIconComponent
            >
          )[iconName] ?? MoonIcon
        ) 

      : iconName;

  // extract the main values needed by the UI.
  // fallback values prevent undefined values from reaching the display.
  const country = weather?.sys?.country ?? '';
  const temp = weather?.main?.temp ?? 0;
  const tempMax = weather?.main.temp_max ?? temp;
  const tempMin = weather?.main?.temp_min ?? temp;
    
  // display a loading state until current weather
  // information has been received.
  if (!weather) {
    return (
      <div className={styles['hero']}>
        <div className={styles['hero-loading']}>Loading weather....</div>
      </div>
    );
  }

  return ( 
    <div className={styles['hero']}>
                
      {/* main city and weather information */}
      <div className={styles['section1']}>

        <div className={styles['section1-info']}>

          {/* selected city information */}
          <div className={styles['hero-city-info']}>

            <div className={styles['hero-city-row']}>

              {/* save/remove location button */}
              <div className={styles['hero-bookmark']}>
                {
                  // only display the save button when the 
                  // parent provides a save handler
                  onToggleSave && (

                    <SaveLocationButton 
                      saved={saved} 
                      onToggle={onToggleSave} 
                    />

                  )

                }
                
              </div>
              
              {/* city name */}
              <div>

                <Text 
                  variant='h2' 
                  className={styles['hero-city']} 
                >

                  {weather?.name}

                </Text>

              </div>
              
            </div>

              {
                  country && (

                    <Text variant='p' 
                      className={styles['hero-country']}
                    >

                    {country}

                  </Text>
                )
              }
    
          </div>

          {/*current weather display */}
          <div className={styles['section2']}>

              <div className={styles['temp-cont']}>
                
                {/* current temperature */}
                <div className={styles['main-temp']}>

                  <Text 
                    variant='span'
                  >

                    {formatTemperature(temp, unit)}°{unit}

                  </Text>

                </div>

                {/* weather description */}
                <div className={styles['weather-desc']}>

                  <Text 
                    variant='span'
                  >

                    {weather?.weather?.[0]?.description}

                  </Text>

                </div>
                
                {/* daily high and low temperatures */}
                <div className={styles['temps']}>

                  <Text 
                    variant='span'
                  >

                    H: {formatTemperature(tempMax, unit)}°{unit}

                  </Text>
                  
                  <Text 
                    variant='span'
                  >

                    L: {formatTemperature(tempMin, unit)}°{unit}

                  </Text>
                
                </div>
              </div>

          </div>

        </div>

        
        <div className={styles['dynamic2']}>
            {/*display dynamic date */}
            
        </div>

      </div>

      {/* date, update time and main weather icon */}
      <div className={styles['dynamic']}>

        {/* display the date associated with the weather data */}
        <div className={styles['dynamic-date1']}>
          {
            new Date(
              (
                weather?.dt ?? 
                Date.now() / 1000
              ) * 1000
            ).toLocaleDateString(
              'en-US', 
              {
                weekday: 'long', 
                month: 'short',
                day: 'numeric',
              }
            )
          }

        </div>

        {/* display when the weather information was last updated. */}
        <div className={styles['dynamic-date2']}>

          <Text 
            variant='p'
          > 
            Last updated:
          </Text>
            {
              new Date(
                (
                  weather?.dt ?? 
                  Date.now() / 1000
                ) * 1000
              ).toLocaleTimeString(
                'en-US', 
                {
                  hour: '2-digit',
                  minute: '2-digit',
                }
              )
            }

        </div>

        {/* main weather condition icon */}
        <div className={styles['the-sun']}>   

            <Icon 
              size={100} 
              strokeWidth={1.25} 
              className={
                styles[
                  isNight 
                    ? 'hero-icon-night' 
                    : 'hero-icon'
                ]
              }
            />

        </div>

      </div>

    </div>
    
  )
}
