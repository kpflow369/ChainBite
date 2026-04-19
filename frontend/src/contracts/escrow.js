import { ethers } from "ethers";
import { CONTRACTS } from "./config";
import OrderEscrowABI from "./OrderEscrow.json";

export const getEscrowContract = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(
    CONTRACTS.ORDER_ESCROW,
    OrderEscrowABI.abi,
    signer
  );
};

export const getOrders = async () => {
  const contract = await getEscrowContract();
  return await contract.getOrders();
};