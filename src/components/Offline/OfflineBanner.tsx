import React from 'react'

import styles from './OfflineBanner.module.css'
import { WifiOff } from 'lucide-react';
import { Text } from '../Text/Text';

// props required by the offlineBnner component
interface OfflineBannerProps {

    // indicates whether the browser currently has an interne
    isOnline: boolean;

    // indicates whether the app is currently displaying cached weather data.
    usingCache: boolean;

    // optional human-readable age of the cached data.
    cacheAge?: string;
}

// displays a small status banner when the user is offline
// or when cached weather data is being used.
export const OfflineBanner: React.FC<OfflineBannerProps> = ({ 

    isOnline, 
    usingCache, 
    cacheAge 

}) => {
    
    // do not display the banne when the user is online
    // and the pp is using fresh weather data.
    if (isOnline && !usingCache) {
        return null;
    }

    // build the correct messag depending on the 
    // user's connection and cache state.
    const message = !isOnline 

        // user is offline
        ? usingCache 

            // offline, but cached weather is available
            ? `You're offline - Showing cached data${
                cacheAge 
                    ? ` from ${cacheAge}` 
                    : ''
            }.`

            // offline and no cached data is being displayed.
        : "You're offline."

        // user is online, but live refresh failed
        // and cached weather is still being shown
        : `Showing cached data${
            cacheAge 
                ? ` from ${cacheAge}` 
                : ''
        } - refresh failed.`;
  
    
    return (
    <div className={styles['offline-banner']} role='status'>

        <WifiOff size={16} />
        <Text variant='span'>{message}</Text>

    </div>
  );

}
