import React from 'react';
import { motion } from 'framer-motion';
import './LoadingAnimations.css';

export const PulseLoader = () => (
  <div className="pulse-loader">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="pulse-dot"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: i * 0.2,
        }}
      />
    ))}
  </div>
);

export const SpinnerLoader = () => (
  <motion.div
    className="spinner-loader"
    animate={{ rotate: 360 }}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }}
  />
);

export const HadithLoader = () => (
  <motion.div className="hadith-loader">
    <motion.div
      className="book-spine"
      animate={{
        rotateY: [0, 180, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <span className="arabic-text">قرآن</span>
    </motion.div>
    <div className="loading-text">Loading Hadith...</div>
  </motion.div>
);

export const PrayerTimesLoader = () => (
  <div className="prayer-times-loader">
    <motion.div
      className="mosque-silhouette"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: [0.5, 1, 0.5],
        scale: [0.8, 1, 0.8],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <motion.div 
      className="loading-dots"
      animate={{
        opacity: [0, 1, 0]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      Loading Prayer Times
    </motion.div>
  </div>
);

export const WeatherLoader = () => (
  <div className="weather-loader">
    <motion.div
      className="sun-moon"
      animate={{
        rotate: 360,
        scale: [1, 1.1, 1]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }}
    />
    <div className="loading-text">Loading Weather...</div>
  </div>
);

export const FullScreenLoader = () => (
  <motion.div 
    className="fullscreen-loader"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="loader-content"
      animate={{
        scale: [0.9, 1, 0.9],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="loader-icon" />
      <div className="loader-text">Loading...</div>
    </motion.div>
  </motion.div>
); 