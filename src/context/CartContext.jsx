import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getData } from './DataContext';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // Always use 'cart' key and default to [] if not present or invalid
  const [cartItem, setCartItem] = useState(() => {
    try {
      const stored = localStorage.getItem('cart');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch {
      return [];
    }
  });
  const { data } = getData();

  useEffect(() => {
    // Remove unavailable products from cart only if needed
    if (data) {
      setCartItem(prev => {
        const filtered = prev.filter(item => {
          const prod = data.find(p => p.id === item.id);
          return prod && prod.available !== false;
        });
        // Only update if cart actually changed
        if (JSON.stringify(filtered) !== JSON.stringify(prev)) {
          return filtered;
        }
        return prev;
      });
    }
  }, [data]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItem));
  }, [cartItem]);

  const addToCart = (product) => {
    if (product.available === false) {
      toast.error('This product is out of stock!');
      return;
    }
    const itemInCart=cartItem.find((item)=>item.id===product.id);
    if(itemInCart){
      //Increase quantity if already in cart
      const updatedCart=cartItem.map((item)=>
        item.id===product.id? {...item, quantity:item.quantity+1}:item
      )
      setCartItem(updatedCart)
      toast.success("Product quantity increased!")
    }else{
      //Add new item with quantity
      setCartItem([...cartItem, {...product,quantity:1}]);
      toast.success("Product is added to cart!")
    }
  };

  const updateQuantity=(cartItem,productId,action)=>{
   setCartItem( cartItem.map(item=>{
    if(item.id===productId){
      if(action==="inc"){
        return {...item,quantity:item.quantity+1}
      }else if(action==="dec" && item.quantity>1){
        return {...item,quantity:item.quantity-1}
      }
    }
    return item
   }))
  }

  const deleteItem=(productId)=>{
    setCartItem(cartItem.filter(item=>item.id!==productId))
    toast.success("Product removed from cart!")
  }

  return (
    <CartContext.Provider value={{ cartItem, setCartItem, addToCart, updateQuantity, deleteItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
