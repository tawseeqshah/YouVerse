import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  addDoc, 
  updateDoc,
  doc,
  onSnapshot,
  deleteDoc,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export function useContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setContacts([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, `users/${user.uid}/contacts`),
      orderBy('name', 'asc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const contactData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setContacts(contactData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching contacts:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addContact = async (contactData) => {
    if (!user) throw new Error('Must be logged in to add contacts');
    
    const contactsRef = collection(db, `users/${user.uid}/contacts`);
    return addDoc(contactsRef, {
      ...contactData,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  };

  const updateContact = async (contactId, updates) => {
    if (!user) throw new Error('Must be logged in to update contacts');
    
    const contactRef = doc(db, `users/${user.uid}/contacts`, contactId);
    return updateDoc(contactRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  };

  const deleteContact = async (contactId) => {
    if (!user) throw new Error('Must be logged in to delete contacts');
    
    const contactRef = doc(db, `users/${user.uid}/contacts`, contactId);
    return deleteDoc(contactRef);
  };

  const searchContacts = (query, filterType = 'all') => {
    if (!query) return contacts;
    
    const searchTerm = query.toLowerCase();
    return contacts.filter(contact => {
      switch (filterType) {
        case 'name':
          return contact.name?.toLowerCase().includes(searchTerm);
        case 'designation':
          return contact.designation?.toLowerCase().includes(searchTerm);
        case 'business':
          return contact.business?.toLowerCase().includes(searchTerm);
        case 'phone':
          return contact.phone?.includes(searchTerm);
        case 'email':
          return contact.email?.toLowerCase().includes(searchTerm);
        case 'all':
        default:
          return (
            contact.name?.toLowerCase().includes(searchTerm) ||
            contact.designation?.toLowerCase().includes(searchTerm) ||
            contact.business?.toLowerCase().includes(searchTerm) ||
            contact.phone?.includes(searchTerm) ||
            contact.email?.toLowerCase().includes(searchTerm)
          );
      }
    });
  };

  return {
    contacts,
    loading,
    addContact,
    updateContact,
    deleteContact,
    searchContacts
  };
} 