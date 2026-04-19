import React from 'react';
import { Link } from 'react-router-dom';
import {
  Store, ShoppingBag, DollarSign, Settings, Bell, ChevronRight
} from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useChainBite } from '../hooks/useChainBite';
import { useAccount } from 'wagmi';

const MerchantDashboard = () => {
  const { walletConnected, getShortAddress, balance } = useWallet();

  const { address } = useAccount();
  const { useGetProfile } = useChainBite();

  const { data: profile } = useGetProfile(address, 'restaurant');
  const merchantName = profile?.[0] || 'Restaurant Dashboard';
  const merchantLoc = profile?.[2] || (walletConnected ? getShortAddress() : 'Not Connected');

  return (
    <div className="merchant-dashboard">
      {/* Header */}
      <div className="dashboard-header fade-in">
        <div className="merchant-profile">
          <div className="merchant-avatar">
            <Store size={24} />
          </div>
          <div className="merchant-info">
            <h2>{merchantName}</h2>
            <p>{merchantLoc}</p>
          </div>
        </div>
        <button className="icon-btn"><Bell size={20} /></button>
      </div>

      {/* Content */}
      <div className="dashboard-content slide-up">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Wallet Balance</span>
            <span className="stat-value">{balance.eth} ETH</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pending Payouts</span>
            <span className="stat-value">Available</span>
          </div>
        </div>

        {/* Action Links */}
        <div className="action-list">
          <Link className="action-item" to="/orders">
            <div className="action-left">
              <ShoppingBag size={20} />
              <span>Active Orders</span>
            </div>
            <ChevronRight size={18} />
          </Link>

          <Link className="action-item" to="/payouts">
            <div className="action-left">
              <DollarSign size={20} />
              <span>Payouts &amp; Earnings</span>
            </div>
            <ChevronRight size={18} />
          </Link>

          <Link className="action-item" to="/menu-management">
            <div className="action-left">
              <Settings size={20} />
              <span>Menu Management</span>
            </div>
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>



      <style>{`
        .merchant-dashboard {
          min-height: 100vh;
          background: #0A0A0A;
          color: white;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        .merchant-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .merchant-avatar {
          width: 48px;
          height: 48px;
          background: rgba(0, 255, 240, 0.1);
          border: 1px solid rgba(0, 255, 240, 0.3);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00FFF0;
        }

        .merchant-info h2 {
          font-size: 18px;
          font-weight: 800;
          margin: 0;
          color: white;
        }

        .merchant-info p {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
          font-family: monospace;
        }

        .icon-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: #111;
          border: 1px solid #222;
          padding: 16px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 600;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 800;
          color: #00FFF0;
        }

        .action-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .action-item {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 16px;
          border-radius: 16px;
          color: white;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-item:hover {
          background: rgba(255, 255, 255, 0.07);
          transform: translateX(3px);
          border-color: rgba(0, 255, 240, 0.2);
        }

        .action-left {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
          font-size: 15px;
        }


      `}</style>
    </div>
  );
};

export default MerchantDashboard;
