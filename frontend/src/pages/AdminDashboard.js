import React, { useState } from 'react';
import { Shield, UserPlus, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useChainBite, ROLES } from '../hooks/useChainBite';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';

const AdminDashboard = () => {
  const { address } = useAccount();
  const { 
    addDriver, 
    completeOrder,
    isPending, 
    isConfirming, 
    useCheckRole
  } = useChainBite();

  // Check if user is admin
  const { data: isAdmin } = useCheckRole(address, ROLES.OPERATOR);

  // Form states
  const [driverAddr, setDriverAddr] = useState('');
  const [driverUri, setDriverUri] = useState('');
  
  const [orderId, setOrderId] = useState('');
  const [restShare, setRestShare] = useState('');
  const [driverShare, setDriverShare] = useState('');

  const handleAddDriver = (e) => {
    e.preventDefault();
    if (!driverAddr || !driverUri) return;
    addDriver(driverAddr, driverUri);
  };

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    if (!orderId || !restShare || !driverShare) return;
    completeOrder({
      orderId: Number(orderId),
      restaurantShare: ethers.parseEther(restShare),
      driverShare: ethers.parseEther(driverShare),
      driverRating: 5,
      greenDelivery: true,
      greenUri: 'ipfs://green-delivery'
    });
  };

  if (!isAdmin) {
    return (
      <div className="admin-denied">
        <Shield size={64} color="#E63946" />
        <h1>Access Denied</h1>
        <p>Operational access required for this terminal.</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <Shield size={32} color="#00FFF0" />
        <h1>Protocol Overlord</h1>
      </div>

      <div className="admin-grid">
        {/* Add Driver Section */}
        <div className="admin-card slide-up">
          <div className="card-header">
            <UserPlus size={20} />
            <h2>Onboard Driver</h2>
          </div>
          <p>Register a new delivery partner and mint their SBT profile.</p>
          <form onSubmit={handleAddDriver} className="admin-form">
            <Input 
              placeholder="Driver Wallet Address" 
              value={driverAddr} 
              onChange={e => setDriverAddr(e.target.value)}
            />
            <Input 
              placeholder="Driver Profile URI (IPFS)" 
              value={driverUri} 
              onChange={e => setDriverUri(e.target.value)}
            />
            <Button disabled={isPending || isConfirming}>
              {isPending ? <Loader2 className="animate-spin" /> : 'Authorize Driver'}
            </Button>
          </form>
        </div>

        {/* Complete Order Section */}
        <div className="admin-card slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="card-header">
            <CheckCircle size={20} />
            <h2>Resolve Order</h2>
          </div>
          <p>Trigger on-chain escrow payout and distribute rewards.</p>
          <form onSubmit={handleCompleteOrder} className="admin-form">
            <Input 
              placeholder="Order ID" 
              value={orderId} 
              onChange={e => setOrderId(e.target.value)}
            />
            <div className="dual-input">
              <Input 
                placeholder="Rest. Share (ETH)" 
                value={restShare} 
                onChange={e => setRestShare(e.target.value)}
              />
              <Input 
                placeholder="Driver Share (ETH)" 
                value={driverShare} 
                onChange={e => setDriverShare(e.target.value)}
              />
            </div>
            <Button disabled={isPending || isConfirming} className="complete-btn">
              {isPending ? <Loader2 className="animate-spin" /> : 'Complete & Payout'}
            </Button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          background: #0A0A0A;
          color: white;
          padding: 40px 24px;
        }

        .admin-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 48px;
        }

        .admin-header h1 {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .admin-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .admin-card {
          background: #111;
          border: 1px solid #222;
          border-radius: 24px;
          padding: 24px;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
          color: #00FFF0;
        }

        .card-header h2 {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }

        .admin-card p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
          margin-bottom: 24px;
        }

        .admin-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .dual-input {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .complete-btn {
          background: #00FFF0 !important;
          color: black !important;
        }

        .admin-denied {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #0A0A0A;
          color: white;
          text-align: center;
          gap: 20px;
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

export default AdminDashboard;
