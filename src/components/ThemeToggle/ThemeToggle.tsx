import React, { useEffect, useState } from 'react'

import styles from './ThemeToggle.module.css'
import { Moon, Sun } from 'lucide-react';
import { Text } from '../Text/Text';

export const ThemeToggle: React.FC = () => {

    const [isDark, setIsDark] = useState<boolean>(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        
        if (isDark) {
            
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');

        }
        else {
            
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            
        }
    }, [isDark]);

  return (
    
    <label className={styles['theme-slider']}>

        <input 
            className={styles['dark-mode']} 
            type='checkbox'
            checked={isDark}
            onChange={(e) => setIsDark(e.target.checked)}
        />

        <Text variant='span' className={styles['slider']}>

            <Text variant='span' 

                className={styles['slider-icon']}>
                {isDark ? <Moon /> : <Sun />}

            </Text>
        </Text>
    </label>
  )
}
