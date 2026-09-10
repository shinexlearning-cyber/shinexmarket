import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from './lib/api';

const ThemeContext = createContext();
const AuthContext = createContext();

const categoryImages = {
  electronics: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=700&q=80',
  fashion: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=700&q=80',
  'home-garden': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=80',
  vehicles: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=700&q=80',
  'health-beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=80',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=700&q=80',
  books: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=700&q=80',
  services: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=700&q=80',
  other: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=700&q=80'
};

function Icon({ name, size = 20 }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    heart: <path d="M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.7Z" />,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    moon: <path d="M20 15.3A8.6 8.6 0 0 1 8.7 4 8.6 8.6 0 1 0 20 15.3Z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    chevron: <path d="m6 9 6 6 6-6" />,
    location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    shield: <path d="M12 3 19 6v5c0 4.6-3 8.1-7 10-4-1.9-7-5.4-7-10V6l7-3Z" />,
    phone: <path d="M6.5 3.5 9 3l2 5-2 1.5a15 15 0 0 0 3.5 3.5L14 11l5 2 .5 2.5A3 3 0 0 1 16.5 19 13.5 13.5 0 0 1 5 7.5a3 3 0 0 1 1.5-4Z" />,
    logout: <><path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9" /></>,
    edit: <><path d="m4 16-.8 4.8L8 20l11-11-4-4L4 16Z" /><path d="m13.5 6.5 4 4" /></>,
    upload: <><path d="M12 16V4m0 0L7 9m5-5 5 5" /><path d="M5 20h14" /></>,
    flag: <><path d="M5 21V4" /><path d="M5 5c5-3 7 3 14 0v9c-7 3-9-3-14 0" /></>,
    message: <><path d="M4 5h16v11H8l-4 4V5Z" /><path d="M8 9h8M8 12h5" /></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    alert: <><path d="M12 3 2.5 20h19L12 3Z" /><path d="M12 9v4m0 3v.2" /></>,
    eye: <><path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
    eyeOff: <><path d="m3 3 18 18M10.6 6.2A10 10 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3 3.6M6.3 6.8C3.9 8.2 2.5 12 2.5 12S6 18 12 18c1.2 0 2.3-.2 3.3-.6" /></>,
    sparkle: <><path d="m12 2 1.4 5.6L19 9l-5.6 1.4L12 16l-1.4-5.6L5 9l5.6-1.4L12 2Z" /><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" /></>
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name] || paths.grid}</svg>;
}

function Logo({ compact = false }) {
  return <Link to="/" className={`brand ${compact ? 'brand--compact' : ''}`} aria-label="SHINEX home">
    <span className="brand-mark">S</span><span className="brand-word">SHINEX</span>
  </Link>;
}

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('shinex_theme') || 'system');
  useEffect(() => {
    localStorage.setItem('shinex_theme', theme);
    const root = document.documentElement;
    const dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.dataset.theme = dark ? 'dark' : 'light';
  }, [theme]);
  return { theme, setTheme };
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('shinex_user') || 'null'); } catch { return null; }
  });
  const [checking, setChecking] = useState(Boolean(sessionStorage.getItem('shinex_token')));
  useEffect(() => {
    if (!sessionStorage.getItem('shinex_token')) return;
    api.get('/auth/me').then((result) => {
      const next = result.data?.user || result.user;
      setUser(next);
      sessionStorage.setItem('shinex_user', JSON.stringify(next));
    }).catch(() => {
      sessionStorage.removeItem('shinex_token');
      sessionStorage.removeItem('shinex_user');
      setUser(null);
    }).finally(() => setChecking(false));
  }, []);
  const login = (payload) => {
    const next = payload.data?.user;
    sessionStorage.setItem('shinex_token', payload.data?.token || '');
    sessionStorage.setItem('shinex_user', JSON.stringify(next));
    setUser(next);
  };
  const logout = async () => {
    try { await api.post('/auth/logout', {}); } catch { /* local session still clears */ }
    sessionStorage.removeItem('shinex_token');
    sessionStorage.removeItem('shinex_user');
    setUser(null);
  };
  return <AuthContext.Provider value={{ user, login, logout, checking }}>{children}</AuthContext.Provider>;
}

function useAuth() { return useContext(AuthContext); }

function App() {
  const themeValue = useTheme();
  return <ThemeContext.Provider value={themeValue}><AuthProvider><Site /></AuthProvider></ThemeContext.Provider>;
}

