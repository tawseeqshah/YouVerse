import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { WiDaySunny, WiNightClear, WiCloudy, WiRain } from 'react-icons/wi';
import { useLocation } from '../../../hooks/useLocation';
import { fetchWeather } from '../../../services/weatherService';
import './GreetingSection.css';
import { convertTo12Hour } from '../../../utils/timeFormat';

function GreetingSection({ islamicDate, nextPrayer }) {
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const { user } = useAuth();
  const { location } = useLocation();
  const navigate = useNavigate();
  
  const firstName = user?.displayName?.split(' ')[0] || 'Guest';

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) setGreeting('Good Morning');
      else if (hour >= 12 && hour < 17) setGreeting('Good Afternoon');
      else if (hour >= 17 && hour < 21) setGreeting('Good Evening');
      else setGreeting('Good Night');
    };

    if (location) {
      fetchWeather(location.latitude, location.longitude)
        .then(setWeather)
        .catch(console.error);
    }

    updateGreeting();
    const interval = setInterval(() => {
      setCurrentDate(new Date());
      updateGreeting();
    }, 60000);

    return () => clearInterval(interval);
  }, [location]);

  const getWeatherIcon = () => {
    if (!weather) return null;
    
    const { cloudCover, isDay } = weather.current;
    const size = 36;
    
    if (cloudCover < 25) {
      return isDay ? 
        <WiDaySunny size={size} /> : 
        <WiNightClear size={size} />;
    }
    if (cloudCover < 75) {
      return <WiCloudy size={size} />;
    }
    return <WiRain size={size} />;
  };

  const gregorianDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(currentDate);

  const handleWeatherClick = () => {
    navigate('/weather'); // Navigate to the weather details page
  };

  return (
    <motion.div 
      className="welcome-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="welcome-header">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 0.6,
            ease: "easeOut"
          }}
        >
          <motion.span
            className="greeting-highlight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6,
              delay: 0.2,
              ease: "easeOut"
            }}
          >
            {greeting}
          </motion.span>
          {", "}
          <motion.span
            className="greeting-name"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {firstName}
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ color: 'var(--text-primary)' }}
          >
            !
          </motion.span>
        </motion.h1>
        {weather && (
          <motion.div 
            className="weather-preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={handleWeatherClick}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            {getWeatherIcon()}
            <div className="weather-info">
              <span className="temperature">
                {Math.round(weather.current.temperature)}°C
              </span>
              <span className="feels-like">
                Feels like {Math.round(weather.current.feelsLike)}°C
              </span>
            </div>
          </motion.div>
        )}
      </div>
      
      <div className="date-prayer-container">
        <div className="dates-container">
          <div className="date-display">
            <i className="fas fa-calendar"></i>
            <span>{gregorianDate}</span>
          </div>
          <div className="islamic-date">
            <i className="fas fa-star-and-crescent"></i>
            <span>{islamicDate}</span>
          </div>
        </div>

        {nextPrayer && (
          <div className="next-prayer">
            <i className="fas fa-clock"></i>
            <div className="prayer-info">
              <span className="prayer-label">Next Prayer</span>
              <span className="prayer-time">
                {nextPrayer.name} - {convertTo12Hour(nextPrayer.time)}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default GreetingSection; 