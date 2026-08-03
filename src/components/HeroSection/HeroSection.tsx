import React from 'react'

import styles from './HeroSection.module.css'

import { Sun} from 'lucide-react'

export const HeroSection: React.FC = () => {
    
    const city = 'Madrid';
    const currentTemp = 31;
    const chanceOfRain = 0;

  return (
    <>  
        <div className={styles['hero']}>
                   
          <div>

            <h1 className={styles['hero-city']} >{city}</h1>
            <p className={styles['hero-subtext']}>Chance of rain: {chanceOfRain}%</p>
            <p className={styles['hero-temp']}>{currentTemp}°C</p>
        
          </div>
            
          <Sun size={110} strokeWidth={1.25} className={styles['hero-icon']}/>
        
        </div>
    </>
  )
}
