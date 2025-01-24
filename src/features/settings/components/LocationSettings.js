import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCrosshairs } from 'react-icons/fa';
import { useLocation } from '../../../hooks/useLocation';
import { reverseGeocode } from '../../../services/geocodingService';
import './LocationSettings.css';

function LocationSettings() {
  const { location, setCustomLocation, getDeviceLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDeviceLocation = async () => {
    try {
      await getDeviceLocation();
      setError(null);
    } catch (error) {
      setError('Unable to get device location. Please enable location services or enter location manually.');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      setError('Error searching for location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = async (result) => {
    try {
      const locationData = {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon)
      };
      
      const details = await reverseGeocode(locationData.latitude, locationData.longitude);
      setCustomLocation({
        ...locationData,
        city: details.city,
        state: details.state,
        country: details.country
      });
      
      setSearchResults([]);
      setSearchQuery('');
    } catch (error) {
      setError('Error setting location. Please try again.');
    }
  };

  return (
    <div className="location-settings">
      <div className="current-location">
        <h3>Current Location</h3>
        {location ? (
          <div className="location-details">
            <FaMapMarkerAlt className="location-icon" />
            <div className="location-info">
              <div className="location-name">
                {location.city}, {location.state}
              </div>
              <div className="coordinates">
                {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
              </div>
            </div>
          </div>
        ) : (
          <div className="no-location">No location set</div>
        )}
      </div>

      <motion.button
        className="device-location-button"
        onClick={handleDeviceLocation}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <FaCrosshairs />
        Use Device Location
      </motion.button>

      <div className="location-search">
        <h3>Search Location</h3>
        <form onSubmit={handleSearch}>
          <div className="search-input">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter city name..."
              className="location-input"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Search
            </motion.button>
          </div>
        </form>

        {loading && <div className="loading">Searching...</div>}
        {error && <div className="error-message">{error}</div>}

        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((result) => (
              <motion.div
                key={result.place_id}
                className="result-item"
                onClick={() => handleLocationSelect(result)}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FaMapMarkerAlt className="result-icon" />
                <div className="result-info">
                  <div className="result-name">{result.display_name}</div>
                  <div className="result-coords">
                    {parseFloat(result.lat).toFixed(4)}°N, {parseFloat(result.lon).toFixed(4)}°E
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationSettings; 