import { createContext, useContext, useState, useEffect } from 'react';
import { SRINAGAR_COORDINATES } from '../constants';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load saved location on mount
  useEffect(() => {
    loadSavedLocation();
  }, []);

  const loadSavedLocation = () => {
    try {
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation) {
        setLocation(JSON.parse(savedLocation));
      } else {
        setLocation(SRINAGAR_COORDINATES);
      }
    } catch (error) {
      console.error('Error loading saved location:', error);
      setLocation(SRINAGAR_COORDINATES);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const saveLocation = async (newLocation) => {
    try {
      localStorage.setItem('userLocation', JSON.stringify(newLocation));
      setLocation(newLocation);
      setError(null);
    } catch (error) {
      console.error('Error saving location:', error);
      setError(error);
    }
  };

  return (
    <LocationContext.Provider value={{
      location,
      loading,
      error,
      saveLocation
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
} 