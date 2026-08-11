import React, { useEffect, useState } from 'react'
import type { SavedLocation } from '../hooks/useSavedLocations'
import { getCurrentWeatherByCoords, type CurrentWeatherResponse } from '../Services/WeatherAPI';
import styles from './Cities.module.css'
import { Loader2, MapPin, Trash2 } from 'lucide-react';
import { Text } from '../Text/Text';
import { formatTemperature, getWeatherIcon, isNightTime } from '../utils/WeatherUtilities';


interface CitiesProps {
    locations: SavedLocation[];
    unit: string;
    onSelectCity: (location: SavedLocation) => void;
    onRemoveCity: (location: SavedLocation) => void;
}

type PreviewEntry = CurrentWeatherResponse | 'loading' | 'error';

function locationKey(loc: Pick<SavedLocation, 'name' | 'country'>): string {
    return `${loc.name}-${loc.country}`.toLowerCase();
}

export const Cities: React.FC<CitiesProps> = ({ locations = [], unit, onSelectCity, onRemoveCity }) => {

    const [previews, setPreviews] = useState<Record<string, PreviewEntry>>({});

    useEffect(() => {
        let cancelled = false;

        locations.forEach((loc) => {
            const key = locationKey(loc);

            setPreviews((prev) => {
                if (prev[key]) return prev;
                    return {...prev, [key]: 'loading'};
            });

            getCurrentWeatherByCoords(loc.lat, loc.lon)
                .then((data) => {
                    if (!cancelled) {
                        setPreviews((prev) => ({ ...prev, [key]: data }));
                    }
                })
                .catch(() => {
                    if (!cancelled) {
                        setPreviews((prev) => ({ ...prev, [key]: 'error' }));
                    }
                });
        });

        return () => {
            cancelled = true;
        };
    }, [locations]);

    if (locations.length === 0) {
        return (
            <div className={styles['cities-empty']}>
                <MapPin size={32} />
                <Text variant='p' className={styles['cities-empty-title']}>No saved cities yet</Text>
                <Text variant='p' className={styles['cities-empty-hint']}>Search for a city and tap the bookmark icon save it here.</Text>
            </div>
        );
    }

  return (
    <div className={styles['cities-list']}>
        {
            locations.map((loc) => {
                const key = locationKey(loc);
                const preview = previews[key];
                const isNight = preview && preview !== 'loading' && preview !== 'error'
                    ? isNightTime(preview.weather[0]?.icon)
                    : false;

                    return (
                        <div key={key} className={styles['city-card']}>
                            <button type='button'
                                className={styles['city-card-main']}
                                onClick={() => onSelectCity(loc)}
                            >
                                <div className={styles['city-card-info']}>
                                    <Text variant='p' className={styles['city-name']}>{loc.name}</Text>
                                    <Text variant='p' className={styles['city-country']}>{loc.state ? `${loc.state}, ` : ''}{loc.country}</Text>
                                </div>

                                <div className={styles['city-card-weather']}>
                                    {
                                        preview === 'loading' || preview === undefined ? (

                                            <Loader2 size={18} className={styles['spinner']} />

                                        ) : preview === 'error' ? (

                                            <Text variant='span' className={styles['city-card-error']}>--</Text>

                                        ) : (
                                            <>
                                                {(() => {
                                                    const Icon = getWeatherIcon(preview.weather[0]);

                                                    return (
                                                        <Icon size={22}
                                                        strokeWidth={1.75}
                                                        className={styles[isNight ? 'icon-night' : 'icon-day']}
                                                    />
                                                    );
                                                })}
                                                <Text variant='span' className={styles['city-card-temp']}>{formatTemperature(preview.main.temp, unit)}°{unit}</Text>
                                            </>
                                        )}
                                </div>
                            </button>

                            <button type='button'
                                className={styles['remove-btn']}
                                onClick={() => onRemoveCity(loc)}
                                aria-label={`Remove ${loc.name}`}
                            >
                                <Trash2 size={16}/>
                            </button>
                        </div>
                    );
            }) }
    </div>
  );
}
