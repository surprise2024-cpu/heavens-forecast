import React from 'react'
import type { WeatherAlert } from '../hooks/WeatherAlerts'
import styles from './WeatherAlertBanner.module.css'
import { AlertTriangle, Bell, X } from 'lucide-react';
import { Text } from '../Text/Text';

interface WeatherAlertBannerProps {
    alert: WeatherAlert | null;
    dismissed: boolean;
    notificationsSupported: boolean;
    permission: PermissionState;
    onEnableNotifications: () => void;
    onDismiss: () => void;
}

export const WeatherAlertBanner: React.FC<WeatherAlertBannerProps> = ({ alert, dismissed, notificationsSupported, permission, onEnableNotifications, onDismiss }) => {
  
    if (!alert || dismissed) return null;
  
    return (

    <div className={`${styles['banner']} ${styles[alert.severity]}`} role='alert'>
        <AlertTriangle size={18} className={styles['icon']} />

        <div className={styles['content']}>
            <Text variant='p' className={styles['title']}>{alert.title}</Text>
            <Text variant='p' className={styles['message']}>{alert.message}</Text>
        </div>

        {notificationsSupported && permission === 'default' && (
            <button className={styles['enable-btn']} 
                type='button'
                onClick={onEnableNotifications}>
                <Bell size={14} />
                Enable alerts
            </button>
        )}

        <button className={styles['dismiss-btn']} 
            type='button'
            onClick={onDismiss}
            aria-label='Dismiss alert'
        >
            <X size={16} />
        </button>
    </div>
  );
}
