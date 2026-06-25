````markdown
# 🍔 ChainBite

> A decentralized Web3-powered food delivery platform that enables secure food ordering and blockchain-based payments using Ethereum smart contracts.

# 📖 Overview

ChainBite bridges the gap between everyday convenience and Web3 technology.

Traditional food delivery platforms rely on centralized, opaque payment gateways and high intermediary fees. ChainBite disrupts this model by utilizing Ethereum smart contracts to facilitate trustless, secure, and fully auditable peer-to-peer transactions directly between consumers and restaurants.

By decentralizing the ordering pipeline, ChainBite ensures:

- 🔒 Tamper-proof transaction histories
- ⚡ Automated payment distribution
- 🛡️ Enhanced cryptographic security
- 🌐 Transparent blockchain-powered ordering

---

# ✨ Features

## 👤 Customer App

- 🔐 **Web3 Authentication** – Passwordless login secured via MetaMask wallet.
- 🍽️ **Restaurant Marketplace** – Browse restaurants and explore menus.
- 🛒 **Cart & Checkout** – Build orders with blockchain-secured payments.
- 📜 **Order History** – View immutable on-chain payment and order records.

---

## 🍽️ Restaurant Portal

- 📋 Manage food listings
- ✏️ Add, update, and remove dishes
- 📦 Receive and manage customer orders
- 💰 Instant blockchain-based wallet settlements

---

## ⛓️ Blockchain Layer

- Smart Contract Escrow Payments
- Immutable Order Records
- Secure Wallet Transactions
- Standards-Compliant Smart Contracts

---

# 🛠️ Tech Stack

## Frontend

| Technology | Description |
|------------|-------------|
| React.js | Component-based UI framework |
| Vite | Lightning-fast frontend tooling |
| Tailwind CSS | Utility-first CSS framework |
| Ethers.js | Ethereum client library |

---

## Smart Contracts & Backend

| Technology | Description |
|------------|-------------|
| Solidity | Smart contract programming language |
| Hardhat | Development & testing framework |
| OpenZeppelin | Secure contract libraries |

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
````

---

# 🚀 Getting Started

## 📋 Prerequisites

Before getting started, ensure you have:

* Node.js (v18 or later)
* npm
* MetaMask browser extension

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/yashithac618/ChainBite.git

cd ChainBite
```

---

## 2️⃣ Configure Environment Variables

Navigate to the backend directory.

```bash
cd backend
cp .env.example .env
```

Update the `.env` file:

```env
PRIVATE_KEY=YOUR_PRIVATE_KEY

RPC_URL=YOUR_RPC_ENDPOINT

ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

---

## 3️⃣ Backend Setup

Install dependencies:

```bash
npm install
```

Compile contracts:

```bash
npx hardhat compile
```

Run a local blockchain:

```bash
npx hardhat node
```

Deploy contracts:

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

Open:

```
http://localhost:5173
```

---

# 🔒 Smart Contracts

ChainBite leverages Solidity smart contracts to manage the core ordering and payment lifecycle.

The contracts provide:

* ✅ Secure blockchain payments
* ✅ Escrow-based transaction handling
* ✅ Immutable order records
* ✅ Trustless verification mechanisms

---

# 🧪 Testing

Run the smart contract test suite:

```bash
cd backend

npx hardhat test
```

---

# 🎥 Demo Video

Watch the complete walkthrough of ChainBite here:

📹 **Google Drive**

https://drive.google.com/file/d/1AhTRspGGgumu04yjDq1bw7bLNqyWe_eS/view?usp=drivesdk

---


# 🌟 Future Roadmap

* [ ] Multi-chain interoperability (Polygon, Arbitrum)
* [ ] Decentralized real-time order tracking
* [ ] NFT-based customer loyalty rewards
* [ ] DAO governance for restaurant onboarding
* [ ] AI-powered food recommendations
* [ ] Mobile application support

```
