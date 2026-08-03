import React, { useState } from 'react'

import styles from './WeatherDashboard.module.css'

import { Navbar } from '../Navbar/Navbar';
import { Searchbar } from '../Searchbar/Searchbar';
import { HeroSection } from '../HeroSection/HeroSection';
import { BentoSection } from '../BentoSection/BentoSection';
import { Forecast } from '../Forecast/Forecast';
import { useWeather } from '../hooks/useWeather';
import { TemperatureToggle } from '../TemperatureToggle/TemperatureToggle';


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


  return (
    <div className={styles['weather-app']}>

        <div className={styles['weather-panel']}>

            <div className={styles['weather-grid']}>

                {/*Sidebar*/}
                <Navbar />
                
                {/*Searchbar */}
                <div>
                    <Searchbar 
                        onSearch={fetchWeatherByCity} 
                        onLocationSearch={fetchWeatherByLocation} 
                        loading={loading} 
                    />
                    {/*Temperature Toggle */}
                    <TemperatureToggle unit={unit} onToggle={toggleUnit} />
                </div>
                

                {/*Hero */}
                <HeroSection />
                
                {/*bento */}
                <BentoSection />


                {/*7 day forecast */}
                <Forecast />

            </div>
        </div>
    </div>
  );
}
