import { useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi';
import { CONTRACTS } from '../contracts/config';
import MarketplaceABI from '../contracts/DeliveryMarketplace.json';
import EscrowABI from '../contracts/OrderEscrow.json';
import ReputationABI from '../contracts/Reputation.json';
import DAOABI from '../contracts/FoodGovernanceDAO.json';

/**
 * Hook for all ChainBite contract interactions
 */
export const useChainBite = () => {
  const { writeContract, writeContractAsync, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // --- READS ---

  const useGetProfile = (address, role) => {
    return useReadContract({
      address: CONTRACTS.DELIVERY_MARKETPLACE,
      abi: MarketplaceABI.abi,
      functionName: role === 'restaurant' ? 'restaurants' : 'users',
      args: [address],
      query: { enabled: !!address }
    });
  };

  const useGetOrder = (orderId) => {
    return useReadContract({
      address: CONTRACTS.ORDER_ESCROW,
      abi: EscrowABI.abi,
      functionName: 'getOrder',
      args: [orderId],
      query: { enabled: !!orderId }
    });
  };

  const useGetReputation = (address) => {
    return useReadContract({
      address: CONTRACTS.REPUTATION,
      abi: ReputationABI.abi,
      functionName: 'getAverage',
      args: [address],
      query: { enabled: !!address }
    });
  };

  const useGetProposal = (proposalId) => {
    return useReadContract({
      address: CONTRACTS.GOVERNANCE_DAO,
      abi: DAOABI.abi,
      functionName: 'proposals',
      args: [proposalId],
      query: { enabled: !!proposalId }
    });
  };

  const useGetHasVoted = (proposalId, voterAddress) => {
    return useReadContract({
      address: CONTRACTS.GOVERNANCE_DAO,
      abi: DAOABI.abi,
      functionName: 'hasVoted',
      args: [proposalId, voterAddress],
      query: { enabled: !!proposalId && !!voterAddress }
    });
  };

  const useCheckRole = (address, roleHash) => {
    return useReadContract({
      address: CONTRACTS.DELIVERY_MARKETPLACE,
      abi: MarketplaceABI.abi,
      functionName: 'hasRole',
      args: [roleHash, address],
      query: { enabled: !!address && !!roleHash }
    });
  };

  const useVerifyDeployment = () => {
    const publicClient = usePublicClient();
    return {
      check: async (addressToCheck) => {
        const target = addressToCheck || CONTRACTS.DELIVERY_MARKETPLACE;
        if (!target) return false;
        try {
          const code = await publicClient.getBytecode({ address: target });
          return code && code !== '0x';
        } catch (err) {
          console.error("Verification error:", err);
          return false;
        }
      }
    };
  };

  // --- WRITES (Async helpers for sequential flows) ---

  const registerUser = async (name, metadataUri) => {
    localStorage.setItem('chainbite_user_name', name);
    return await writeContractAsync({
      address: CONTRACTS.DELIVERY_MARKETPLACE,
      abi: MarketplaceABI.abi,
      functionName: 'registerUser',
      args: [],
    });
  };

  const registerRestaurant = async (name, metadataUri) => {
    localStorage.setItem('chainbite_rest_name', name);
    return await writeContractAsync({
      address: CONTRACTS.DELIVERY_MARKETPLACE,
      abi: MarketplaceABI.abi,
      functionName: 'registerRestaurant',
      args: [],
    });
  };

  const createOrder = async (restaurant, driver, amount) => {
    return await writeContractAsync({
      address: CONTRACTS.DELIVERY_MARKETPLACE,
      abi: MarketplaceABI.abi,
      functionName: 'createOrder',
      args: [restaurant, driver, amount],
    });
  };

  const completeOrder = async (params) => {
    const { orderId, restaurantShare, driverShare, driverRating, greenDelivery, greenUri } = params;
    return await writeContractAsync({
      address: CONTRACTS.DELIVERY_MARKETPLACE,
      abi: MarketplaceABI.abi,
      functionName: 'completeOrder',
      args: [orderId, restaurantShare, driverShare, driverRating, greenDelivery, greenUri],
    });
  };

  const addDriver = async (driverAddress, uri) => {
    return await writeContractAsync({
      address: CONTRACTS.DELIVERY_MARKETPLACE,
      abi: MarketplaceABI.abi,
      functionName: 'addDriver',
      args: [driverAddress, uri],
    });
  };

  const createDAOProposal = async (duration = 86400) => {
    return await writeContractAsync({
      address: CONTRACTS.GOVERNANCE_DAO,
      abi: DAOABI.abi,
      functionName: 'createProposal',
      args: [duration],
    });
  };

  const voteDAO = async (proposalId, support) => {
    return await writeContractAsync({
      address: CONTRACTS.GOVERNANCE_DAO,
      abi: DAOABI.abi,
      functionName: 'vote',
      args: [proposalId, support]
    });
  };

  return {
    // State
    hash,
    error,
    isPending,
    isConfirming,
    isSuccess,
    // Methods
    registerUser,
    registerRestaurant,
    createOrder,
    completeOrder,
    addDriver,
    createDAOProposal,
    voteDAO,
    // Read Hooks (nested for usage in components)
    useGetProfile,
    useGetOrder,
    useGetReputation,
    useGetProposal,
    useGetHasVoted,
    useCheckRole,
    useVerifyDeployment
  };
};

// Role Hashes
export const ROLES = {
  ADMIN: '0x0000000000000000000000000000000000000000000000000000000000000000',
  OPERATOR: '0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929' // keccak256("OPERATOR_ROLE")
};