function Site() {
  const location = useLocation();
  const { user, logout, checking } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setMobileOpen(false), [location.pathname]);
  if (checking) return <div className="app-loading"><Logo /><span className="spinner" /></div>;
  return <div className="site-shell">
    <header className="site-header">
      <div className="container header-inner">
        <button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Icon name="menu" /></button>
        <Logo />
        <nav className={`main-nav ${mobileOpen ? 'main-nav--open' : ''}`}>
          <div className="mobile-nav-head"><Logo compact /><button className="icon-button" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><Icon name="close" /></button></div>
          <Link to="/products">Discover</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/support">Support</Link>
          <div className="mobile-only nav-divider" />
          {user && <Link className="mobile-only" to="/profile">My profile</Link>}
          {!user && <Link className="mobile-only" to="/login">Sign in</Link>}
        </nav>
        {mobileOpen && <button className="nav-scrim" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}
        <div className="header-actions">
          <Link className="header-favorite" to="/favorites" aria-label="Favorites"><Icon name="heart" /></Link>
          <ThemeToggle />
          {user ? <div className="user-menu"><Link className="avatar" to="/profile">{initials(user.full_name || user.username)}</Link><button className="text-button logout-button" onClick={logout}>Sign out</button></div> : <Link className="button button--dark button--small" to="/login">Sign in</Link>}
          <Link className="button button--primary button--small post-button" to="/sell"><Icon name="plus" size={17} /> Post a product</Link>
        </div>
      </div>
    </header>
    <main><Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/category/:slug" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/shop/:username" element={<Shop />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/profile" element={<Protected><Profile /></Protected>} />
      <Route path="/favorites" element={<Protected><Favorites /></Protected>} />
      <Route path="/sell" element={<Protected><Sell /></Protected>} />
      <Route path="/support" element={<Support />} />
      <Route path="/reports" element={<Protected><Reports /></Protected>} />
      <Route path="/advertise" element={<Protected><Advertise /></Protected>} />
      <Route path="*" element={<NotFound />} />
    </Routes></main>
    <MobileNav />
    <footer className="site-footer"><div className="container footer-inner"><Logo compact /><span>© {new Date().getFullYear()} SHINEX Marketplace</span><div><Link to="/support">Support</Link><Link to="/categories">Explore</Link></div></div></footer>
  </div>;
}

function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);
  return <div className="theme-toggle" aria-label="Theme">
    <button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')} title="Light theme"><Icon name="sun" size={16} /></button>
    <button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')} title="Dark theme"><Icon name="moon" size={16} /></button>
    <button className={theme === 'system' ? 'active' : ''} onClick={() => setTheme('system')} title="System theme">A</button>
  </div>;
}

function MobileNav() {
  const { user } = useAuth();
  return <nav className="mobile-bottom-nav"><Link to="/"><Icon name="grid" size={19} /><span>Home</span></Link><Link to="/products"><Icon name="search" size={19} /><span>Discover</span></Link><Link className="mobile-post" to="/sell"><Icon name="plus" size={21} /></Link><Link to="/favorites"><Icon name="heart" size={19} /><span>Saved</span></Link><Link to={user ? '/profile' : '/login'}><Icon name="user" size={19} /><span>Account</span></Link></nav>;
}

