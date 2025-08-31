import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Navbar from './components/Navbar';
import axios from 'axios';
import Footer from './components/Footer';
import SingleProduct from './pages/SingleProduct';
import CategoryProduct from './pages/CategoryProduct';
import { useCart } from './context/CartContext';
import ProtectedRouts from './components/ProtectedRouts';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuth } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import { initializeFirestore } from './firebase/initialize';

const App = () => {
  const [location, setLocation] = useState();
  const [openDropdown, setOpenDropdown] = useState(false);
  const { cartItem, setCartItem } = useCart();
  const { user } = useAuth();

  const getLocation = async () => {
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude, longitude } = pos.coords;
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
      try {
        const location = await axios.get(url);
        const exactLocation = location.data.address;
        setLocation(exactLocation);
        setOpenDropdown(false);
      } catch (error) {
        console.log(error);
      }
    });
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    console.log('App mounted');
    // Initialize Firebase with sample data (only in development)
    if (import.meta.env.DEV) {
      console.log('Initializing Firestore with sample data');
      initializeFirestore()
        .then(() => console.log('Sample data initialized'))
        .catch(error => console.error('Failed to initialize sample data:', error));
    }
  }, []);

  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-xl font-semibold">Loading your application...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar location={location} getLocation={getLocation} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/products/:id' element={<SingleProduct />} />
        <Route path='/category/:category' element={<CategoryProduct />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/cart' element={<ProtectedRouts><Cart location={location} getLocation={getLocation} /></ProtectedRouts>} />
        <Route path='/orders' element={<ProtectedRouts><Orders /></ProtectedRouts>} />
        <Route path='/profile' element={<ProtectedRouts><Profile /></ProtectedRouts>} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/admin-dashboard' element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to='/' replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;