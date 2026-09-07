import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartIcon } from './Icons';
import { formatNaira } from '../utils/format';
import { useAuth } from '../context/AuthContext';
import { favoriteProduct, unfavoriteProduct } from '../api/favorites';
import { useToast } from './Toast';

export default function ProductCard({ product, favorited = false, onFavoriteChange }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const showToast = useToast();
  const [isFav, setIsFav] = useState(favorited);
  const [busy, setBusy] = useState(false);

  const toggleFav = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) return navigate('/login');
    if (busy) return;
    setBusy(true);
    try {
      if (isFav) {
        await unfavoriteProduct(product.id);
        setIsFav(false);
      } else {
        await favoriteProduct(product.id);
        setIsFav(true);
      }
      onFavoriteChange?.(!isFav);
    } catch (err) {
      showToast(err.message || 'Could not update favorites');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="shx-card shx-product-card" onClick={() => navigate(`/product/${product.id}`)} role="button" tabIndex={0}>
      <div className="shx-product-card__imgwrap">
        {product.primary_image ? (
          <img className="shx-product-card__img" src={product.primary_image} alt={product.name} loading="lazy" />
        ) : (
          <div className="shx-product-card__img" />
        )}
        <button className={`shx-fav-btn${isFav ? ' is-active' : ''}`} onClick={toggleFav} aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}>
          <HeartIcon filled={isFav} width={16} height={16} />
        </button>
      </div>
      <div className="shx-product-card__body">
        <div className="shx-product-card__price">{formatNaira(product.price)}</div>
        <div className="shx-product-card__name">{product.name}</div>
        <div className="shx-product-card__meta">{product.location || product.seller?.shop_name || ''}</div>
      </div>
    </div>
  );
}
