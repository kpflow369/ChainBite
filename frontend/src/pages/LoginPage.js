import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Phone, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { useConnect, useAccount, useReadContract, useSwitchChain } from 'wagmi';
import { sepolia, hardhat } from 'wagmi/chains';
import { CONTRACTS } from '../contracts/config';
import MarketplaceABI from '../contracts/DeliveryMarketplace.json';

const LoginPage = () => {
  const navigate = useNavigate();
  const { connect, connectors, isLoading: isConnecting } = useConnect();
  const { address, isConnected, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const role = localStorage.getItem('chainbite_user_role') || 'customer';

  // Check registration on-chain
  const { data: userProfile } = useReadContract({
    address: CONTRACTS.DELIVERY_MARKETPLACE,
    abi: MarketplaceABI.abi,
    functionName: 'users',
    args: [address],
    query: { enabled: !!address && role === 'customer' }
  });

  const { data: restProfile } = useReadContract({
    address: CONTRACTS.DELIVERY_MARKETPLACE,
    abi: MarketplaceABI.abi,
    functionName: 'restaurants',
    args: [address],
    query: { enabled: !!address && role === 'restaurant' }
  });

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setIsSubmitting(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setStep('otp');
    toast.success('OTP sent to +91 ' + phone);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 4) {
      toast.error('Please enter a valid 4-digit OTP');
      return;
    }

    setIsSubmitting(true);
    // Mock OTP verification (accepts any 4 digits)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    localStorage.setItem('chainbite_logged_in', 'true');
    localStorage.setItem('chainbite_phone', phone);
    
    toast.success('Login successful!');
    setIsSubmitting(false);
    
    // Prompt for wallet connection
    setStep('wallet');
  };

  const handleSkipWallet = () => {
    toast.error('Wallet connection is mandatory to access the application');
  };

  const handleWalletConnect = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask extension not detected!');
      return;
    }

    try {
      const injectedConnector = connectors.find(c => c.id === 'injected' || c.name.toLowerCase().includes('metamask'));
      const connectorToUse = injectedConnector || connectors[0];
      
      connect({ connector: connectorToUse }, {
        onSuccess: () => {
          toast.success('Wallet connected!');
          
          // Logic for redirection
          setTimeout(() => {
            if (role === 'customer') {
              if (userProfile?.isRegistered) {
                navigate('/home');
              } else {
                navigate('/onboarding/user');
              }
            } else {
              if (restProfile?.isRegistered) {
                navigate('/restaurant-dashboard'); // Or home for now
              } else {
                navigate('/onboarding/restaurant');
              }
            }
          }, 500);
        },
        onError: (error) => {
          toast.error('Connection failed: ' + error.message);
        }
      });
    } catch (err) {
      toast.error('An unexpected error occurred.');
    }
  };

  const NetworkSwitcher = () => {
    const isWrongNetwork = chainId !== sepolia.id && chainId !== hardhat.id;
    
    if (!isConnected || !isWrongNetwork) return null;

    return (
      <div className="network-warning slide-down">
        <p>You're on the wrong network</p>
        <Button onClick={() => switchChainAsync({ chainId: sepolia.id })} size="sm">
          Switch to Sepolia
        </Button>
      </div>
    );
  };

  return (
    <div className="login-page">
      <div className="login-header">
        {step !== 'phone' && (
          <button className="back-btn" onClick={() => step === 'otp' ? setStep('phone') : setStep('otp')}>
            <ArrowLeft size={24} />
          </button>
        )}
      </div>

      <NetworkSwitcher />
      <div className="login-content">
        {step === 'phone' && (
          <div className="login-step fade-in">
            <div className="step-icon">
              <Phone size={40} strokeWidth={2} style={{ color: '#E63946' }} />
            </div>
            <h1 className="step-title">Enter your phone number</h1>
            <p className="step-subtitle">We'll send you a verification code</p>

            <form onSubmit={handleSendOTP} className="login-form">
              <div className="phone-input-group">
                <span className="country-code">+91</span>
                <Input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="phone-input"
                  maxLength={10}
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                className="submit-btn"
                disabled={phone.length !== 10 || isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          </div>
        )}

        {step === 'otp' && (
          <div className="login-step fade-in">
            <div className="step-icon">
              <Phone size={40} strokeWidth={2} style={{ color: '#E63946' }} />
            </div>
            <h1 className="step-title">Enter verification code</h1>
            <p className="step-subtitle">Sent to +91 {phone}</p>

            <form onSubmit={handleVerifyOTP} className="login-form">
              <Input
                type="text"
                placeholder="Enter 4-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="otp-input"
                maxLength={4}
                autoFocus
              />
              <Button
                type="submit"
                className="submit-btn"
                disabled={otp.length !== 4 || isSubmitting}
              >
                {isSubmitting ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <button type="button" className="link-btn" onClick={() => toast.success('OTP resent!')}>Resend OTP</button>
            </form>
          </div>
        )}

        {step === 'wallet' && (
          <div className="login-step fade-in">
            <div className="step-icon">
              <Wallet size={40} strokeWidth={2} style={{ color: '#00FFF0' }} />
            </div>
            <h1 className="step-title">Connect your wallet</h1>
            <p className="step-subtitle">Enable crypto payments & earn NFT rewards</p>

            <div className="wallet-options">
              <Button
                onClick={handleWalletConnect}
                className="wallet-btn"
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
              </Button>
              <button className="link-btn" onClick={handleSkipWallet}>Skip for now</button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: #0A0A0A;
          padding: 20px;
        }

        .login-header {
          padding: 20px 0;
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

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .login-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 150px);
        }

        .login-step {
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }

        .step-icon {
          width: 80px;
          height: 80px;
          background: rgba(230, 57, 70, 0.1);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(230, 57, 70, 0.2);
        }

        .step-title {
          font-size: 28px;
          font-weight: 800;
          color: #FFFFFF;
          text-align: center;
          margin: 0;
        }

        .step-subtitle {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
          margin: 0;
        }

        .login-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 16px;
        }

        .phone-input-group {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .country-code {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          color: #FFFFFF;
          min-width: 60px;
          text-align: center;
        }

        .phone-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
          font-size: 16px;
          padding: 12px 16px;
          border-radius: 12px;
          height: 48px;
        }

        .phone-input:focus {
          border-color: #E63946;
          outline: none;
        }

        .otp-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
          font-size: 24px;
          padding: 16px;
          border-radius: 12px;
          text-align: center;
          letter-spacing: 8px;
          font-weight: 700;
        }

        .otp-input:focus {
          border-color: #E63946;
          outline: none;
        }

        .submit-btn {
          width: 100%;
          height: 52px;
          background: #E63946;
          color: #FFFFFF;
          font-size: 16px;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          cursor: pointer;
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

        .wallet-options {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
        }

        .wallet-btn {
          width: 100%;
          height: 52px;
          background: linear-gradient(135deg, #00FFF0 0%, #00CCE0 100%);
          color: #000000;
          font-size: 16px;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .wallet-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 255, 240, 0.3);
        }

        .link-btn {
          background: none;
          border: none;
          color: #E63946;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          padding: 12px;
          transition: color 0.2s;
        }

        .link-btn:hover {
          color: #FF3B30;
        }
        .network-warning {
          background: #E63946;
          color: white;
          padding: 8px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          font-size: 13px;
          font-weight: 600;
        }

        :global(.network-warning .button) {
          background: white !important;
          color: #E63946 !important;
          font-size: 11px !important;
          height: 28px !important;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;