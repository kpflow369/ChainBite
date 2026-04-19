const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeliveryMarketplace Registration", function () {
  let marketplace, escrow, rewardToken, reputation, greenNFT, driverProfile;
  let admin, user1, rest1;

  beforeEach(async function () {
    [admin, user1, rest1] = await ethers.getSigners();

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
      admin.address
    );
  });

  it("should allow a user to register", async function () {
    await marketplace.connect(user1).registerUser("Alice", "Bangalore");
    const profile = await marketplace.users(user1.address);
    expect(profile.name).to.equal("Alice");
    expect(profile.location).to.equal("Bangalore");
    expect(profile.isRegistered).to.equal(true);
  });

  it("should allow a restaurant to register", async function () {
    await marketplace.connect(rest1).registerRestaurant(
      "Crypto Cafe",
      "Best coffee",
      "City Center",
      "http://image.url"
    );
    const profile = await marketplace.restaurants(rest1.address);
    expect(profile.name).to.equal("Crypto Cafe");
    expect(profile.description).to.equal("Best coffee");
    expect(profile.isRegistered).to.equal(true);
  });

  it("should prevent duplicate registration", async function () {
    await marketplace.connect(user1).registerUser("Alice", "Bangalore");
    await expect(
      marketplace.connect(user1).registerUser("Alice 2", "Delhi")
    ).to.be.revertedWith("Already registered");
  });
});
