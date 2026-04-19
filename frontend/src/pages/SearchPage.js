import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search as SearchIcon, ArrowLeft, Home, ShoppingBag, User, TrendingUp, Clock, Landmark } from 'lucide-react';
import { mockRestaurants, mockCuisines } from '../mockData';
import { useCart } from '../contexts/CartContext';
import { Input } from '../components/ui/input';

const SearchPage = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches] = useState([
    'Pizza',
    'Burgers',
    'South Indian',
    'Desserts'
  ]);

  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    const query = searchQuery.toLowerCase();
    return (
      restaurant.name.toLowerCase().includes(query) ||
      restaurant.cuisine.toLowerCase().includes(query) ||
      restaurant.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const trendingSearches = ['Biryani', 'Chinese', 'Ice Cream', 'North Indian'];

  return (
    <div className="search-page">
      {/* Header */}
      <div className="search-header">
        <button className="back-btn" onClick={() => navigate('/home')}>
          <ArrowLeft size={24} />
        </button>
        <div className="search-input-wrapper">
          <SearchIcon size={20} style={{ color: 'rgba(255, 255, 255, 0.4)' }} />
          <Input
            placeholder="Search for restaurants, cuisines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            autoFocus
          />
        </div>
      </div>

      <div className="search-content">
        {!searchQuery ? (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="search-section fade-in">
                <div className="section-header">
                  <Clock size={18} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                  <h2 className="section-title">Recent Searches</h2>
                </div>
                <div className="search-chips">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      className="search-chip"
                      onClick={() => setSearchQuery(search)}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending */}
            <div className="search-section slide-up">
              <div className="section-header">
                <TrendingUp size={18} style={{ color: '#E63946' }} />
                <h2 className="section-title">Trending</h2>
              </div>
              <div className="search-chips">
                {trendingSearches.map((search, index) => (
                  <button
                    key={index}
                    className="search-chip trending"
                    onClick={() => setSearchQuery(search)}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Cuisines */}
            <div className="search-section slide-up">
              <h2 className="section-title">Popular Cuisines</h2>
              <div className="cuisines-grid">
                {mockCuisines.map(cuisine => (
                  <button
                    key={cuisine.id}
                    className="cuisine-card"
                    onClick={() => setSearchQuery(cuisine.name)}
                  >
                    <div className="cuisine-icon" style={{ background: `${cuisine.color}20` }}>
                      <span style={{ fontSize: '32px' }}>{cuisine.icon}</span>
                    </div>
                    <span className="cuisine-name">{cuisine.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Search Results */}
            {filteredRestaurants.length > 0 ? (
              <div className="search-results fade-in">
                <p className="results-count">{filteredRestaurants.length} restaurants found</p>
                <div className="restaurants-list">
                  {filteredRestaurants.map(restaurant => (
                    <div
                      key={restaurant.id}
                      className="restaurant-card"
                      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                    >
                      <img src={restaurant.image} alt={restaurant.name} className="restaurant-image" />
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-results fade-in">
                <div className="no-results-icon">🔍</div>
                <h3>No results found</h3>
                <p>Try searching for something else</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <Link to="/home" className="nav-item">
          <Home size={24} />
          <span>Home</span>
        </Link>
        <Link to="/search" className="nav-item active">
          <SearchIcon size={24} />
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
        .search-page {
          min-height: 100vh;
          background: #0A0A0A;
          padding-bottom: 80px;
        }

        .search-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px;
          background: #0A0A0A;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          position: sticky;
          top: 0;
          z-index: 100;
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
          flex-shrink: 0;
        }

        .search-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 0 16px;
        }

        .search-input {
          flex: 1;
          background: none;
          border: none;
          color: #FFFFFF;
          font-size: 15px;
          padding: 12px 0;
          outline: none;
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .search-content {
          padding: 24px 20px;
        }

        .search-section {
          margin-bottom: 32px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
        }

        .search-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .search-chip {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
          padding: 10px 18px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .search-chip:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .search-chip.trending {
          background: rgba(230, 57, 70, 0.1);
          border-color: rgba(230, 57, 70, 0.3);
          color: #E63946;
        }

        .search-chip.trending:hover {
          background: rgba(230, 57, 70, 0.15);
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

        .search-results {
          margin-top: 8px;
        }

        .results-count {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          margin: 0 0 20px 0;
        }

        .restaurants-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .restaurant-card {
          display: flex;
          gap: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .restaurant-card:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-2px);
        }

        .restaurant-image {
          width: 100px;
          height: 100px;
          border-radius: 10px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .restaurant-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .restaurant-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }

        .restaurant-name {
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0;
        }

        .verified-badge {
          background: #00FFF0;
          color: #000000;
          width: 16px;
          height: 16px;
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
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        .rating {
          color: #FFD700;
          font-weight: 600;
        }

        .dot {
          color: rgba(255, 255, 255, 0.3);
        }

        .no-results {
          text-align: center;
          padding: 60px 20px;
        }

        .no-results-icon {
          font-size: 80px;
          margin-bottom: 20px;
        }

        .no-results h3 {
          font-size: 20px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 8px 0;
        }

        .no-results p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default SearchPage;