import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaEye, FaStar, FaShoppingCart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist } from '../store/slices/wishlistSlice';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const {
    id,
    title,
    description,
    price,
    condition,
    category,
    imageUrl,
    image_url,
    seller,
    createdAt
  } = product;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [wishlistAdded, setWishlistAdded] = useState(false);

  const productImage = imageUrl || image_url || '/placeholder-image.svg';

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getConditionColor = (condition) => {
    const colors = {
      'New': '#10B981',
      'Like New': '#059669',
      'Good': '#3B82F6',
      'Fair': '#F59E0B',
      'Used': '#6B7280'
    };
    return colors[condition] || '#6B7280';
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(addToWishlist(id));
    setWishlistAdded(true);
    setTimeout(() => setWishlistAdded(false), 2000);
  };

  const handleBuy = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/buy/${id}`);
  };

  return (
      <div className="product-card">
        <div className="product-image-container">
          <img
              src={productImage}
              alt={title}
              className="product-image"
              onError={(e) => {
                e.target.src = '/placeholder-image.svg';
                e.target.onerror = null;
              }}
          />
          <div className="product-overlay">
            <button
                className="overlay-btn wishlist-btn"
                title="В желания"
                onClick={handleAddToWishlist}
                style={{ color: wishlistAdded ? '#ff4d6d' : 'white' }}
            >
              <FaHeart />
            </button>
            <button className="overlay-btn view-btn" title="Quick view">
              <FaEye />
            </button>
          </div>
          <div className="product-badge" style={{ backgroundColor: getConditionColor(condition) }}>
            {condition}
          </div>
        </div>

        <div className="product-content">
          <div className="product-category">
            <span className="category-tag">{category}</span>
            <span className="product-date">{formatDate(createdAt)}</span>
          </div>

          <Link to={`/products/${id}`} className="product-title">
            {title}
          </Link>

          <p className="product-description">
            {description && description.length > 80
                ? `${description.substring(0, 80)}...`
                : description}
          </p>

          <div className="product-meta">
            <div className="seller-info">
              <span className="seller-label">Seller:</span>
              <span className="seller-name">{seller?.username || product.seller_name || 'Unknown'}</span>
            </div>
            <div className="rating-info">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        className={`star ${star <= 4 ? 'filled' : 'empty'}`}
                    />
                ))}
              </div>
              <span className="rating-text">4.0 (12)</span>
            </div>
          </div>

          <div className="product-footer">
            <div className="price-container">
              <span className="product-price">{formatPrice(price)}</span>
              {condition === 'New' && (
                  <span className="original-price">{formatPrice(price * 1.2)}</span>
              )}
            </div>
            <Link to={`/products/${id}`} className="view-details-btn">
              View Details
            </Link>
          </div>

          {/* Новые кнопки */}
          <div className="card-action-buttons">
            <button
                onClick={handleAddToWishlist}
                className="card-btn wishlist-action-btn"
                style={{
                  backgroundColor: wishlistAdded ? '#10B981' : '#f3f4f6',
                  color: wishlistAdded ? 'white' : '#374151'
                }}
            >
              <FaHeart style={{ marginRight: '6px' }} />
              {wishlistAdded ? 'Добавлено!' : 'В желания'}
            </button>

            <button
                onClick={handleBuy}
                className="card-btn buy-action-btn"
            >
              <FaShoppingCart style={{ marginRight: '6px' }} />
              Купить
            </button>
          </div>
        </div>
      </div>
  );
};

export default ProductCard;