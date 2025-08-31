import { createContext, useContext, useState, useEffect } from "react";
import { ref, onValue, set, get } from "firebase/database";
import { db } from "../firebase/config";
import axios from "axios";

export const DataContext = createContext(null);

export const DataProvider = ({children}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      console.log('Setting up products listener');
      
      const setupProductsListener = async () => {
        try {
          // First try to fetch products from API and store in Firebase
          await fetchAllProducts();
          
          // Then set up real-time listener
          const productsRef = ref(db, 'products');
          onValue(productsRef, (snapshot) => {
            if (snapshot.exists()) {
              const productsData = Object.values(snapshot.val());
              
              // Sort products by category and name
              productsData.sort((a, b) => {
                if (a.category === b.category) {
                  return a.title.localeCompare(b.title);
                }
                return a.category.localeCompare(b.category);
              });
              
              console.log(`Received ${productsData.length} products from Realtime DB`);
              setData(productsData);
            } else {
              console.log('No products in Realtime DB');
              setData([]);
            }
            setLoading(false);
          }, (error) => {
            console.error("Error listening to products:", error);
            setLoading(false);
          });
        } catch (error) {
          console.error("Error setting up products:", error);
          setLoading(false);
        }
      };

      setupProductsListener();
    }, []);

    const fetchAllProducts = async () => {
      try {
        // Check if products already exist in Realtime DB
        const productsRef = ref(db, 'products');
        const snapshot = await get(productsRef);
        
        if (!snapshot.exists()) {
          console.log('No products found, fetching from API...');
          // Fetch products from the original API
          const response = await axios.get('https://fakestoreapi.in/api/products?limit=150');
          console.log('Fetched products from API:', response.data);
          const products = response.data.products;

          
          // Process and store products in Realtime DB
          const processedProducts = products.map(product => ({
            ...product,
            available: true,
            price: parseFloat(product.price),
            createdAt: new Date().toISOString()
          }));
          
          // Store in Realtime DB
          await set(productsRef, processedProducts);
          console.log(`Stored ${processedProducts.length} products in Realtime DB`);
          return processedProducts;
        }
        
        return Object.values(snapshot.val());
      } catch (error) {
        console.error("Error fetching/storing products:", error);
        throw error;
      }
    };

    // Admin: toggle product availability
    const toggleProductAvailability = async (productId) => {
      try {
        const product = data.find(p => p.id === productId);
        if (!product) {
          console.error("Product not found:", productId);
          return;
        }
        
        // Update product availability in Realtime DB
        const productRef = ref(db, `products/${productId}`);
        await set(productRef, {
          ...product,
          available: !product.available
        });
        
        console.log(`Product ${productId} availability toggled to ${!product.available}`);
      } catch (error) {
        console.error("Error toggling product availability:", error);
      }
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
    // Show loading state or children
    if (loading) {
      return <div className="min-h-screen flex items-center justify-center">Loading products...</div>;
    }

    return <DataContext.Provider value={{data,setData,fetchAllProducts,categoryOnlyData,brandOnlyData,toggleProductAvailability}}>
        {children}
    </DataContext.Provider>
}

export const getData=()=>useContext(DataContext)