import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'admin') {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh]'>
        <h1 className='text-3xl font-bold text-red-500 mb-4'>Not Authorized</h1>
        <button onClick={() => navigate('/')} className='bg-red-500 text-white px-4 py-2 rounded-md'>Go Home</button>
      </div>
    );
  }

  return (
    <div className='max-w-3xl mx-auto py-10 px-4 min-h-[80vh]'>
      <h1 className='text-4xl font-bold mb-6 text-center text-gray-800'>Admin Dashboard</h1>
      <div className='bg-white shadow-lg rounded-xl p-8 flex flex-col gap-6'>
        <div>
          <h2 className='text-2xl font-semibold text-gray-700 mb-2'>Welcome, {user.email}</h2>
          <p className='text-gray-600'>You have admin access. Here you can manage orders, users, and more.</p>
        </div>
        <div className='flex flex-col gap-4'>
          <button onClick={() => navigate('/orders')} className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'>Manage Orders</button>
          {/* Add more admin actions here as needed */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 