import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useLocation } from '../../hooks/useLocation';
import { PrayerTimesLoader } from '../../components/LoadingAnimations';
import { convertTo12Hour } from '../../utils/timeFormat';
import './styles/PrayerTimes.css';

function PrayerTimesPage() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [islamicDate, setIslamicDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { location, error: locationError } = useLocation();

  const fetchPrayerTimes = async () => {
    try {
      if (!location) return;
      
      const { data } = await axios.get(
        `http://api.aladhan.com/v1/timings/${Math.floor(Date.now() / 1000)}`,
        {
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
            method: 2,
          },
        }
      );
      setPrayerTimes(data.data.timings);
      setIslamicDate(data.data.date.hijri);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch prayer times. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      fetchPrayerTimes();
    }
  }, [location]);

  if (loading || !location) {
    return <PrayerTimesLoader />;
  }

  if (error || locationError) {
    return (
      <div className="prayer-times-error">
        {error || "Unable to get location. Please check your location settings."}
      </div>
    );
  }

  const fardPrayers = [
    { name: 'Fajr', time: convertTo12Hour(prayerTimes?.Fajr), icon: 'fa-sun' },
    { name: 'Zuhr', time: convertTo12Hour(prayerTimes?.Dhuhr), icon: 'fa-sun' },
    { name: 'Asr', time: convertTo12Hour(prayerTimes?.Asr), icon: 'fa-sun' },
    { name: 'Maghrib', time: convertTo12Hour(prayerTimes?.Maghrib), icon: 'fa-moon' },
    { name: 'Isha', time: convertTo12Hour(prayerTimes?.Isha), icon: 'fa-moon' },
  ];

  const nafilPrayers = [
    { name: 'Tahajjud', time: 'Last 1/3 of night', icon: 'fa-moon' },
    { name: 'Ishraq', time: '15-20 mins after sunrise', icon: 'fa-sun' },
    { name: 'Chasht', time: '15-20 mins before noon', icon: 'fa-sun' },
  ];

  const otherTimes = [
    { name: 'Sunrise', time: convertTo12Hour(prayerTimes?.Sunrise), icon: 'fa-sunrise' },
    { name: 'Sunset', time: convertTo12Hour(prayerTimes?.Sunset), icon: 'fa-sunset' },
    { name: 'Sehri Ends', time: convertTo12Hour(prayerTimes?.Imsak), icon: 'fa-utensils' },
    { name: 'Iftar Time', time: convertTo12Hour(prayerTimes?.Maghrib), icon: 'fa-utensils' },
  ];

  return (
    <div className="prayer-times-page">
      <motion.div 
        className="islamic-date-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Islamic Date</h2>
        <p>{`${islamicDate?.day} ${islamicDate?.month.en} ${islamicDate?.year} AH`}</p>
      </motion.div>

      <motion.div 
        className="prayer-times-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2>Fard Prayers</h2>
        <div className="prayer-times-grid">
          {fardPrayers.map((prayer, index) => (
            <motion.div 
              key={prayer.name}
              className="prayer-time-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <i className={`fas ${prayer.icon}`}></i>
              <h3>{prayer.name}</h3>
              <p>{prayer.time}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="prayer-times-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2>Nafil Prayers</h2>
        <div className="prayer-times-grid">
          {nafilPrayers.map((prayer, index) => (
            <motion.div 
              key={prayer.name}
              className="prayer-time-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <i className={`fas ${prayer.icon}`}></i>
              <h3>{prayer.name}</h3>
              <p>{prayer.time}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="prayer-times-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2>Other Times</h2>
        <div className="prayer-times-grid">
          {otherTimes.map((time, index) => (
            <motion.div 
              key={time.name}
              className="prayer-time-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <i className={`fas ${time.icon}`}></i>
              <h3>{time.name}</h3>
              <p>{time.time}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default PrayerTimesPage; 