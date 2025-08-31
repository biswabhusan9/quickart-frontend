import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getData } from './DataContext';
import { useAuth } from './AuthContext';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../firebase/config';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItem, setCartItem] = useState([]);
  const { data } = getData();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      // If no user is logged in, try to get cart from localStorage
      try {
        const stored = localStorage.getItem('cart');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setCartItem(parsed);
          }
        }
      } catch {
        setCartItem([]);
      }
      return;
    }

    // Set up real-time listener for user's cart
    const cartRef = ref(db, `carts/${user.uid}/items`);
    const unsubscribe = onValue(cartRef, (snapshot) => {
      if (snapshot.exists()) {
        const cartItems = snapshot.val();
        setCartItem(Array.isArray(cartItems) ? cartItems : []);
      } else {
        setCartItem([]);
      }
    }, (error) => {
      console.error("Error listening to cart:", error);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    // Remove unavailable products from cart only if needed
    if (data) {
      const filtered = cartItem.filter(item => {
        const prod = data.find(p => p.id === item.id);
        return prod && prod.available !== false;
      });
      
      if (JSON.stringify(filtered) !== JSON.stringify(cartItem)) {
        updateCart(filtered);
      }
    }
  }, [data]);

  // Helper function to update cart in Realtime DB/localStorage
  const updateCart = async (newCart) => {
    if (user) {
      // Update in Realtime Database
      try {
        const cartRef = ref(db, `carts/${user.uid}`);
        await set(cartRef, {
          items: newCart,
          updatedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error("Error updating cart:", error);
      }
    } else {
      // Update in localStorage
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
    setCartItem(newCart);
  };

  const addToCart = (product) => {
    if (product.available === false) {
      toast.error('This product is out of stock!');
      return;
    }
    const itemInCart = cartItem.find((item) => item.id === product.id);
    if (itemInCart) {
      // Increase quantity if already in cart
      const updatedCart = cartItem.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      updateCart(updatedCart);
      toast.success("Product quantity increased!");
    } else {
      // Add new item with quantity
      const updatedCart = [...cartItem, { ...product, quantity: 1 }];
      updateCart(updatedCart);
      toast.success("Product is added to cart!");
    }
  };

  const updateQuantity = (cartItems, productId, action) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === productId) {
        if (action === "inc") {
          return { ...item, quantity: item.quantity + 1 };
        } else if (action === "dec" && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
      }
      return item;
    });
    updateCart(updatedCart);
  };

  const deleteItem = (productId) => {
    const updatedCart = cartItem.filter(item => item.id !== productId);
    updateCart(updatedCart);
    toast.success("Product removed from cart!");
  };

  return (
    <CartContext.Provider value={{ cartItem, setCartItem, addToCart, updateQuantity, deleteItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
