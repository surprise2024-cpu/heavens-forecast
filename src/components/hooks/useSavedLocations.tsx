import React, { useCallback, useEffect, useState } from 'react'

export interface SavedLocation {
    name: string;
    country: string;
    lat: number;
    lon: number;
    state?: string;
}

const STORAGE_KEY = 'weather-app:saved-locations';

function loadFromStorage(): SavedLocation[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (!raw) return [];

        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];

    }
    catch (err) {
        console.error('Failed to load saved locations:', err);
        return [];
    }
}

function locationId(loc: Pick<SavedLocation, 'name' | 'country'>): string {
    return `${loc.name}-${loc.country}`.toLowerCase();
}

interface UseSavedLocationsReturn {
    locations: SavedLocation[];
    isSaved: (loc: Pick<SavedLocation, 'name' | 'country'>) => boolean;
    savedLocation: (loc: SavedLocation) => void;
    removeLocation: (loc: Pick<SavedLocation, 'name' | 'country'>) => void;
    toggleLocation: (loc: SavedLocation) => void;
}

export function useSavedLocations(): UseSavedLocationsReturn {
 
    const [locations, setLocations] = useState<SavedLocation[]>(() => loadFromStorage());

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
        }
        catch (err) {
            console.error('Failed to save locations:', err);
        }
    }, [locations]);

    const isSaved = useCallback(
        (loc: Pick<SavedLocation, 'name' | 'country'>) =>
            locations.some((l) => locationId(l) === locationId(loc)),
        [locations]
    );

    const savedLocation = useCallback((loc: SavedLocation) => {
        setLocations((prev) => {
            if (prev.some((l) => locationId(l) === locationId(loc))) return prev;
            return [...prev, loc];
        });
    }, []);

    const removeLocation = useCallback((loc: Pick<SavedLocation, 'name' | 'country'>) => {
        setLocations((prev) => prev.filter((l) => locationId(l) !== locationId(loc)));
    }, []);

    const toggleLocation = useCallback((loc: SavedLocation) => {
        setLocations((prev) => {
            const exists = prev.some((l) => locationId(l) === locationId(loc));
            return exists
                ? prev.filter((l) => locationId(l) !== locationId(loc))
                : [...prev, loc];
        });
    }, []);

    return { 
        locations, 
        isSaved, 
        savedLocation, 
        removeLocation, 
        toggleLocation 
    };

}
