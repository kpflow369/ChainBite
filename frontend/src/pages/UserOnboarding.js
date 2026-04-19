import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { useChainBite } from '../hooks/useChainBite';

const UserOnboarding = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { registerUser, isConfirming, isSuccess, error, useVerifyDeployment } = useChainBite();
  const { check: verifyMarketplace } = useVerifyDeployment();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !location) {
      toast.error('Please fill in all fields');
      return;
    }

    // Pre-check: Verify contract exists
    const isDeployed = await verifyMarketplace();
    if (!isDeployed) {
      toast.error('Contract not found on this network. Please switch to the correct network or redeploy.');
      return;
    }

    setIsSubmitting(true);
    // Bundle metadata into a URI (simulated for prototype)
    const metadataUri = `ipfs://user-${name.toLowerCase().replace(/\s/g, '-')}`;
    registerUser(name, metadataUri);
  };

  React.useEffect(() => {
    if (isSuccess) {
      toast.success('Profile created on-chain!');
      localStorage.setItem('chainbite_logged_in', 'true');
      localStorage.setItem('chainbite_user_role', 'customer');
      navigate('/home');
    }
  }, [isSuccess, navigate]);

  React.useEffect(() => {
    if (error) {
      let msg = error.message || 'Unknown error';
      if (msg.includes('Requested resource not available')) {
        msg = 'Contract not found (Resource not available). Check if you are on the right network.';
      }
      toast.error('Transaction failed: ' + msg);
      setIsSubmitting(false);
    }
  }, [error]);

  return (
    <div className="onboarding-page">
      <div className="onboarding-content">
        <div className="onboarding-header fade-in">
          <div className="icon-badge">
            <User size={40} style={{ color: '#E63946' }} />
          </div>
          <h1>Welcome to ChainBite</h1>
          <p>Let's set up your delivery profile</p>
        </div>

        <form onSubmit={handleRegister} className="onboarding-form slide-up">
          <div className="form-section">
            <label>Full Name</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <Input
                placeholder="How should we call you?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="form-section">
            <label>Delivery Address</label>
            <div className="input-with-icon">
              <MapPin size={18} className="input-icon" />
              <Input
                placeholder="Street address, City, ZIP"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="onboarding-info">
            <p>Your details will be securely stored on-chain to enable decentralized delivery verification.</p>
          </div>

          <Button 
            type="submit" 
            className="submit-btn" 
            disabled={isSubmitting || isConfirming}
          >
            {isSubmitting || isConfirming ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                {isConfirming ? 'Confirming...' : 'Registering...'}
              </>
            ) : (
              <>
                Complete Onboarding
                <ArrowRight size={18} className="ml-2" />
              </>
            )}
          </Button>
        </form>
      </div>

      <style jsx>{`
        .onboarding-page {
          min-height: 100vh;
          background: #0A0A0A;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .onboarding-content {
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .onboarding-header {
          text-align: center;
        }

        .icon-badge {
          width: 80px;
          height: 80px;
          background: rgba(230, 57, 70, 0.1);
          border: 2px solid rgba(230, 57, 70, 0.2);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        h1 {
          font-size: 28px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 8px 0;
        }

        p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 16px;
        }

        .onboarding-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          margin-left: 4px;
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.4);
          z-index: 1;
        }

        :global(.input-with-icon input) {
          padding-left: 48px !important;
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          height: 56px !important;
        }

        .onboarding-info {
          background: rgba(0, 255, 240, 0.05);
          border: 1px solid rgba(0, 255, 240, 0.1);
          border-radius: 12px;
          padding: 16px;
        }

        .onboarding-info p {
          font-size: 13px;
          color: #00FFF0;
          margin: 0;
          line-height: 1.5;
        }

        .submit-btn {
          height: 56px;
          background: #E63946;
          color: white;
          font-size: 17px;
          font-weight: 700;
          border-radius: 16px;
          width: 100%;
          border: none;
          transition: all 0.3s;
        }

        .submit-btn:hover:not(:disabled) {
          background: #FF3B30;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(230, 57, 70, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UserOnboarding;
