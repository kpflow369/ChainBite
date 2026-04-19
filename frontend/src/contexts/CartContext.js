import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isEcoDelivery, setIsEcoDelivery] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('chainbite_cart');
    if (savedCart) {
      const data = JSON.parse(savedCart);
      setCartItems(data.items || []);
      setRestaurantInfo(data.restaurant || null);
      setIsEcoDelivery(data.isEcoDelivery || false);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('chainbite_cart', JSON.stringify({
        items: cartItems,
        restaurant: restaurantInfo,
        isEcoDelivery
      }));
    } else {
      localStorage.removeItem('chainbite_cart');
    }
  }, [cartItems, restaurantInfo, isEcoDelivery]);

  const addToCart = (item, restaurant) => {
    // Check if adding from a different restaurant
    if (restaurantInfo && restaurantInfo.id !== restaurant.id) {
      const confirm = window.confirm(
        `Your cart contains items from ${restaurantInfo.name}. Do you want to clear the cart and add items from ${restaurant.name}?`
      );
      if (!confirm) return false;
      setCartItems([]);
    }

    setRestaurantInfo(restaurant);

    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
    return true;
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
    if (cartItems.length === 1) {
      setRestaurantInfo(null);
      setAppliedCoupon(null);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurantInfo(null);
    setAppliedCoupon(null);
    setIsEcoDelivery(false);
    localStorage.removeItem('chainbite_cart');
  };

  const applyCoupon = (coupon) => {
    setAppliedCoupon(coupon);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const toggleEcoDelivery = () => {
    setIsEcoDelivery(!isEcoDelivery);
  };

  // Calculate totals
  const getItemTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDeliveryFee = () => {
    if (isEcoDelivery) return 20; // Eco delivery cheaper
    return 40;
  };

  const getPlatformFee = () => {
    return 5; // Minimal platform fee (no 20-30% commission!)
  };

  const getGSTAmount = () => {
    return Math.round(getItemTotal() * 0.05); // 5% GST
  };

  const getDiscount = () => {
    if (!appliedCoupon) return 0;
    const itemTotal = getItemTotal();
    
    if (itemTotal < appliedCoupon.minOrder) return 0;

    if (appliedCoupon.type === 'percentage') {
      const discount = Math.round(itemTotal * 0.5); // 50%
      return Math.min(discount, appliedCoupon.maxDiscount);
    } else if (appliedCoupon.type === 'flat') {
      return appliedCoupon.maxDiscount;
    } else if (appliedCoupon.type === 'delivery') {
      return getDeliveryFee();
    }
    return 0;
  };

  const getGrandTotal = () => {
    const itemTotal = getItemTotal();
    const deliveryFee = getDeliveryFee();
    const platformFee = getPlatformFee();
    const gst = getGSTAmount();
    const discount = getDiscount();
    
    return itemTotal + deliveryFee + platformFee + gst - discount;
  };

  // Crypto conversions (mock rates)
  const getCryptoPrice = (currency = 'eth') => {
    const grandTotal = getGrandTotal();
    const inrToUsd = grandTotal / 83; // Mock conversion rate
    
    if (currency === 'eth') {
      return (inrToUsd / 3800).toFixed(4); // Mock ETH price
    } else if (currency === 'usdc') {
      return inrToUsd.toFixed(2);
    }
    return grandTotal;
  };

  const value = {
    cartItems,
    restaurantInfo,
    appliedCoupon,
    isEcoDelivery,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    toggleEcoDelivery,
    getItemTotal,
    getDeliveryFee,
    getPlatformFee,
    getGSTAmount,
    getDiscount,
    getGrandTotal,
    getCryptoPrice,
    cartCount: cartItems.reduce((count, item) => count + item.quantity, 0)
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};