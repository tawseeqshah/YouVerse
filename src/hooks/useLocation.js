import { useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { reverseGeocode } from '../services/geocodingService';
import { useLocationContext } from '../context/LocationContext';

// Default coordinates for Srinagar (updated to be more precise)
const SRINAGAR_COORDINATES = {
  latitude: 34.0837,
  longitude: 74.7973
};

export function useLocation() {
  const { location, saveLocation } = useLocationContext();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    try {
      const permissionStatus = await Geolocation.checkPermissions();
      
      if (permissionStatus.location === 'prompt' || permissionStatus.location === 'denied') {
        const request = await Geolocation.requestPermissions();
        return request.location === 'granted';
      }
      
      return permissionStatus.location === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  };

  const getDeviceLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      const hasPermission = await requestPermissions();
      
      if (!hasPermission) {
        throw new Error('Location permission denied');
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });

      if (position && position.coords) {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        
        const details = await reverseGeocode(coords.latitude, coords.longitude);
        const newLocation = {
          ...coords,
          ...details
        };
        
        await saveLocation(newLocation);
      }
    } catch (err) {
      console.error('Location error:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setCustomLocation = async (newLocation) => {
    try {
      setLoading(true);
      await saveLocation(newLocation);
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    location,
    error,
    loading,
    getDeviceLocation,
    setCustomLocation
  };
} 