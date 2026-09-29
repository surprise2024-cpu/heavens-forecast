import React from 'react'

import styles from './TemperatureToggle.module.css'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';

// props required by the temperatureToggle component.
interface TemperatureToggleProps {
    
    // currently selected temperature unit
    unit: 'C' | 'F';

    // functon used to switch between celsius and fahrenheit
    onToggle: () => void;
}

// diplays the temperature unit selector
// together with the theme toggle
export const TemperatureToggle: React.FC<TemperatureToggleProps> = ({

    unit, 
    onToggle 

}) => {

    // handles selecting a specific temperature unit.
    const handleSelect = (
        target: 'C' | 'F') => {

            // only toggle when the selected unit
            // is different from the current one
            if(unit !== target) {
                onToggle();
            }
        }

  return (
    <div className={styles['temperature-toggle']}>

        {/* temperature unit buttons */}
        <div className={styles['temperature-buttons']}>

            {/* celsius button */}
            <button 
                type='button'
                className={`${styles['temp-btn']} 
                ${unit ==='C' ? styles['temp-btn-active'] : ''}`} 
                onClick={() => handleSelect('C')}

                // indicates whether celsius 
                // is currently selected.
                aria-pressed={unit === 'C'}
            >
                °C
            </button>

            {/* fahrenheit button */}
            <button 
                type='button'
                className={`${styles['temp-btn']} ${unit === 'F' ? styles['temp-btn-active'] : ''}`} 
                onClick={() => handleSelect('F')}

                // indicates whether fahrenheit 
                // is currently selected.
                aria-pressed={unit === 'F'}
            >
                °F
            </button>
        </div>

        {/* Application theme control */}
        <div className={styles['theme-cont']}>

            <ThemeToggle />

        </div>
    </div>
  )
}
