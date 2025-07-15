import React, { useEffect, useState } from 'react';
import No_order from '../assets/No_order.webm.webm'
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];

    const updatedOrders = storedOrders.map(order => {
      if (!order.estimatedDelivery) {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 3) + 2);
        return {
          ...order,
          estimatedDelivery: deliveryDate.toDateString(),
          date: new Date().toDateString()
        };
      }
      return order;
    });

    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
  }, []);

  const updateOrderStatus = (index, status) => {
    const updatedOrders = [...orders];
    updatedOrders[index].status = status;
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const deleteOrder = (index) => {
    const updatedOrders = orders.filter((_, i) => i !== index);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className='max-w-5xl mx-auto py-10 px-4 min-h-[80vh]'>
      <h1 className='text-4xl font-bold mb-8 text-center text-gray-800'>Your Orders</h1>

      {orders.length === 0 ? (
  <div className="flex justify-center items-center flex-col gap-4">
    <video
      className="w-[300px] md:w-[400px] rounded-xl shadow"
      src={No_order}
      autoPlay
      loop
      muted
      playsInline
    />
    <p className="text-center text-lg text-gray-600">No orders yet.</p>
  </div>
) : (
        orders.map((order, index) => (
          <div
            key={index}
            className='border border-gray-200 p-4 md:p-6 rounded-xl shadow-md mb-6 bg-white transition-all duration-300'
          >
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2'>
              <div>
                <h2 className='text-xl font-semibold text-gray-800'>Order #{index + 1}</h2>
                <p className='text-sm text-gray-500'>Placed on: {order.date}</p>
                <p className='text-sm text-gray-500'>Estimated Delivery: {order.estimatedDelivery}</p>
              </div>
              {user && user.role === 'admin' && (
                <button
                  onClick={() => deleteOrder(index)}
                  className='text-red-600 hover:text-red-800 text-sm border px-3 py-1 rounded-md border-red-300 hover:border-red-600'
                >
                  Delete
                </button>
              )}
            </div>

            <div className='mb-4'>
              <h3 className='font-medium text-gray-700 mb-1'>Items:</h3>
              <ul className='list-disc pl-6 text-gray-700 text-sm'>
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.title || 'Product'} (x{item.quantity})
                  </li>
                ))}
              </ul>
            </div>

            {order.address && (
              <div className='mb-4 text-sm'>
                <h3 className='font-medium text-gray-700 mb-1'>Delivery Address:</h3>
                <p className='text-gray-700 leading-6'>
                  {order.address.fullName}<br />
                  {order.address.address}<br />
                  {order.address.state}, {order.address.postcode}<br />
                  {order.address.country}<br />
                  Phone: {order.address.phone}
                </p>
              </div>
            )}

            <div className='mt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3'>
              <p className='text-gray-800'>
                <span className='font-medium'>Status:</span>{' '}
                <span
                  className={
                    order.status === 'Delivered'
                      ? 'text-green-600 font-semibold'
                      : order.status === 'Canceled'
                      ? 'text-red-600 font-semibold'
                      : 'text-yellow-600 font-semibold'
                  }
                >
                  {order.status}
                </span>
              </p>
              {user && user.role === 'admin' && (
                <div className='flex gap-2'>
                  <button
                    onClick={() => updateOrderStatus(index, 'Delivered')}
                    className='bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 text-sm'
                  >
                    Mark as Delivered
                  </button>
                  <button
                    onClick={() => updateOrderStatus(index, 'Canceled')}
                    className='bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 text-sm'
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
