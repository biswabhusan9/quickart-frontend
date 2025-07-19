import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ResponsiveMenu = ({ openNav, setOpenNav }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpenNav(false);
    navigate('/');
  };

  const handleMenuLinkClick = () => {
    setOpenNav(false);
  };

  return (
    <div className={`${openNav ? "left-0":"-left-[100%]"} fixed bottom-0 top-0 z-20 flex h-screen w-[75%] flex-col 
    justify-between bg-white px-6 pb-6 pt-16 text-black md:hidden rounded-r-xl shadow-md transition-all overflow-hidden`}>

      <div className="flex-1 overflow-y-auto">
        {/* Profile Section */}
        <div className='flex items-center justify-between gap-3 mb-6 p-3 bg-gray-50 rounded-lg'>
          <div className='flex items-center gap-3 flex-1 min-w-0'>
            <FaUserCircle size={45} className='text-gray-700' />
            
            <div className='flex-1 min-w-0'>
              <h1 className='text-base font-medium text-gray-800 truncate'>
                {user ? `Hello, ${user.role === 'admin' ? 'Admin' : 'User'}` : 'Welcome, Guest'}
              </h1>
              {user && (
                <p className='text-sm text-gray-500 truncate' title={user.email}>
                  {user.email}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className='mb-6'>
          <ul className='flex flex-col gap-2'>
            <Link to="/" onClick={handleMenuLinkClick}>
              <li className='px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium'>Home</li>
            </Link>
            <Link to="/products" onClick={handleMenuLinkClick}>
              <li className='px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium'>Products</li>
            </Link>
            <Link to="/about" onClick={handleMenuLinkClick}>
              <li className='px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium'>About</li>
            </Link>
            <Link to="/contact" onClick={handleMenuLinkClick}>
              <li className='px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium'>Contact</li>
            </Link>
            {user && (
              <>
                <Link to="/orders" onClick={handleMenuLinkClick}>
                  <li className='px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium'>Orders</li>
                </Link>
                <Link to="/profile" onClick={handleMenuLinkClick}>
                  <li className='px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium'>My Profile</li>
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin-dashboard" onClick={handleMenuLinkClick}>
                    <li className='px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium'>Admin Dashboard</li>
                  </Link>
                )}
              </>
            )}
          </ul>
        </nav>

        {/* Auth Buttons */}
        {!user && (
          <div className='px-3'>
            <button 
              onClick={() => {
                setOpenNav(false);
                navigate('/login');
              }}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Logout Button for logged in users */}
        {user && (
          <div className='px-3'>
            <button 
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className='text-center text-sm text-gray-500 pt-4 border-t border-gray-100'>
        Made with <span className='text-red-500 text-lg'>❤️</span> by <span className='font-semibold'>Biswa</span>
      </div>
    </div>
  );
};

export default ResponsiveMenu;
