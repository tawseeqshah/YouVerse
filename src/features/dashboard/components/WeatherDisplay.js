import React from 'react';
import { FaSun, FaCloud, FaCloudRain, FaMosque, FaMoon } from 'react-icons/fa';
import { WiSunrise, WiSunset } from 'react-icons/wi';
import { motion } from 'framer-motion';
import { useLocation } from '../../../hooks/useLocation';
import { WeatherLoader } from '../../../components/LoadingAnimations';
import { convertTo12Hour } from '../../../utils/timeFormat';

function WeatherDisplay({ weather, prayerTimes }) {
  const { location, error: locationError, loading: locationLoading } = useLocation();

  if (locationLoading) {
    return <WeatherLoader />;
  }

  if (locationError) {
    return (
      <motion.div className="weather-prayer-info error">
        <div className="error-message">
          Unable to get location. Please enable location services and try again.
        </div>
      </motion.div>
    );
  }

  if (!weather || !location) return null;

  const getWeatherIcon = (condition) => {
    // Map weather conditions to appropriate icons
    switch(condition.toLowerCase()) {
      case 'clear': return <FaSun className="weather-icon" />;
      case 'clouds': return <FaCloud className="weather-icon" />;
      case 'rain': return <FaCloudRain className="weather-icon" />;
      // Add more conditions as needed
      default: return <FaSun className="weather-icon" />;
    }
  };

  // Use prayer times data for sunrise/sunset with 12-hour format
  const sunTimes = {
    sunrise: convertTo12Hour(prayerTimes?.sunrise) || convertTo12Hour(weather.sunrise),
    sunset: convertTo12Hour(prayerTimes?.sunset) || convertTo12Hour(weather.sunset)
  };

  return (
    <motion.div 
      className="weather-prayer-info"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="weather-display"
        whileHover={{ scale: 1.02 }}
      >
        {getWeatherIcon(weather.condition)}
        <div className="weather-info">
          <motion.div 
            className="temperature"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {weather.temperature}°C
          </motion.div>
          <motion.div 
            className="weather-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {weather.description}
          </motion.div>
          <motion.div 
            className="feels-like"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Feels like: {weather.feelsLike}°C
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        className="sun-info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="sun-item">
          <WiSunrise className="sun-icon" />
          <span>{sunTimes.sunrise}</span>
        </div>
        <div className="sun-item">
          <WiSunset className="sun-icon" />
          <span>{sunTimes.sunset}</span>
        </div>
      </motion.div>

      {weather.forecast && (
        <motion.div 
          className="weather-forecast"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h4>Today's Forecast</h4>
          <div className="forecast-items">
            {weather.forecast.map((item, index) => (
              <motion.div
                key={index}
                className="forecast-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + (index * 0.1) }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="forecast-time">{item.time}</div>
                {getWeatherIcon(item.condition)}
                <div className="forecast-temp">{item.temp}°C</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div 
        className="next-prayer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: 0.8,
          type: "spring",
          stiffness: 100
        }}
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)"
        }}
      >
        <FaMosque className="prayer-icon" />
        <div className="prayer-info">
          <div className="prayer-label">Next Prayer:</div>
          <div className="prayer-time">
            {weather.nextPrayer} - {convertTo12Hour(weather.nextPrayerTime)}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default WeatherDisplay; 