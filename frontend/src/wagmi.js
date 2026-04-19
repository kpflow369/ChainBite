import { http, createConfig, fallback } from 'wagmi'
import { mainnet, localhost, hardhat, sepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

const projectId = process.env.REACT_APP_WC_PROJECT_ID || '3fcc6bba6f1de962d911bb5b5c3dba68'

export const config = createConfig({
  chains: [hardhat, localhost, mainnet, sepolia],
  connectors: [
    injected(),
    walletConnect({ projectId }),
  ],
  transports: {
    [hardhat.id]: http('http://127.0.0.1:8545'),
    [localhost.id]: http('http://127.0.0.1:8545'),
    [sepolia.id]: fallback([
      http(process.env.REACT_APP_SEPOLIA_RPC),
      http('https://eth-sepolia.public.blastapi.io'),
      http('https://rpc.ankr.com/eth_sepolia'),
      http('https://sepolia.infura.io/v3/'), // Fallback without key if needed
    ]),
    [mainnet.id]: http(),
  },
})
