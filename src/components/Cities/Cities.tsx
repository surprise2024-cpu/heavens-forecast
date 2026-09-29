import React, { useEffect, useState } from 'react'
import type { SavedLocation } from '../hooks/useSavedLocations'
import { getCurrentWeatherByCoords, type CurrentWeatherResponse } from '../Services/WeatherAPI';
import styles from './Cities.module.css'
import { Loader2, MapPin, Trash2 } from 'lucide-react';
import { Text } from '../Text/Text';
import { formatTemperature, getWeatherIcon, isNightTime } from '../utils/WeatherUtilities';

// props required b the cities component.
interface CitiesProps {
    //list of cities saved by the user
    locations: SavedLocation[];

    // currently selected teperature unit.
    unit: 'C' | 'F';

    // rus when the user selects one of their saved cities.
    onSelectCity: (location: SavedLocation) => void;

    // runs when the user removes a city from their saved list.
    onRemoveCity: (location: SavedLocation) => void;
}

// represents the possible states of a city's weather preview.
//
// the value can either contain
// - actual weather data
// - a loading state
// - an error state
type PreviewEntry = CurrentWeatherResponse | 'loading' | 'error';

// creates a consistent key for each saved location.
//
// this is used when storing weather previews and when rendering
// each city inside the list
function locationKey(loc: SavedLocation): string {
    return `${loc.name}-${loc.lat}-${loc.lon}`.toLowerCase();
}

// displays the user's saved cities together with a small
// current-weather preview for each location.
export const Cities: React.FC<CitiesProps> = ({ 

    locations = [], 
    unit, 
    onSelectCity, 
    onRemoveCity 

}) => {

    // stores the weather preview for every saved city.
    const [previews, setPreviews] = useState<Record<string, PreviewEntry>>({});

    useEffect(() => {

        // prevents state updates if the componenet is removed
        // before an API request finshes.
        let cancelled = false;

        // fetch current weather for every saved city
        locations.forEach((loc) => {
            const key = locationKey(loc);

            // mark the city as loading if it does not already
            // have a preview stored.
            setPreviews((prev) => {
                if (prev[key]) return prev;
                    return {...prev, [key]: 'loading'};
            });

            // requests the city's curent weather using
            // its saved latitude and longitude.
            getCurrentWeatherByCoords(loc.lat, loc.lon)
                .then((data) => {

                    // only update state while the component
                    // is still mounted.
                    if (!cancelled) {
                        setPreviews((prev) => ({ ...prev, [key]: data }));
                    }
                })
                .catch(() => {

                    // store an error state if the weather 
                    // request fails.
                    if (!cancelled) {
                        setPreviews((prev) => ({ ...prev, [key]: 'error' }));
                    }
                });
        });

        // cleanup runs when the component unmounts
        // or when the locations array changes.+
        return () => {
            cancelled = true;
        };

    }, [locations]);

    // display an empty-state message when the user
    // has not saved any cities yet.
    if (locations.length === 0) {
        return (
            <div className={styles['cities-empty']}>
                <MapPin size={32} />
                <Text variant='p' className={styles['cities-empty-title']}>No saved cities yet</Text>
                <Text variant='p' className={styles['cities-empty-hint']}>Search for a city and tap the bookmark icon to save it here.</Text>
            </div>
        );
    }

  return (
        <div className={styles['cities-list']}>
            {
                locations.map((loc) => {

                    // creates a key used to find the city's preview
                    const key = locationKey(loc);

                    // get the currentpreview state for the city.
                    const preview = previews[key];

                    // only check whether it is night time once
                    // valid weather data has been loaded.
                    const isNight = preview && preview !== 'loading' && preview !== 'error'
                        ? isNightTime(preview.weather[0]?.icon)
                        : false;

                        return (
                            <div
                                key={key} 
                                className={styles['city-card']}
                            >
                                {/* MAIN CLICKABLE AREA USED TO SELECT THE CITY */}
                                <button type='button'
                                    className={styles['city-card-main']}
                                    onClick={() => onSelectCity(loc)}
                                >
                                    {/* saved  city information */}
                                    <div className={styles['city-card-info']}>
                                        <Text variant='p' className={styles['city-name']}>{loc.name}</Text>
                                        <Text variant='p' className={styles['city-country']}>{loc.state ? `${loc.state}, ` : ''}{loc.country}</Text>
                                    </div>

                                    {/* weather preview for the saved city */}
                                    <div className={styles['city-card-weather']}>
                                        {
                                            // show a spinner while the prevew 
                                            // is still being fetched
                                            preview === 'loading' || preview === undefined ? (

                                                <Loader2 size={18} className={styles['spinner']} />

                                                // show a simple fallback when
                                                // the weather request fails.
                                            ) : preview === 'error' ? (

                                                <Text variant='span' className={styles['city-card-error']}>--</Text>

                                                // display the city's weather once 
                                                // valid data has been returned.
                                            ) : (
                                                <>
                                                    {
                                                        (() => {

                                                            // choose the correct weather 
                                                            // icon from the API condition.
                                                            const Icon = getWeatherIcon(preview.weather[0]);

                                                            return (
                                                                <Icon size={22}
                                                                    strokeWidth={1.75}
                                                                    className={
                                                                        styles[
                                                                            isNight 
                                                                                ? 'icon-night' 
                                                                                : 'icon-day'
                                                                        ]
                                                                    }
                                                                />
                                                            );

                                                        })()

                                                    }

                                                    {/* current city temperature */}
                                                    <Text 
                                                        variant='span' 
                                                        className={styles['city-card-temp']}
                                                    >
                                                        {
                                                            formatTemperature(
                                                                preview.main.temp, 
                                                            unit)

                                                        }°{unit}

                                                    </Text>
                                                </>
                                            )
                                        }

                                    </div>

                                </button>

                                {/* remove the city from savd locations. */}
                                <button 
                                    type='button'
                                    className={styles['remove-btn']}
                                    onClick={() => onRemoveCity(loc)}
                                    aria-label={`Remove ${loc.name}`}
                                >
                                    <Trash2 size={16}/>

                                </button>

                            </div>

                        );

                }) 
            }

        </div>

    );

}