function Protected({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  return user ? children : <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
}

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    Promise.all([api.get('/products?limit=8&sort=newest'), api.get('/products/categories/all')]).then(([p, c]) => {
      setProducts(p.data || []);
      setCategories(c.data || []);
    }).catch((e) => setError(e.message));
  }, []);
  return <div>
    <section className="hero"><div className="container hero-grid"><div className="hero-copy"><p className="eyebrow"><span className="eyebrow-dot" /> A marketplace built around people</p><h1>Find what matters.<br /><em>Sell what’s yours.</em></h1><p className="hero-lede">Discover quality products, trusted sellers and new opportunities from your community and beyond.</p><div className="hero-actions"><Link className="button button--primary" to="/products">Browse products <Icon name="arrow" size={17} /></Link><Link className="button button--ghost" to="/sell">Post a product</Link></div><div className="hero-proof"><div className="proof-avatars"><span>AM</span><span>TO</span><span>KI</span></div><span>Built for real local connections</span></div></div><div className="hero-art"><div className="hero-orbit hero-orbit--one" /><div className="hero-orbit hero-orbit--two" /><div className="hero-card hero-card--main"><img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85" alt="Minimal wristwatch listed on SHINEX" /><div className="hero-card-caption"><span>Featured find</span><strong>Everyday essentials</strong></div></div><div className="hero-note hero-note--top"><span className="status-dot" /> New listings daily</div><div className="hero-note hero-note--bottom"><Icon name="shield" size={17} /><span>Meet with confidence</span></div></div></div></section>
    <section className="section section--tight"><div className="container"><div className="section-heading"><div><p className="eyebrow">Browse your way</p><h2>Explore categories</h2></div><Link className="link-arrow" to="/categories">View all <Icon name="arrow" size={16} /></Link></div>{categories.length ? <div className="category-row">{categories.slice(0, 5).map((category) => <CategoryCard key={category.id} category={category} />)}</div> : <EmptyState compact message={error ? 'Categories are unavailable right now.' : 'Categories will appear here once they are available.'} />}</div></section>
    <section className="section products-section"><div className="container"><div className="section-heading"><div><p className="eyebrow">Fresh on SHINEX</p><h2>Recently listed</h2></div><Link className="link-arrow" to="/products">See all products <Icon name="arrow" size={16} /></Link></div>{error ? <ErrorState message={error} /> : products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <EmptyState message="No products have been listed yet." action="Be the first to post" onAction={() => navigate('/sell')} />}</div></section>
    <section className="trust-strip"><div className="container trust-grid"><div><Icon name="shield" /><span><strong>Real people, real listings</strong><small>Connect directly with sellers.</small></span></div><div><Icon name="location" /><span><strong>Discover nearby</strong><small>Find more around your community.</small></span></div><div><Icon name="message" /><span><strong>Talk it through</strong><small>WhatsApp sellers before you meet.</small></span></div></div></section>
  </div>;
}

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const slug = useParams().slug;
  const activeCategory = category || slug || '';
  const load = () => {
    setLoading(true);
    const query = new URLSearchParams({ page: '1', limit: '20', sort: 'newest' });
    if (search) query.set('search', search);
    if (activeCategory) query.set('category', activeCategory);
    api.get(`/products?${query}`).then((result) => { setProducts(result.data || []); setError(''); }).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => { api.get('/products/categories/all').then((r) => setCategories(r.data || [])).catch(() => {}); }, []);
  useEffect(() => { load(); }, [search, activeCategory]);
  const setFilter = (key, value) => { const next = new URLSearchParams(searchParams); if (value) next.set(key, value); else next.delete(key); setSearchParams(next); };
  return <div className="page"><div className="container"><div className="page-intro"><div><p className="eyebrow">The marketplace</p><h1>{search ? `Results for “${search}”` : activeCategory ? 'Category listings' : 'Discover products'}</h1><p>Useful things, beautiful finds and opportunities from sellers on SHINEX.</p></div><Link className="button button--primary" to="/sell"><Icon name="plus" size={17} /> Post a product</Link></div><div className="filter-bar"><label className="search-field"><Icon name="search" size={18} /><input value={search} onChange={(e) => setFilter('search', e.target.value)} placeholder="Search products" /></label><select value={activeCategory} onChange={(e) => setFilter('category', e.target.value)}><option value="">All categories</option>{categories.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select><span className="result-count">{loading ? 'Loading…' : `${products.length} shown`}</span></div>{error ? <ErrorState message={error} /> : loading ? <ProductSkeleton /> : products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <EmptyState message="No products found." action="Clear filters" onAction={() => setSearchParams({})} />}</div></div>;
}

function Categories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { api.get('/products/categories/all').then((r) => setCategories(r.data || [])).catch((e) => setError(e.message)); }, []);
  return <div className="page"><div className="container"><div className="page-intro"><div><p className="eyebrow">Find your next thing</p><h1>Explore categories</h1><p>Start with a category, then narrow the search to what fits.</p></div></div>{error ? <ErrorState message={error} /> : categories.length ? <div className="category-grid category-grid--large">{categories.map((category) => <CategoryCard key={category.id} category={category} large />)}</div> : <EmptyState message="No categories are available yet." />}</div></div>;
}

