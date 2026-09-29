import React from 'react'
import type { CurrentWeather } from '../hooks/useWeather';
import type { ForecastResponse } from '../Services/WeatherAPI';
import { Forecast, type DailyPoint } from '../Forecast/Forecast';
import { Searchbar } from '../Searchbar/Searchbar';
import { TemperatureToggle } from '../TemperatureToggle/TemperatureToggle';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { HeroSection } from '../HeroSection/HeroSection';
import { BentoSection } from '../BentoSection/BentoSection';

// Props required by the WeatherView component.
interface WeatherViewProps {

    // Indicates whether weather data is currently loading.
    loading: boolean;

    // Stores the current user-facing error message.
    error: string | null;

    // Runs when the user retries a failed weather request.
    onRetry: ()=> void;

    // Runs when the user searches for a city.
    onSearch: (city: string) => void;

    // Runs when the user requests weather
    // for their current location.
    onLocationSearch: () => void;

    // Currently selected temperature unit.
    unit: 'C' | 'F';

    // Switches between Celsius and Fahrenheit.
    onToggleUnit: () => void;

    // Weather currently being displayed in the UI.
    // This may be live weather or weather for a selected forecast day.
    displayWeather: CurrentWeather | null;

    // Forecast currently being displayed
    // inside the weather detail sections.
    displayForecast: ForecastResponse | null;

    // Main forecast data used by the daily forecast component.
    forecast: ForecastResponse | null;

    // Current live weather data.
    currentWeather: CurrentWeather | null;

    // Indicates whether the current city is saved.
    saved: boolean;

    // Optional function used to save or remove the current city.
    onToggleSave?: () => void;

    // Runs when the user selects a day
    // from the daily forecast.
    onSelectDay: (day: DailyPoint, index: number) => void;
}

// Combines the main weather components into one view.
// This component receives state and handlers from its parent
// and focuses mainly on rendering the correct UI.
export const WeatherView: React.FC<WeatherViewProps> = ({
    loading, 
    error, 
    onRetry,
    onSearch,
    onLocationSearch, 
    unit,
    onToggleUnit, 
    displayWeather, 
    displayForecast, 
    forecast, 
    currentWeather, 
    saved, 
    onToggleSave,
    onSelectDay,
}) => {
  return (
    <>
        {/*Searchbar */}
        <Searchbar 
            onSearch={onSearch}
            onLocationSearch={onLocationSearch}
            loading={loading}
        />

        {/* Temperature unit and theme controls */}
        <TemperatureToggle 
            unit={unit}
            onToggle={onToggleUnit}
        />

        {
            // Show the error screen only when
            // an error exists and loading has finished.
            error && !loading ? (
                <ErrorMessage 
                    message={error}
                    onRetry={onRetry}
                />
            ) : (
                <>
                    {/* Main current-weather summary */}
                    <HeroSection
                        weather={displayWeather}
                        unit={unit}
                        saved={saved}
                        onToggleSave={onToggleSave}
                    />

                    {/* Hourly forecast and air conditions */}
                    <BentoSection 
                        weather={displayWeather}
                        currentWeather={displayWeather}
                        forecast={displayForecast}
                        unit={unit}
                    />

                    {/* Multi-day forecast */}
                    {
                        forecast && (
                            <Forecast 
                                forecast={forecast}
                                unit={unit}
                                weather={currentWeather}
                                onSelectDay={onSelectDay}
                            />

                        )

                    }

                </>

            )

        }

    </>

  );
}
