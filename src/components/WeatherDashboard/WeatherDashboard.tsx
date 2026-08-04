import styles from './WeatherDashboard.module.css'

import { Navbar } from '../Navbar/Navbar';
import { Searchbar } from '../Searchbar/Searchbar';
import { HeroSection } from '../HeroSection/HeroSection';
import { BentoSection } from '../BentoSection/BentoSection';
import { Forecast } from '../Forecast/Forecast';
import  { useWeather } from '../hooks/useWeather';
import type {UseWeatherReturn} from '../hooks/useWeather'
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

    }: UseWeatherReturn = useWeather();

    const handleRetry = () => {
        if(currentWeather) {
            fetchWeatherByCity(currentWeather.name)
        }
        else {
            fetchWeatherByCity('Polokwane')
        }
        
        const city = currentWeather?.name ?? 'Polokwane';
        fetchWeatherByCity(city);
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
                    <HeroSection weather={currentWeather} unit={unit}/>
                    
                    {/*bento */}
                    <BentoSection />


                    {/*7 day forecast */}
                    {forecast && <Forecast />}
                    
                </div>

            </div>
        </div>
    </div>
  );
}
