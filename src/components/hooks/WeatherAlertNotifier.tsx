import { 
    useEffect, 
    useRef 
} from 'react'

import type { 
    WeatherAlert 
} from './WeatherAlerts'

// watches the current weather alert and displays 
// a browser notification when appropriate.
export function useWeatherAlertNotifier(

    // current weather alert that may need to be shown
    alert: WeatherAlert | null,

    // current browser notification permission state.
    permission: NotificationPermission | 'unsupported'

): void {

    // stors the ID of the most recently displayed alert.
    // useRef keeps its value between renders without
    // causing the component to re-render when it changes
    const lastNotifiedId = 
        useRef<string | null>(null);

    useEffect(() => {

        // if there is no active alert,
        // clear the previously notified alert ID.
        if (!alert) {
            lastNotifiedId.current = null;
            return;
        }

        // don't attemp to show a notification
        // unless the user has granted permission.
        if (permission !== 'granted') {
            return
        };

        // prevent the same alert from being
        // displayed more than once.
        if (lastNotifiedId.current === alert.id) {
            return
        };

        try {

            // display the browser notification.
            new Notification(
                alert.title, 
                {
                    body: alert.message,
                }
            );

            // remember which alert was displayed
            // so it is not shown again.
            lastNotifiedId.current = alert.id;
        }
        catch (err) {

            console.error('Failed to show notification:', err);
        }

    }, [alert, permission]);

}
