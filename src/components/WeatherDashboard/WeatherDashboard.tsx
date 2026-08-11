import styles from './WeatherDashboard.module.css'

import { Navbar } from '../Navbar/Navbar';
import { Searchbar } from '../Searchbar/Searchbar';
import { HeroSection } from '../HeroSection/HeroSection';
import { BentoSection } from '../BentoSection/BentoSection';
import { Forecast } from '../Forecast/Forecast';
import  { useWeather } from '../hooks/useWeather';
import type {CurrentWeather, UseWeatherReturn} from '../hooks/useWeather'
import { TemperatureToggle } from '../TemperatureToggle/TemperatureToggle';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import type { DailyPoint } from '../Forecast/Forecast'
import { useEffect, useState } from 'react';
import type { ForecastResponse } from '../Services/WeatherAPI';

import { UseNotificationPermission } from '../hooks/UseNotificationPermission';
import { getWeatherAlerts } from '../hooks/WeatherAlerts';
import { WeatherAlertNotifier } from '../hooks/WeatherAlertNotifier';
import { WeatherAlertBanner } from '../WeatherAlertBanner/WeatherAlertBanner';

import { useSavedLocations } from '../hooks/useSavedLocations';
import type { SavedLocation } from '../hooks/useSavedLocations';
import { Cities } from '../Cities/Cities';

function buildDisplayWeather(base: CurrentWeather, day: DailyPoint): CurrentWeather {

    const item = day.representative;

    return {
        ...base,
        main: item.main,
        weather: item.weather, 
        wind: item.wind,
        clouds: item.clouds,
        visibility: item.visibility,
        dt: item.dt,
    };
}

export const WeatherDashboard = () => {

    const {
        currentWeather,
        forecast,
        loading,
        error,
        unit,
        fetchWeatherByCity,
        fetchWeatherByLocation,
        toggleUnit,

    }: UseWeatherReturn = useWeather();

    const [selectedDay, setSelectedDay] = useState<DailyPoint | null>(null);

    const handleSelectDay = (day: DailyPoint, index: number) => {
        setSelectedDay(index === 0 ? null: day); 
    };

    const handleSearch = (city: string) => {
        setSelectedDay(null);
        fetchWeatherByCity(city);
    }

    const handleLocationSearch = () => {
        setSelectedDay(null);
        fetchWeatherByLocation();
    }

    const displayWeather: CurrentWeather | null = 
        selectedDay && currentWeather
            ? buildDisplayWeather(currentWeather, selectedDay)
            : currentWeather;

    const displayForecast: ForecastResponse | null = 
        selectedDay && forecast
            ? { ...forecast, list: selectedDay.items }
            : forecast;

    const handleRetry = () => {
        const city = currentWeather?.name ?? 'Polokwane';
        fetchWeatherByCity(city);
    }

    const {supported, permission, requestPermission } = UseNotificationPermission();

    const alert = getWeatherAlerts(currentWeather);
    WeatherAlertNotifier(alert, permission);

    const [alertDismissed, setAlertDismissed] = useState(false);

    useEffect(() => {
        setAlertDismissed(false);
    }, [alert?.id]);

    const [activeView, setActiveView] = useState<'weather' | 'cities'>('weather')

    const handleNavigate = (label: string) => {
        setActiveView(label === 'Cities' ? 'cities' : 'weather');
    };

    const { locations, isSaved, toggleLocation, removeLocation } = useSavedLocations();

    const currentLocation: SavedLocation | null = currentWeather
    ? {
        name: currentWeather.name,
        country: currentWeather.sys.country,
        lat: currentWeather.coord.lat,
        lon: currentWeather.coord.lon
    } : null;

    const handleToggleSaveCurrent = () => {
        if (currentLocation) toggleLocation(currentLocation);
    };

    const handleSelectCity = (loc: SavedLocation) => {
        setSelectedDay(null);
        setActiveView('weather')
        fetchWeatherByCity(loc.name);
    };

  return (
    <div className={styles['weather-app']}>

        <div className={styles['weather-panel']}>

            <WeatherAlertBanner 
                alert={alert}
                dismissed={alertDismissed}
                notificationsSupported={supported}
                permission={permission}
                onEnableNotifications={requestPermission}
                onDismiss={() => setAlertDismissed(true)}
            /> 

            <div className={styles['weather-grid']}>

                {/*Sidebar*/}
                <Navbar activeLabel={activeView === 'cities' ? 'Cities' : 'Weather'}
                onSelect={handleNavigate}
                />

                {
                    activeView === 'cities' ? (
                        <div className={styles['cities-area']}>
                            <Cities locations={locations}
                                unit={unit}
                                onSelectCity={handleSelectCity}
                                onRemoveCity={removeLocation}
                            />
                        </div>
                    ) : (
                        <>
                            {/*Searchbar */}
                        <Searchbar 
                            onSearch={handleSearch} 
                            onLocationSearch={handleLocationSearch} 
                            loading={loading} 
                        />

                        {/*TemperatureToggle */}
                        <TemperatureToggle 
                            unit={unit} 
                            onToggle={toggleUnit} 
                        />

                        {/*Load spinner*/}
                        {/*<div className={styles['load-spinner']}>*/}
                            {/*Conditional rendering*/}
                            {
                                error && !loading ? (
                                    
                                    <ErrorMessage 
                                        message={error} 
                                        onRetry={handleRetry}
                                    />
                                    
                                ): (
                                    <>
                                        {/*Hero */}
                                        <HeroSection 
                                            weather={displayWeather} 
                                            unit={unit}
                                            saved={currentLocation ? isSaved(currentLocation) : false}
                                            onToggleSave={currentLocation ? handleToggleSaveCurrent : undefined}
                                        />
                                        
                                        {/*bento */}
                                        <BentoSection 
                                            currentWeather={displayWeather} 
                                            forecast={displayForecast}
                                            unit={unit}
                                        />


                                        {/*7 day forecast */}
                                        {forecast && 
                                        <Forecast 
                                            forecast={forecast} 
                                            unit={unit} 
                                            weather={currentWeather}
                                            onSelectDay={handleSelectDay}
                                        />}
                                    </>
                                )
                            }
                        </>
                    )
                }
                
                
                    
                {/*</div>*/}

            </div>
        </div>
    </div>
  );
}
 