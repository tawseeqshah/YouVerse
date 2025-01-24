import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useContacts } from '../../../hooks/useContacts';

function AddContactModal({ onClose, editContact = null }) {
  const [formData, setFormData] = useState({
    name: '',
    business: '',
    designation: '',
    phone: '',
    email: '',
    district: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addContact, updateContact } = useContacts();

  useEffect(() => {
    if (editContact) {
      setFormData(editContact);
    }
  }, [editContact]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
          );
          const data = await response.json();
          setFormData(prev => ({
            ...prev,
            address: data.display_name,
            district: data.address.city || data.address.town || data.address.district
          }));
        } catch (error) {
          setError('Failed to get location details');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Unable to retrieve your location');
        setLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (editContact) {
        await updateContact(editContact.id, formData);
      } else {
        await addContact(formData);
      }
      onClose();
    } catch (err) {
      console.error('Error saving contact:', err);
      setError('Failed to save contact. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="modal-content"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <h2>{editContact ? 'Edit Contact' : 'Add New Contact'}</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>Business</label>
            <input
              type="text"
              value={formData.business}
              onChange={(e) => setFormData(prev => ({ ...prev, business: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Designation</label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>District</label>
            <input
              type="text"
              value={formData.district}
              onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <div className="address-input-group">
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              />
              <button 
                type="button" 
                onClick={getCurrentLocation}
                className="location-button"
                disabled={loading}
              >
                <i className="fas fa-map-marker-alt"></i>
              </button>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Saving...' : (editContact ? 'Update' : 'Add')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default AddContactModal; 