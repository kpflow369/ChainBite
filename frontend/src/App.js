import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from 'sonner';

// Pages
import OrdersPage from './pages/OrdersPage';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RestaurantPage from './pages/RestaurantPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import RestaurantOnboarding from './pages/RestaurantOnboarding';
import UserOnboarding from './pages/UserOnboarding';
import MerchantDashboard from './pages/MerchantDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DAODashboard from './pages/DAODashboard';
import PayoutsPage from './pages/PayoutsPage';
import MenuManagementPage from './pages/MenuManagementPage';

// Device Frame Wrapper
const DeviceFrame = ({ children }) => {
  return (
    <div className="app-container">
      <div className="device-frame">
        {/* iOS Notch */}
        <div className="ios-notch">
          <div className="notch-speaker"></div>
          <div className="notch-camera"></div>
        </div>
        
        {/* Status Bar */}
        <div className="ios-status-bar">
          <div className="status-left">
            <span className="status-time">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
          </div>
          <div className="status-right">
            <span className="status-icon">📶</span>
            <span className="status-icon">📡</span>
            <span className="status-battery">100%</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="device-content">
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <WalletProvider>
        <CartProvider>
          <BrowserRouter>
            <DeviceFrame>
              <Routes>
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/" element={<WelcomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/restaurant/:id" element={<RestaurantPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-tracking/:orderId" element={<OrderTrackingPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/onboarding/user" element={<UserOnboarding />} />
                <Route path="/onboarding/restaurant" element={<RestaurantOnboarding />} />
                <Route path="/restaurant-dashboard" element={<MerchantDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/dao" element={<DAODashboard />} />
                <Route path="/payouts" element={<PayoutsPage />} />
                <Route path="/menu-management" element={<MenuManagementPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </DeviceFrame>
          </BrowserRouter>
          <Toaster position="top-center" richColors />
        </CartProvider>
      </WalletProvider>
    </div>
  );
}

export default App;