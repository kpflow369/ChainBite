import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';


const WelcomePage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('chainbite_logged_in');
    if (isLoggedIn === 'true') {
      navigate('/home');
      return;
    }

    setIsVisible(true);
  }, [navigate]);

  return (
    <div className="welcome-page">
      <div className="welcome-content">
        {/* Animated Background */}
        <div className="welcome-bg">
          <div className="glow-orb glow-orb-1"></div>
          <div className="glow-orb glow-orb-2"></div>
          <div className="glow-orb glow-orb-3"></div>
        </div>

        {/* Logo & Brand */}
        <div className={`welcome-hero ${isVisible ? 'fade-in' : ''}`}>
          <div className="brand-icon">
            <Zap size={60} strokeWidth={2.5} className="neon-text" style={{ color: '#E63946' }} />
          </div>
          <h1 className="brand-name">ChainBite</h1>
          <p className="brand-tagline">Decentralized Food Delivery</p>
        </div>

        {/* Feature Pills */}
        <div className={`feature-pills ${isVisible ? 'slide-up' : ''}`}>
          <div className="feature-pill">
            <span className="pill-icon">⚡</span>
            <span>Zero Commission</span>
          </div>
          <div className="feature-pill">
            <span className="pill-icon">🔒</span>
            <span>Web3 Powered</span>
          </div>
          <div className="feature-pill">
            <span className="pill-icon">🌱</span>
            <span>Earn Green NFTs</span>
          </div>
        </div>

        {/* Flow Choice */}
        <div className={`welcome-cta ${isVisible ? 'slide-up' : ''}`} style={{ animationDelay: '0.2s' }}>
          <div className="choice-container">
            <button 
              onClick={() => {
                localStorage.setItem('chainbite_user_role', 'customer');
                navigate('/login');
              }} 
              className="welcome-btn primary-btn"
            >
              Order Food
            </button>
            <button 
              onClick={() => {
                localStorage.setItem('chainbite_user_role', 'restaurant');
                navigate('/login');
              }} 
              className="welcome-btn secondary-btn"
            >
              Join as Partner
            </button>
          </div>
          <p className="welcome-footer">Hyperlocal • Trustful • AI + Web3 Powered</p>
        </div>
      </div>

      <style jsx>{`
        .welcome-page {
          min-height: 100vh;
          background: #0A0A0A;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .welcome-content {
          width: 100%;
          padding: 40px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 48px;
          position: relative;
          z-index: 2;
        }

        .welcome-bg {
          position: absolute;
          pointer-events: none;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
        }

        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          animation: float 8s ease-in-out infinite;
        }

        .glow-orb-1 {
          width: 300px;
          height: 300px;
          background: #E63946;
          top: -100px;
          right: -100px;
          animation-delay: 0s;
        }

        .glow-orb-2 {
          width: 250px;
          height: 250px;
          background: #00FFF0;
          bottom: -80px;
          left: -80px;
          animation-delay: 2s;
        }

        .glow-orb-3 {
          width: 200px;
          height: 200px;
          background: #39FF14;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, 20px) scale(1.1); }
        }

        .welcome-hero {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .brand-icon {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, rgba(230, 57, 70, 0.15) 0%, rgba(230, 57, 70, 0.05) 100%);
          border-radius: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(230, 57, 70, 0.3);
          margin-bottom: 8px;
        }

        .brand-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 48px;
          font-weight: 800;
          background: linear-gradient(135deg, #E63946 0%, #FF6B35 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -1px;
          margin: 0;
        }

        .brand-tagline {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
          margin: 0;
        }

        .feature-pills {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          max-width: 320px;
        }

        .feature-pill {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 15px;
          font-weight: 600;
          color: #FFFFFF;
          backdrop-filter: blur(10px);
        }

        .pill-icon {
          font-size: 24px;
        }

        .welcome-cta {
          width: 100%;
          max-width: 320px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
        }

        .choice-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .welcome-btn {
          width: 100%;
          height: 56px;
          font-size: 17px;
          font-weight: 700;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .primary-btn {
          background: #E63946;
          color: #FFFFFF;
          border: none;
        }

        .primary-btn:hover {
          background: #FF3B30;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(230, 57, 70, 0.4);
        }

        .secondary-btn {
          background: rgba(255, 255, 255, 0.05);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .secondary-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .welcome-footer {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.4);
          text-align: center;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default WelcomePage;