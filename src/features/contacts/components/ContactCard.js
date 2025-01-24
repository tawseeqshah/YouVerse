import { motion } from 'framer-motion';
import { useState } from 'react';
import { useContacts } from '../../../hooks/useContacts';
import { 
  FaUser, FaBuilding, FaBriefcase, FaPhone, 
  FaEnvelope, FaMapMarkerAlt, FaCity, 
  FaEdit, FaTrashAlt, FaChevronDown 
} from 'react-icons/fa';

function ContactCard({ contact, onEdit }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { deleteContact } = useContacts();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact(contact.id);
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const displayName = contact?.name || 'Unknown';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <motion.div 
      className="contact-card"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
    >
      <div className="contact-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="contact-avatar">
          <FaUser />
        </div>
        <div className="contact-info">
          <h3>{displayName}</h3>
          <div className="contact-subinfo">
            {contact?.business && (
              <span className="business">
                <FaBuilding className="icon" />
                {contact.business}
              </span>
            )}
            {contact?.designation && (
              <span className="designation">
                <FaBriefcase className="icon" />
                {contact.designation}
              </span>
            )}
          </div>
        </div>
        <motion.div 
          className="expand-icon"
          animate={{ rotate: isExpanded ? 180 : 0 }}
        >
          <FaChevronDown />
        </motion.div>
      </div>

      <motion.div 
        className="contact-details"
        initial={false}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        {contact?.phone && (
          <a 
            href={`tel:${contact.phone}`}
            className="contact-detail"
            onClick={(e) => e.stopPropagation()}
          >
            <FaPhone className="icon" />
            <span>{contact.phone}</span>
          </a>
        )}
        
        {contact?.email && (
          <a 
            href={`mailto:${contact.email}`}
            className="contact-detail"
            onClick={(e) => e.stopPropagation()}
          >
            <FaEnvelope className="icon" />
            <span>{contact.email}</span>
          </a>
        )}
        
        {contact?.address && (
          <a 
            href={`https://maps.google.com/?q=${encodeURIComponent(contact.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-detail"
            onClick={(e) => e.stopPropagation()}
          >
            <FaMapMarkerAlt className="icon" />
            <span>{contact.address}</span>
          </a>
        )}

        {contact?.district && (
          <div className="contact-detail">
            <FaCity className="icon" />
            <span>{contact.district}</span>
          </div>
        )}

        <div className="contact-actions">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="edit-button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(contact);
            }}
          >
            <FaEdit />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="delete-button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <FaTrashAlt />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ContactCard; 