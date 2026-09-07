import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Splash from './pages/Splash';
import Onboarding from './pages/onboarding/Onboarding';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import Home from './pages/Home';
import Categories from './pages/Categories';
import Search from './pages/Search';
import ProductDetail from './pages/ProductDetail';
import Shop from './pages/Shop';
import MyShop from './pages/MyShop';
import MyListings from './pages/MyListings';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Activity from './pages/Activity';
import Subscriptions from './pages/Subscriptions';
import Support from './pages/Support';
import NotFound from './pages/NotFound';

import SellFlow from './pages/sell/SellFlow';
import EditProduct from './pages/sell/EditProduct';

import SettingsHome from './pages/settings/SettingsHome';
import AccountSettings from './pages/settings/AccountSettings';
import SecuritySettings from './pages/settings/SecuritySettings';

import AdvertiseList from './pages/advertise/AdvertiseList';
import CreateAd from './pages/advertise/CreateAd';
import AdPay from './pages/advertise/AdPay';

import LegalIndex from './pages/legal/LegalIndex';
import LegalPage from './pages/legal/LegalPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Public browsing — no login required, matches the backend's public read routes */}
      <Route path="/home" element={<Home />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/search" element={<Search />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/shop/:username" element={<Shop />} />
      <Route path="/support" element={<Support />} />
      <Route path="/legal" element={<LegalIndex />} />
      <Route path="/legal/:slug" element={<LegalPage />} />

      {/* Requires auth */}
      <Route path="/sell" element={<ProtectedRoute><SellFlow /></ProtectedRoute>} />
      <Route path="/sell/edit/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
      <Route path="/my-shop" element={<ProtectedRoute><MyShop /></ProtectedRoute>} />
      <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
      <Route path="/subscriptions" element={<ProtectedRoute><Subscriptions /></ProtectedRoute>} />

      <Route path="/settings" element={<ProtectedRoute><SettingsHome /></ProtectedRoute>} />
      <Route path="/settings/account" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
      <Route path="/settings/security" element={<ProtectedRoute><SecuritySettings /></ProtectedRoute>} />

      <Route path="/advertise" element={<ProtectedRoute><AdvertiseList /></ProtectedRoute>} />
      <Route path="/advertise/new" element={<ProtectedRoute><CreateAd /></ProtectedRoute>} />
      <Route path="/advertise/:id/pay" element={<ProtectedRoute><AdPay /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
