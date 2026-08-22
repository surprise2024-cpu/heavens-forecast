import React from 'react'
import type { CurrentWeather } from '../hooks/useWeather';
import type { ForecastResponse } from '../Services/WeatherAPI';
import { Forecast, type DailyPoint } from '../Forecast/Forecast';
import { Searchbar } from '../Searchbar/Searchbar';
import { TemperatureToggle } from '../TemperatureToggle/TemperatureToggle';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { HeroSection } from '../HeroSection/HeroSection';
import { BentoSection } from '../BentoSection/BentoSection';

interface WeatherViewProps {
    loading: boolean;
    error: string | null;
    onRetry: ()=> void;
    onSearch: (city: string) => void;
    onLocationSearch: () => void;
    unit: string;
    onToggleUnit: () => void;
    displayWeather: CurrentWeather | null;
    displayForecast: ForecastResponse | null;
    forecast: ForecastResponse | null;
    currentWeather: CurrentWeather | null;
    saved: boolean;
    onToggleSave?: () => void;
    onSelectDay: (day: DailyPoint, index: number) => void;
}

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

        {/*TemperatureToggle */}
        <TemperatureToggle 
            unit={unit}
            onToggle={onToggleUnit}
        />

        {
            error && !loading ? (
                <ErrorMessage 
                    message={error}
                    onRetry={onRetry}
                />
            ) : (
                <>
                    {/*Hero */}
                    <HeroSection
                        weather={displayWeather}
                        unit={unit}
                        saved={saved}
                        onToggleSave={onToggleSave}
                    />

                    {/*bento */}
                    <BentoSection 
                        currentWeather={displayWeather}
                        forecast={displayForecast}
                        unit={unit}
                    />

                    {/*6 day forecast */}
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
