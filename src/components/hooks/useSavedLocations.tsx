import { useCallback, useEffect, useState } from 'react'

// represents a location saved by the user.
export interface SavedLocation {
    name: string;
    country: string;

    // geographic coordinates used for weather requests.
    lat: number;
    lon: number;
    state?: string;
}

// key used when storing saved locations in localStorage.
const STORAGE_KEY = 'weather-app:saved-locations';

// loads previously saved locations from localStorage
function loadFromStorage(): SavedLocation[] {
    try {
        // get sthe saved json string.
        const raw = localStorage.getItem(STORAGE_KEY);

        // if nothing has been saved yet, return an empty list.
        if (!raw) return [];

        // convert the stored json string back into javascript data
        const parsed = JSON.parse(raw);

        // only return the value if it is actualy an array.
        return Array.isArray(parsed) ? parsed : [];

    }
    catch (err) {

        // if parsing or storage access fails, 
        // return an empty array instead of crashing the app
        console.error('Failed to load saved locations:', err);
        return [];
    }
}

// creates a consistent identifier for a location.
//
// this allows the hook to compare aved locations
// without comparing the whole object.
function locationId(

    loc: Pick<SavedLocation, 'name' | 'country'>

): string {

    return `${loc.name}-${loc.country}`.toLowerCase();
}

// describes everything returned by the custom hook
interface UseSavedLocationsReturn {

    // all currently saved locations
    locations: SavedLocation[];

    // checks whther a location has already been saved.
    isSaved: (loc: Pick<SavedLocation, 'name' | 'country'>) => boolean;
    
    // adds a location to the saved list
    savedLocation: (loc: SavedLocation) => void;

    // removes a location from the saved list
    removeLocation: (loc: Pick<SavedLocation, 'name' | 'country'>) => void;
    
    // adds the locaion if it is not saved,
    // or removes it if it already exists.
    toggleLocation: (loc: SavedLocation) => void;
}

// custom hook tha tmanages saed weather locations
export function useSavedLocations(): UseSavedLocationsReturn {
 
    // load saved locations once when the hook is first
    // passing a function to useState means loadfFromStorage()
    // only runs during the initial state setup
    const [locations, setLocations] = 
    useState<SavedLocation[]>(
        () => loadFromStorage()
    );

    useEffect(() => {
        try {

            // save the locatons array whenever it changes 
            // local storage can only store strings
            // so the array must first be converted into json
            localStorage.setItem(
                STORAGE_KEY, 
                JSON.stringify(locations)
            );
        }
        catch (err) {
            console.error('Failed to save locations:', err);
        }
    }, [locations]);

    // checks whether a location already exists
    // inside the saved location array
    const isSaved = useCallback(
        (loc: Pick<SavedLocation, 'name' | 'country'>) =>
            locations.some((l) => locationId(l) === locationId(loc)),

        // recrate this callback whenever
        // the locatons array changes
        [locations]
    );

    // adds a new location to the saved list.
    const savedLocation = useCallback((loc: SavedLocation) => {
        setLocations((prev) => {

            // not add the location again
            // if it has already been saved
            if (prev.some((l) => locationId(l) === locationId(loc))) return prev;
            
            // create a new array containing
            // all preivous locations plus the new one.
            return [...prev, loc];
        });
    }, []);

    // removes a location from the saved list.
    const removeLocation = useCallback(
        (
            loc: Pick<
                SavedLocation, 
                'name' | 'country'
            >
        ) => {

        setLocations((prev) => 

            // keep every locaion except 
            // the one being removed.
            prev.filter(
                (l) => 
                    locationId(l) !== 
                locationId(loc)
            )
        );

    }, []);

    // toggles a location between saved and unsaved.
    const toggleLocation = useCallback(
        (loc: SavedLocation) => {

            setLocations((prev) => {

                // check whether the location
                // currently exists in the saved list.
                const exists = prev.some(
                    (l) => locationId(l) === 
                    locationId(loc)
                );

                // if it already exist, remoe it.
                // otherwise, add it.
                return exists
                    ? prev.filter(
                        (l) => 
                            locationId(l) !== 
                        locationId(loc)
                    )
                    : [...prev, loc];
            }
        );
    }, []);

    // expose the saved locations and helper functions
    // to components using this hook
    return { 
        locations, 
        isSaved, 
        savedLocation, 
        removeLocation, 
        toggleLocation 
    };

}
