import React from 'react'

import styles from './OfflineBanner.module.css'
import { WifiOff } from 'lucide-react';
import { Text } from '../Text/Text';

interface OfflineBannerProps {
    isOnline: boolean;
    usingCache: boolean;
    cacheAge?: string;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline, usingCache, cacheAge }) => {
    
    if (isOnline && !usingCache) return null;

    const message = !isOnline 
        ? usingCache 
        ? `You're offline - showing cached data${cacheAge ? ` from ${cacheAge}` : ''}.`
        : "You're offline."
        : `showing cached data${cacheAge ? ` from ${cacheAge}` : ''} - refresh failed.`;
  
    
    return (
    <div className={styles['offline-banner']} role='status'>
        <WifiOff size={16} />
        <Text variant='span'>{message}</Text>
    </div>
  );
}
