import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaBookOpen, FaSync } from 'react-icons/fa';
import './HadithCard.css';
import { HadithLoader } from '../../../components/LoadingAnimations';

function HadithCard() {
  const [hadith, setHadith] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHadith = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('https://random-hadith-generator.vercel.app/bukhari/');
      setHadith(response.data.data);
    } catch (error) {
      console.error('Error fetching hadith:', error);
      setError('Failed to load hadith. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHadith();
    // Update hadith every 6 hours
    const interval = setInterval(fetchHadith, 6 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchHadith();
  };

  if (error) {
    return (
      <motion.div 
        className="hadith-card error"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="hadith-header">
          <FaBookOpen className="hadith-icon" />
          <h2>Hadith of the Day</h2>
        </div>
        <div className="hadith-content error">
          <p>{error}</p>
          <motion.button 
            className="refresh-button"
            onClick={handleRefresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSync /> Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return <HadithLoader />;
  }

  if (!hadith) return null;

  return (
    <motion.div 
      className="hadith-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="hadith-header">
        <FaBookOpen className="hadith-icon" />
        <h2>Hadith of the Day</h2>
        <motion.button 
          className="refresh-button"
          onClick={handleRefresh}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Get new hadith"
        >
          <FaSync />
        </motion.button>
      </div>
      <div className="hadith-content">
        <div className="hadith-metadata">
          <p className="hadith-book">{hadith.book}</p>
          <p className="hadith-chapter">{hadith.bookName?.trim()} - {hadith.chapterName}</p>
        </div>
        <p className="hadith-narrator">{hadith.header?.trim()}</p>
        <p className="hadith-text">{hadith.hadith_english}</p>
        <div className="hadith-details">
          <p className="hadith-reference">Reference: {hadith.refno}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default HadithCard; 