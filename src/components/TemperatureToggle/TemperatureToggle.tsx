import React, { useState } from 'react'

import styles from './TemperatureToggle.module.css'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';

interface TemperatureToggleProps {
  unit: string;
  onToggle: () => void;
}

export const TemperatureToggle: React.FC<TemperatureToggleProps> = ({ unit, onToggle }) => {

    {/*const [isActive, setIsActive] = useState<boolean>(false)*/}

    const handleSelect = (target: 'C' | 'F') => {
        if(unit !== target) {
            onToggle();
        }
    }

  return (
    <div className={styles['temperature-toggle']}>
        <div className={styles['temperature-buttons']}>
            <button 
                className={`${styles['temp-btn']} ${unit ==='C' ? styles['temp-btn-active'] : ''}`} 
                
                onClick={() => handleSelect('C')}
                aria-pressed={unit === 'C'}
            >
                °C
            </button>
            <button 
                className={`${styles['temp-btn']} ${unit === 'F' ? styles['temp-btn-active'] : ''}`} 
                onClick={() => handleSelect('F')}
                aria-pressed={unit === 'F'}
            >
                °F
            </button>

        </div>
        <ThemeToggle />
    </div>
  )
}
