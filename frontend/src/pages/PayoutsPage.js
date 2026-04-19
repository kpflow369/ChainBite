import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { toast } from 'sonner';

const PayoutsPage = () => {
  const navigate = useNavigate();
  const { balance } = useWallet();
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const transactions = [
    { id: 'TX-1092', type: 'Order Revenue', amount: '+0.045 ETH', date: 'Today, 2:45 PM', status: 'completed' },
    { id: 'TX-1091', type: 'Order Revenue', amount: '+0.012 ETH', date: 'Today, 1:15 PM', status: 'completed' },
    { id: 'WD-0042', type: 'Withdrawal', amount: '-0.500 ETH', date: 'Yesterday', status: 'completed' },
    { id: 'TX-1090', type: 'Order Revenue', amount: '+0.088 ETH', date: 'Yesterday', status: 'completed' },
  ];

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      toast.success("Withdrawal initiated successfully!");
    }, 2000);
  };

  return (
    <div className="page-container payouts-page">
      <div className="header glass-header" style={{ display: 'flex', alignItems: 'center', padding: '50px 20px 15px', gap: '15px' }}>
        <button className="back-btn" onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="header-title" style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: 'white' }}>Payouts & Earnings</h1>
      </div>

      <div className="content-scroll" style={{ padding: '20px', paddingBottom: '100px' }}>
        {/* Balance Card */}
        <div style={{ background: 'linear-gradient(135deg, rgba(0,255,240,0.1) 0%, rgba(0,255,240,0.02) 100%)', border: '1px solid rgba(0,255,240,0.2)', borderRadius: '24px', padding: '24px', marginBottom: '30px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <DollarSign size={20} color="#00FFF0" />
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: '600' }}>Available Balance</span>
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#fff', margin: '0 0 20px 0' }}>{balance.eth} <span style={{ fontSize: '20px', color: '#00FFF0' }}>ETH</span></h2>
          
          <button 
            onClick={handleWithdraw}
            disabled={isWithdrawing}
            style={{ width: '100%', padding: '16px', background: '#00FFF0', color: '#000', borderRadius: '14px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', opacity: isWithdrawing ? 0.7 : 1 }}
          >
            {isWithdrawing ? 'Processing...' : 'Withdraw Funds'}
          </button>
        </div>

        {/* Transaction History */}
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>Transaction History</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {transactions.map((tx, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: tx.type === 'Withdrawal' ? 'rgba(255,71,87,0.1)' : 'rgba(0,255,240,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: tx.type === 'Withdrawal' ? '#ff4757' : '#00fff0' }}>
                  {tx.type === 'Withdrawal' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                </div>
                <div>
                  <p style={{ color: '#fff', margin: 0, fontWeight: '600', fontSize: '15px' }}>{tx.type}</p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '12px', marginTop: '2px' }}>{tx.date} • {tx.id}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: tx.type === 'Withdrawal' ? '#fff' : '#00fff0', margin: 0, fontWeight: '700', fontSize: '15px' }}>{tx.amount}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <CheckCircle2 size={12} color="#2ed573" />
                  <span style={{ color: '#2ed573', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Done</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PayoutsPage;
