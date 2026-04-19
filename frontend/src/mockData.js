// Mock data for ChainBite - Web3 Food Delivery

export const mockRestaurants = [
  {
    id: 1,
    name: "Crypto Cafe",
    cuisine: "Multi-cuisine",
    rating: 4.5,
    deliveryTime: "25-30 min",
    distance: "2.3 km",
    costForTwo: 300,
    ethPrice: "0.08",
    usdcPrice: "12",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    tags: ["Fast Food", "Burgers", "Pizza"],
    offers: ["50% off up to ₹100", "Free delivery"],
    isEcoFriendly: true,
    verified: true,
    acceptsCrypto: true
  },
  {
    id: 2,
    name: "Blockchain Bistro",
    cuisine: "Italian, Continental",
    rating: 4.3,
    deliveryTime: "30-35 min",
    distance: "3.5 km",
    costForTwo: 500,
    ethPrice: "0.13",
    usdcPrice: "20",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=400&fit=crop",
    tags: ["Pasta", "Pizza", "Italian"],
    offers: ["40% off up to ₹80"],
    isEcoFriendly: false,
    verified: true,
    acceptsCrypto: true
  },
  {
    id: 3,
    name: "DeFi Dosa",
    cuisine: "South Indian",
    rating: 4.7,
    deliveryTime: "20-25 min",
    distance: "1.8 km",
    costForTwo: 200,
    ethPrice: "0.05",
    usdcPrice: "8",
    image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&h=400&fit=crop",
    tags: ["Dosa", "Idli", "Vada"],
    offers: ["₹50 off above ₹199"],
    isEcoFriendly: true,
    verified: true,
    acceptsCrypto: true
  },
  {
    id: 4,
    name: "NFT Noodles",
    cuisine: "Chinese, Asian",
    rating: 4.2,
    deliveryTime: "25-30 min",
    distance: "2.7 km",
    costForTwo: 350,
    ethPrice: "0.09",
    usdcPrice: "14",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=400&fit=crop",
    tags: ["Noodles", "Fried Rice", "Manchurian"],
    offers: ["Buy 1 Get 1"],
    isEcoFriendly: false,
    verified: true,
    acceptsCrypto: true
  },
  {
    id: 5,
    name: "Smart Contract Sweets",
    cuisine: "Desserts, Beverages",
    rating: 4.6,
    deliveryTime: "15-20 min",
    distance: "1.2 km",
    costForTwo: 250,
    ethPrice: "0.07",
    usdcPrice: "10",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=400&fit=crop",
    tags: ["Ice Cream", "Shakes", "Pastries"],
    offers: ["Free dessert on orders above ₹299"],
    isEcoFriendly: true,
    verified: true,
    acceptsCrypto: true
  },
  {
    id: 6,
    name: "Token Tandoor",
    cuisine: "North Indian, Mughlai",
    rating: 4.4,
    deliveryTime: "30-35 min",
    distance: "3.0 km",
    costForTwo: 400,
    ethPrice: "0.11",
    usdcPrice: "16",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop",
    tags: ["Biryani", "Kebabs", "Curries"],
    offers: ["30% off on biryani"],
    isEcoFriendly: false,
    verified: true,
    acceptsCrypto: true
  }
];

export const mockFoodItems = [
  {
    id: 101,
    restaurantId: 1,
    name: "Classic Veg Burger",
    description: "Crispy veggie patty with fresh lettuce, tomatoes, and our special sauce",
    price: 120,
    ethPrice: "0.03",
    usdcPrice: "5",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    category: "Burgers",
    isVeg: true,
    isBestseller: true,
    rating: 4.5,
    calories: 450
  },
  {
    id: 102,
    restaurantId: 1,
    name: "Chicken Crispy Burger",
    description: "Juicy fried chicken fillet with mayo and pickles",
    price: 180,
    ethPrice: "0.05",
    usdcPrice: "7",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop",
    category: "Burgers",
    isVeg: false,
    isBestseller: true,
    rating: 4.7,
    calories: 620
  },
  {
    id: 103,
    restaurantId: 1,
    name: "Margherita Pizza",
    description: "Classic pizza with mozzarella, basil, and tomato sauce",
    price: 250,
    ethPrice: "0.07",
    usdcPrice: "10",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
    category: "Pizza",
    isVeg: true,
    isBestseller: false,
    rating: 4.3,
    calories: 800
  },
  {
    id: 104,
    restaurantId: 1,
    name: "French Fries",
    description: "Crispy golden fries with seasoning",
    price: 80,
    ethPrice: "0.02",
    usdcPrice: "3",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
    category: "Sides",
    isVeg: true,
    isBestseller: false,
    rating: 4.2,
    calories: 320
  },
  {
    id: 105,
    restaurantId: 1,
    name: "Chocolate Shake",
    description: "Rich and creamy chocolate milkshake",
    price: 100,
    ethPrice: "0.03",
    usdcPrice: "4",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop",
    category: "Beverages",
    isVeg: true,
    isBestseller: true,
    rating: 4.6,
    calories: 380
  }
];

