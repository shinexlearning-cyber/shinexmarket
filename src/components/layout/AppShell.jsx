import React, { useState, useEffect, useCallback } from "react";
import { NotificationPanel } from "../NotificationPanel";
import { SubscriptionPanel } from "../SubscriptionPanel";
import { AppTopBar } from "./AppTopBar";
import { NavDrawer } from "./NavDrawer";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { ActivityPage } from "../../pages/Activity/ActivityPage";
import { AdvertisePage } from "../../pages/Advertise/AdvertisePage";
import { ForgotPasswordPage } from "../../pages/Auth/ForgotPasswordPage";
import { LoginPage } from "../../pages/Auth/LoginPage";
import { RegisterPage } from "../../pages/Auth/RegisterPage";
import { ContactPage } from "../../pages/Contact/ContactPage";
import { FavoritesPage } from "../../pages/Favorites/FavoritesPage";
import { HomePage } from "../../pages/Home/HomePage";
import { AboutPage } from "../../pages/Legal/AboutPage";
import { PrivacyPage } from "../../pages/Legal/PrivacyPage";
import { TermsPage } from "../../pages/Legal/TermsPage";
import { ProductDetailPage } from "../../pages/Product/ProductDetailPage";
import { ProfilePage } from "../../pages/Profile/ProfilePage";
import { SellPage } from "../../pages/Sell/SellPage";
import { SettingsPage } from "../../pages/Settings/SettingsPage";
import { ShopPage } from "../../pages/Shop/ShopPage";
import { COLORS, api } from "../../services/api";

/* ------------------------------------------------------------
   APP ROOT
   ------------------------------------------------------------ */
export function AppShell() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("shinex_dark_mode") === "true");
  useEffect(() => { document.documentElement.classList.toggle("shinex-dark", darkMode); localStorage.setItem("shinex_dark_mode", String(darkMode)); }, [darkMode]);
  const [nav, setNav] = useState({ page: "home", params: {} });
  const [query, setQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [favoriteProductIds, setFavoriteProductIds] = useState(new Set());
  const [favoriteSellerIds, setFavoriteSellerIds] = useState(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const go = (page, params = {}) => {
    setNav({ page, params });
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  };

  const loadFavoriteIds = useCallback(async () => {
    if (!user) {
      setFavoriteProductIds(new Set());
      setFavoriteSellerIds(new Set());
      return;
    }
    try {
      const [prodRes, sellerRes] = await Promise.all([api("/favorites/products"), api("/favorites/sellers")]);
      setFavoriteProductIds(new Set((prodRes.data || []).map((f) => f.product?.id).filter(Boolean)));
      setFavoriteSellerIds(new Set((sellerRes.data || []).map((f) => f.seller?.id).filter(Boolean)));
    } catch (e) {
      // silent — favorites are non-critical to first paint
    }
  }, [user]);

  useEffect(() => {
    loadFavoriteIds();
  }, [loadFavoriteIds]);

  const toggleFavorite = async (id, type) => {
    if (!user) return go("login");
    const setState = type === "product" ? setFavoriteProductIds : setFavoriteSellerIds;
    const currentSet = type === "product" ? favoriteProductIds : favoriteSellerIds;
    const isFav = currentSet.has(id);
    setState((prev) => {
      const next = new Set(prev);
      isFav ? next.delete(id) : next.add(id);
      return next;
    });
    const endpoint = type === "product" ? `/favorites/product/${id}` : `/favorites/seller/${id}`;
    try {
      await api(endpoint, { method: isFav ? "DELETE" : "POST" });
      toast.push(isFav ? "Removed from favorites" : "Added to favorites", "success");
    } catch (e) {
      setState((prev) => {
        const next = new Set(prev);
        isFav ? next.add(id) : next.delete(id);
        return next;
      });
      toast.push(e.message, "error");
    }
  };

  const onSearchSubmit = () => {
    setActiveSearch(query);
    go("home");
  };

  let content;
  switch (nav.page) {
    case "home": content = <HomePage go={go} search={activeSearch} favoriteProductIds={favoriteProductIds} toggleFavorite={toggleFavorite} />; break;
    case "product": content = <ProductDetailPage params={nav.params} go={go} favoriteProductIds={favoriteProductIds} toggleFavorite={toggleFavorite} />; break;
    case "shop": content = <ShopPage params={nav.params} go={go} favoriteSellerIds={favoriteSellerIds} toggleFavorite={toggleFavorite} />; break;
    case "register": content = <RegisterPage go={go} />; break;
    case "login": content = <LoginPage go={go} />; break;
    case "forgot": content = <ForgotPasswordPage go={go} />; break;
    case "sell": content = <SellPage go={go} params={nav.params} />; break;
    case "favorites": content = <FavoritesPage go={go} favoriteProductIds={favoriteProductIds} favoriteSellerIds={favoriteSellerIds} toggleFavorite={toggleFavorite} />; break;
    case "subscription": content = <SubscriptionPanel onBack={() => go("settings")} />; break;
    case "notifications": content = <NotificationPanel onBack={() => go("settings")} />; break;
    case "profile": content = <ProfilePage go={go} />; break;
    case "advertise": content = <AdvertisePage go={go} />; break;
    case "activity": content = <ActivityPage go={go} />; break;
    case "settings": content = <SettingsPage go={go} darkMode={darkMode} setDarkMode={setDarkMode} />; break;
    case "contact": content = <ContactPage />; break;
    case "about": content = <AboutPage />; break;
    case "privacy": content = <PrivacyPage />; break;
    case "terms": content = <TermsPage />; break;
    default: content = <HomePage go={go} search={activeSearch} favoriteProductIds={favoriteProductIds} toggleFavorite={toggleFavorite} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadein { from { opacity: 0; transform: translateY(-6px);} to { opacity:1; transform:none; } }
        select:focus { outline: none; }
        .shinex-dark body { background:#0b1510; color:#e5e7eb; }
        .shinex-dark .bg-white { background-color:#122019 !important; }
        .shinex-dark .bg-gray-50 { background-color:#17271f !important; }
        .shinex-dark .text-gray-900 { color:#f3f4f6 !important; }
        .shinex-dark .text-gray-800 { color:#e5e7eb !important; }
        .shinex-dark .text-gray-700, .shinex-dark .text-gray-600 { color:#cbd5d1 !important; }
        .shinex-dark .text-gray-500, .shinex-dark .text-gray-400 { color:#9ca3af !important; }
        .shinex-dark .border-gray-100, .shinex-dark .border-gray-200 { border-color:#24372e !important; }
        .shinex-dark input, .shinex-dark textarea, .shinex-dark select { background:#17271f !important; color:#f3f4f6 !important; border-color:#2b4236 !important; }

      `}</style>
      <AppTopBar nav={nav} go={go} query={query} setQuery={setQuery} onSearchSubmit={onSearchSubmit} onOpenDrawer={() => setDrawerOpen(true)}  />
      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} go={go} nav={nav} />
      <main className="flex-1 pb-8" style={{ backgroundColor: COLORS.bg }}>{content}</main>
    </div>
  );
}
