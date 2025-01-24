import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../features/dashboard/DashboardPage';
import TodoPage from '../features/todo/TodoPage';
import ContactsPage from '../features/contacts/ContactsPage';
import NotesPage from '../features/notes/NotesPage';
import SettingsPage from '../features/settings/SettingsPage';
import MoreAppsPage from '../features/more-apps/MoreAppsPage';
import PrayerTimesPage from '../features/prayer-times/PrayerTimesPage';
import LoginPage from '../features/auth/LoginPage';
import SignupPage from '../features/auth/SignupPage';
import PrivateRoute from '../components/PrivateRoute';
import WeatherPage from '../features/weather/WeatherPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/todo" 
        element={
          <PrivateRoute>
            <TodoPage />
          </PrivateRoute>
        } 
      />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/notes" element={<NotesPage />} />
      <Route 
        path="/settings" 
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        } 
      />
      <Route path="/more-apps" element={<MoreAppsPage />} />
      <Route path="/prayer-times" element={<PrayerTimesPage />} />
      <Route path="/weather" element={<WeatherPage />} />
    </Routes>
  );
}

export default AppRoutes; 