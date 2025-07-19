// import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { useAuth } from '../context/AuthContext'

import { MapPin } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import { CgClose } from 'react-icons/cg'
import { FaCaretDown, FaUserCircle, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa'
import { IoCartOutline } from 'react-icons/io5'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { HiMenuAlt1, HiMenuAlt3 } from 'react-icons/hi'
import ResponsiveMenu from './ResponsiveMenu'
import { UserCircleIcon } from '@heroicons/react/24/outline';

const Navbar = ({ location, getLocation, openDropdown, setOpenDropdown }) => {
  const { user, logout } = useAuth();

  const { cartItem } = useCart()
  const [openNav, setOpenNav] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown)
  }

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    setProfileOpen(false);
    navigate('/profile');
  };

  return (
    <div className='bg-white py-3 shadow-2xl px-4 md:px-0'>
      <div className='max-w-6xl mx-auto flex justify-between items-center'>
        {/*logo section */}
        <div className='flex gap-7 items-center'>
          <Link to={'/'}><h1 className='font-bold text-3xl'>Quic<span className='text-red-500 font-serif'>K</span>art</h1></Link>
          <div className='md:flex gap-1 cursor-pointer text-gray-700 items-center hidden'>
            <MapPin className='text-red-500' />
            <span className='font-semibold'>{location ? <div className='-space-y-2'>
              <p>{location.county}</p>
              <p>{location.city}</p>
            </div> : "Add Address"}</span>
            <FaCaretDown onClick={toggleDropdown} />
          </div>
          {
            openDropdown ? <div className='w-[250px] h-max shadow-2xl z-50 bg-white fixed top-16 left-60 border-2 p-5 border-gray-100 rounded-md'>
              <h1 className='font-semibold mb-4 text-xl flex justify-between'>Change Location <span onClick={toggleDropdown}><CgClose /></span></h1>
              <button onClick={getLocation} className='bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer hover:bg-red-400'>Detect my location</button>
            </div> : null
          }
        </div>
        {/* menu section */}
        <nav className='flex gap-7 items-center'>
          <ul className='md:flex gap-7 items-center font-semibold hidden'>
            <NavLink to={"/"} className={({ isActive }) => `${isActive ? "border-b-3 transition-all border-red-500" : ""} cursor-pointer`}><li>Home</li></NavLink>
            <NavLink to={"/products"} className={({ isActive }) => `${isActive ? "border-b-3 transition-all border-red-500" : ""} cursor-pointer`}><li>Products </li></NavLink>
            <NavLink to={"/about"} className={({ isActive }) => `${isActive ? "border-b-3 transition-all border-red-500" : ""} cursor-pointer`}><li>About</li></NavLink>
            <NavLink to={"/contact"} className={({ isActive }) => `${isActive ? "border-b-3 transition-all border-red-500" : ""} cursor-pointer`}><li>Contact</li></NavLink>
            {user && (
              <NavLink to={"/orders"} className={({ isActive }) => `${isActive ? "border-b-3 transition-all border-red-500" : ""} cursor-pointer`}><li>Orders</li></NavLink>
            )}
          </ul>
          <Link to={"/cart"} className='relative'>
            <IoCartOutline className='h-7 w-7' />
            <span className='bg-red-500 px-2 rounded-full absolute -top-3 -right-3 text-white'>{cartItem.length}</span>
          </Link>
          
          {/* Desktop Profile Section */}
          <div className='hidden md:block'>
            {!user ? (
              <button 
                onClick={() => navigate('/login')}
                className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-red-600 transition-colors font-medium"
              >
                Sign In
              </button>
            ) : (
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setProfileOpen(!profileOpen)} 
                  className="focus:outline-none hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <FaUserCircle className="h-8 w-8 text-gray-700" />
                </button>
                
                {profileOpen && (
                  <div className="absolute right-0 top-12 bg-white shadow-xl rounded-lg border border-gray-200 w-64 z-50 overflow-hidden">
                    <div className='p-4 border-b border-gray-100'>
                      <div className='flex items-center gap-3'>
                        <FaUserCircle size={40} className='text-gray-600' />
                        <div className='flex-1 min-w-0'>
                          <h3 className='font-semibold text-gray-800 truncate'>
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className='text-sm text-gray-500 truncate'>{user.email}</p>
                          <p className='text-xs text-gray-400 capitalize mt-1'>
                            Role: {user.role === 'admin' ? 'Admin' : 'User'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className='py-2'>
                      <button 
                        onClick={handleProfileClick}
                        className='w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors'
                      >
                        <FaUser className='text-gray-500' />
                        <span className='text-gray-700'>My Profile</span>
                      </button>
                      
                      {user.role === 'admin' && (
                        <button 
                          onClick={() => { 
                            setProfileOpen(false); 
                            navigate('/admin-dashboard'); 
                          }} 
                          className='w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors'
                        >
                          <FaCog className='text-gray-500' />
                          <span className='text-gray-700'>Admin Dashboard</span>
                        </button>
                      )}
                      
                      <button 
                        onClick={handleLogout} 
                        className='w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-red-600'
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          {
            openNav ? <HiMenuAlt3 onClick={() => setOpenNav(false)} className='h-7 w-7 md:hidden' /> : <HiMenuAlt1
              onClick={() => setOpenNav(true)}
              className='h-7 w-7 md:hidden' />
          }
        </nav>
      </div>
      <ResponsiveMenu openNav={openNav} setOpenNav={setOpenNav} />
    </div>
  )
}

export default Navbar