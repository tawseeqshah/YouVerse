import { useState, useEffect } from 'react';
import GreetingSection from './components/GreetingSection';
import StatsOverview from './components/StatsOverview';
import HadithCard from './components/HadithCard';
import './styles/Dashboard.css';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useLocation } from '../../hooks/useLocation';
import { convertTo12Hour } from '../../utils/timeFormat';

function DashboardPage() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [islamicDate, setIslamicDate] = useState(null);
  const { location } = useLocation();

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      if (!location) return;
      
      try {
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
        setIslamicDate(`${data.data.date.hijri.day} ${data.data.date.hijri.month.en} ${data.data.date.hijri.year} AH`);
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      }
    };

    fetchPrayerTimes();
  }, [location]); // Re-fetch when location changes

  const getNextPrayer = () => {
    if (!prayerTimes) return null;

    const prayers = [
      { name: 'Fajr', time: prayerTimes.Fajr },
      { name: 'Zuhr', time: prayerTimes.Dhuhr },
      { name: 'Asr', time: prayerTimes.Asr },
      { name: 'Maghrib', time: prayerTimes.Maghrib },
      { name: 'Isha', time: prayerTimes.Isha }
    ];

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(':');
      const prayerTime = parseInt(hours) * 60 + parseInt(minutes);
      
      if (prayerTime > currentTime) {
        return prayer;
      }
    }

    return prayers[0]; // Return Fajr if all prayers have passed
  };

  return (
    <div className="dashboard-page">
      <motion.div 
        className="dashboard-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="dashboard-grid">
          <div className="dashboard-main">
            <GreetingSection 
              islamicDate={islamicDate} 
              nextPrayer={getNextPrayer()} 
            />
            <StatsOverview />
            <HadithCard />
          </div>
          <div className="dashboard-sidebar">
            {/* Prayer times and other widgets */}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default DashboardPage; 