import React from 'react'
import type { WeatherAlert } from '../hooks/WeatherAlerts'
import styles from './WeatherAlertBanner.module.css'
import { AlertTriangle, Bell, X } from 'lucide-react';
import { Text } from '../Text/Text';
import type { NotificationPermissionState } from '../hooks/UseNotificationPermission';

// Props required by the WeatherAlertBanner component.
interface WeatherAlertBannerProps {

    // Current weather alert to display.
    alert: WeatherAlert | null;

    // Indicates whether the user has dismissed
    // the current alert banner.
    dismissed: boolean;

    // Indicates whether browser notifications
    // are supported on the current device/browser.
    notificationsSupported: boolean;

    // Current browser notification permission state.
    permission: NotificationPermissionState;

    // Runs when the user chooses to enable notifications.
    onEnableNotifications: () => void | Promise<void>;

    // Runs when the user dismisses the alert banner.
    onDismiss: () => void;
}

// Displays an active weather alert to the user.
export const WeatherAlertBanner: React.FC<WeatherAlertBannerProps> = ({ 
    alert, 
    dismissed, 
    notificationsSupported, 
    permission, 
    onEnableNotifications, 
    onDismiss 
}) => {
  
    // Do not render the banner when there is no alert
    // or when the user has already dismissed it.
    if (!alert || dismissed) return null;
  
    return (

    <div 
        className={`
            ${styles['banner']} 
            ${styles[alert.severity]}
        `} 

        // Announces important weather alerts
        // to assistive technologies.
        role='alert'>

        {/* Weather alert icon */}
        <AlertTriangle 
            size={18} 
            className={styles['icon']} 
        />

        {/* Alert information */}
        <div className={styles['content']}>
            
            <Text variant='p' className={styles['title']}>{alert.title}</Text>
            <Text variant='p' className={styles['message']}>{alert.message}</Text>

        </div>

        {/* Show the notification button only when
            notifications are supported and the user
            has not made a permission decision yet. */}
        {
            notificationsSupported && permission === 'default' && (

                <button className={styles['enable-btn']} 
                    type='button'
                    onClick={onEnableNotifications}>

                    <Bell size={14} />
                    <Text variant='span'>Enable alerts</Text>

                </button>
            )
        }

        {/* Dismiss the current alert banner */}
        <button 
            className={styles['dismiss-btn']} 
            type='button'
            onClick={onDismiss}
            aria-label='Dismiss alert'
        >
            <X size={16} />

        </button>

    </div>

  );

};
