import { collection, writeBatch, doc, getDocs } from 'firebase/firestore';
import { db } from './config';
import axios from 'axios';export const initializeFirestore = async () => {
  try {
    // First check if products already exist
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    if (!snapshot.empty) {
      console.log('Products already exist in Firestore');
      return;
    }

    console.log('Fetching products from API...');
    const response = await axios.get('https://fakestoreapi.in/api/products?limit=150');
    const products = response.data.products;

    // Split products into batches of 500 (Firestore batch limit)
    const batchSize = 500;
    const batches = [];
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = writeBatch(db);
      const batchProducts = products.slice(i, i + batchSize);
      
      batchProducts.forEach(product => {
        const productRef = doc(db, 'products', product.id.toString());
        batch.set(productRef, {
          ...product,
          available: true, // Add availability field
          price: parseFloat(product.price), // Ensure price is a number
          createdAt: new Date().toISOString()
        });
      });
      
      batches.push(batch);
    }
    
    // Commit all batches
    console.log('Uploading products to Firestore...');
    await Promise.all(batches.map(batch => batch.commit()));
    
    console.log('Firestore initialized with', products.length, 'products');
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    throw error;
  }
};
