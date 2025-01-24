import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WiDaySunny, WiNightClear, WiCloudy, WiRain, WiSunrise, WiSunset, WiStrongWind, WiHumidity, WiDayCloudyHigh, WiNightAltCloudyHigh, WiDayRain, WiNightRain, WiDaySnow, WiNightSnow, WiDayThunderstorm, WiNightThunderstorm, WiDayFog, WiNightFog } from 'react-icons/wi';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useLocation } from '../../hooks/useLocation';
import { fetchWeather } from '../../services/weatherService';
import { reverseGeocode } from '../../services/geocodingService';
import { WeatherLoader } from '../../components/LoadingAnimations';
import './styles/Weather.css';

function WeatherPage() {
  const [weather, setWeather] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);
  const { location } = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (location) {
        setLoading(true);
        setError(null);
        try {
          const [weatherData, locationData] = await Promise.all([
            fetchWeather(location.latitude, location.longitude),
            reverseGeocode(location.latitude, location.longitude)
          ]);
          
          setWeather(weatherData);
          setLocationDetails(locationData);
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Failed to load weather data. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    }
    
    fetchData();
  }, [location]);

  const getWeatherIcon = (condition, isDay, size = 24) => {
    const iconProps = {
      size,
      className: "weather-icon"
    };

    switch(condition?.toLowerCase()) {
      case 'clear-day':
        return <WiDaySunny {...iconProps} />;
      case 'clear-night':
        return <WiNightClear {...iconProps} />;
      case 'partly-cloudy-day':
        return <WiDayCloudyHigh {...iconProps} />;
      case 'partly-cloudy-night':
        return <WiNightAltCloudyHigh {...iconProps} />;
      case 'cloudy':
        return <WiCloudy {...iconProps} />;
      case 'rain':
        return isDay ? <WiDayRain {...iconProps} /> : <WiNightRain {...iconProps} />;
      case 'snow':
        return isDay ? <WiDaySnow {...iconProps} /> : <WiNightSnow {...iconProps} />;
      case 'thunder-rain':
      case 'thunder-showers-day':
      case 'thunder-showers-night':
        return isDay ? <WiDayThunderstorm {...iconProps} /> : <WiNightThunderstorm {...iconProps} />;
      case 'fog':
        return isDay ? <WiDayFog {...iconProps} /> : <WiNightFog {...iconProps} />;
      default:
        return isDay ? <WiDaySunny {...iconProps} /> : <WiNightClear {...iconProps} />;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) return <WeatherLoader />;
  if (error) return <div className="error-message">{error}</div>;
  if (!weather || !weather.current) return <div className="error-message">No weather data available</div>;

  return (
    <motion.div 
      className="weather-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {locationDetails && (
        <motion.div 
          className="location-info"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <FaMapMarkerAlt />
          <span>{locationDetails.city}, {locationDetails.state}</span>
          <div className="coordinates">
            {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
          </div>
        </motion.div>
      )}

      <motion.div 
        className="current-weather"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="main-info">
          <motion.div
            className="weather-icon-large"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {getWeatherIcon(weather.current.icon, weather.current.isDay, 64)}
          </motion.div>
          <h1>{Math.round(weather.current.temperature)}°C</h1>
          <p className="conditions">{weather.current.conditions}</p>
          <p>Feels like {Math.round(weather.current.feelsLike)}°C</p>
        </div>
        
        <div className="weather-details">
          <div className="detail-item">
            <WiStrongWind />
            <span>{weather.current.windSpeed} km/h</span>
          </div>
          <div className="detail-item">
            <WiHumidity />
            <span>{weather.current.humidity}%</span>
          </div>
          <div className="detail-item">
            <WiCloudy />
            <span>{weather.current.cloudCover}%</span>
          </div>
          <div className="detail-item">
            <span>UV</span>
            <span>{weather.current.uvIndex}</span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="sun-times"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="sun-item">
          <WiSunrise size={32} className="sun-icon" />
          <div className="sun-info">
            <span className="sun-label">Sunrise</span>
            <span className="sun-time">{formatTime(weather.daily.sunrise)}</span>
          </div>
        </div>
        <div className="sun-item">
          <WiSunset size={32} className="sun-icon" />
          <div className="sun-info">
            <span className="sun-label">Sunset</span>
            <span className="sun-time">{formatTime(weather.daily.sunset)}</span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="hourly-forecast"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2>Hourly Forecast</h2>
        <div className="forecast-scroll">
          {weather.hourlyForecast.map((hour, index) => (
            <motion.div 
              key={index}
              className="forecast-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <span className="time">{hour.time}</span>
              {getWeatherIcon(hour.icon, hour.isDay)}
              <span className="temp">{Math.round(hour.temperature)}°C</span>
              <span className="precip">{hour.precipitation}%</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default WeatherPage; 