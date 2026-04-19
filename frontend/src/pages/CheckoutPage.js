import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Wallet, Banknote } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWallet } from '../contexts/WalletContext';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { useWriteContract, useAccount, useReadContract } from 'wagmi';
import { CONTRACTS } from '../contracts/config';
import { parseEther, formatEther } from 'viem';
import { useChainBite } from '../hooks/useChainBite';
import RewardTokenABI from '../contracts/RewardToken.json';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { getGrandTotal, getCryptoPrice, clearCart, isEcoDelivery } = useCart();
  const { walletConnected, balance } = useWallet();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastError] = useState(null);
  const { isConnected, address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { createOrder } = useChainBite();

  // Fetch RWD Token balance
  const { data: rwdBalanceRaw } = useReadContract({
    address: CONTRACTS.REWARD_TOKEN,
    abi: RewardTokenABI.abi,
    functionName: 'balanceOf',
    args: [address],
    query: { enabled: !!address }
  });

  const rwdBalance = rwdBalanceRaw ? formatEther(rwdBalanceRaw) : '0';

  const baseAmount = getGrandTotal();
  let taxRate = 0;
  // crypto = 5%
  if (paymentMethod?.includes('crypto')) {
    taxRate = 0.05;
  }
  // upi/card/cod = 15%
  else if (paymentMethod) {
    taxRate = 0.15;
  }

const taxAmount = baseAmount * taxRate;
const finalAmount = baseAmount + taxAmount;

  const paymentOptions = [
    {
      id: 'crypto_eth',
      name: 'Ethereum (ETH)',
      icon: Wallet,
      color: '#00FFF0',
      balance: balance.eth,
      enabled: walletConnected,
      type: 'crypto'
    },
    {
      id: 'crypto_usdc',
      name: 'USDC (Stablecoin)',
      icon: Wallet,
      color: '#00FFF0',
      balance: balance.usdc,
      enabled: walletConnected,
      type: 'crypto'
    },
    {
      id: 'upi',
      name: 'UPI / PhonePe / GPay',
      icon: Banknote,
      color: '#E63946',
      enabled: true,
      type: 'fiat'
    },
    {
      id: 'card',
      name: 'Credit / Debit Card',
      icon: CreditCard,
      color: '#E63946',
      enabled: true,
      type: 'fiat'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: Banknote,
      color: '#39FF14',
      enabled: true,
      type: 'fiat'
    }
  ];

const handlePlaceOrder = async () => {
  if (!isConnected) {
    toast.error("Connect wallet to continue");
    return;
  }

  try {
    setIsProcessing(true);
    const ethPrice = getCryptoPrice('eth');
    const amountToPay = parseEther(ethPrice);

    console.log(`Checkout: Paying ${ethPrice} RWD. Balance: ${rwdBalance} RWD`);

    if (Number(rwdBalance) < Number(ethPrice)) {
      toast.error(`Insufficient $RWD balance. You need ${ethPrice} but have ${rwdBalance}.`);
      setIsProcessing(false);
      return;
    }

    // 1. Approve Tokens
    toast.info("Approving tokens for escrow...");
    await writeContractAsync({
      address: CONTRACTS.REWARD_TOKEN || '0x2D8471388d805e459C62fE15dd81447DA2eE1a12', // Fallback to Sepolia address if not in config
      abi: RewardTokenABI.abi,
      functionName: 'approve',
      args: [CONTRACTS.ORDER_ESCROW, amountToPay],
    });

    // 2. Create Order via Marketplace
    toast.info("Creating on-chain order...");
    // For demo, we use the deployer address which is now pre-registered in the contract
    const targetRestaurant = '0x719D12c7b602D78F812E227dB4A08F6ff2A8A114'; 
    const targetDriver = '0x719D12c7b602D78F812E227dB4A08F6ff2A8A114';
    
    console.log("Placing order with amount:", amountToPay.toString());
    await createOrder(targetRestaurant, targetDriver, amountToPay);

    toast.success("✅ Order placed successfully!");
    clearCart();
    setTimeout(() => navigate('/orders'), 2000);
  } catch (err) {
    console.error(err);
    toast.error("Checkout failed: " + (err.shortMessage || err.message));
  } finally {
    setIsProcessing(false);
  }
};

  return (
    <div className="checkout-page">
      {/* Header */}
      <div className="checkout-header">
        <button className="back-btn" onClick={() => navigate('/cart')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="page-title">Checkout</h1>
        <div></div>
      </div>

      <div className="checkout-content">
        {/* Order Summary */}
        <div className="order-summary fade-in">
          <h2 className="section-title">Order Summary</h2>
          <div className="summary-card">
            <div className="summary-row">
              <span>Total Amount</span>
              <span className="amount-fiat">₹{baseAmount}</span>
            </div>

          <div className="summary-row">
           <span>Platform Fee ({taxRate * 100}%)</span>
           <span>₹{taxAmount.toFixed(0)}</span>
          </div>

          <div className="summary-row">
            <strong>Final Total</strong>
            <strong>₹{finalAmount.toFixed(0)}</strong>
          </div>
            <div className="summary-row crypto-row">
              <span>Equivalent</span>
              <div className="crypto-amounts">
                <span className="amount-crypto">{getCryptoPrice('eth')} ETH</span>
                <span className="or">or</span>
                <span className="amount-crypto">{getCryptoPrice('usdc')} USDC</span>
              </div>
            </div>
            {paymentMethod?.includes('crypto') && (
              <div className="eco-reward-banner">
                💸 Save money using Crypto (lower fees)
            </div>
            )}
            {isEcoDelivery && (
              <div className="eco-reward-banner">
                <span className="eco-icon">🌱</span>
                <span>You'll earn a Green NFT for choosing eco-delivery!</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="payment-section slide-up">
          <h2 className="section-title">Select Payment Method</h2>
          
          {/* Crypto Payments */}
          <div className="payment-group">
            <p className="payment-group-label">Cryptocurrency</p>
            {paymentOptions.filter(opt => opt.type === 'crypto').map(option => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  className={`payment-option ${paymentMethod === option.id ? 'selected' : ''} ${!option.enabled ? 'disabled' : ''}`}
                  onClick={() => option.enabled && setPaymentMethod(option.id)}
                  disabled={!option.enabled}
                >
                  <div className="option-left">
                    <div className="option-icon" style={{ background: `${option.color}20` }}>
                      <Icon size={24} style={{ color: option.color }} />
                    </div>
                    <div className="option-info">
                      <span className="option-name">{option.name}</span>
                      {option.balance && (
                        <span className="option-balance">Balance: {option.balance}</span>
                      )}
                      {!option.enabled && (
                        <span className="option-status">Connect wallet to use</span>
                      )}
                    </div>
                  </div>
                  <div className="option-radio">
                    {paymentMethod === option.id && <div className="radio-selected"></div>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Fiat Payments */}
          <div className="payment-group">
            <p className="payment-group-label">Traditional Payment</p>
            {paymentOptions.filter(opt => opt.type === 'fiat').map(option => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  className={`payment-option ${paymentMethod === option.id ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod(option.id)}
                >
                  <div className="option-left">
                    <div className="option-icon" style={{ background: `${option.color}20` }}>
                      <Icon size={24} style={{ color: option.color }} />
                    </div>
                    <div className="option-info">
                      <span className="option-name">{option.name}</span>
                    </div>
                  </div>
                  <div className="option-radio">
                    {paymentMethod === option.id && <div className="radio-selected"></div>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info Banner */}
        <div className="info-banner slide-up">
          <div className="info-content">
            <span className="info-icon">⚡</span>
            <div>
              <h4 className="info-title">Web3 Advantage</h4>
              <p className="info-text">Pay with crypto and get instant settlement. No waiting for refunds!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="place-order-container">
        {lastError && (
          <div className="error-message" style={{ color: '#E63946', fontSize: '12px', marginBottom: '10px', textAlign: 'center', background: 'rgba(230, 57, 70, 0.1)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(230, 57, 70, 0.2)' }}>
            ⚠️ {lastError}
          </div>
        )}
        <Button
          className="place-order-btn"
          onClick={handlePlaceOrder}
          disabled={!paymentMethod || isProcessing}
        >
          {isProcessing ? 'Processing...' : `Place Order ₹${finalAmount.toFixed(0)}`}
        </Button>
      </div>

      <style jsx>{`
        .checkout-page {
          min-height: 100vh;
          background: #0A0A0A;
          padding-bottom: 100px;
        }

        .checkout-header {
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

        .page-title {
          font-size: 20px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
        }

        .checkout-content {
          padding: 20px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 16px 0;
        }

        .order-summary {
          margin-bottom: 32px;
        }

        .summary-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 20px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.7);
        }

        .summary-row:last-child {
          margin-bottom: 0;
        }

        .amount-fiat {
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
        }

        .crypto-row {
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .crypto-amounts {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .amount-crypto {
          font-size: 13px;
          font-weight: 600;
          color: #00FFF0;
          background: rgba(0, 255, 240, 0.1);
          padding: 4px 10px;
          border-radius: 8px;
        }

        .or {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
        }

        .eco-reward-banner {
          margin-top: 16px;
          padding: 12px;
          background: linear-gradient(135deg, rgba(57, 255, 20, 0.15) 0%, rgba(57, 255, 20, 0.05) 100%);
          border: 1px solid rgba(57, 255, 20, 0.3);
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #39FF14;
        }

        .eco-icon {
          font-size: 24px;
        }

        .payment-section {
          margin-bottom: 24px;
        }

        .payment-group {
          margin-bottom: 24px;
        }

        .payment-group-label {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
          margin: 0 0 12px 0;
        }

        .payment-option {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .payment-option:hover:not(.disabled) {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .payment-option.selected {
          background: rgba(230, 57, 70, 0.1);
          border-color: #E63946;
        }

        .payment-option.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .option-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .option-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .option-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .option-name {
          font-size: 15px;
          font-weight: 600;
          color: #FFFFFF;
        }

        .option-balance {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        .option-status {
          font-size: 11px;
          color: #E63946;
        }

        .option-radio {
          width: 24px;
          height: 24px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .payment-option.selected .option-radio {
          border-color: #E63946;
        }

        .radio-selected {
          width: 12px;
          height: 12px;
          background: #E63946;
          border-radius: 50%;
        }

        .info-banner {
          background: linear-gradient(135deg, rgba(0, 255, 240, 0.1) 0%, rgba(0, 255, 240, 0.05) 100%);
          border: 1px solid rgba(0, 255, 240, 0.3);
          border-radius: 12px;
          padding: 16px;
        }

        .info-content {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .info-icon {
          font-size: 24px;
        }

        .info-title {
          font-size: 15px;
          font-weight: 700;
          color: #00FFF0;
          margin: 0 0 4px 0;
        }

        .info-text {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
          line-height: 1.5;
        }

        .place-order-container {
          position: sticky;
          bottom: 20px;
          left: 20px;
          right: 20px;
          z-index: 100;
        }

        .place-order-btn {
          width: 100%;
          height: 56px;
          background: #E63946;
          color: #FFFFFF;
          font-size: 16px;
          font-weight: 700;
          border: none;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 8px 24px rgba(230, 57, 70, 0.4);
        }

        .place-order-btn:hover:not(:disabled) {
          background: #FF3B30;
          transform: translateY(-2px);
        }

        .place-order-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;