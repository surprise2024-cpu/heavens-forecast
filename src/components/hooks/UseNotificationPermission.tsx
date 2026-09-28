import { useCallback, useState } from 'react'

// represents every possible notification permission state
//
// browser normally return:
// 'default' | 'granted' | 'denied'
//
// 'unsupported' is added for browsers/devices
// that do not support the notification API
export type NotificationPermissionState = 
    NotificationPermission | 'unsupported';

// describes what the custom hook returns.
interface useNotificationPermissionReturn {
    
    // indicaes whether the browser supports notifications.
    supported: boolean;

    // stores the current notification permission status.
    permission: NotificationPermissionState;

    // function used to ask the user for notification permission.
    requestPermission: () => Promise<void>;
}

// custom hook used to manage browser notification permissions.
export function useNotificationPermission():
 
    useNotificationPermissionReturn {

    // check whether the code is running in the browser
    // and whether the notification api is available.
    const supported = 
        typeof window !== 'undefined' && 
        'Notification' in window;

    // store the current notification permission state.
    //
    // if notifications are unsupported,
    // use our ustom 'unsupported' value instead.
    const [permission, setPermission] = 
        useState<NotificationPermissionState>(
            supported 
                ? Notification.permission 
                : 'unsupported'
        );
    
    // requests notification permission from the user.
    //
    // use Callback keeps the same function reference
    // unless the 'supported' value changes
    const requestPermission = useCallback(
        async () => {

            // stop immediately if notifications
            // are not supported by the browser.
            if (!supported) return;

            try {

                // open the browser's ntification
                // permission promp.
                const result = 
                    await Notification.requestPermission();
                
                // save the user's response:
                // 'granted', 'denied', or 'default'.
                setPermission(result);

            }
            catch (err) {

                // log unexpected errors while repreenting permission.
                console.error(
                    'Failed to request notification permission', 
                    err
                );

            }

        }, [supported]
    );

    // exposed the ntification state and permission function
    // to components using this hook
    return { 
        supported, 
        permission, 
        requestPermission 
    };

}
