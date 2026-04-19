import React, { createContext, useContext, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';


const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  
  // Custom states that map to old behavior
  const [network] = useState('localhost');

  // Fetch balances
  const { data: ethBalance } = useBalance({ address });
  const balanceEth = ethBalance ? Number(ethBalance.formatted).toFixed(4) : "0.0000";

  const balance = {
    eth: balanceEth,
    usdc: "0.00",
    matic: "0.00"
  };

  const connectWallet = async () => {
    // Return a promise that resolves when connected
    try {
      const injectedConnector = connectors.find(c => c.id === 'injected');
      if (injectedConnector) {
        connect({ connector: injectedConnector });
      } else {
        connect({ connector: connectors[0] });
      }
      return { success: true, address };
    } catch(err) {
      return { success: false };
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  const getShortAddress = () => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const value = {
    walletConnected: isConnected,
    walletAddress: address,
    balance,
    network,
    isLoading: false,
    connectWallet,
    disconnectWallet,
    getShortAddress,
    switchNetwork: () => {}
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};