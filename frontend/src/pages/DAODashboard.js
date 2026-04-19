import React, { useState } from 'react';
import { useChainBite } from '../hooks/useChainBite';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle2, XCircle, TrendingUp, Home, Search as SearchIcon, ShoppingBag, User, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const DUMMY_PROPOSALS = {
  1: { title: "Add 100% Vegan Delivery Fleet in NYC", desc: "Commit to deploying a purely vegan delivery fleet in the New York area to reduce cross-contamination." },
  2: { title: "Reduce Merchant Fees by 0.5%", desc: "Lower the platform commission fee for onboarding new independent restaurants during Q3." },
  3: { title: "Onboard Starbucks to ChainBite", desc: "Official DAO vote to formally request a merchant integration with Starbucks local chains." }
};

// Helper component to read and display a single proposal
const ProposalCard = ({ id, onVote }) => {
  const { useGetProposal, useGetHasVoted } = useChainBite();
  const { address } = useAccount();
  const { data: proposalRaw, isError, isLoading } = useGetProposal(id);
  const { data: hasVoted } = useGetHasVoted(id, address);

  if (isLoading) return <div className="dao-card skeleton">Loading...</div>;
  if (!proposalRaw || isError) return null;

  const [,yesVotes, noVotes, endTime, executed] = proposalRaw;
  const yesCount = Number(yesVotes);
  const noCount = Number(noVotes);
  const totalVotes = yesCount + noCount;
  const expiration = Number(endTime) * 1000; // js date
  const isExpired = Date.now() > expiration;
  
  const yesPercentage = totalVotes === 0 ? 0 : (yesCount / totalVotes) * 100;
  const noPercentage = totalVotes === 0 ? 0 : (noCount / totalVotes) * 100;

  // Use localStorage first (if the user made a new one), fallback to dummy
  const storedTitle = localStorage.getItem(`dao_prop_${id}_title`);
  const storedDesc = localStorage.getItem(`dao_prop_${id}_desc`);
  const title = storedTitle || (DUMMY_PROPOSALS[id]?.title || `Community Proposal #${id}`);
  const desc = storedDesc || (DUMMY_PROPOSALS[id]?.desc || `Community-driven governance proposal.`);

  return (
    <div className="dao-card" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '20px', marginBottom: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', backdropFilter: 'blur(10px)' }}>
      <div className="dao-card-header" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className={`status-badge ${executed ? 'executed' : (isExpired ? 'expired' : 'active')}`}>
            {executed ? 'Executed' : (isExpired ? 'Ended' : 'Active Voting')}
          </span>
          {!executed && !isExpired && (
            <span style={{ fontSize: '12px', color: '#a0a0b0' }}>
              Ends in {Math.max(1, Math.floor((expiration - Date.now()) / (1000 * 60 * 60 * 24)))} days
            </span>
          )}
        </div>
        <span className="prop-id">CHB-{id.toString().padStart(4, '0')}</span>
      </div>
      
      <h3 className="dao-title" style={{ fontSize: '16px', marginBottom: '4px' }}>{title}</h3>
      <p className="dao-desc" style={{ fontSize: '13px', marginBottom: '12px' }}>{desc}</p>
      
      <div className="vote-stats" style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', height: '6px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
          <div style={{ width: `${yesPercentage}%`, background: '#00fff0', transition: 'width 0.5s ease' }} />
          <div style={{ width: `${noPercentage}%`, background: '#ff4757', transition: 'width 0.5s ease' }} />
        </div>
        <div className="vote-numbers">
          <span className="yes-text"><CheckCircle2 size={14}/> {yesCount} Yes</span>
          <span className="no-text"><XCircle size={14}/> {noCount} No</span>
        </div>
      </div>

      {!executed && !isExpired && (
        <div className="dao-actions">
          <button 
            className="btn-vote btn-yes" 
            onClick={() => onVote(id, true)}
            disabled={hasVoted}
          >
            {hasVoted ? 'Voted' : 'Vote Yes'}
          </button>
          <button 
            className="btn-vote btn-no" 
            onClick={() => onVote(id, false)}
            disabled={hasVoted}
          >
            {hasVoted ? 'Voted' : 'Vote No'}
          </button>
        </div>
      )}
    </div>
  );
};

const DAODashboard = () => {
  const { isConnected } = useAccount();
  const { voteDAO } = useChainBite();
  const { cartCount } = useCart();
  const [activeIds] = useState([1, 2, 3]);

  const handleVote = async (id, support) => {
    if (!isConnected) {
      toast.error("Connect wallet to vote");
      return;
    }
    toast.promise(
      voteDAO(id, support).then(tx => tx),
      {
        loading: 'Casting your vote...',
        success: 'Vote cast successfully!',
        error: 'Failed to cast vote.'
      }
    );
  };



  return (
    <div className="page-container dao-page">
      <div className="header glass-header" style={{ display: 'flex', alignItems: 'center', padding: '50px 20px 15px', gap: '15px' }}>
        <h1 className="header-title" style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>Gov DAO</h1>
      </div>

      <div className="content-scroll" style={{ padding: '0 20px 100px 20px' }}>
        <div className="dao-hero" style={{ textAlign: 'center', padding: '30px 20px', background: 'linear-gradient(135deg, rgba(255,107,107,0.1) 0%, rgba(78,205,196,0.1) 100%)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px', marginTop: '10px' }}>
          <TrendingUp className="hero-icon" size={48} />
          <h2>Community Governance</h2>
          <p>Shape the future of ChainBite. 1 Wallet = 1 Vote.</p>
        </div>

        {!isConnected && (
          <div className="connect-warning">
            <AlertCircle size={20} />
            <p>Connect your wallet to participate in voting.</p>
          </div>
        )}

        <div className="section-title-row" style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Active Proposals</h3>
        </div>

        <div className="dao-list" style={{ paddingBottom: '30px' }}>
          {activeIds.map(id => (
            <ProposalCard key={id} id={id} onVote={handleVote} />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <Link to="/home" className="nav-item">
          <Home size={24} />
          <span>Home</span>
        </Link>
        <Link to="/search" className="nav-item">
          <SearchIcon size={24} />
          <span>Search</span>
        </Link>
        <Link to="/cart" className="nav-item">
          <ShoppingBag size={24} />
          {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
          <span>Cart</span>
        </Link>
        <Link to="/profile" className="nav-item">
          <User size={24} />
          <span>Profile</span>
        </Link>
        <Link to="/dao" className="nav-item active">
          <Landmark size={24} />
          <span>DAO</span>
        </Link>
      </div>
    </div>
  );
};

export default DAODashboard;
