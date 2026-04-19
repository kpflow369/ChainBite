// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "../token/RewardToken.sol";
import "../token/GreenDeliveryNFT.sol";
import "./OrderEscrow.sol";
import "./Reputation.sol";
import "../token/DriverProfileNFT.sol";

contract DeliveryMarketplace is AccessControl, Pausable {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    OrderEscrow public escrow;
    RewardToken public rewardToken;
    Reputation public reputation;
    GreenDeliveryNFT public greenNFT;
    DriverProfileNFT public driverProfile; 
    address public platformFeeRecipient;

    struct Restaurant {
        bool isRegistered;
    }

    struct User {
        bool isRegistered;
    }

    mapping(address => bool) public isDriver;
    mapping(address => Restaurant) public restaurants;
    mapping(address => User) public users;

    event RestaurantRegistered(address indexed restaurant);
    event UserRegistered(address indexed user);

    constructor(
        address admin,
        OrderEscrow _escrow,
        RewardToken _rewardToken,
        Reputation _reputation,
        GreenDeliveryNFT _greenNFT,
        DriverProfileNFT _driverProfile, 
        address _platformFeeRecipient
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);

        escrow = _escrow;
        rewardToken = _rewardToken;
        reputation = _reputation;
        greenNFT = _greenNFT;
        driverProfile = _driverProfile;  
        platformFeeRecipient = _platformFeeRecipient;
    }

    // Admin / registration

    function addDriver(address driver, string calldata uri)
        external
        onlyRole(OPERATOR_ROLE)
    {
        require(!isDriver[driver], "Already driver");
        isDriver[driver] = true;

        // Mint soulbound profile if they don't already have one
        if (driverProfile.profileTokenOf(driver) == 0) {
            driverProfile.mintProfile(driver, uri);
        }
    }

    function registerRestaurant() external {
        restaurants[msg.sender] = Restaurant({
            isRegistered: true
        });
        emit RestaurantRegistered(msg.sender);
    }

    function registerUser() external {
        users[msg.sender] = User({
            isRegistered: true
        });
        emit UserRegistered(msg.sender);
    }
    function addRestaurant(address rest) external onlyRole(OPERATOR_ROLE) {
        restaurants[rest].isRegistered = true;
    }

    // Order flow

    function createOrder(
        address restaurant,
        address driver,
        uint256 amount
    ) external whenNotPaused returns (uint256 orderId) {
        require(restaurants[restaurant].isRegistered, "Not restaurant");
        require(isDriver[driver], "Not driver");
        // msg.sender is customer
        orderId = escrow.createOrder(msg.sender, restaurant, driver, amount);
    }

    function completeOrder(
        uint256 orderId,
        uint256 restaurantShare,
        uint256 driverShare,
        uint8 driverRating,
        bool greenDelivery,
        string calldata greenUri
    ) external onlyRole(OPERATOR_ROLE) {
        // In a real app, you’d also check that the right customer/driver
        // agreed, maybe via signatures.

        escrow.payout(orderId, restaurantShare, driverShare, platformFeeRecipient);

        // Rewards to driver
        OrderEscrow.Order memory o = escrow.getOrder(orderId);
        rewardToken.mint(o.driver, driverShare); // or some reward formula

        // Rating
        reputation.addDriverRating(o.driver, driverRating);

        // Green NFT
        if (greenDelivery) {
            greenNFT.mint(o.driver, greenUri);
        }
    }

    // Emergency

    function pause() external onlyRole(OPERATOR_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(OPERATOR_ROLE) {
        _unpause();
    }
}