function ProductCard({ product }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const image = product.primary_image || product.images?.find((item) => item.is_primary)?.image_url;
  const seller = product.seller || {};
  const toggle = async (event) => {
    event.preventDefault();
    if (!user) return;
    setBusy(true);
    try { if (saved) await api.delete(`/favorites/product/${product.id}`); else await api.post(`/favorites/product/${product.id}`, {}); setSaved(!saved); } catch { /* card stays usable if favorite fails */ } finally { setBusy(false); }
  };
  return <Link className="product-card" to={`/product/${product.id}`}><div className="product-image">{image ? <img src={image} alt={product.name} /> : <div className="image-placeholder"><Icon name="grid" size={28} /></div>}<button className={`favorite-button ${saved ? 'is-saved' : ''}`} disabled={busy} onClick={toggle} aria-label={saved ? 'Remove from favorites' : 'Save product'}><Icon name="heart" size={18} /></button>{product.is_sold && <span className="sold-badge">Sold</span>}</div><div className="product-info"><div className="product-category">{product.category?.name || 'Marketplace'}</div><h3>{product.name}</h3><strong className="price">{formatMoney(product.price)}</strong><div className="product-meta"><span><Icon name="location" size={14} />{product.location || 'Location not listed'}</span><span>{seller.shop_name || seller.full_name || seller.username || 'Seller'}</span></div></div></Link>;
}

function CategoryCard({ category, large = false }) {
  const image = categoryImages[category.slug] || categoryImages.other;
  return <Link className={`category-card ${large ? 'category-card--large' : ''}`} to={`/products?category=${encodeURIComponent(category.id)}`}><img src={image} alt="" /><div className="category-overlay"><span>{category.name}</span><Icon name="arrow" size={17} /></div></Link>;
}

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    api.get(`/products/${id}`).then((r) => setProduct(r.data)).catch((e) => setError(e.message));
    if (user) api.get(`/favorites/product/${id}/check`).then((r) => setSaved(Boolean(r.data?.is_favorited))).catch(() => {});
  }, [id, user]);
  if (error) return <div className="page"><div className="container"><ErrorState message={error} /></div></div>;
  if (!product) return <div className="page"><div className="container"><ProductSkeleton /></div></div>;
  const images = product.images?.length ? product.images : product.primary_image ? [{ image_url: product.primary_image }] : [];
  const seller = product.seller || {};
  const whatsapp = String(seller.whatsapp || '').replace(/\D/g, '');
  const toggle = async () => { if (!user) return; try { if (saved) await api.delete(`/favorites/product/${id}`); else await api.post(`/favorites/product/${id}`, {}); setSaved(!saved); } catch {} };
  return <div className="page"><div className="container"><Link className="back-link" to="/products">← Back to discovery</Link><div className="detail-layout"><div className="detail-gallery"><div className="detail-main-image">{images[0] ? <img src={images[0].image_url} alt={product.name} /> : <div className="image-placeholder"><Icon name="grid" size={42} /></div>}</div>{images.length > 1 && <div className="detail-thumbs">{images.map((image) => <img key={image.image_url} src={image.image_url} alt="" />)}</div>}</div><div className="detail-copy"><div className="product-category">{product.category?.name || 'Marketplace'}</div><h1>{product.name}</h1><div className="detail-price">{formatMoney(product.price)}</div><div className="detail-meta"><span><Icon name="location" size={16} />{product.location || 'Location not listed'}</span><span className="dot-separator">•</span><span>{product.condition || 'Condition not listed'}</span></div><p className="detail-description">{product.description || 'The seller has not added a description yet.'}</p><div className="detail-actions"><a className="button button--primary button--wide" href={whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi, I’m interested in your SHINEX listing: ${product.name}`)}` : undefined} target="_blank" rel="noreferrer"><Icon name="message" size={18} /> Contact seller on WhatsApp</a><button className={`button button--outline button--wide ${saved ? 'button--saved' : ''}`} onClick={toggle}><Icon name="heart" size={18} /> {saved ? 'Saved' : 'Save listing'}</button></div><SellerPanel seller={seller} /></div></div><div className="detail-footer-actions"><Link to={`/reports?product=${id}`} className="text-button"><Icon name="flag" size={16} /> Report this listing</Link></div></div></div>;
}

function SellerPanel({ seller }) {
  return <div className="seller-panel"><div className="seller-avatar">{seller.avatar_url ? <img src={seller.avatar_url} alt="" /> : initials(seller.full_name || seller.username)}</div><div className="seller-panel-copy"><span className="muted-label">Listed by</span><strong>{seller.shop_name || seller.full_name || seller.username || 'SHINEX seller'}</strong><span>{seller.location || 'Location not listed'}</span></div>{seller.username && <Link className="link-arrow" to={`/shop/${seller.username}`}>View shop <Icon name="arrow" size={15} /></Link>}</div>;
}

