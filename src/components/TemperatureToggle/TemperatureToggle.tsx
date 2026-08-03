import React, { useState } from 'react'

import styles from './TemperatureToggle.module.css'

interface TemperatureToggleProps {
  unit: string
  onToggle: () => void;
}

export const TemperatureToggle: React.FC<TemperatureToggleProps> = ({ unit, onToggle }) => {

    const [isActive, setIsActive] = useState<boolean>(false)

    const toggleActive = (): void => {
        setIsActive((prev) => !prev);
    }

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
