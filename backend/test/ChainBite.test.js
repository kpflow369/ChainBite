const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ChainBite Unified System Test", function () {
  let marketplace, escrow, rewardToken, reputation, greenNFT, driverProfile;
  let admin, customer, restaurant, driver, platform;
  let MARKETPLACE_ROLE, MINTER_ROLE, UPDATER_ROLE;

  beforeEach(async function () {
    [admin, customer, restaurant, driver, platform] = await ethers.getSigners();

    // 1. Deploy Infrastructure
    const RewardToken = await ethers.getContractFactory("RewardToken");
    rewardToken = await RewardToken.deploy(admin.address);

    const Reputation = await ethers.getContractFactory("Reputation");
    reputation = await Reputation.deploy(admin.address);

    const GreenNFT = await ethers.getContractFactory("GreenDeliveryNFT");
    greenNFT = await GreenNFT.deploy(admin.address);

    const OrderEscrow = await ethers.getContractFactory("OrderEscrow");
    escrow = await OrderEscrow.deploy(admin.address, rewardToken.target);

    const DriverProfileNFT = await ethers.getContractFactory("DriverProfileNFT");
    driverProfile = await DriverProfileNFT.deploy(admin.address);

    const Marketplace = await ethers.getContractFactory("DeliveryMarketplace");
    marketplace = await Marketplace.deploy(
      admin.address,
      escrow.target,
      rewardToken.target,
      reputation.target,
      greenNFT.target,
      driverProfile.target,
      platform.address
    );

    // 2. Wire Roles
    MARKETPLACE_ROLE = await escrow.MARKETPLACE_ROLE();
    MINTER_ROLE = await rewardToken.MINTER_ROLE();
    UPDATER_ROLE = await reputation.UPDATER_ROLE();

    await escrow.grantRole(MARKETPLACE_ROLE, marketplace.target);
    await rewardToken.grantRole(MINTER_ROLE, marketplace.target);
    await reputation.grantRole(UPDATER_ROLE, marketplace.target);
    await greenNFT.grantRole(MINTER_ROLE, marketplace.target);
    await driverProfile.grantRole(MINTER_ROLE, marketplace.target);
  });

  describe("Onboarding & Registration", function () {
    it("should allow a customer to register metadata", async function () {
      await marketplace.connect(customer).registerUser("Alex Chen", "Sector 5, HK");
      const profile = await marketplace.users(customer.address);
      expect(profile.name).to.equal("Alex Chen");
      expect(profile.isRegistered).to.be.true;
    });

    it("should allow a restaurant to register metadata", async function () {
      await marketplace.connect(restaurant).registerRestaurant(
        "Satoshi Snacks",
        "Best Bitcoin Burgers",
        "Block 1, Genesis",
        "ipfs://burger-img"
      );
      const profile = await marketplace.restaurants(restaurant.address);
      expect(profile.name).to.equal("Satoshi Snacks");
      expect(profile.isRegistered).to.be.true;
    });

    it("should mint a soulbound profile for a driver on registration", async function () {
      const uri = "ipfs://driver-profile";
      await marketplace.connect(admin).addDriver(driver.address, uri);
      
      expect(await marketplace.isDriver(driver.address)).to.be.true;
      const tokenId = await driverProfile.profileTokenOf(driver.address);
      expect(tokenId).to.equal(1n);
      expect(await driverProfile.tokenURI(tokenId)).to.equal(uri);
    });
  });

  describe("Order Workflow", function () {
    const orderAmount = ethers.parseEther("100");

    beforeEach(async function () {
      // Register parties
      await marketplace.connect(customer).registerUser("Customer", "Loc A");
      await marketplace.connect(restaurant).registerRestaurant("Rest", "Desc", "Loc B", "img");
      await marketplace.connect(admin).addDriver(driver.address, "uri");

      // Setup funds
      await rewardToken.mint(customer.address, orderAmount);
      await rewardToken.connect(customer).approve(escrow.target, orderAmount);
    });

    it("should enforce registration check on createOrder", async function () {
      const [_, guest] = await ethers.getSigners();
      await expect(
        marketplace.connect(customer).createOrder(guest.address, driver.address, orderAmount)
      ).to.be.revertedWith("Not restaurant");
    });

    it("should complete a full order flow with rewards and ratings", async function () {
      // 1. Create Order
      const tx = await marketplace.connect(customer).createOrder(restaurant.address, driver.address, orderAmount);
      const receipt = await tx.wait();
      const orderId = 1; // First order

      // 2. Complete Order
      const restaurantShare = ethers.parseEther("80");
      const driverShare = ethers.parseEther("15");
      const driverRating = 5;
      const greenUri = "ipfs://green-badge";

      await marketplace.connect(admin).completeOrder(
        orderId,
        restaurantShare,
        driverShare,
        driverRating,
        true, // Green delivery
        greenUri
      );

      // Verify Payouts
      expect(await rewardToken.balanceOf(restaurant.address)).to.equal(restaurantShare);
      // Driver gets share from escrow PLUS reward mint of same amount
      expect(await rewardToken.balanceOf(driver.address)).to.equal(driverShare * 2n);
      expect(await rewardToken.balanceOf(platform.address)).to.equal(ethers.parseEther("5")); // 100 - (80+15)

      // Verify Reputation
      const avgRep = await reputation.getAverage(driver.address);
      expect(avgRep).to.equal(ethers.parseEther("5")); // 5.0 scaled

      // Verify Green NFT
      const greenTokenId = 1;
      expect(await greenNFT.ownerOf(greenTokenId)).to.equal(driver.address);
      expect(await greenNFT.tokenURI(greenTokenId)).to.equal(greenUri);
    });

    it("should allow admin to refund an order", async function () {
      await marketplace.connect(customer).createOrder(restaurant.address, driver.address, orderAmount);
      
      const balanceBefore = await rewardToken.balanceOf(customer.address);
      await escrow.refund(1);
      
      expect(await rewardToken.balanceOf(customer.address)).to.equal(balanceBefore + orderAmount);
    });
  });
});
