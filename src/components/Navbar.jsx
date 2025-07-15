// import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { useAuth } from '../context/AuthContext'

import { MapPin } from 'lucide-react'
import React, { useState } from 'react'
import { CgClose } from 'react-icons/cg'
import { FaCaretDown, FaUserCircle } from 'react-icons/fa'
import { IoCartOutline } from 'react-icons/io5'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { HiMenuAlt1, HiMenuAlt3 } from 'react-icons/hi'
import ResponsiveMenu from './ResponsiveMenu'

const Navbar = ({ location, getLocation, openDropdown, setOpenDropdown }) => {
  const { user, logout } = useAuth();

  const { cartItem } = useCart()
  const [openNav, setOpenNav] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown)
  }

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
            <NavLink to={"/orders"} className={({ isActive }) => `${isActive ? "border-b-3 transition-all border-red-500" : ""} cursor-pointer`}><li>Orders</li></NavLink>

          </ul>
          <Link to={"/cart"} className='relative'>
            <IoCartOutline className='h-7 w-7' />
            <span className='bg-red-500 px-2 rounded-full absolute -top-3 -right-3 text-white'>{cartItem.length}</span>
          </Link>
          {/* <div className='hidden md:block'>
            <SignedOut>
              <SignInButton className="bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer"/>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div> */}
          <div className='hidden md:block'>
            {!user ? (
              <button 
                onClick={() => navigate('/login')}
                className="bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer"
              >
                Sign In
              </button>
            ) : (
              <div className="relative flex items-center gap-2">
                <button onClick={() => setProfileOpen(!profileOpen)} className="focus:outline-none">
                  <FaUserCircle className="text-3xl text-gray-700 hover:text-red-500 transition" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-10 bg-white shadow-lg rounded-md border w-56 z-50 p-4 flex flex-col gap-2">
                    <div className="flex flex-col gap-1 border-b pb-2">
                      <span className="font-semibold text-gray-800 truncate max-w-[180px]" title={user.email}>{user.email.length > 22 ? user.email.slice(0, 19) + '...' : user.email}</span>
                      <span className="text-xs text-gray-500 capitalize">Role: {user.role === 'admin' ? 'Admin' : 'User'}</span>
                    </div>
                    {user.role === 'admin' && (
                      <button onClick={() => { setProfileOpen(false); navigate('/admin-dashboard'); }} className="text-left px-2 py-1 rounded hover:bg-gray-100 text-red-500 font-semibold">Admin Dashboard</button>
                    )}
                    <button onClick={() => { setProfileOpen(false); logout(); }} className="text-left px-2 py-1 rounded hover:bg-gray-100 text-gray-700">Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>

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