<div align="center">

# 🍔 ChainBite

### A Decentralized Web3-Powered Food Delivery Platform

Secure food ordering powered by **Ethereum Smart Contracts**, **React**, and **Hardhat**.

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)]()
[![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity)]()
[![Hardhat](https://img.shields.io/badge/Hardhat-F7DF1E?style=for-the-badge)]()
[![Ethereum](https://img.shields.io/badge/Ethereum-627EEA?style=for-the-badge&logo=ethereum)]()

📹 **Project Demo**

https://drive.google.com/file/d/1AhTRspGGgumu04yjDq1bw7bLNqyWe_eS/view?usp=drivesdk

</div>

---

# 📖 Overview

ChainBite is a decentralized food delivery platform built on Web3 technologies that combines the convenience of modern food ordering with the transparency and security of blockchain.

Unlike traditional delivery platforms that rely on centralized payment gateways and intermediaries, ChainBite utilizes Ethereum smart contracts to facilitate secure, trustless, and transparent transactions directly between customers and restaurants.

### ✨ Key Highlights

- 🔒 Tamper-proof transaction history
- ⚡ Instant blockchain-powered payments
- 🛡️ Wallet-based authentication
- 🌐 Transparent order management
- ⛓️ Smart contract automation

---

# ✨ Features

## 👤 Customer Features

- 🔐 MetaMask Wallet Authentication
- 🍽️ Browse Restaurants & Menus
- 🛒 Add Items to Cart
- 💳 Secure Blockchain Checkout
- 📜 Immutable Order History

---

## 🍽️ Restaurant Features

- 📋 Manage Food Listings
- ✏️ Add, Update & Remove Dishes
- 📦 Track Incoming Orders
- 💰 Receive Instant Wallet Payments

---

## ⛓️ Blockchain Features

- Smart Contract Escrow
- Immutable Order Records
- Secure Ethereum Transactions
- OpenZeppelin Smart Contracts
- Trustless Payment Processing

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|------------|---------|
| React.js | User Interface |
| Vite | Frontend Build Tool |
| Tailwind CSS | Styling |
| Ethers.js | Blockchain Interaction |

## Backend & Blockchain

| Technology | Purpose |
|------------|---------|
| Solidity | Smart Contracts |
| Hardhat | Development Environment |
| OpenZeppelin | Secure Contract Library |

---

# 📂 Project Structure

```text
ChainBite
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── contracts/
│   │   ├── core/
│   │   └── token/
│   ├── scripts/
│   ├── ignition/
│   ├── test/
│   ├── hardhat.config.js
│   └── package.json
│
└── README.md
```

---

# 🚀 Getting Started

## 📋 Prerequisites

- Node.js (v18+)
- npm
- MetaMask Browser Extension

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/kpflow369/ChainBite.git

cd ChainBite
```

---

## 2️⃣ Configure Environment Variables

```bash
cd backend

cp .env.example .env
```

Update your `.env` file:

```env
PRIVATE_KEY=YOUR_PRIVATE_KEY
RPC_URL=YOUR_RPC_ENDPOINT
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

---

## 3️⃣ Backend Setup

Install dependencies

```bash
npm install
```

Compile contracts

```bash
npx hardhat compile
```

Run a local blockchain

```bash
npx hardhat node
```

Deploy contracts

```bash
npx hardhat run scripts/deploy.js --network localhost
```

---

## 4️⃣ Frontend Setup

```bash
cd ../frontend

npm install

npm run dev
```

Visit:

```
http://localhost:5173
```

---

# 🔒 Smart Contracts

ChainBite leverages Solidity smart contracts to automate and secure the food ordering lifecycle.

### Core Capabilities

- ✅ Secure Blockchain Payments
- ✅ Escrow-Based Transactions
- ✅ Immutable Order Records
- ✅ Trustless Verification

---

# 🧪 Testing

Run the complete smart contract test suite.

```bash
cd backend

npx hardhat test
```

---

# 🎥 Demo Video

Watch the complete walkthrough of ChainBite here:

🔗 https://drive.google.com/file/d/1AhTRspGGgumu04yjDq1bw7bLNqyWe_eS/view?usp=drivesdk

---

# 🌟 Future Roadmap

- [ ] Multi-chain Support (Polygon, Arbitrum)
- [ ] Decentralized Real-Time Order Tracking
- [ ] NFT-Based Loyalty Rewards
- [ ] DAO Governance
- [ ] AI-Powered Food Recommendations
- [ ] Mobile Application
