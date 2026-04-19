import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Search, ShoppingBag, User, Wallet, LogOut, MapPin, Heart, Award, ChevronRight, ExternalLink, Star, Shield, Landmark } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useCart } from '../contexts/CartContext';
import { mockUserData, mockNFTs } from '../mockData';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';
import { useChainBite, ROLES } from '../hooks/useChainBite';
import { formatEther } from 'viem';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { walletConnected, getShortAddress, disconnectWallet, connectWallet, balance } = useWallet();
  const { cartCount } = useCart();
  const { address } = useAccount();
  const { useGetProfile, useGetReputation, useCheckRole } = useChainBite();

  const role = localStorage.getItem('chainbite_user_role') || 'customer';
  
  // Fetch data via custom hook library
  const { data: profile } = useGetProfile(address, role);
  const { data: reputationRaw } = useGetReputation(address);
  const { data: isOperator } = useCheckRole(address, ROLES.OPERATOR);

  const reputationScore = (reputationRaw != null) ? (Number(reputationRaw)).toFixed(1) : "0.0";
  const profileName = profile?.[0] || mockUserData.name;
  const profileSub = role === 'customer' ? (profile?.[1] || mockUserData.phone) : 'Registered Merchant';

  const handleLogout = () => {
    localStorage.removeItem('chainbite_logged_in');
    localStorage.removeItem('chainbite_phone');
    disconnectWallet();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header fade-in">
        <div className="header-bg"></div>
        <div className="profile-avatar">
          <User size={40} />
        </div>
        <h2 className="profile-name">{profileName}</h2>
        <p className="profile-phone">{profileSub}</p>
      </div>

      <div className="profile-content">
        {/* Wallet Card */}
        <div className="wallet-card slide-up">
          <div className="wallet-header">
            <div className="wallet-icon-wrapper">
              <Wallet size={24} style={{ color: '#00FFF0' }} />
            </div>
            <div className="wallet-info">
              <h3 className="wallet-title">Web3 Wallet</h3>
              {walletConnected ? (
                <p className="wallet-address">{getShortAddress()}</p>
              ) : (
                <p className="wallet-status">Not connected</p>
              )}
            </div>
          </div>
          {walletConnected ? (
            <div className="wallet-balances">
              <div className="balance-item">
                <span className="balance-label">ETH</span>
                <span className="balance-value">{balance.eth}</span>
              </div>
              <div className="balance-item">
                <span className="balance-label">USDC</span>
                <span className="balance-value">{balance.usdc}</span>
              </div>
              <div className="balance-item">
                <span className="balance-label">MATIC</span>
                <span className="balance-value">{balance.matic}</span>
              </div>
            </div>
          ) : (
            <Button className="connect-wallet-btn" onClick={connectWallet}>
              Connect Wallet
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="stats-section slide-up">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(230, 57, 70, 0.15)' }}>
              <ShoppingBag size={24} style={{ color: '#E63946' }} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Orders</span>
              <span className="stat-value">{mockUserData.totalOrders}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(0, 255, 240, 0.15)' }}>
              <Star size={24} style={{ color: '#00FFF0' }} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Reputation</span>
              <span className="stat-value">{reputationScore}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(57, 255, 20, 0.15)' }}>
              <Award size={24} style={{ color: '#39FF14' }} />
            </div>
            <div className="stat-info">
              <span className="stat-label">CO2 Saved</span>
              <span className="stat-value">{mockUserData.carbonSaved}kg</span>
            </div>
          </div>
        </div>

        {/* NFT Collection */}
        {mockUserData.nftsOwned > 0 && (
          <div className="nft-section slide-up">
            <div className="section-header">
              <h3 className="section-title">Green NFT Collection</h3>
              <span className="nft-count">{mockUserData.nftsOwned}</span>
            </div>
            <div className="nft-grid">
              {mockNFTs.map(nft => (
                <div key={nft.id} className="nft-card">
                  <img src={nft.image} alt={nft.name} className="nft-image" />
                  <div className="nft-info">
                    <h4 className="nft-name">{nft.name}</h4>
                    <p className="nft-desc">{nft.description}</p>
                    <div className="nft-meta">
                      <span className="nft-carbon">🌱 {nft.carbonSaved}kg CO2</span>
                      <span className="nft-network">{nft.network}</span>
                    </div>
                  </div>
                  <button className="nft-view-btn">
                    <ExternalLink size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Driver SBT Section */}
        {isOperator && (
          <div className="nft-section driver-section slide-up">
            <div className="section-header">
              <h3 className="section-title">Driver Profile SBT</h3>
              <span className="nft-count" style={{ background: 'rgba(0, 255, 240, 0.15)', color: '#00FFF0' }}>Verified</span>
            </div>
            <div className="nft-card driver-card">
              <div className="nft-icon driver-icon" style={{ fontSize: '32px', background: 'rgba(0, 255, 240, 0.1)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🪪</div>
              <div className="nft-info">
                <h4 className="nft-name">ChainBite Driver ID</h4>
                <p className="nft-desc">Soulbound Token proving protocol authorization and safety records.</p>
                <div className="nft-meta">
                  <span className="nft-network">Reputation Score: {reputationScore}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu Options */}
        <div className="menu-section slide-up">
          <button className="menu-item">
            <div className="menu-left">
              <MapPin size={20} />
              <span>Saved Addresses</span>
            </div>
            <ChevronRight size={20} />
          </button>
          
          {isOperator && (
            <button className="menu-item operator-item" onClick={() => navigate('/admin')}>
              <div className="menu-left">
                <Shield size={20} color="#00FFF0" />
                <span style={{ color: '#00FFF0' }}>Admin Terminal</span>
              </div>
              <ChevronRight size={20} color="#00FFF0" />
            </button>
          )}

          <button className="menu-item">
            <div className="menu-left">
              <Heart size={20} />
              <span>Favorites</span>
            </div>
            <ChevronRight size={20} />
          </button>
          <button className="menu-item">
            <div className="menu-left">
              <Award size={20} />
              <span>Rewards & Offers</span>
            </div>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Logout */}
        <Button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </Button>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <Link to="/home" className="nav-item">
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
        <Link to="/profile" className="nav-item active">
          <User size={24} />
          <span>Profile</span>
        </Link>
        <Link to="/dao" className="nav-item">
          <Landmark size={24} />
          <span>DAO</span>
        </Link>
      </div>

      <style jsx>{`
        .profile-page {
          min-height: 100vh;
          background: #0A0A0A;
          padding-bottom: 80px;
        }

        .profile-header {
          position: relative;
          padding: 40px 20px;
          text-align: center;
          overflow: hidden;
        }

        .header-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 150px;
          background: linear-gradient(135deg, rgba(230, 57, 70, 0.2) 0%, rgba(0, 255, 240, 0.2) 100%);
          filter: blur(60px);
          z-index: 1;
        }

        .profile-avatar {
          position: relative;
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #E63946 0%, #FF6B35 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: #FFFFFF;
          z-index: 2;
          box-shadow: 0 8px 24px rgba(230, 57, 70, 0.4);
        }

        .profile-name {
          position: relative;
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 4px 0;
          z-index: 2;
        }

        .profile-phone {
          position: relative;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
          z-index: 2;
        }

        .profile-content {
          padding: 0 20px 20px 20px;
        }

        .wallet-card {
          background: linear-gradient(135deg, rgba(0, 255, 240, 0.1) 0%, rgba(0, 255, 240, 0.05) 100%);
          border: 1px solid rgba(0, 255, 240, 0.3);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .wallet-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .wallet-icon-wrapper {
          width: 48px;
          height: 48px;
          background: rgba(0, 255, 240, 0.15);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wallet-info {
          flex: 1;
        }

        .wallet-title {
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 4px 0;
        }

        .wallet-address {
          font-size: 13px;
          color: #00FFF0;
          font-family: monospace;
          margin: 0;
        }

        .wallet-status {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
        }

        .wallet-balances {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .balance-item {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .balance-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
        }

        .balance-value {
          font-size: 16px;
          font-weight: 800;
          color: #00FFF0;
        }

        .connect-wallet-btn {
          width: 100%;
          background: #00FFF0;
          color: #000000;
          font-weight: 700;
          border: none;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
        }

        .stats-section {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        .stat-value {
          font-size: 20px;
          font-weight: 800;
          color: #FFFFFF;
        }

        .nft-section {
          margin-bottom: 24px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
        }

        .nft-count {
          background: rgba(57, 255, 20, 0.15);
          color: #39FF14;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
        }

        .nft-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .nft-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 12px;
          display: flex;
          gap: 12px;
          align-items: center;
          transition: all 0.3s;
        }

        .nft-card:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-2px);
        }

        .nft-image {
          width: 80px;
          height: 80px;
          border-radius: 10px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .nft-info {
          flex: 1;
        }

        .nft-name {
          font-size: 15px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 4px 0;
        }

        .nft-desc {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0 0 8px 0;
        }

        .nft-meta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .nft-carbon {
          font-size: 11px;
          background: rgba(57, 255, 20, 0.15);
          color: #39FF14;
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: 600;
        }

        .nft-network {
          font-size: 11px;
          background: rgba(0, 255, 240, 0.15);
          color: #00FFF0;
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: 600;
        }

        .nft-view-btn {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nft-view-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .menu-section {
          margin-bottom: 24px;
        }

        .menu-item {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 8px;
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .menu-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logout-btn {
          width: 100%;
          background: rgba(230, 57, 70, 0.1);
          border: 1px solid rgba(230, 57, 70, 0.3);
          color: #E63946;
          font-size: 16px;
          font-weight: 700;
          padding: 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .logout-btn:hover {
          background: rgba(230, 57, 70, 0.15);
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;