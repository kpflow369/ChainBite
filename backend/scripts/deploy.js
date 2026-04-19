const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // 1) Deploy the REAL RewardToken used for rewards
  const RewardToken = await ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy(deployer.address);
  await rewardToken.waitForDeployment();
  console.log("RewardToken:", rewardToken.target);

  // 2) Deploy Reputation
  const Reputation = await ethers.getContractFactory("Reputation");
  const reputation = await Reputation.deploy(deployer.address);
  await reputation.waitForDeployment();
  console.log("Reputation:", reputation.target);

  // 3) Deploy GreenDeliveryNFT
  const GreenNFT = await ethers.getContractFactory("GreenDeliveryNFT");
  const greenNFT = await GreenNFT.deploy(deployer.address);
  await greenNFT.waitForDeployment();
  console.log("GreenDeliveryNFT:", greenNFT.target);

  // 4) Deploy OrderEscrow with payment token (using rewardToken as payment for this demo)
  const OrderEscrow = await ethers.getContractFactory("OrderEscrow");
  const escrow = await OrderEscrow.deploy(deployer.address, rewardToken.target);
  await escrow.waitForDeployment();
  console.log("OrderEscrow:", escrow.target);

  // 5) Deploy DriverProfileNFT
  const DriverProfileNFT = await ethers.getContractFactory("DriverProfileNFT");
  const driverProfile = await DriverProfileNFT.deploy(deployer.address);
  await driverProfile.waitForDeployment();
  console.log("DriverProfileNFT:", driverProfile.target);

  // 6) Deploy DeliveryMarketplacehub
  const Marketplace = await ethers.getContractFactory("DeliveryMarketplace");
  const marketplace = await Marketplace.deploy(
    deployer.address,
    escrow.target,
    rewardToken.target,
    reputation.target,
    greenNFT.target,
    driverProfile.target,
    deployer.address
  );
  await marketplace.waitForDeployment();
  console.log("DeliveryMarketplace:", marketplace.target);

  // 6.5) Deploy DAO
  const DAO = await ethers.getContractFactory("FoodGovernanceDAO");
  const dao = await DAO.deploy(deployer.address);
  await dao.waitForDeployment();
  console.log("FoodGovernanceDAO:", dao.target);

  // 7) WIRE ROLES

  // Escrow: Marketplace needs role to manage orders
  await (await escrow.grantRole(await escrow.MARKETPLACE_ROLE(), marketplace.target)).wait();
  
  // RewardToken: Marketplace needs role to mint rewards
  await (await rewardToken.grantRole(await rewardToken.MINTER_ROLE(), marketplace.target)).wait();
  
  // Reputation: Marketplace needs role to score drivers
  await (await reputation.grantRole(await reputation.UPDATER_ROLE(), marketplace.target)).wait();
  
  // GreenNFT: Marketplace needs role for green rewards
  await (await greenNFT.grantRole(await greenNFT.MINTER_ROLE(), marketplace.target)).wait();

  // DriverProfile: Marketplace needs role to mint SBTs
  await (await driverProfile.grantRole(await driverProfile.MINTER_ROLE(), marketplace.target)).wait();

  console.log("Roles wired successfully.");

  // 7.5) PRIME SYSTEM FOR TESTING
  // Register deployer as a test restaurant and driver so orders can be placed immediately
  console.log("Priming system for testing...");
  const regTx = await marketplace.registerRestaurant();
  await regTx.wait();
  console.log("Test Restaurant registered.");

  const drvTx = await marketplace.addDriver(deployer.address, "ipfs://test-driver-sbt");
  await drvTx.wait();
  console.log("Test Driver authorized.");

  const mintTx = await rewardToken.mint(deployer.address, ethers.parseEther("10000"));
  await mintTx.wait();
  console.log("Minted 10,000 $RWD test tokens to deployer.");

  console.log("Priming DAO with test proposals (1 day duration)...");
  await (await dao.createProposal(86400)).wait(); // Proposal 1
  await (await dao.createProposal(86400)).wait(); // Proposal 2
  await (await dao.createProposal(86400)).wait(); // Proposal 3
  console.log("Created 3 initial DAO proposals.");

  // 8) Update Frontend Config
  const fs = require("fs");
  const path = require("path");
  const configPath = path.join(__dirname, "../../frontend/src/contracts/config.js");
  const config = `export const CONTRACTS = {
  ORDER_ESCROW: "${escrow.target}",
  DELIVERY_MARKETPLACE: "${marketplace.target}",
  REPUTATION: "${reputation.target}",
  REWARD_TOKEN: "${rewardToken.target}",
  GOVERNANCE_DAO: "${dao.target}"
};`;

  fs.writeFileSync(configPath, config);
  console.log("Frontend config updated at:", configPath);

  // 9) Sync ABIs to Frontend
  console.log("Syncing ABIs to frontend...");
  const artifactsBase = path.join(__dirname, "../artifacts/contracts");
  const frontendContracts = path.join(__dirname, "../../frontend/src/contracts");

  const syncList = [
    { src: "core/DeliveryMarketplace.sol/DeliveryMarketplace.json", dest: "DeliveryMarketplace.json" },
    { src: "core/OrderEscrow.sol/OrderEscrow.json", dest: "OrderEscrow.json" },
    { src: "core/Reputation.sol/Reputation.json", dest: "Reputation.json" },
    { src: "token/RewardToken.sol/RewardToken.json", dest: "RewardToken.json" },
    { src: "core/FoodGovernanceDAO.sol/FoodGovernanceDAO.json", dest: "FoodGovernanceDAO.json" }
  ];

  syncList.forEach(item => {
    const srcPath = path.join(artifactsBase, item.src);
    const destPath = path.join(frontendContracts, item.dest);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Synced: ${item.dest}`);
    }
  });

  console.log("-----------------------------------");
  console.log("MARKETPLACE:", marketplace.target);
  console.log("ESCROW:", escrow.target);
  console.log("REWARD_TOKEN:", rewardToken.target);
  console.log("REPUTATION:", reputation.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});