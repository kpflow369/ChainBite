import React from 'react';
import { CheckCircle, Clock, ArrowRight, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { walletConnected } = useWallet();

  // For now, this lists recent on-chain activity or mock orders linked to the user
  const orders = [
    {
      id: 'CB-1024',
      restaurant: 'Satoshi Snacks',
      status: 'Delivering',
      amount: '0.045 ETH',
      time: '12 mins ago',
      icon: <Clock color="#FFD700" size={20} />
    },
    {
      id: 'CB-1021',
      restaurant: 'Vitalik Veggies',
      status: 'Completed',
      amount: '0.032 ETH',
      time: '2 hours ago',
      icon: <CheckCircle color="#39FF14" size={20} />
    }
  ];

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Your Orders</h1>
        <p>Active and past transactions on the grid.</p>
      </div>

      <div className="orders-list">
        {!walletConnected ? (
          <div className="no-wallet">
            <Wallet size={48} color="rgba(255, 255, 255, 0.2)" />
            <p>Connect wallet to see your order history</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card slide-up">
              <div className="order-main">
                <div className="order-status-icon">
                  {order.icon}
                </div>
                <div className="order-details">
                  <div className="order-top">
                    <h3>{order.restaurant}</h3>
                    <span className="order-id">#{order.id}</span>
                  </div>
                  <div className="order-meta">
                    <span className="order-amount">{order.amount}</span>
                    <span className="dot">•</span>
                    <span className="order-time">{order.time}</span>
                  </div>
                </div>
                <ArrowRight size={20} color="rgba(255, 255, 255, 0.3)" />
              </div>
              <div className="order-footer">
                <div className={`status-pill ${order.status.toLowerCase()}`}>
                  {order.status}
                </div>
                <button 
                  className="track-btn"
                  onClick={() => navigate(`/track/${order.id}`)}
                >
                  Track Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .orders-page {
          min-height: 100vh;
          background: #0A0A0A;
          color: white;
          padding: 40px 24px;
        }

        .orders-header {
          margin-bottom: 32px;
        }

        .orders-header h1 {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .orders-header p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .order-card {
          background: #111;
          border: 1px solid #222;
          border-radius: 20px;
          padding: 20px;
        }

        .order-main {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .order-status-icon {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .order-details {
          flex: 1;
        }

        .order-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .order-top h3 {
          font-size: 16px;
          font-weight: 700;
          margin: 0;
        }

        .order-id {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.3);
          font-family: monospace;
        }

        .order-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
        }

        .order-amount {
          color: #00FFF0;
          font-weight: 600;
        }

        .order-time {
          color: rgba(255, 255, 255, 0.4);
        }

        .dot {
          color: rgba(255, 255, 255, 0.2);
        }

        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid #222;
        }

        .status-pill {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-pill.delivering {
          background: rgba(255, 215, 0, 0.1);
          color: #FFD700;
        }

        .status-pill.completed {
          background: rgba(57, 255, 20, 0.1);
          color: #39FF14;
        }

        .track-btn {
          background: none;
          border: none;
          color: #E63946;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .no-wallet {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 0;
          text-align: center;
          gap: 16px;
          color: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default OrdersPage;