export const mockCuisines = [
  { id: 1, name: "Burgers", icon: "🍔", color: "#E63946" },
  { id: 2, name: "Pizza", icon: "🍕", color: "#FF6B35" },
  { id: 3, name: "Chinese", icon: "🥡", color: "#F77F00" },
  { id: 4, name: "South Indian", icon: "🫓", color: "#06A77D" },
  { id: 5, name: "Desserts", icon: "🍰", color: "#9D4EDD" },
  { id: 6, name: "Beverages", icon: "🥤", color: "#00B4D8" }
];

export const mockOffers = [
  {
    id: 1,
    title: "50% OFF",
    description: "Up to ₹100 on orders above ₹199",
    code: "CRYPTO50",
    type: "percentage",
    minOrder: 199,
    maxDiscount: 100,
    icon: "Zap"
  },
  {
    id: 2,
    title: "FREE DELIVERY",
    description: "On orders above ₹299",
    code: "FREEDEL",
    type: "delivery",
    minOrder: 299,
    maxDiscount: 50,
    icon: "Truck"
  },
  {
    id: 3,
    title: "₹75 OFF",
    description: "First crypto payment",
    code: "NFTPAY",
    type: "flat",
    minOrder: 150,
    maxDiscount: 75,
    icon: "Coins"
  }
];

export const mockNFTs = [
  {
    id: 1,
    name: "Green Warrior #001",
    description: "Saved 2.5kg CO2 with eco-friendly deliveries",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop",
    carbonSaved: "2.5",
    ordersCount: 5,
    mintDate: "2025-01-15",
    tokenId: "0x7a9f...",
    network: "Polygon",
    rarity: "Rare"
  },
  {
    id: 2,
    name: "Eco Champion #042",
    description: "Achieved 5kg CO2 reduction milestone",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=300&h=300&fit=crop",
    carbonSaved: "5.0",
    ordersCount: 12,
    mintDate: "2025-01-10",
    tokenId: "0x8b2e...",
    network: "Ethereum",
    rarity: "Epic"
  }
];

export const mockUserData = {
  name: "Alex Chen",
  phone: "+91 98765 43210",
  email: "alex.chen@chainbite.io",
  walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  walletConnected: false,
  balance: {
    eth: "0.5432",
    usdc: "250.00",
    matic: "125.50"
  },
  savedAddresses: [
    {
      id: 1,
      type: "Home",
      address: "Block A, Crypto Campus, Bangalore 560001",
      lat: 12.9716,
      lng: 77.5946,
      isDefault: true
    },
    {
      id: 2,
      type: "Work",
      address: "Tech Park, Whitefield, Bangalore 560066",
      lat: 12.9698,
      lng: 77.7500,
      isDefault: false
    }
  ],
  totalOrders: 47,
  carbonSaved: "7.5",
  nftsOwned: 2
};

export const mockOrderStatuses = [
  { stage: 1, label: "Order Placed", icon: "CheckCircle2", time: "14:30" },
  { stage: 2, label: "Restaurant Accepted", icon: "Store", time: "14:32" },
  { stage: 3, label: "Food Preparing", icon: "ChefHat", time: "14:35" },
  { stage: 4, label: "Out for Delivery", icon: "Bike", time: "14:50" },
  { stage: 5, label: "Delivered", icon: "Home", time: "15:10" }
];