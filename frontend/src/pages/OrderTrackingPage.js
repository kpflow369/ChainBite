import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { mockOrderStatuses } from '../mockData';
import { Button } from '../components/ui/button';

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(1);
  const [orderInfo] = useState({
    restaurantName: 'Crypto Cafe',
    deliveryPartner: 'Alex Rider',
    deliveryPhone: '+91 98765 43210',
    estimatedTime: '25 mins',
    otp: '4829'
  });

  // Auto-progress through stages (mock live tracking)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage(prev => {
        if (prev < 5) return prev + 1;
        return prev;
      });
    }, 5000); // Progress every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="tracking-page">
      {/* Header */}
      <div className="tracking-header">
        <button className="back-btn" onClick={() => navigate('/home')}>
          <ArrowLeft size={24} />
        </button>
        <div className="header-info">
          <h1 className="page-title">Order Tracking</h1>
          <p className="order-id">#{orderId}</p>
        </div>
        <div></div>
      </div>

      {/* Mock Map */}
      <div className="map-container fade-in">
        <svg viewBox="0 0 400 300" className="map-svg">
          {/* Background */}
          <rect width="400" height="300" fill="#1A1A1A" />
          
          {/* Roads */}
          <line x1="0" y1="150" x2="400" y2="150" stroke="#2A2A2A" strokeWidth="40" />
          <line x1="200" y1="0" x2="200" y2="300" stroke="#2A2A2A" strokeWidth="40" />
          
          {/* Route Path */}
          <path
            d="M 100 100 Q 150 150 200 150 T 300 200"
            stroke="#E63946"
            strokeWidth="3"
            fill="none"
            strokeDasharray="5,5"
            className="route-path"
          />
          
          {/* Restaurant Marker */}
          <circle cx="100" cy="100" r="20" fill="#E63946" opacity="0.3" />
          <circle cx="100" cy="100" r="12" fill="#E63946" />
          <text x="100" y="105" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">🏪</text>
          
          {/* Delivery Partner Marker (animated) */}
          <circle cx="200" cy="150" r="20" fill="#00FFF0" opacity="0.3" className="pulse" />
          <circle cx="200" cy="150" r="12" fill="#00FFF0" />
          <text x="200" y="155" textAnchor="middle" fill="black" fontSize="12" fontWeight="bold">🏍️</text>
          
          {/* Your Location Marker */}
          <circle cx="300" cy="200" r="20" fill="#39FF14" opacity="0.3" />
          <circle cx="300" cy="200" r="12" fill="#39FF14" />
          <text x="300" y="205" textAnchor="middle" fill="black" fontSize="12" fontWeight="bold">🏠</text>
        </svg>
        
        <div className="map-overlay">
          <div className="eta-badge">
            <span className="eta-label">ETA</span>
            <span className="eta-time">{orderInfo.estimatedTime}</span>
          </div>
        </div>
      </div>

      <div className="tracking-content">
        {/* Order Status Timeline */}
        <div className="status-timeline slide-up">
          {mockOrderStatuses.map((status, index) => {
            const isCompleted = currentStage > status.stage;
            const isActive = currentStage === status.stage;
            
            return (
              <div key={status.stage} className={`timeline-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                <div className="timeline-marker">
                  {isCompleted ? (
                    <CheckCircle2 size={24} style={{ color: '#39FF14' }} />
                  ) : (
                    <div className={`status-dot ${isActive ? 'active-dot' : ''}`}></div>
                  )}
                </div>
                <div className="timeline-content">
                  <h4 className="status-label">{status.label}</h4>
                  {(isCompleted || isActive) && (
                    <p className="status-time">{status.time}</p>
                  )}
                </div>
                {index < mockOrderStatuses.length - 1 && (
                  <div className={`timeline-line ${isCompleted ? 'completed-line' : ''}`}></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Delivery Partner Info */}
        {currentStage >= 4 && (
          <div className="delivery-partner-card fade-in">
            <div className="partner-avatar">👨‍🍳</div>
            <div className="partner-info">
              <h4 className="partner-name">{orderInfo.deliveryPartner}</h4>
              <p className="partner-role">Delivery Partner</p>
            </div>
            <button className="call-btn">
              <Phone size={20} />
            </button>
          </div>
        )}

        {/* OTP Section */}
        {currentStage >= 4 && (
          <div className="otp-section fade-in">
            <div className="otp-card">
              <div className="otp-header">
                <MapPin size={20} style={{ color: '#E63946' }} />
                <span>Delivery OTP</span>
              </div>
              <div className="otp-code">{orderInfo.otp}</div>
              <p className="otp-hint">Share this OTP with delivery partner</p>
            </div>
          </div>
        )}

        {/* NFT Reward (if eco-delivery) */}
        {currentStage === 5 && (
          <div className="nft-reward-card fade-in">
            <div className="nft-content">
              <div className="nft-icon">🎉</div>
              <div>
                <h4 className="nft-title">Green NFT Minted!</h4>
                <p className="nft-desc">You've earned a Green NFT for choosing eco-delivery</p>
              </div>
            </div>
            <Button className="view-nft-btn" onClick={() => navigate('/profile')}>
              View NFT
            </Button>
          </div>
        )}
      </div>

      {currentStage === 5 && (
        <div className="order-complete-container">
          <Button className="home-btn" onClick={() => navigate('/home')}>
            Back to Home
          </Button>
        </div>
      )}

      <style jsx>{`
        .tracking-page {
          min-height: 100vh;
          background: #0A0A0A;
          padding-bottom: 100px;
        }

        .tracking-header {
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
        }

        .header-info {
          text-align: center;
        }

        .page-title {
          font-size: 20px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 4px 0;
        }

        .order-id {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
        }

        .map-container {
          position: relative;
          width: 100%;
          height: 300px;
          background: #1A1A1A;
          overflow: hidden;
        }

        .map-svg {
          width: 100%;
          height: 100%;
        }

        .route-path {
          animation: dash 2s linear infinite;
        }

        @keyframes dash {
          to {
            stroke-dashoffset: -10;
          }
        }

        .pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            r: 20;
            opacity: 0.3;
          }
          50% {
            r: 30;
            opacity: 0.1;
          }
        }

        .map-overlay {
          position: absolute;
          top: 20px;
          right: 20px;
        }

        .eta-badge {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .eta-label {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
        }

        .eta-time {
          font-size: 18px;
          font-weight: 800;
          color: #39FF14;
        }

        .tracking-content {
          padding: 24px 20px;
        }

        .status-timeline {
          margin-bottom: 24px;
        }

        .timeline-item {
          position: relative;
          display: flex;
          gap: 16px;
          padding-bottom: 32px;
        }

        .timeline-marker {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          z-index: 2;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .status-dot.active-dot {
          background: #E63946;
          border-color: #E63946;
          box-shadow: 0 0 20px rgba(230, 57, 70, 0.6);
          animation: pulse 1.5s ease-in-out infinite;
        }

        .timeline-content {
          flex: 1;
        }

        .status-label {
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 4px 0;
        }

        .timeline-item.completed .status-label {
          color: #39FF14;
        }

        .timeline-item.active .status-label {
          color: #E63946;
        }

        .status-time {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
        }

        .timeline-line {
          position: absolute;
          left: 11px;
          top: 24px;
          width: 2px;
          height: calc(100% - 24px);
          background: rgba(255, 255, 255, 0.1);
        }

        .timeline-line.completed-line {
          background: #39FF14;
        }

        .delivery-partner-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .partner-avatar {
          width: 60px;
          height: 60px;
          background: rgba(0, 255, 240, 0.1);
          border: 2px solid rgba(0, 255, 240, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
        }

        .partner-info {
          flex: 1;
        }

        .partner-name {
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 4px 0;
        }

        .partner-role {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
        }

        .call-btn {
          width: 48px;
          height: 48px;
          background: #E63946;
          border: none;
          border-radius: 50%;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .call-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 16px rgba(230, 57, 70, 0.4);
        }

        .otp-section {
          margin-bottom: 20px;
        }

        .otp-card {
          background: linear-gradient(135deg, rgba(230, 57, 70, 0.15) 0%, rgba(230, 57, 70, 0.05) 100%);
          border: 1px solid rgba(230, 57, 70, 0.3);
          border-radius: 16px;
          padding: 20px;
          text-align: center;
        }

        .otp-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 16px;
        }

        .otp-code {
          font-size: 48px;
          font-weight: 800;
          color: #E63946;
          letter-spacing: 8px;
          margin-bottom: 8px;
          font-family: 'Space Grotesk', monospace;
        }

        .otp-hint {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
        }

        .nft-reward-card {
          background: linear-gradient(135deg, rgba(57, 255, 20, 0.15) 0%, rgba(57, 255, 20, 0.05) 100%);
          border: 1px solid rgba(57, 255, 20, 0.3);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .nft-content {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        .nft-icon {
          font-size: 48px;
        }

        .nft-title {
          font-size: 18px;
          font-weight: 800;
          color: #39FF14;
          margin: 0 0 6px 0;
        }

        .nft-desc {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .view-nft-btn {
          width: 100%;
          background: #39FF14;
          color: #000000;
          font-weight: 700;
          border: none;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
        }

        .order-complete-container {
          position: fixed;
          bottom: 20px;
          left: 20px;
          right: 20px;
          z-index: 100;
        }

        .home-btn {
          width: 100%;
          height: 56px;
          background: #E63946;
          color: #FFFFFF;
          font-size: 16px;
          font-weight: 700;
          border: none;
          border-radius: 16px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default OrderTrackingPage;