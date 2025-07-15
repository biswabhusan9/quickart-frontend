import React from 'react'
import { IoCartOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { getData } from '../context/DataContext'

const ProductCard = ({product}) => {
  const navigate=useNavigate()
  const {addToCart}=useCart()
  const { user } = useAuth();
  const { toggleProductAvailability } = getData();

  return (
    <div className='border relative border-gray-100 rounded-2xl cursor-pointer hover:shadow-2xl transition-all p-2 h-max'>
      <img src={product.image} alt='' className='bg-gray-100 aspect-square' onClick={()=>navigate(`/products/${product.id}`)}/>
      <h1 className='line-clamp-2 p-1 font-semibold'>{product.title}</h1>
      <p className='my-1 text-lg text-gray-800 font-bold'>${product.price}</p>
      {user && user.role === 'admin' && (
        <button onClick={() => toggleProductAvailability(product.id)} className={`mb-2 px-2 py-1 rounded text-xs ${product.available ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
          {product.available ? 'Set Out of Stock' : 'Set In Stock'}
        </button>
      )}
      {product.available ? (
        <button onClick={()=>addToCart(product)} className='bg-red-500 px-3 py-2 text-lg rounded-md text-white w-full cursor-pointer flex gap-2 items-center justify-center font-semibold'><IoCartOutline className='w-6 h-6'/> Add to Cart</button>
      ) : (
        <div className='bg-gray-300 text-gray-700 text-center py-2 rounded-md font-semibold'>Out of Stock</div>
      )}
    </div>
  )
}

export default ProductCard