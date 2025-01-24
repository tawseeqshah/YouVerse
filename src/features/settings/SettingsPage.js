import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import './styles/Settings.css';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useState } from 'react';
import { FaUser, FaEnvelope, FaSignOutAlt, FaDownload, FaMapMarkerAlt } from 'react-icons/fa';
import { useContacts } from '../../hooks/useContacts';
import LocationSettings from './components/LocationSettings';

function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.displayName || '');
  const [updateMessage, setUpdateMessage] = useState('');
  const { contacts } = useContacts();
  const [exportMessage, setExportMessage] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(auth.currentUser, {
        displayName: name
      });
      setUpdateMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateMessage('Failed to update profile');
    }
  };

  const handleExportContacts = () => {
    try {
      // Check if contacts exist
      if (!contacts || contacts.length === 0) {
        setExportMessage('No contacts to export');
        return;
      }

      // Define CSV headers
      const headers = ['Name', 'Email', 'Phone', 'Address', 'Notes', 'Created At'];
      
      // Convert contacts data to CSV rows
      const contactRows = contacts.map(contact => [
        contact.name || '',
        contact.email || '',
        contact.phone || '',
        contact.address || '',
        contact.notes || '',
        contact.createdAt || ''
      ].map(field => `"${String(field).replace(/"/g, '""')}"`)); // Ensure field is string and escape quotes

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...contactRows.map(row => row.join(','))
      ].join('\n');

      // Add BOM for Excel UTF-8 compatibility
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setExportMessage('Contacts exported successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setExportMessage(''), 3000);
    } catch (error) {
      console.error('Error exporting contacts:', error);
      setExportMessage('Failed to export contacts. Please try again.');
    }
  };

  return (
    <div className="settings-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="settings-container"
      >
        <h1>Settings</h1>
        
        <section className="settings-section">
          <h2><FaUser className="section-icon" /> Account</h2>
          <div className="user-info">
            <div className="info-item">
              <FaUser className="info-icon" />
              <div className="info-content">
                <span className="info-label">Name</span>
                <span className="info-value">{user?.displayName}</span>
              </div>
            </div>
            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div className="info-content">
                <span className="info-label">Email</span>
                <span className="info-value">{user?.email}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2><FaUser className="section-icon" /> Profile Settings</h2>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="form-input"
                required
              />
            </div>
            <motion.button 
              type="submit"
              className="update-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Update Profile
            </motion.button>
            {updateMessage && (
              <motion.div 
                className={`update-message ${updateMessage.includes('success') ? 'success' : 'error'}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {updateMessage}
              </motion.div>
            )}
          </form>
        </section>

        <section className="settings-section">
          <h2><FaDownload className="section-icon" /> Data Export</h2>
          <motion.button
            className="export-button"
            onClick={handleExportContacts}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaDownload className="icon" />
            <div className="export-info">
              <h3>Export Contacts</h3>
              <p>Download your contacts as CSV</p>
            </div>
          </motion.button>
          {exportMessage && (
            <motion.div 
              className={`update-message ${exportMessage.includes('success') ? 'success' : 'error'}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {exportMessage}
            </motion.div>
          )}
        </section>

        <section className="settings-section">
          <h2><FaMapMarkerAlt className="section-icon" /> Location Settings</h2>
          <LocationSettings />
        </section>

        <section className="settings-section">
          <h2><FaSignOutAlt className="section-icon" /> Actions</h2>
          <motion.button 
            className="logout-button"
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaSignOutAlt /> Sign Out
          </motion.button>
        </section>
      </motion.div>
    </div>
  );
}

export default SettingsPage; 