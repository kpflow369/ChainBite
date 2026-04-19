import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, MapPin, AlignLeft, Image as ImageIcon, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { useChainBite } from '../hooks/useChainBite';

const RestaurantOnboarding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    imageUri: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { registerRestaurant, isConfirming, isSuccess, error, useVerifyDeployment } = useChainBite();
  const { check: verifyMarketplace } = useVerifyDeployment();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.description) {
      toast.error('Please fill in required fields');
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
    const metadataUri = `ipfs://rest-${formData.name.toLowerCase().replace(/\s/g, '-')}`;
    registerRestaurant(
      formData.name,
      metadataUri
    );
  };

  React.useEffect(() => {
    if (isSuccess) {
      toast.success('Restaurant registered on-chain!');
      localStorage.setItem('chainbite_logged_in', 'true');
      localStorage.setItem('chainbite_user_role', 'restaurant');
      navigate('/restaurant-dashboard');
    }
  }, [isSuccess, navigate]);

  React.useEffect(() => {
    if (error) {
      toast.error('Transaction failed: ' + (error.message || 'Unknown error'));
      setIsSubmitting(false);
    }
  }, [error]);

  return (
    <div className="onboarding-page">
      <div className="onboarding-content">
        <div className="onboarding-header fade-in">
          <div className="icon-badge">
            <Store size={40} style={{ color: '#00FFF0' }} />
          </div>
          <h1>Partner Onboarding</h1>
          <p>Register your restaurant on the decentralized grid</p>
        </div>

        <form onSubmit={handleRegister} className="onboarding-form slide-up">
          <div className="form-section">
            <label>Restaurant Name</label>
            <div className="input-with-icon">
              <Store size={18} className="input-icon" />
              <Input
                placeholder="e.g. Satoshi Snacks"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="form-section">
            <label>Short Description</label>
            <div className="input-with-icon">
              <AlignLeft size={18} className="input-icon" />
              <Input
                placeholder="What makes your food special?"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <div className="form-section">
            <label>Physical Location</label>
            <div className="input-with-icon">
              <MapPin size={18} className="input-icon" />
              <Input
                placeholder="Complete address for pickups"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          <div className="form-section">
            <label>Restaurant Cover Image (URL)</label>
            <div className="input-with-icon">
              <ImageIcon size={18} className="input-icon" />
              <Input
                placeholder="Link to your restaurant photo"
                value={formData.imageUri}
                onChange={(e) => setFormData({...formData, imageUri: e.target.value})}
              />
            </div>
          </div>

          <div className="onboarding-info">
            <p>Registration as a partner involves an on-chain verification. You will be able to manage orders and payouts once confirmed.</p>
          </div>

          <Button 
            type="submit" 
            className="submit-btn" 
            disabled={isSubmitting || isConfirming}
          >
            {isSubmitting || isConfirming ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                {isConfirming ? 'Finalizing...' : 'Registering...'}
              </>
            ) : (
              <>
                Register My Restaurant
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
          padding-top: 60px;
          padding-bottom: 60px;
        }

        .onboarding-content {
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .onboarding-header {
          text-align: center;
        }

        .icon-badge {
          width: 80px;
          height: 80px;
          background: rgba(0, 255, 240, 0.1);
          border: 2px solid rgba(0, 255, 240, 0.2);
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
          gap: 20px;
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
          height: 52px !important;
        }

        .onboarding-info {
          background: rgba(230, 57, 70, 0.05);
          border: 1px solid rgba(230, 57, 70, 0.1);
          border-radius: 12px;
          padding: 16px;
        }

        .onboarding-info p {
          font-size: 13px;
          color: #E63946;
          margin: 0;
          line-height: 1.5;
        }

        .submit-btn {
          height: 56px;
          background: #00FFF0;
          color: #000000;
          font-size: 17px;
          font-weight: 700;
          border-radius: 16px;
          width: 100%;
          border: none;
          transition: all 0.3s;
          margin-top: 12px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #00E5D9;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 255, 240, 0.3);
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

export default RestaurantOnboarding;
