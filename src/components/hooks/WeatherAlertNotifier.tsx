import React, { useEffect, useRef } from 'react'

import type { WeatherAlert } from './WeatherAlerts'


export function WeatherAlertNotifier(

    alert: WeatherAlert | null,
    permission: NotificationPermission | 'unsupported'

): void {
    const lastNotifiedId = useRef<string | null>(null);

    useEffect(() => {
        if (!alert) {
            lastNotifiedId.current = null;
            return;
        }

        if (permission !== 'granted') return;
        if (lastNotifiedId.current === alert.id) return;

        try {
            new Notification(alert.title, {
                body: alert.message,
            });
            lastNotifiedId.current = alert.id;
        }
        catch (err) {
            console.error('Failed to show notification:', err);
        }
    }, [alert, permission]);

}
