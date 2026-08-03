import React from 'react'

import styles from './TemperatureToggle.module.css'

interface TemperatureToggleProps {
  unit: string
  onToggle: () => void;
}

export const TemperatureToggle: React.FC<TemperatureToggleProps> = ({ unit, onToggle }) => {
  return (
    <div className={styles['temperature-toggle']}>
        <div className={styles['temperature-buttons']}>
            <button 
                className={styles['temp-btn']} 
              
                onClick={onToggle}
            >
                °C
            </button>
            <button 
                className={styles['temp-btn']} 
                onClick={onToggle}
            >
                °F
            </button>

        </div>

    </div>
  )
}
