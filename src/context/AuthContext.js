import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  const signUp = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Set display name in Firebase Auth
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Create user profile in Firestore
      const userProfileRef = doc(db, `users/${userCredential.user.uid}/profile`);
      await setDoc(userProfileRef, {
        displayName: name,
        email: userCredential.user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      setUser({
        ...userCredential.user,
        displayName: name
      });
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  };

  // Login function
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout function
  const logout = () => {
    return signOut(auth);
  };

  // Password reset function
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Update profile function
  const updateUserProfile = async (displayName) => {
    if (!auth.currentUser) throw new Error('No user logged in');
    
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, { displayName });
      
      // Update Firestore profile
      const userProfileRef = doc(db, `users/${auth.currentUser.uid}/profile`);
      await setDoc(userProfileRef, {
        displayName,
        email: auth.currentUser.email,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      // Update local state
      setUser(prev => ({
        ...prev,
        displayName
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    signUp,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 