function Shop() {
  const { username } = useParams();
  const [shop, setShop] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api.get(`/users/${username}/shop?limit=20`).then((r) => setShop(r.data)).catch((e) => setError(e.message)); }, [username]);
  if (error) return <div className="page"><div className="container"><ErrorState message={error} /></div></div>;
  if (!shop) return <div className="page"><div className="container"><ProductSkeleton /></div></div>;
  return <div className="page"><div className="container"><div className="shop-hero"><div className="seller-avatar seller-avatar--large">{shop.shop?.avatar_url ? <img src={shop.shop.avatar_url} alt="" /> : initials(shop.shop?.full_name || username)}</div><div><p className="eyebrow">Seller shop</p><h1>{shop.shop?.shop_name || shop.shop?.full_name || username}</h1><p>{shop.shop?.shop_description || shop.shop?.bio || 'This seller has not added a shop description yet.'}</p><span className="shop-location"><Icon name="location" size={15} /> {shop.shop?.location || 'Location not listed'} · {shop.pagination?.total ?? shop.shop?.product_count ?? 0} listings</span></div></div><div className="section-heading section-heading--inline"><h2>Available listings</h2></div>{shop.products?.length ? <div className="product-grid">{shop.products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <EmptyState message="This shop has no active listings yet." />}</div></div>;
}

function AuthPage({ mode }) {
  const isLogin = mode === 'login';
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(isLogin ? { email: '', password: '' } : { full_name: '', username: '', email: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [searchParams] = useSearchParams();
  if (user) return <Navigate to="/" replace />;
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError('');
    try { const result = await api.post(isLogin ? '/auth/login' : '/auth/register', form); login(result); navigate(searchParams.get('next') || '/', { replace: true }); } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return <div className="auth-page"><div className="auth-aside"><Logo /><div><p className="eyebrow">SHINEX Marketplace</p><h1>{isLogin ? 'Welcome back to your marketplace.' : 'Make room for what’s next.'}</h1><p>Buy, sell and discover through a marketplace designed for real connections.</p></div><span className="auth-aside-footer">Modern · Clean · Global</span></div><div className="auth-form-wrap"><div className="auth-form"><div className="auth-mobile-logo"><Logo /></div><p className="eyebrow">{isLogin ? 'Sign in' : 'Create your account'}</p><h2>{isLogin ? 'Good to see you.' : 'Start with SHINEX.'}</h2><p className="form-intro">{isLogin ? 'Access your saved listings and seller tools.' : 'One account for browsing, selling and connecting.'}</p><form onSubmit={submit}>{!isLogin && <><Field label="Full name" name="full_name" value={form.full_name} onChange={change} placeholder="Your full name" required /><Field label="Username" name="username" value={form.username} onChange={change} placeholder="Choose a username" required /></>}<Field label="Email" name="email" value={form.email} onChange={change} type="email" placeholder="you@example.com" required />{!isLogin && <Field label="Phone number" name="phone" value={form.phone} onChange={change} placeholder="080 000 0000" required />}<label className="field"><span>Password</span><div className="password-field"><input name="password" value={form.password} onChange={change} type={showPassword ? 'text' : 'password'} placeholder="Enter your password" required minLength="6" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}><Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} /></button></div></label>{error && <div className="form-error"><Icon name="alert" size={17} />{error}</div>}<button className="button button--primary button--wide" disabled={busy}>{busy ? <><span className="spinner spinner--small" /> Working…</> : isLogin ? 'Sign in' : 'Create account'}</button></form>{isLogin && <Link className="forgot-link" to="/forgot-password">Forgot password?</Link>}<p className="auth-switch">{isLogin ? 'New to SHINEX?' : 'Already have an account?'} <Link to={isLogin ? '/register' : '/login'}>{isLogin ? 'Create an account' : 'Sign in'}</Link></p></div></div></div>;
}

function ForgotPassword() {
  const [email, setEmail] = useState(''); const [message, setMessage] = useState(''); const [error, setError] = useState('');
  const submit = async (e) => { e.preventDefault(); setError(''); try { const r = await api.post('/auth/forgot-password', { email }); setMessage(r.message || 'If an account exists, reset instructions will be sent.'); } catch (err) { setError(err.message); } };
  return <div className="simple-page"><div className="auth-form auth-form--card"><Logo /><p className="eyebrow">Password reset</p><h2>Get back in.</h2><p className="form-intro">Enter your account email and we’ll send reset instructions if it exists.</p>{message ? <div className="success-box"><Icon name="check" />{message}</div> : <form onSubmit={submit}><Field label="Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" required />{error && <div className="form-error">{error}</div>}<button className="button button--primary button--wide">Send instructions</button></form>}<Link className="back-link back-link--center" to="/login">Back to sign in</Link></div></div>;
}

