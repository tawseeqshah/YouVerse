import { AnimatePresence } from 'framer-motion';
import ContactCard from './ContactCard';

function ContactList({ contacts, loading, onEditContact }) {
  if (loading) {
    return <div className="loading">Loading contacts...</div>;
  }

  if (!contacts.length) {
    return <div className="no-contacts">No contacts found</div>;
  }

  return (
    <div className="contacts-list">
      <AnimatePresence>
        {contacts.map(contact => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onEdit={onEditContact}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ContactList; 