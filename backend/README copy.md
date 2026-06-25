# ChainBite Backend

Welcome to the backend repository for **ChainBite**. This project is built on top of the **Hardhat** development environment, utilizing smart contracts to power the ChainBite ecosystem. It includes the core token/smart contracts, automated tests, and deployment modules using Hardhat Ignition.

---

## 🚀 Features & Stack

* **Smart Contracts:** Solidity / OpenZeppelin standards.
* **Framework:** Hardhat (Advanced development environment for Ethereum).
* **Deployment:** Hardhat Ignition modules.
* **Language:** TypeScript (for tests and deployment scripts).

---

## 🛠️ Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Installation

1. Clone the repository (if you haven't already).
2. Install the required dependencies:

```bash
npm install

🧪 Development & Testing
Compile Contracts
To compile your Solidity smart contracts:

Bash
npx hardhat compile
Run Tests
To run the automated test suite and ensure contract integrity:

Bash
npm test
🌐 Deployment
This project uses Hardhat Ignition for deployments. You can deploy the contracts to a local node, a testnet, or the mainnet.

To deploy to a specific network defined in your hardhat.config.ts:

Bash
npx hardhat ignition deploy ignition/modules/MyToken.ts --network <network-name>
💡 Tip: For local development, you can spin up a local network node using npx hardhat node before deploying.