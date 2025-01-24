import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContacts } from '../../hooks/useContacts';
import ContactList from './components/ContactList';
import AddContactButton from './components/AddContactButton';
import AddContactModal from './components/AddContactModal';
import SearchBar from './components/SearchBar';
import './styles/Contacts.css';

function ContactsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const { contacts, loading, searchContacts } = useContacts();

  const filteredContacts = searchContacts(searchQuery, searchFilter);

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleSearch = (query, filterType) => {
    setSearchQuery(query);
    setSearchFilter(filterType);
  };

  return (
    <motion.div 
      className="contacts-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="contacts-header">
        <SearchBar 
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search contacts..."
        />
      </div>

      <div className="contacts-content">
        {loading ? (
          <div className="loading">Loading contacts...</div>
        ) : filteredContacts.length === 0 ? (
          <div className="no-contacts">
            {searchQuery ? 'No contacts found matching your search' : 'No contacts added yet'}
          </div>
        ) : (
          <ContactList 
            contacts={filteredContacts}
            loading={loading}
            onEditContact={handleEditContact}
          />
        )}
      </div>

      <AddContactButton onClick={() => setIsModalOpen(true)} />
      
      <AnimatePresence>
        {isModalOpen && (
          <AddContactModal 
            onClose={() => {
              setIsModalOpen(false);
              setSelectedContact(null);
            }}
            editContact={selectedContact}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ContactsPage; 