import { Routes, Route } from 'react-router-dom'
import AppShell from './layouts/AppShell'
import RequireAuth from './components/RequireAuth'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductDetail from './pages/ProductDetail'
import Sell from './pages/Sell'
import Favorites from './pages/Favorites'
import Activity from './pages/Activity'
import Advertise from './pages/Advertise'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Shop from './pages/Shop'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/shop/:username" element={<Shop />} />
        <Route
          path="/sell"
          element={
            <RequireAuth>
              <Sell />
            </RequireAuth>
          }
        />
        <Route
          path="/favorites"
          element={
            <RequireAuth>
              <Favorites />
            </RequireAuth>
          }
        />
        <Route
          path="/activity"
          element={
            <RequireAuth>
              <Activity />
            </RequireAuth>
          }
        />
        <Route path="/advertise" element={<Advertise />} />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <Settings />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
