import React, { useCallback, useState } from 'react'

export type PermissionState = NotificationPermission | 'unsupported';

interface UseNotificationPermissionReturn {
    supported: boolean;
    permission: PermissionState;
    requestPermission: () => Promise<void>;
}

export function UseNotificationPermission(): UseNotificationPermissionReturn {

    const supported = typeof window !== 'undefined' && 'Notification' in window;

    const [permission, setPermission] = useState<PermissionState>(
        supported ? Notification.permission : 'unsupported'
    );

    const requestPermission = useCallback(async () => {
        if (!supported) return;

        try {
            const result = await Notification.requestPermission();
            setPermission(result);
        }
        catch (err) {
            console.error('Failed to request notification permission', err);
        }
    }, [supported]);

  return { supported, permission, requestPermission };
}