function Profile() {
  const { user } = useAuth(); const [form, setForm] = useState({ full_name: user?.full_name || '', bio: user?.bio || '', location: user?.location || '', whatsapp: user?.whatsapp || '', shop_name: user?.shop_name || '', shop_description: user?.shop_description || '' }); const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (e) => { e.preventDefault(); setBusy(true); setMessage(''); setError(''); try { await api.put('/users/me', form); setMessage('Profile updated successfully.'); } catch (err) { setError(err.message); } finally { setBusy(false); } };
  return <div className="page"><div className="container narrow-container"><div className="page-intro"><div><p className="eyebrow">Your account</p><h1>Profile settings</h1><p>Keep your seller details current so people know who they are talking to.</p></div><div className="profile-avatar">{user?.avatar_url ? <img src={user.avatar_url} alt="" /> : initials(user?.full_name || user?.username)}</div></div><form className="panel form-panel" onSubmit={submit}><div className="form-section"><h3>Personal details</h3><div className="form-grid"><Field label="Full name" name="full_name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /><Field label="WhatsApp number" name="whatsapp" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} /><Field label="Location" name="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /><Field label="Bio" name="bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div></div><div className="form-section"><h3>Shop details</h3><div className="form-grid"><Field label="Shop name" name="shop_name" value={form.shop_name} onChange={(e) => setForm({ ...form, shop_name: e.target.value })} /><Field label="Shop description" name="shop_description" value={form.shop_description} onChange={(e) => setForm({ ...form, shop_description: e.target.value })} /></div></div>{message && <div className="success-box"><Icon name="check" />{message}</div>}{error && <div className="form-error">{error}</div>}<div className="form-actions"><button className="button button--primary" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button></div></form></div></div>;
}

function Favorites() {
  const [products, setProducts] = useState([]); const [sellers, setSellers] = useState([]); const [error, setError] = useState('');
  useEffect(() => { Promise.all([api.get('/favorites/products?limit=20'), api.get('/favorites/sellers')]).then(([p, s]) => { setProducts(p.data || []); setSellers(s.data || []); }).catch((e) => setError(e.message)); }, []);
  return <div className="page"><div className="container"><div className="page-intro"><div><p className="eyebrow">Your shortlist</p><h1>Saved for later</h1><p>Keep the listings and sellers you want to come back to.</p></div></div>{error ? <ErrorState message={error} /> : <><div className="section-heading section-heading--inline"><h2>Saved listings</h2></div>{products.length ? <div className="product-grid">{products.map((item) => <ProductCard product={item.product} key={item.id} />)}</div> : <EmptyState compact message="No saved listings yet." action="Explore products" onAction={() => window.location.href = '/products'} />}<div className="section-heading section-heading--inline"><h2>Saved sellers</h2></div>{sellers.length ? <div className="seller-grid">{sellers.map((item) => <SellerPanel seller={item.seller} key={item.id} />)}</div> : <EmptyState compact message="No saved sellers yet." />}</>}</div></div>;
}

function Sell() {
  const [categories, setCategories] = useState([]); const [form, setForm] = useState({ name: '', price: '', category_id: '', condition: 'used', location: '', description: '' }); const [images, setImages] = useState([]); const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => { api.get('/products/categories/all').then((r) => setCategories(r.data || [])).catch((e) => setError(e.message)); }, []);
  const submit = async (e) => { e.preventDefault(); setBusy(true); setError(''); setMessage(''); const body = new FormData(); Object.entries(form).forEach(([key, value]) => body.append(key, value)); images.forEach((image) => body.append('images', image)); try { const r = await api.post('/products', body); setMessage(r.message || 'Product created successfully.'); setForm({ name: '', price: '', category_id: '', condition: 'used', location: '', description: '' }); setImages([]); } catch (err) { setError(err.message); } finally { setBusy(false); } };
  return <div className="page"><div className="container narrow-container"><div className="page-intro"><div><p className="eyebrow">Seller tools</p><h1>Post a product</h1><p>Give your listing the detail it needs to find the right person.</p></div></div><form className="panel form-panel" onSubmit={submit}><div className="form-section"><h3>Listing details</h3><div className="form-grid"><Field label="Product name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="What are you selling?" required /><Field label="Price (₦)" name="price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} type="number" min="0" placeholder="0" required /><label className="field"><span>Category</span><select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required><option value="">Select a category</option>{categories.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label><label className="field"><span>Condition</span><select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}><option value="new">New</option><option value="used">Used</option><option value="refurbished">Refurbished</option></select></label><Field label="Location" name="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City or area" /><label className="field field--full"><span>Description</span><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="5" placeholder="What should buyers know?" /></label></div></div><label className="upload-box"><Icon name="upload" size={24} /><strong>Add product photos</strong><span>Up to 5 images · JPG, PNG or WEBP</span><input type="file" accept="image/*" multiple onChange={(e) => setImages(Array.from(e.target.files || []).slice(0, 5))} />{images.length > 0 && <small>{images.length} photo{images.length > 1 ? 's' : ''} selected</small>}</label>{message && <div className="success-box"><Icon name="check" />{message}</div>}{error && <div className="form-error"><Icon name="alert" size={17} />{error}</div>}<div className="form-actions"><button className="button button--primary" disabled={busy}>{busy ? 'Publishing…' : 'Publish listing'}</button></div></form></div></div>;
}

