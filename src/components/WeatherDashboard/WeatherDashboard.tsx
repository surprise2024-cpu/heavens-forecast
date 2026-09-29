import styles from './WeatherDashboard.module.css'

import { Navbar } from '../Navbar/Navbar';
import  { useWeather } from '../hooks/useWeather';
import type {CurrentWeather, UseWeatherReturn} from '../hooks/useWeather'
import type { DailyPoint } from '../Forecast/Forecast'
import { useEffect, useState } from 'react';
import type { ForecastResponse } from '../Services/WeatherAPI';

import { useNotificationPermission } from '../hooks/UseNotificationPermission';
import { getWeatherAlerts } from '../hooks/WeatherAlerts';
import { useWeatherAlertNotifier } from '../hooks/WeatherAlertNotifier';
import { WeatherAlertBanner } from '../WeatherAlertBanner/WeatherAlertBanner';

import { useSavedLocations } from '../hooks/useSavedLocations';
import type { SavedLocation } from '../hooks/useSavedLocations';
import { Cities } from '../Cities/Cities';
import { Navigate, Route, Routes, useNavigate } from 'react-router';
import { WeatherView } from './WeatherView';

// Creates temporary display weather for a selected forecast day.
// The current city's basic information is kept,
// while weather values are replaced with the selected day's data.
function buildDisplayWeather(

    base: CurrentWeather, 
    day: DailyPoint

): CurrentWeather {

    // Forecast entry chosen to represent the selected day.
    const item = day.representative;

    return {

        // Keep city information such as name,
        // coordinates and country from current weather.
        ...base,

        // Replace current-weather values with
        // the selected forecast day's values.
        main: item.main,
        weather: item.weather, 
        wind: item.wind,
        clouds: item.clouds,
        visibility: item.visibility,
        dt: item.dt,
    };
}

// Main dashboard responsible for coordinating
// weather state, routing, alerts and saved locations.
export const WeatherDashboard = () => {

    // Get the main weather state and actions
    // from the custom useWeather hook.
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

    // Stores the forecast day currently selected by the user.
    // null means the UI should display current weather.
    const [selectedDay, setSelectedDay] = 
        useState<DailyPoint | null>(null);

    // Handles selecting a day from the daily forecast.
    const handleSelectDay = (

        day: DailyPoint, 
        index: number

    ) => {

        // Selecting the first forecast entry ("Today")
        // returns the UI to the real current weather.
        setSelectedDay(index === 0 ? null: day); 
    };

    // Search for weather using a city name.
    const handleSearch = (city: string) => {

        // Clear any previously selected forecast day.
        setSelectedDay(null);
        fetchWeatherByCity(city);
    }

    // Search for weather using the user's location.
    const handleLocationSearch = () => {

        // Return to the current weather view.
        setSelectedDay(null);
        fetchWeatherByLocation();
    }

    // Determine which weather data should currently
    // be shown in the hero and detail sections.
    const displayWeather: CurrentWeather | null = 

        selectedDay && currentWeather

            // Build temporary weather using
            // the selected forecast day.
            ? buildDisplayWeather(currentWeather, selectedDay)

            // Otherwise display real current weather.
            : currentWeather;

    // Determine which forecast entries should
    // be displayed inside the detail sections.
    const displayForecast: ForecastResponse | null = 
        selectedDay && forecast

            // Keep the forecast structure but replace
            // its list with entries for the selected day.
            ? { ...forecast, list: selectedDay.items }
            : forecast;

    // Retry the weather request for the currently loaded city.
    const handleRetry = () => {

       setSelectedDay(null);

        fetchWeatherByLocation();
    }

    // Browser notification permission state.
    const {

        supported, 
        permission, 
        requestPermission 

    } = useNotificationPermission();

    // Generate an alert from the current weather.
    const alert = 
        getWeatherAlerts(currentWeather);

    // Trigger a browser notification when
    // a new alert is available.
    useWeatherAlertNotifier(
        alert, 
        permission
    );

    // Tracks whether the current alert banner
    // has been dismissed by the user.
    const [
        alertDismissed, 
        setAlertDismissed
    ] = useState(false);

    useEffect(() => {

        // Whenever a completely new alert arrives,
        // allow the alert banner to appear again.
        setAlertDismissed(false);

    }, [alert?.id]);

    // Saved location state and helper functions.
    const { 
        locations, 
        isSaved, 
        toggleLocation, 
        removeLocation 
    } = useSavedLocations();

    // Convert the currently loaded weather
    // into the SavedLocation structure.
    const currentLocation: SavedLocation | null = currentWeather
    ? {
        name: currentWeather.name,
        country: currentWeather.sys.country,
        lat: currentWeather.coord.lat,
        lon: currentWeather.coord.lon
    } : null;

    // Save or remove the currently loaded location.
    const handleToggleSaveCurrent = () => {

        if (currentLocation) {

            toggleLocation(currentLocation);

        }

    };

    const navigate = useNavigate();
    // Load weather when the user selects
    // one of their saved cities.
    const handleSelectCity = (loc: SavedLocation) => {

        // Clear selected forecast-day state.
        setSelectedDay(null);

        // Fetch weather for the selected city.
        fetchWeatherByCity(loc.name);

        navigate('/');

    };

  return (
    <div className={styles['weather-app']}>

        <div className={styles['weather-panel']}>

            {/* Severe weather alert banner */}
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
                <Navbar />

                {/* Application routes */}
                <Routes>
                    <Route path='/' element={
                            <WeatherView 
                                loading={loading}
                                error={error}
                                onRetry={handleRetry}
                                onSearch={handleSearch}
                                onLocationSearch={handleLocationSearch}
                                unit={unit}
                                onToggleUnit={toggleUnit}
                                displayWeather={displayWeather}
                                displayForecast={displayForecast}
                                forecast={forecast}
                                currentWeather={currentWeather}

                                // Check whether the current city
                                // has already been saved.
                                saved={currentLocation ? isSaved(currentLocation): false}

                                // Only provide the save handler
                                // when a valid current location exists.
                                onToggleSave={
                                    currentLocation 
                                        ? handleToggleSaveCurrent 
                                        : undefined
                                }
                                onSelectDay={handleSelectDay}
                            />

                        }
                    />

                    {/* Saved cities page */}
                    <Route 
                        path='/cities' 
                        element={
                            <div className={styles['cities-area']}>
                                <Cities 
                                    locations={locations}
                                    unit={unit}
                                    onSelectCity={handleSelectCity}
                                    onRemoveCity={removeLocation}
                                />
                            </div>

                        }

                    />

                    {/*Future add on */}
                    {/*<Route path='/map' element={
                        <div>

                        </div>
                    }/>

                    <Route path='/settings' element={
                        <div>
                            
                        </div>
                    }/>*/}

                    {/* Redirect unknown routes back to home. */}
                    <Route path='*' element={<Navigate to='/' />}/>
                    
                </Routes>

            </div>

        </div>

    </div>

  );

}
 