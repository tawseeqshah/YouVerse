import { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LocationProvider } from './context/LocationContext';
import Layout from './components/Layout/Layout';
import AppRoutes from './routes/AppRoutes';
import { FullScreenLoader } from './components/LoadingAnimations';
import { SRINAGAR_COORDINATES } from './constants';
import './styles/index.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [defaultLocation, setDefaultLocation] = useState(SRINAGAR_COORDINATES);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const permissionStatus = await Geolocation.requestPermissions();
        
        if (permissionStatus.location === 'granted') {
          try {
            const position = await Geolocation.getCurrentPosition({
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            });
            
            setDefaultLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          } catch (error) {
            console.log('Using default Srinagar coordinates:', SRINAGAR_COORDINATES);
          }
        } else {
          console.log('Using default Srinagar coordinates:', SRINAGAR_COORDINATES);
        }
      } catch (error) {
        console.error('Error requesting location permission:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    requestLocationPermission();
  }, []);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <AuthProvider>
      <LocationProvider>
        <ThemeProvider>
          <Layout defaultLocation={defaultLocation}>
            <AppRoutes />
          </Layout>
        </ThemeProvider>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;