function Support() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' }); const [info, setInfo] = useState(null); const [sent, setSent] = useState(false); const [error, setError] = useState('');
  useEffect(() => { api.get('/contact/info').then((r) => setInfo(r.data)).catch(() => {}); }, []);
  const submit = async (e) => { e.preventDefault(); setError(''); try { await api.post('/contact', form); setSent(true); } catch (err) { setError(err.message); } };
  return <div className="page"><div className="container support-grid"><div><p className="eyebrow">We’re here to help</p><h1>Let’s sort it out.</h1><p className="lead">Send a message to the SHINEX team. We’ll get back to you through the details you provide.</p><div className="contact-details">{info?.email && <a href={`mailto:${info.email}`}><Icon name="message" />{info.email}</a>}{info?.phone && <a href={`tel:${info.phone}`}><Icon name="phone" />{info.phone}</a>}{info?.whatsapp && <a href={`https://wa.me/${String(info.whatsapp).replace(/\D/g, '')}`}><Icon name="message" />WhatsApp support</a>}</div></div><div className="panel form-panel">{sent ? <div className="success-state"><span className="success-icon"><Icon name="check" /></span><h2>Message received.</h2><p>Your note is with the SHINEX team. Thanks for reaching out.</p><Link className="button button--outline" to="/">Return home</Link></div> : <form onSubmit={submit}><h3>Contact support</h3><div className="form-grid"><Field label="Name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /><Field label="Email" name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /><Field label="Phone" name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /><Field label="Subject" name="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required /><label className="field field--full"><span>Message</span><textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows="6" required /></label></div>{error && <div className="form-error">{error}</div>}<button className="button button--primary button--wide">Send message</button></form>}</div></div></div>;
}

function Reports() {
  const [searchParams] = useSearchParams(); const [reports, setReports] = useState([]); const [form, setForm] = useState({ target_product_id: searchParams.get('product') || '', reason: 'Spam', description: '' }); const [message, setMessage] = useState(''); const [error, setError] = useState('');
  useEffect(() => { api.get('/reports/my').then((r) => setReports(r.data || [])).catch((e) => setError(e.message)); }, []);
  const submit = async (e) => { e.preventDefault(); setError(''); try { const r = await api.post('/reports', form); setMessage(r.message || 'Report submitted successfully.'); } catch (err) { setError(err.message); } };
  return <div className="page"><div className="container support-grid"><div><p className="eyebrow">Keep SHINEX useful</p><h1>Report a listing.</h1><p className="lead">Only report content that breaks the marketplace rules. The team reviews every report.</p></div><div className="panel form-panel"><form onSubmit={submit}><h3>New report</h3><div className="form-grid"><Field label="Product ID" name="target_product_id" value={form.target_product_id} onChange={(e) => setForm({ ...form, target_product_id: e.target.value })} required /><label className="field"><span>Reason</span><select value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}><option>Spam</option><option>Fraud</option><option>Prohibited item</option><option>Harassment</option><option>Other</option></select></label><label className="field field--full"><span>What happened?</span><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="5" required /></label></div>{message && <div className="success-box"><Icon name="check" />{message}</div>}{error && <div className="form-error">{error}</div>}<button className="button button--primary button--wide">Submit report</button></form><div className="subsection"><h3>Your reports</h3>{reports.length ? reports.map((report) => <div className="list-row" key={report.id}><span>{report.target_product?.name || report.reason}</span><StatusBadge status={report.status} /><span className="muted">{formatDate(report.created_at)}</span></div>) : <p className="muted">No reports submitted.</p>}</div></div></div></div>;
}

