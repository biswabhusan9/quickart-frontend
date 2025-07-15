import axios from "axios";
import { createContext, useContext, useState } from "react";

export const DataContext=createContext(null)

export const DataProvider =({children})=>{
    const [data,setData]=useState()
    const [availability, setAvailability] = useState(() => {
      // Load availability map from localStorage
      return JSON.parse(localStorage.getItem('productAvailability') || '{}');
    });

    //fetching all products from api
    const fetchAllProducts=async()=>{
      try {
        const res=await axios.get('https://fakestoreapi.in/api/products?limit=150')
        const productsData=res.data.products.map(product => ({
          ...product,
          available: availability[product.id] !== undefined ? availability[product.id] : true
        }));
        // Only update if data actually changed
        setData(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(productsData)) {
            return productsData;
          }
          return prev;
        });
      } catch (error) {
        console.log(error)
      }
    }

    // Admin: toggle product availability
    const toggleProductAvailability = (productId) => {
      setData(prevData => prevData.map(product =>
        product.id === productId ? { ...product, available: !product.available } : product
      ));
      setAvailability(prev => {
        const updated = { ...prev, [productId]: !prev[productId] };
        localStorage.setItem('productAvailability', JSON.stringify(updated));
        return updated;
      });
    };

      const getUniqueCategory=(data,property)=>{
        let newVal=data?.map((curElem)=>{
          return curElem[property]
        })
        newVal=["All",...new Set(newVal)]
        return newVal
      }
    
      const categoryOnlyData=getUniqueCategory(data,"category")
      const brandOnlyData=getUniqueCategory(data,"brand")
    return <DataContext.Provider value={{data,setData,fetchAllProducts,categoryOnlyData,brandOnlyData,toggleProductAvailability}}>
        {children}
    </DataContext.Provider>
}

export const getData=()=>useContext(DataContext)