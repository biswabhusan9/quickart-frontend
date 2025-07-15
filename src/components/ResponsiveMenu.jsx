// import { UserButton, useUser, SignInButton, SignOutButton } from '@clerk/clerk-react';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

// import React from 'react';
// import { FaUserCircle } from 'react-icons/fa';
// import { Link } from 'react-router-dom';

// const ResponsiveMenu = ({ openNav, setOpenNav }) => {
//   const { user, isSignedIn } = useUser();

//   return (
//     <div className={`${openNav ? "left-0":"-left-[100%]"} fixed bottom-0 top-0 z-20 flex h-screen w-[75%] flex-col 
//     justify-between bg-white px-8 pb-6 pt-16 text-black md:hidden rounded-r-xl shadow-md transition-all`}>

      
//       <div>
        
//         <div className='flex items-center justify-start gap-3'>
//           {isSignedIn ? (
//             <>
//               <UserButton size={50} />
//               <div>
//                 <h1 className='text-lg font-medium'>Hello, {user?.firstName}</h1>
//                 <h2 className='text-sm text-slate-500'>Premium User</h2>
//               </div>
//             </>
//           ) : (
//             <>
//               <FaUserCircle size={50} />
//               <div>
//                 <h1 className='text-lg font-medium'>Welcome, Guest</h1>
//               </div>
//             </>
//           )}
//         </div>

        
//         <nav className='mt-12'>
//           <ul className='flex flex-col gap-6 text-xl font-semibold'>
//             <Link to="/" onClick={() => setOpenNav(false)}><li>Home</li></Link>
//             <Link to="/products" onClick={() => setOpenNav(false)}><li>Products</li></Link>
//             <Link to="/about" onClick={() => setOpenNav(false)}><li>About</li></Link>
//             <Link to="/contact" onClick={() => setOpenNav(false)}><li>Contact</li></Link>
//             <Link to="/orders" onClick={() => setOpenNav(false)}><li>Orders</li></Link>

           
//             {!isSignedIn && (
//               <li>
//                 <SignInButton mode="modal">
//                   <button
//                     className="w-full mt-4 bg-red-600 text-white text-base font-medium py-2 rounded-md hover:bg-red-700 transition duration-200"
//                   >
//                     Sign In
//                   </button>
//                 </SignInButton>
//               </li>
//             )}

           
//             {isSignedIn && (
//               <li>
//                 <SignOutButton>
//                   <button
//                     className="w-full mt-4 bg-gray-200 text-black text-base font-medium py-2 rounded-md hover:bg-gray-300 transition duration-200"
//                   >
//                     Sign Out
//                   </button>
//                 </SignOutButton>
//               </li>
//             )}
//           </ul>
//         </nav>
//       </div>

      
//       <div className='mt-10 text-center text-sm text-gray-500'>
//         Made with <span className='text-red-500 text-lg'>❤️</span> by <span className='font-semibold'>Biswa</span>
//       </div>
//     </div>
//   );
// };

// export default ResponsiveMenu;


const ResponsiveMenu = ({ openNav, setOpenNav }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpenNav(false);
    navigate('/');
  };

  return (
    <div className={`${openNav ? "left-0":"-left-[100%]"} fixed bottom-0 top-0 z-20 flex h-screen w-[75%] flex-col 
    justify-between bg-white px-8 pb-6 pt-16 text-black md:hidden rounded-r-xl shadow-md transition-all`}>

      <div>
        <div className='flex items-center justify-start gap-3'>
          <button onClick={() => setProfileOpen(!profileOpen)} className='focus:outline-none'>
            <FaUserCircle size={50} className='text-gray-700 hover:text-red-500 transition' />
          </button>
          {user && profileOpen && (
            <div className='absolute left-4 top-20 bg-white shadow-lg rounded-md border w-56 z-50 p-4 flex flex-col gap-2'>
              <div className='flex flex-col gap-1 border-b pb-2'>
                <span className='font-semibold text-gray-800 truncate max-w-[180px]' title={user.email}>{user.email.length > 22 ? user.email.slice(0, 19) + '...' : user.email}</span>
                <span className='text-xs text-gray-500 capitalize'>Role: {user.role === 'admin' ? 'Admin' : 'User'}</span>
              </div>
              {user.role === 'admin' && (
                <button onClick={() => { setProfileOpen(false); navigate('/admin-dashboard'); setOpenNav(false); }} className='text-left px-2 py-1 rounded hover:bg-gray-100 text-red-500 font-semibold'>Admin Dashboard</button>
              )}
              <button onClick={() => { setProfileOpen(false); handleLogout(); }} className='text-left px-2 py-1 rounded hover:bg-gray-100 text-gray-700'>Logout</button>
            </div>
          )}
          <div>
            <h1 className='text-lg font-medium'>
              {user ? `Hello, ${user.email}` : 'Welcome, Guest'}
            </h1>
          </div>
        </div>

        <nav className='mt-12'>
          <ul className='flex flex-col gap-6 text-xl font-semibold'>
            <Link to="/" onClick={() => setOpenNav(false)}><li>Home</li></Link>
            <Link to="/products" onClick={() => setOpenNav(false)}><li>Products</li></Link>
            <Link to="/about" onClick={() => setOpenNav(false)}><li>About</li></Link>
            <Link to="/contact" onClick={() => setOpenNav(false)}><li>Contact</li></Link>
            <Link to="/orders" onClick={() => setOpenNav(false)}><li>Orders</li></Link>

            {!user && (
              <li>
                <button 
                  onClick={() => {
                    setOpenNav(false);
                    navigate('/login');
                  }}
                  className="w-full mt-4 bg-red-600 text-white py-2 rounded-md"
                >
                  Sign In
                </button>
              </li>
            )}
            {user && (
              <li>
                <button onClick={handleLogout} className="w-full mt-4 bg-gray-200 text-black py-2 rounded-md">Sign Out</button>
              </li>
            )}
          </ul>
        </nav>
      </div>

      <div className='mt-10 text-center text-sm text-gray-500'>
        Made with <span className='text-red-500 text-lg'>❤️</span> by <span className='font-semibold'>Biswa</span>
      </div>
    </div>
  );
};

export default ResponsiveMenu;
