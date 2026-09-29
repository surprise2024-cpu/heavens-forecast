import { 
    useEffect, 
    useState 
} from 'react'

import styles from './ThemeToggle.module.css'

import {
    Moon, 
    Sun 
} from 'lucide-react';

import { 
    Text 
} from '../Text/Text';

// toggle used to switch between
// the application's light and dark themes.
export const ThemeToggle = () => {

    // load the previously selected theme from localStorage
    // the function form of the useState means this check
    // only runs during the initial state setup.
    const [isDark, setIsDark] = 
        useState<boolean>(() => {

            return (
                localStorage.getItem('theme') === 'dark'
            );

        });

    useEffect(() => {
        
        // apply the dark theme when enabled.
        if (isDark) {
            
            // add the 'dark' class to the root <html> element.
            document.documentElement.classList.add('dark');

            // remember the user's preference.
            localStorage.setItem('theme', 'dark');

        }
        else {
            
            // remove the dark class to return
            // the application to its light theme.
            document.documentElement.classList.remove('dark');

            // remember the user's preference.
            localStorage.setItem('theme', 'light');
            
        }
    }, [isDark]);

  return (
    
    <label className={styles['theme-slider']}>

        {/* Hidden checkbox controlling the theme state. */}
        <input 
            className={styles['dark-mode']} 
            type='checkbox'

            // Keep the checkbox state synchronized
            // with the current theme.
            checked={isDark}

            // Update the theme when the checkbox changes.
            onChange={(e) => setIsDark(e.target.checked)}

            aria-label='Toggle dark mode'
        />

        {/* Visual slider */}
        <Text variant='span' className={styles['slider']}>

            {/* Theme icon */}
            <Text variant='span' 

                className={styles['slider-icon']}>
                {
                    isDark 

                    // Show the moon while dark mode is active.
                    ? (
                        <Moon 
                            className={`
                                ${styles['moon-icon']} 
                                ${styles['moon-icon-active']}
                            
                            `}
                        />
                    )

                    // Show the sun while light mode is active.
                    : (
                        <Sun 
                            className={`
                                ${styles['sun-icon']} 
                                ${styles['sun-icon-active']}
                            `} 

                        />

                    )

                }

            </Text>

        </Text>

    </label>

  );

}
