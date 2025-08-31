import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth listener');
    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? 'user exists' : 'no user');
      try {
        if (firebaseUser) {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data() || {};
          
          const userState = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            role: userData.role || 'user',
            ...userData
          };
          console.log('Setting user state:', userState);
          setUser(userState);
        } else {
          console.log('No user, setting null');
          setUser(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setUser(null);
      } finally {
        console.log('Setting loading false');
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data() || {};
      
      const user = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        ...userData
      };
      
      return { success: true, user };
    } catch (err) {
      console.error('Login error:', err);
      return { 
        success: false, 
        error: err.code === 'auth/wrong-password' ? 'Invalid credentials' :
               err.code === 'auth/user-not-found' ? 'User not found' :
               'An error occurred during login'
      };
    }
  };

  const register = async (firstName, lastName, email, password) => {
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Set display name
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        firstName,
        lastName,
        email,
        role: 'user',
        createdAt: new Date().toISOString()
      });

      return { success: true };
    } catch (err) {
      console.error('Register error:', err);
      return { 
        success: false, 
        error: err.code === 'auth/email-already-in-use' ? 'Email already in use' :
               'An error occurred during registration'
      };
    }
  };

  const updateUser = async (userData) => {
    try {
      if (!user?.uid) throw new Error('No user logged in');

      // Update Firestore document
      await setDoc(doc(db, 'users', user.uid), {
        ...userData,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // If name is being updated, update auth profile
      if (userData.firstName || userData.lastName) {
        const displayName = `${userData.firstName || user.firstName} ${userData.lastName || user.lastName}`;
        await updateProfile(auth.currentUser, { displayName });
      }

      // Get fresh user data
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const updatedUserData = userDoc.data();
      
      const updatedUser = {
        ...user,
        ...updatedUserData
      };
      
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (err) {
      console.error('Update error:', err);
      return { success: false, error: 'Failed to update user data' };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('cart'); // Clear cart on logout
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
