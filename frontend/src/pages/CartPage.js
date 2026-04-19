import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Tag, Leaf } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { mockOffers } from '../mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { toast } from 'sonner';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    restaurantInfo,
    updateQuantity,
    removeFromCart,
    getItemTotal,
    getDeliveryFee,
    getPlatformFee,
    getGSTAmount,
    getDiscount,
    getGrandTotal,
    applyCoupon,
    appliedCoupon,
    removeCoupon,
    isEcoDelivery,
    toggleEcoDelivery,
    getCryptoPrice
  } = useCart();

  const [showCoupons, setShowCoupons] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  if (cartItems.length === 0) {
  return (
    <div className="empty-cart">
      <div className="empty-content">

        <div className="empty-icon">🍔</div>

        <h2>Your cart is empty</h2>
        <p>Looks like you haven’t added anything yet</p>

        <Button
          onClick={() => navigate('/home')}
          className="browse-btn"
        >
          Browse Restaurants
        </Button>
      </div>
    </div>
  );
}

  const handleApplyCoupon = (coupon) => {
    if (!coupon) {
      const found = mockOffers.find(o => o.code === couponCode.toUpperCase());
      if (!found) {
        toast.error('Invalid coupon code');
        return;
      }
      coupon = found;
    }

    if (getItemTotal() < coupon.minOrder) {
      toast.error(`Minimum order value ₹${coupon.minOrder} required`);
      return;
    }

    applyCoupon(coupon);
    toast.success(`Coupon ${coupon.code} applied!`);
    setShowCoupons(false);
    setCouponCode('');
  };

  return (
    <div className="cart-page">
      {/* Header */}
      <div className="cart-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="page-title">Cart</h1>
        <div></div>
      </div>

      <div className="cart-content">
        {/* Restaurant Info */}
        {restaurantInfo && (
          <div className="cart-restaurant-info fade-in">
            <img src={restaurantInfo.image} alt={restaurantInfo.name} className="restaurant-thumb" />
            <div>
              <h3 className="restaurant-name">{restaurantInfo.name}</h3>
              <p className="restaurant-location">{restaurantInfo.cuisine}</p>
            </div>
          </div>
        )}

        {/* Eco Delivery Toggle */}
        <div className="eco-delivery-card slide-up">
          <div className="eco-info">
            <div className="eco-icon">
              <Leaf size={24} style={{ color: '#39FF14' }} />
            </div>
            <div>
              <h4 className="eco-title">Eco-Friendly Delivery</h4>
              <p className="eco-subtitle">Save ₹20 & earn Green NFT rewards</p>
            </div>
          </div>
          <Switch
            checked={isEcoDelivery}
            onCheckedChange={toggleEcoDelivery}
          />
        </div>

        {/* Cart Items */}
        <div className="cart-items-section slide-up">
          <h2 className="section-title">Items ({cartItems.length})</h2>
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-veg-indicator">
                <span className={item.isVeg ? 'veg-dot' : 'non-veg-dot'}></span>
              </div>
              <div className="cart-item-info">
                <h4 className="item-name">{item.name}</h4>
                <div className="item-price-row">
                  <span className="item-price">₹{item.price}</span>
                  <span className="item-price-crypto">{item.ethPrice} ETH</span>
                </div>
              </div>
              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => {
                    removeFromCart(item.id);
                    toast.success('Item removed');
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Coupons Section */}
        <div className="coupons-section slide-up">
          <button className="coupons-toggle" onClick={() => setShowCoupons(!showCoupons)}>
            <div className="coupons-left">
              <Tag size={20} style={{ color: '#E63946' }} />
              <span>
                {appliedCoupon ? `${appliedCoupon.code} applied` : 'Apply coupon'}
              </span>
            </div>
            {appliedCoupon && (
              <button
                className="remove-coupon-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeCoupon();
                  toast.info('Coupon removed');
                }}
              >
                Remove
              </button>
            )}
          </button>

          {showCoupons && (
            <div className="coupons-dropdown fade-in">
              <div className="coupon-input-group">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="coupon-input"
                />
                <Button onClick={() => handleApplyCoupon(null)} className="apply-btn">
                  Apply
                </Button>
              </div>

              <div className="available-coupons">
                <p className="coupons-label">Available Coupons</p>
                {mockOffers.map(offer => (
                  <div key={offer.id} className="coupon-card">
                    <div className="coupon-info">
                      <h4 className="coupon-title">{offer.title}</h4>
                      <p className="coupon-desc">{offer.description}</p>
                      <span className="coupon-code">{offer.code}</span>
                    </div>
                    <Button
                      className="apply-coupon-btn"
                      onClick={() => handleApplyCoupon(offer)}
                      disabled={getItemTotal() < offer.minOrder}
                    >
                      Apply
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bill Details */}
        <div className="bill-section slide-up">
          <h2 className="section-title">Bill Details</h2>
          <div className="bill-row">
            <span>Item Total</span>
            <span>₹{getItemTotal()}</span>
          </div>
          <div className="bill-row">
            <span>Delivery Fee {isEcoDelivery && <span className="eco-tag">ECO</span>}</span>
            <span>₹{getDeliveryFee()}</span>
          </div>
          <div className="bill-row">
            <span>Platform Fee</span>
            <span className="zero-fee">₹{getPlatformFee()} <span className="fee-badge">0% Commission!</span></span>
          </div>
          <div className="bill-row">
            <span>GST (5%)</span>
            <span>₹{getGSTAmount()}</span>
          </div>
          {getDiscount() > 0 && (
            <div className="bill-row discount-row">
              <span>Discount</span>
              <span>-₹{getDiscount()}</span>
            </div>
          )}
          <div className="bill-divider"></div>
          <div className="bill-row total-row">
            <span>Grand Total</span>
            <div className="total-prices">
              <span className="total-fiat">₹{getGrandTotal()}</span>
              <span className="total-crypto">{getCryptoPrice('eth')} ETH</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="checkout-container">
        <Button
          className="checkout-btn"
          onClick={() => navigate('/checkout')}
        >
          Proceed to Checkout
        </Button>
      </div>

      <style jsx>{`
        .cart-page {
          min-height: 100vh;
          background: #0A0A0A;
          padding-bottom: 100px;
        }

        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .back-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .page-title {
          font-size: 20px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
        }

        .cart-content {
          padding: 20px;
        }

        .cart-restaurant-info {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 16px;
        }

        .restaurant-thumb {
          width: 60px;
          height: 60px;
          border-radius: 10px;
          object-fit: cover;
        }

        .restaurant-name {
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 4px 0;
        }

        .restaurant-location {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
        }

        .eco-delivery-card {
          background: linear-gradient(135deg, rgba(57, 255, 20, 0.1) 0%, rgba(57, 255, 20, 0.05) 100%);
          border: 1px solid rgba(57, 255, 20, 0.3);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .eco-info {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .eco-icon {
          width: 48px;
          height: 48px;
          background: rgba(57, 255, 20, 0.15);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .eco-title {
          font-size: 15px;
          font-weight: 700;
          color: #39FF14;
          margin: 0 0 4px 0;
        }

        .eco-subtitle {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
        }

        .section-title {
          font-size: 18px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 16px 0;
        }

        .cart-items-section {
          margin-bottom: 20px;
        }

        .cart-item {
          display: flex;
          gap: 12px;
          padding: 16px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .item-veg-indicator {
          width: 16px;
          height: 16px;
          border: 2px solid;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .veg-dot {
          width: 6px;
          height: 6px;
          background: #39FF14;
          border-radius: 50%;
        }

        .non-veg-dot {
          width: 6px;
          height: 6px;
          background: #E63946;
          border-radius: 50%;
        }

        .item-veg-indicator:has(.veg-dot) {
          border-color: #39FF14;
        }

        .item-veg-indicator:has(.non-veg-dot) {
          border-color: #E63946;
        }

        .cart-item-info {
          flex: 1;
        }

        .item-name {
          font-size: 15px;
          font-weight: 600;
          color: #FFFFFF;
          margin: 0 0 6px 0;
        }

        .item-price-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .item-price {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
        }

        .item-price-crypto {
          font-size: 11px;
          font-weight: 600;
          color: #00FFF0;
          background: rgba(0, 255, 240, 0.1);
          padding: 3px 6px;
          border-radius: 5px;
        }

        .cart-item-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: flex-end;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 4px 8px;
          border-radius: 8px;
        }

        .qty-btn {
          width: 24px;
          height: 24px;
          background: #E63946;
          color: #FFFFFF;
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

        .delete-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: color 0.2s;
        }

        .delete-btn:hover {
          color: #E63946;
        }

        .coupons-section {
          margin-bottom: 20px;
        }

        .coupons-toggle {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 16px;
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .coupons-toggle:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .coupons-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .remove-coupon-btn {
          background: none;
          border: none;
          color: #E63946;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .remove-coupon-btn:hover {
          background: rgba(230, 57, 70, 0.1);
        }

        .coupons-dropdown {
          margin-top: 12px;
        }

        .coupon-input-group {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .coupon-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
          padding: 10px 12px;
          border-radius: 8px;
        }

        .apply-btn {
          background: #E63946;
          color: #FFFFFF;
          font-weight: 600;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
        }

        .coupons-label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0 0 12px 0;
        }

        .coupon-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .coupon-info {
          flex: 1;
        }

        .coupon-title {
          font-size: 14px;
          font-weight: 700;
          color: #E63946;
          margin: 0 0 4px 0;
        }

        .coupon-desc {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          margin: 0 0 6px 0;
        }

        .coupon-code {
          font-size: 11px;
          font-weight: 700;
          color: #E63946;
          background: rgba(230, 57, 70, 0.1);
          padding: 4px 8px;
          border-radius: 6px;
          border: 1px dashed #E63946;
        }

        .apply-coupon-btn {
          background: #E63946;
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 600;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
        }

        .apply-coupon-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .bill-section {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 16px;
        }

        .bill-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 12px;
        }

        .eco-tag {
          font-size: 10px;
          font-weight: 700;
          color: #39FF14;
          background: rgba(57, 255, 20, 0.15);
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 6px;
        }

        .zero-fee {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .fee-badge {
          font-size: 10px;
          font-weight: 700;
          color: #39FF14;
          background: rgba(57, 255, 20, 0.15);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .discount-row {
          color: #39FF14;
        }

        .bill-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 12px 0;
        }

        .total-row {
          font-size: 18px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
        }

        .total-prices {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .total-fiat {
          font-size: 18px;
          font-weight: 800;
        }

        .total-crypto {
          font-size: 13px;
          font-weight: 600;
          color: #00FFF0;
          background: rgba(0, 255, 240, 0.15);
          padding: 4px 10px;
          border-radius: 8px;
        }

        .checkout-container {
          position: sticky;
          bottom: 20px;
          left: 20px;
          right: 20px;
          z-index: 100;
        }

        .checkout-btn {
          width: 100%;
          height: 56px;
          background: #E63946;
          color: #FFFFFF;
          font-size: 16px;
          font-weight: 700;
          border: none;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 8px 24px rgba(230, 57, 70, 0.4);
        }

        .checkout-btn:hover {
          background: #FF3B30;
          transform: translateY(-2px);
        }

        .empty-cart {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        padding: 20px;
      }

      .empty-content {
        text-align: center;
        max-width: 320px;
      }

      .empty-icon {
        font-size: 64px;
        margin-bottom: 16px;
        opacity: 0.9;
      }

      .empty-content h2 {
        font-size: 26px;
        font-weight: 800;
        margin-bottom: 6px;
      }

      .empty-content p {
        color: #aaa;
        margin-bottom: 20px;
      }

      .browse-btn {
        width: 100%;
        padding: 16px;
        border-radius: 14px;
      }
      `}</style>
    </div>
  );
};

export default CartPage;