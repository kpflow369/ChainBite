import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Search, Wallet, Home, ShoppingBag, User, Zap, Sparkles, Landmark } from 'lucide-react';
import { mockRestaurants, mockCuisines, mockOffers } from '../mockData';
import { useWallet } from '../contexts/WalletContext';
import { useCart } from '../contexts/CartContext';
import { useChainBite } from '../hooks/useChainBite';
import { useAccount } from 'wagmi';


const HomePage = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { walletConnected, getShortAddress, balance } = useWallet();
  const { cartCount } = useCart();
  const { useGetProfile } = useChainBite();
  
  // Fetch profile
  const role = localStorage.getItem('chainbite_user_role') || 'customer';
  const { data: profile } = useGetProfile(address, role);

  const displayLocation = profile?.[1] || 'Crypto Campus, Bangalore';
  const displayName = profile?.[0] || 'User';

  return (
    <div className="home-page">
      {/* Header */}
      <div className="home-header">
        <div className="header-top">
          <button className="location-btn" onClick={() => {}}>
            <MapPin size={20} style={{ color: '#E63946' }} />
            <div className="location-text">
              <span className="location-label">Deliver to</span>
              <span className="location-name">{displayLocation}</span>
            </div>
          </button>
          
          {walletConnected && (
            <div className="wallet-badge">
              <Wallet size={16} />
              <span>{getShortAddress()}</span>
              <span className="balance">{parseFloat(balance.eth).toFixed(3)} ETH</span>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <button className="search-bar" onClick={() => navigate('/search')}>
          <Search size={20} style={{ color: 'rgba(255, 255, 255, 0.4)' }} />
          <span>Search for restaurants, cuisines...</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="home-content">
        {/* Offers Banner */}
        <div className="welcome-greeting fade-in">
          <h1>Namaste, {displayName}!</h1>
          <p>Hungry for some decentralized food?</p>
        </div>

        <div className="offers-section fade-in">
          <div className="section-header">
            <h2 className="section-title">Web3 Exclusive Offers</h2>
            <Sparkles size={20} style={{ color: '#39FF14' }} />
          </div>
          <div className="offers-scroll">
            {mockOffers.map(offer => (
              <div key={offer.id} className="offer-card">
                <div className="offer-icon">
                  <Zap size={24} style={{ color: '#E63946' }} />
                </div>
                <h3 className="offer-title">{offer.title}</h3>
                <p className="offer-desc">{offer.description}</p>
                <div className="offer-code">{offer.code}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cuisines */}
        <div className="cuisines-section slide-up">
          <h2 className="section-title">What's on your mind?</h2>
          <div className="cuisines-grid">
            {mockCuisines.map(cuisine => (
              <button key={cuisine.id} className="cuisine-card">
                <div className="cuisine-icon" style={{ background: `${cuisine.color}20` }}>
                  <span style={{ fontSize: '32px' }}>{cuisine.icon}</span>
                </div>
                <span className="cuisine-name">{cuisine.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Restaurants */}
        <div className="restaurants-section slide-up">
          <h2 className="section-title">Restaurants near you</h2>
          <div className="restaurants-list">
            {mockRestaurants.map(restaurant => (
              <div
                key={restaurant.id}
                className="restaurant-card"
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              >
                <div className="restaurant-image-wrapper">
                  <img src={restaurant.image} alt={restaurant.name} className="restaurant-image" />
                  {restaurant.isEcoFriendly && (
                    <div className="eco-badge">
                      <span>🌱</span>
                      <span>Eco</span>
                    </div>
                  )}
                  {restaurant.acceptsCrypto && (
                    <div className="crypto-badge">
                      <Wallet size={12} />
                    </div>
                  )}
                </div>
                <div className="restaurant-info">
                  <div className="restaurant-header">
                    <h3 className="restaurant-name">{restaurant.name}</h3>
                    {restaurant.verified && <span className="verified-badge">✓</span>}
                  </div>
                  <p className="restaurant-cuisine">{restaurant.cuisine}</p>
                  <div className="restaurant-meta">
                    <span className="rating">⭐ {restaurant.rating}</span>
                    <span className="dot">•</span>
                    <span>{restaurant.deliveryTime}</span>
                    <span className="dot">•</span>
                    <span>{restaurant.distance}</span>
                  </div>
                  <div className="restaurant-pricing">
                    <span className="price-fiat">₹{restaurant.costForTwo} for two</span>
                    <span className="price-crypto">{restaurant.ethPrice} ETH</span>
                  </div>
                  {restaurant.offers.length > 0 && (
                    <div className="restaurant-offers">
                      <Zap size={12} style={{ color: '#E63946' }} />
                      <span>{restaurant.offers[0]}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <Link to="/home" className="nav-item active">
          <Home size={24} />
          <span>Home</span>
        </Link>
        <Link to="/search" className="nav-item">
          <Search size={24} />
          <span>Search</span>
        </Link>
        <Link to="/cart" className="nav-item">
          <ShoppingBag size={24} />
          {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
          <span>Cart</span>
        </Link>
        <Link to="/profile" className="nav-item">
          <User size={24} />
          <span>Profile</span>
        </Link>
        <Link to="/dao" className="nav-item">
          <Landmark size={24} />
          <span>DAO</span>
        </Link>
      </div>

      <style jsx>{`
        .home-page {
          min-height: 100vh;
          background: #0A0A0A;
          padding-bottom: 80px;
        }

        .home-header {
          background: linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%);
          padding: 20px;
          position: relative;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .location-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: #FFFFFF;
          cursor: pointer;
          padding: 0;
        }

        .location-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .location-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        .location-name {
          font-size: 14px;
          font-weight: 600;
          color: #FFFFFF;
        }

        .wallet-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 255, 240, 0.1);
          border: 1px solid rgba(0, 255, 240, 0.3);
          padding: 8px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          color: #00FFF0;
        }

        .balance {
          color: #39FF14;
          margin-left: 4px;
        }

        .search-bar {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 14px 16px;
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.4);
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .search-bar:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .home-content {
          padding: 24px 20px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .section-title {
          font-size: 22px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 16px 0;
        }

        .offers-section {
          margin-bottom: 32px;
        }

        .offers-scroll {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 8px;
          scrollbar-width: none;
        }

        .offers-scroll::-webkit-scrollbar {
          display: none;
        }

        .offer-card {
          min-width: 280px;
          background: linear-gradient(135deg, rgba(230, 57, 70, 0.15) 0%, rgba(230, 57, 70, 0.05) 100%);
          border: 1px solid rgba(230, 57, 70, 0.3);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .offer-icon {
          width: 48px;
          height: 48px;
          background: rgba(230, 57, 70, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .offer-title {
          font-size: 20px;
          font-weight: 800;
          color: #E63946;
          margin: 0;
        }

        .offer-desc {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .offer-code {
          display: inline-block;
          background: rgba(230, 57, 70, 0.2);
          color: #E63946;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          border: 1px dashed #E63946;
          align-self: flex-start;
          margin-top: 4px;
        }

        .cuisines-section {
          margin-bottom: 32px;
        }

        .cuisines-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .cuisine-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .cuisine-card:hover {
          background: rgba(255, 255, 255, 0.06);
          transform: translateY(-4px);
        }

        .cuisine-icon {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cuisine-name {
          font-size: 13px;
          font-weight: 600;
          color: #FFFFFF;
        }

        .restaurants-section {
          margin-bottom: 32px;
        }

        .restaurants-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .restaurant-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s;
        }

        .restaurant-card:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }

        .restaurant-image-wrapper {
          position: relative;
          width: 100%;
          height: 180px;
          overflow: hidden;
        }

        .restaurant-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .eco-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(57, 255, 20, 0.9);
          backdrop-filter: blur(10px);
          color: #000000;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .crypto-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 255, 240, 0.9);
          backdrop-filter: blur(10px);
          color: #000000;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .restaurant-info {
          padding: 16px;
        }

        .restaurant-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }

        .restaurant-name {
          font-size: 18px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0;
        }

        .verified-badge {
          background: #00FFF0;
          color: #000000;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
        }

        .restaurant-cuisine {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0 0 8px 0;
        }

        .restaurant-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 8px;
        }

        .rating {
          color: #FFD700;
          font-weight: 600;
        }

        .dot {
          color: rgba(255, 255, 255, 0.3);
        }

        .restaurant-pricing {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .price-fiat {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
        }

        .price-crypto {
          font-size: 12px;
          font-weight: 600;
          color: #00FFF0;
          background: rgba(0, 255, 240, 0.1);
          padding: 4px 8px;
          border-radius: 6px;
        }

        .restaurant-offers {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #E63946;
          background: rgba(230, 57, 70, 0.1);
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid rgba(230, 57, 70, 0.2);
        }
      `}</style>
    </div>
  );
};

export default HomePage;