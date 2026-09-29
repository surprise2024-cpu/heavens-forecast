import React from 'react'

import styles from './HeroSection.module.css'
import { Text } from '../Text/Text'

import { 
  Cloud,
  CloudLightning,
  CloudMoon,
  CloudRain,
  Moon,
  Sun,
} from 'lucide-react'

import { 
  formatTemperature, 
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

function renderWeatherIcon(
  main: string,
  isNight: boolean,
  className: string
) {

  if (isNight) {

    if (main === 'Clear') {
      return (
        <Moon
          size={100}
          strokeWidth={1.25}
          className={className}
        />
      );
    }

    if (main === 'Clouds') {
      return (
        <CloudMoon
          size={100}
          strokeWidth={1.25}
          className={className}
        />
      );
    }
  }

  switch (main) {

    case 'Clear':
      return (
        <Sun
          size={100}
          strokeWidth={1.25}
          className={className}
        />
      );

    case 'Clouds':
      return (
        <Cloud
          size={100}
          strokeWidth={1.25}
          className={className}
        />
      );

    case 'Rain':
      return (
        <CloudRain
          size={100}
          strokeWidth={1.25}
          className={className}
        />
      );

    case 'Thunderstorm':
      return (
        <CloudLightning
          size={100}
          strokeWidth={1.25}
          className={className}
        />
      );

    default:
      return (
        <Cloud
          size={100}
          strokeWidth={1.25}
          className={className}
        />
      );
  }
}

// displays the main current-weather information for the selected city.
export const HeroSection: React.FC<HeroSectionProps> = ({

  weather, 
  unit, 
  saved = false, 
  onToggleSave 

}) => {


  // determine whether the current weather occurs at night.
  const isNight = isNightTime(
    weather?.weather?.[0]?.icon
  );

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
                weather?.dt * 1000
              ) 
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
                  weather?.dt * 1000
                )
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

            {
              renderWeatherIcon( 
                weather.weather[0]?.main ?? 'Clouds',
                isNight, 
                  styles[
                    isNight 
                      ? 'hero-icon-night' 
                      : 'hero-icon'
                  ]

              )

            }

        </div>

      </div>

    </div>
    
  )
}
