import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, MapPin, Heart, Share2 } from 'lucide-react';
import { mockRestaurants, mockFoodItems } from '../mockData';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const RestaurantPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);

  useEffect(() => {
    const foundRestaurant = mockRestaurants.find(r => r.id === parseInt(id));
    setRestaurant(foundRestaurant);
    
    // Get menu items for this restaurant
    const items = mockFoodItems.filter(item => item.restaurantId === parseInt(id));
    setMenuItems(items);
  }, [id]);

  if (!restaurant) {
    return <div className="loading-page"><div className="loading-spinner"></div></div>;
  }

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  
  const filteredItems = menuItems.filter(item => {
    const categoryMatch = activeCategory === 'All' || item.category === activeCategory;
    const vegMatch = !vegOnly || item.isVeg;
    return categoryMatch && vegMatch;
  });

  const getItemQuantity = (itemId) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (item) => {
    const success = addToCart(item, restaurant);
    if (success) {
      toast.success(`${item.name} added to cart`);
    }
  };

  return (
    <div className="restaurant-page">
      {/* Header */}
      <div className="restaurant-hero">
        <img src={restaurant.image} alt={restaurant.name} className="hero-image" />
        <div className="hero-overlay"></div>
        
        <button className="back-btn" onClick={() => navigate('/home')}>
          <ArrowLeft size={24} />
        </button>

        <div className="hero-actions">
          <button className="action-btn">
            <Heart size={20} />
          </button>
          <button className="action-btn">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="restaurant-details fade-in">
        <div className="details-header">
          <div>
            <h1 className="restaurant-name">{restaurant.name}</h1>
            <p className="restaurant-cuisine">{restaurant.cuisine}</p>
          </div>
          {restaurant.verified && (
            <div className="verified-badge-large">
              <span>✓</span>
            </div>
          )}
        </div>

        <div className="restaurant-stats">
          <div className="stat-item">
            <Star size={16} style={{ color: '#FFD700' }} />
            <span>{restaurant.rating}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <Clock size={16} style={{ color: '#00FFF0' }} />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <MapPin size={16} style={{ color: '#E63946' }} />
            <span>{restaurant.distance}</span>
          </div>
        </div>

        {restaurant.offers.length > 0 && (
          <div className="restaurant-offer-banner">
            <span className="offer-icon">🎉</span>
            <span>{restaurant.offers[0]}</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="menu-filters">
        <button
          className={`filter-chip ${vegOnly ? 'active' : ''}`}
          onClick={() => setVegOnly(!vegOnly)}
        >
          <span className="veg-indicator"></span>
          <span>Veg Only</span>
        </button>
      </div>

      {/* Categories */}
      <div className="categories-scroll">
        {categories.map(category => (
          <button
            key={category}
            className={`category-chip ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="menu-section">
        <h2 className="menu-title">Menu</h2>
        <div className="menu-items">
          {filteredItems.map(item => {
            const quantity = getItemQuantity(item.id);
            return (
              <div key={item.id} className="menu-item slide-up">
                <div className="item-info">
                  <div className="item-veg-indicator">
                    <span className={item.isVeg ? 'veg-dot' : 'non-veg-dot'}></span>
                  </div>
                  {item.isBestseller && (
                    <div className="bestseller-badge">
                      <Star size={12} style={{ color: '#FFD700' }} />
                      <span>Bestseller</span>
                    </div>
                  )}
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-description">{item.description}</p>
                  <div className="item-pricing">
                    <span className="item-price">₹{item.price}</span>
                    <span className="item-price-crypto">{item.ethPrice} ETH</span>
                  </div>
                </div>
                <div className="item-image-section">
                  <img src={item.image} alt={item.name} className="item-image" />
                  {quantity === 0 ? (
                    <Button
                      className="add-btn"
                      onClick={() => handleAddToCart(item)}
                    >
                      ADD
                    </Button>
                  ) : (
                    <div className="quantity-controls">
                      <button
                        className="qty-btn"
                        onClick={() => {
                          const cartItem = cartItems.find(ci => ci.id === item.id);
                          if (cartItem.quantity > 1) {
                            addToCart({ ...item, quantity: -1 }, restaurant);
                          } else {
                            // Remove item
                          }
                        }}
                      >
                        -
                      </button>
                      <span className="qty-display">{quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => handleAddToCart(item)}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* View Cart Button */}
      {cartItems.length > 0 && (
        <div className="view-cart-container">
          <Button
            className="view-cart-btn"
            onClick={() => navigate('/cart')}
          >
            <span>View Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
            <span>₹{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
          </Button>
        </div>
      )}

      <style jsx>{`
        .restaurant-page {
          min-height: 100vh;
          background: #0A0A0A;
          padding-bottom: 120px;
        }

        .restaurant-hero {
          position: relative;
          width: 100%;
          height: 240px;
          overflow: hidden;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(to top, #0A0A0A, transparent);
        }

        .back-btn {
          position: absolute;
          top: 20px;
          left: 20px;
          width: 40px;
          height: 40px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-btn:hover {
          background: rgba(0, 0, 0, 0.8);
        }

        .hero-actions {
          position: absolute;
          top: 20px;
          right: 20px;
          display: flex;
          gap: 8px;
        }

        .action-btn {
          width: 40px;
          height: 40px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: rgba(0, 0, 0, 0.8);
          color: #E63946;
        }

        .restaurant-details {
          padding: 20px;
          background: #0A0A0A;
        }

        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .restaurant-name {
          font-size: 28px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 4px 0;
        }

        .restaurant-cuisine {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
        }

        .verified-badge-large {
          width: 36px;
          height: 36px;
          background: #00FFF0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000000;
          font-size: 18px;
          font-weight: 700;
        }

        .restaurant-stats {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
        }

        .stat-divider {
          width: 1px;
          height: 16px;
          background: rgba(255, 255, 255, 0.2);
        }

        .restaurant-offer-banner {
          background: linear-gradient(135deg, rgba(230, 57, 70, 0.15) 0%, rgba(230, 57, 70, 0.05) 100%);
          border: 1px solid rgba(230, 57, 70, 0.3);
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #E63946;
        }

        .offer-icon {
          font-size: 20px;
        }

        .menu-filters {
          padding: 0 20px 16px 20px;
          display: flex;
          gap: 8px;
        }

        .filter-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-chip.active {
          background: rgba(57, 255, 20, 0.15);
          border-color: #39FF14;
          color: #39FF14;
        }

        .veg-indicator {
          width: 14px;
          height: 14px;
          border: 2px solid #39FF14;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .veg-indicator::after {
          content: '';
          width: 6px;
          height: 6px;
          background: #39FF14;
          border-radius: 50%;
        }

        .categories-scroll {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 0 20px 20px 20px;
          scrollbar-width: none;
        }

        .categories-scroll::-webkit-scrollbar {
          display: none;
        }

        .category-chip {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .category-chip.active {
          background: #E63946;
          border-color: #E63946;
          color: #FFFFFF;
        }

        .menu-section {
          padding: 0 20px;
        }

        .menu-title {
          font-size: 22px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 20px 0;
        }

        .menu-items {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .menu-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          gap: 16px;
          justify-content: space-between;
        }

        .item-info {
          flex: 1;
        }

        .item-veg-indicator {
          width: 18px;
          height: 18px;
          border: 2px solid;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        .veg-dot {
          width: 8px;
          height: 8px;
          background: #39FF14;
          border-radius: 50%;
        }

        .non-veg-dot {
          width: 8px;
          height: 8px;
          background: #E63946;
          border-radius: 50%;
        }

        .item-veg-indicator:has(.veg-dot) {
          border-color: #39FF14;
        }

        .item-veg-indicator:has(.non-veg-dot) {
          border-color: #E63946;
        }

        .bestseller-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 215, 0, 0.15);
          border: 1px solid rgba(255, 215, 0, 0.3);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #FFD700;
          margin-bottom: 8px;
        }

        .item-name {
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 6px 0;
        }

        .item-description {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0 0 10px 0;
          line-height: 1.5;
        }

        .item-pricing {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .item-price {
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
        }

        .item-price-crypto {
          font-size: 12px;
          font-weight: 600;
          color: #00FFF0;
          background: rgba(0, 255, 240, 0.1);
          padding: 4px 8px;
          border-radius: 6px;
        }

        .item-image-section {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .item-image {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 12px;
        }

        .add-btn {
          width: 100px;
          height: 36px;
          background: #E63946;
          color: #FFFFFF;
          font-size: 14px;
          font-weight: 700;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-btn:hover {
          background: #FF3B30;
          transform: scale(1.05);
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #E63946;
          padding: 6px 10px;
          border-radius: 10px;
        }

        .qty-btn {
          width: 24px;
          height: 24px;
          background: #FFFFFF;
          color: #E63946;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .qty-btn:hover {
          transform: scale(1.1);
        }

        .qty-display {
          font-size: 14px;
          font-weight: 700;
          color: #FFFFFF;
          min-width: 20px;
          text-align: center;
        }

        .view-cart-container {
          position: sticky;
          width: 100%;
          bottom: 20px;
          left: 20px;
          right: 20px;
          z-index: 100;
        }

        .view-cart-btn {
          width: 100%;
          height: 56px;
          background: #E63946;
          color: #FFFFFF;
          font-size: 16px;
          font-weight: 700;
          border: none;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 8px 24px rgba(230, 57, 70, 0.4);
        }

        .view-cart-btn:hover {
          background: #FF3B30;
          transform: translateY(-2px);
        }

        .loading-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0A0A0A;
        }
      `}</style>
    </div>
  );
};

export default RestaurantPage;