function Advertise() {
  const [pricing, setPricing] = useState([]); const [ads, setAds] = useState([]); const [form, setForm] = useState({ title: '', description: '', duration_id: '' }); const [image, setImage] = useState(null); const [message, setMessage] = useState(''); const [error, setError] = useState('');
  useEffect(() => { Promise.all([api.get('/advertisements/pricing'), api.get('/advertisements/my')]).then(([p, a]) => { setPricing(p.data || []); setAds(a.data || []); }).catch((e) => setError(e.message)); }, []);
  const submit = async (e) => { e.preventDefault(); const body = new FormData(); Object.entries(form).forEach(([key, value]) => body.append(key, value)); if (image) body.append('image', image); try { const r = await api.post('/advertisements', body); setMessage(r.message || 'Advertisement created.'); } catch (err) { setError(err.message); } };
  return <div className="page"><div className="container"><div className="page-intro"><div><p className="eyebrow">Reach more people</p><h1>Advertise on SHINEX</h1><p>Put your offer in front of people already exploring the marketplace.</p></div></div><div className="advertise-layout"><form className="panel form-panel" onSubmit={submit}><h3>Create an advertisement</h3><div className="form-grid"><Field label="Title" name="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /><label className="field"><span>Duration</span><select value={form.duration_id} onChange={(e) => setForm({ ...form, duration_id: e.target.value })} required><option value="">Choose duration</option>{pricing.map((item) => <option value={item.id} key={item.id}>{item.duration_days} days · {formatMoney(item.price)}</option>)}</select></label><label className="field field--full"><span>Description</span><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="4" /></label></div><label className="upload-box upload-box--small"><Icon name="upload" size={22} /><strong>Upload ad image</strong><span>Required · one image</span><input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />{image && <small>{image.name}</small>}</label>{message && <div className="success-box"><Icon name="check" />{message}</div>}{error && <div className="form-error">{error}</div>}<button className="button button--primary button--wide">Create advertisement</button></form><div className="panel"><div className="panel-heading"><div><p className="eyebrow">Your campaigns</p><h3>Advertisement history</h3></div></div>{ads.length ? ads.map((ad) => <div className="list-row" key={ad.id}><div><strong>{ad.title}</strong><small>{ad.duration_days} days · {formatMoney(ad.amount)}</small></div><StatusBadge status={ad.approval_status || ad.payment_status} /><span className="muted">{formatDate(ad.created_at)}</span></div>) : <EmptyState compact message="No advertisements yet." />}</div></div></div></div>;
}

function Field({ label, name, value, onChange, type = 'text', placeholder, required, min }) {
  return <label className="field"><span>{label}</span><input name={name} value={value} onChange={onChange} type={type} placeholder={placeholder} required={required} min={min} /></label>;
}

function StatusBadge({ status }) { return <span className={`status-badge status-badge--${String(status || 'unknown').toLowerCase()}`}>{String(status || 'unknown').replace('_', ' ')}</span>; }
function EmptyState({ message, action, onAction, compact = false }) { return <div className={`empty-state ${compact ? 'empty-state--compact' : ''}`}><span className="empty-icon"><Icon name="sparkle" size={21} /></span><p>{message}</p>{action && <button className="button button--outline button--small" onClick={onAction}>{action}</button>}</div>; }
function ErrorState({ message }) { return <div className="error-state"><Icon name="alert" size={22} /><div><strong>Something needs attention</strong><p>{message}</p></div></div>; }
function ProductSkeleton() { return <div className="product-grid">{Array.from({ length: 4 }).map((_, i) => <div className="skeleton-card" key={i}><div className="skeleton skeleton-image" /><div className="skeleton skeleton-line" /><div className="skeleton skeleton-line skeleton-line--short" /></div>)}</div>; }
function NotFound() { return <div className="simple-page"><div className="empty-state"><span className="empty-icon"><Icon name="search" size={24} /></span><h2>That page moved.</h2><p>Try discovering products instead.</p><Link className="button button--primary" to="/products">Browse products</Link></div></div>; }
function initials(name = '') { return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'S'; }
function formatMoney(value) { if (value === null || value === undefined || value === '') return 'Price on request'; return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(Number(value)); }
function formatDate(value) { return value ? new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium' }).format(new Date(value)) : '—'; }

export default App;