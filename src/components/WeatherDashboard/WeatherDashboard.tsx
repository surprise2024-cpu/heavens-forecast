import React, { useState } from 'react'

import styles from './WeatherDashboard.module.css'

import { Navbar } from '../Navbar/Navbar';
import { Searchbar } from '../Searchbar/Searchbar';
import { HeroSection } from '../HeroSection/HeroSection';
import { BentoSection } from '../BentoSection/BentoSection';
import { Forecast } from '../Forecast/Forecast';
import { useWeather } from '../hooks/useWeather';
import { TemperatureToggle } from '../TemperatureToggle/TemperatureToggle';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';


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

    } = useWeather();

    const handleRetry = () => {
        if(currentWeather) {
            fetchWeatherByCity(currentWeather.name)
        }
        else {
            fetchWeatherByCity('Polokwane')
        }
    }

  return (
    <div className={styles['weather-app']}>

        <div className={styles['weather-panel']}>

            <div className={styles['weather-grid']}>

                {/*Sidebar*/}
                <Navbar />
                
                {/*Searchbar */}
                <Searchbar 
                    onSearch={fetchWeatherByCity} 
                    onLocationSearch={fetchWeatherByLocation} 
                    loading={loading} 
                />
                {/*TemperatureToggle */}
                <TemperatureToggle unit={unit} onToggle={toggleUnit} />

                {/*Load spinner*/}
                <div className={styles['load-spinner']}>
                    {/*Conditional rendering*/}
                    {
                        error && !loading && (
                            <div>
                                <ErrorMessage message={error} onRetry={handleRetry}/>
                            </div>
                        )
                    }

                    {/*Hero */}
                    <HeroSection />
                    
                    {/*bento */}
                    <BentoSection />


                    {/*7 day forecast */}
                    <Forecast />
                    
                </div>

                

            </div>
        </div>
    </div>
  );
}
