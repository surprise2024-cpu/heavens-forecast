import React, { useState } from 'react'

import styles from './WeatherDashboard.module.css'

import { Navbar } from '../Navbar/Navbar';
import { Searchbar } from '../Searchbar/Searchbar';
import { HeroSection } from '../HeroSection/HeroSection';
import { BentoSection } from '../BentoSection/BentoSection';
import { Forecast } from '../Forecast/Forecast';

//Types


export const WeatherDashboard = () => {

  return (
    <div className={styles['weather-app']}>

        <div className={styles['weather-panel']}>

            <div className={styles['weather-grid']}>

                {/*Sidebar*/}
                <Navbar />
                
                {/*Searchbar */}
                <Searchbar />

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
