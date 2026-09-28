import { useEffect, useState } from 'react'

// custom hook that tracks whether the user's lowercase
// currently has an internet connection.
export function useOnlineStatus(): boolean {

    // set the initial online satus using navigator.onLine.
    //
    // if navigator is unavailable, default to true.
    const [isOnline, setIsOnline] = useState<boolean> (
        typeof navigator !== 'undefined' 
            ? navigator.onLine 
            : true

    );

    useEffect(() => {

        // runs when the browser detects that 
        // the internet connection has been resored.
        const goOnline = () => {
            setIsOnline(true)
        };

        // runs when the browser detects that 
        // the internet connection has been lost.
        const goOffline = () => {
            setIsOnline(false)
        };

        // listen for browser online/offline events.
        window.addEventListener(
            'online', 
            goOnline
        );

        window.addEventListener(
            'offline', 
            goOffline
        );

        // cleanUp the event listeners when the 
        // component using this hook is removed.
        return () => {
            window.removeEventListener(
                'online', 
                goOnline
            );

            window.removeEventListener(
                'offline', 
                goOffline
            );

        };

    },[])

    // return the current connection status
    // to whichever component is using the hook.
    return isOnline;
}
