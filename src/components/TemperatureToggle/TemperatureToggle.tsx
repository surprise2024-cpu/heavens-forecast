import React, { useState } from 'react'

import styles from './TemperatureToggle.module.css'
import { useWeather } from '../hooks/useWeather';

interface TemperatureToggleProps {
  unit: string
  onToggle: () => void;
}

export const TemperatureToggle: React.FC<TemperatureToggleProps> = ({ unit, onToggle }) => {

    const [isActive, setIsActive] = useState<boolean>(false)

    const toggleActive = (): void => {
        setIsActive((prev) => !prev);
    }

        {/*const {
            currentWeather,
            forecast,
            loading,
            error,
            unit,
            fetchWeatherByCity,
            fetchWeatherByLocation,
            toggleUnit,
    
        } = useWeather();*/}

  return (
    <div className={styles['temperature-toggle']}>
        <div className={styles['temperature-buttons']}>
            <button 
                className={`${styles['temp-btn']} ${isActive ? styles['temp-btn-active'] : ''}`} 
                
                onClick={onToggle}
            >
                °C
            </button>
            <button 
                className={`${styles['temp-btn']} ${isActive ? styles['temp-btn-active'] : ''}`} 
                onClick={onToggle}
            >
                °F
            </button>

        </div>

    </div>
  )
}
