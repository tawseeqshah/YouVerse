import axios from 'axios';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await axios.get(NOMINATIM_URL, {
      params: {
        format: 'json',
        lat: latitude,
        lon: longitude,
        zoom: 10,
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'YouVerse Weather App'
      }
    });

    const address = response.data.address;
    return {
      city: address.city || address.town || address.village || address.suburb,
      state: address.state,
      country: address.country
    };
  } catch (error) {
    console.error('Error fetching location details:', error);
    throw error;
  }
}; 