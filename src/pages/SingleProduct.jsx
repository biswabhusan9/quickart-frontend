import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../assets/Loading4.webm'
import BreadCrums from '../components/BreadCrums'
import { IoCartOutline } from 'react-icons/io5'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { getData } from '../context/DataContext'

const SingleProduct = () => {
    const params = useParams()
    const [singleProduct, setSingleProduct] = useState("")
    const {addToCart}=useCart()
    const { user } = useAuth();
    const { data, toggleProductAvailability } = getData();

    useEffect(() => {
        if (data) {
            console.log('🚀 useEffect triggered for product id:', params.id);
            const found = data.find(p => p.id === Number(params.id));
            setSingleProduct(found || "");
        }
    }, [data, params.id]);

    if (!singleProduct) {
        return (
            <div className='flex items-center justify-center min-h-[400px] py-20'>
                <video muted autoPlay loop>
                    <source src={Loading} type='video/webm' />
                </video>
            </div>
        )
    }

    const OriginalPrice = Math.round(singleProduct.price + (singleProduct.price * singleProduct.discount / 100))
    return (
        <>
            <div className='px-4 pb-4 md:px-0'>
                <BreadCrums title={singleProduct.title}/>
                <div className='max-w-6xl mx-auto md:p-6 grid grid-cols-1 md:grid-cols-2 gap-10'>
                    {/* product image */}
                    <div className='w-full'>
                        <img src={singleProduct.image} alt={singleProduct.title} className='rounded-2xl w-full object-cover'/>
                    </div>
                    {/* product details */}
                    <div className='flex flex-col gap-6'>
                        <h1 className='md:text-3xl text-xl font-bold text-gray-800'>{singleProduct.title}</h1>
                        <div className='text-gray-700'>{singleProduct.brand?.toUpperCase()} /{singleProduct.category?.toUpperCase()} /{singleProduct.model}</div>
                        <p className='text-xl text-red-500 font-bold'>${singleProduct.price}
                        <span className='line-through px-2 text-gray-700'>${OriginalPrice}</span>
                        <span className='bg-red-500  text-white px-4 py-1 rounded-full'>{singleProduct.discount}% discount</span>
                        </p>
                        <p className='text-gray-600'>{singleProduct.description}</p>
                        {/* quantity selector */}
                        <div className='flex items-center gap-4'>
                            <label htmlFor='' className='text-sm font-medium text-gray-700'>Quantity:</label>
                            <input type='number' min={1} value={1} className='w-20 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:inset-ring-red-500' readOnly/>
                        </div>
                        {user && user.role === 'admin' && (
                            <button onClick={() => toggleProductAvailability(singleProduct.id)} className={`mb-2 px-2 py-1 rounded text-xs ${singleProduct.available ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                {singleProduct.available ? 'Set Out of Stock' : 'Set In Stock'}
                            </button>
                        )}
                        {singleProduct.available ? (
                            <div className='flex gap-4 mt-4'>
                                <button onClick={()=>addToCart(singleProduct)} className='px-6 flex gap-2 py-2 text-lg bg-red-500 text-white rounded-md'><IoCartOutline className='w-6 h-6'/> Add to Cart</button>
                            </div>
                        ) : (
                            <div className='bg-gray-300 text-gray-700 text-center py-2 rounded-md font-semibold mt-4'>Out of Stock</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SingleProduct