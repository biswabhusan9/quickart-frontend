import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { DataProvider } from './context/DataContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastContainer } from 'react-toastify';
import ScrollToTop from 'react-scroll-to-top';

createRoot(document.getElementById('root')).render(
  <DataProvider>
    <CartProvider>
      <AuthProvider>
        <App />
        <ScrollToTop
          smooth
          color="white"
          style={{
            backgroundColor: '#fa2d37',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </CartProvider>
  </DataProvider>
);