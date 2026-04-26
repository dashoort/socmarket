import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchProduct, deleteProduct } from '../store/slices/productSlice';
import { setCurrentChat } from '../store/slices/chatSlice';
import { addToWishlist } from '../store/slices/wishlistSlice';
import AlsoBought from '../components/AlsoBought';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct, loading } = useSelector((state) => state.products);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (!currentProduct) return;
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;
    const result = await dispatch(deleteProduct(currentProduct.id));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/my-products');
    }
  };

  const handleMessageSeller = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (currentProduct) {
      dispatch(setCurrentChat({
        other_user_id: currentProduct.seller_id,
        other_username: currentProduct.seller_name,
        last_message_time: new Date().toISOString(),
      }));
      navigate('/chat');
    }
  };

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(addToWishlist(currentProduct.id));
  };

  const handleBuy = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/buy/${currentProduct.id}`);
  };

  if (loading || !currentProduct) {
    return (
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading product...</p>
          </div>
        </div>
    );
  }

  const isOwner = user && currentProduct.seller_id === user.id;

  return (
      <div className="container">
        <div className="product-detail">
          {currentProduct.image_url && (
              <img
                  src={currentProduct.image_url}
                  alt={currentProduct.title}
                  className="product-detail-image"
                  onError={(e) => { e.target.src = '/placeholder-image.svg'; e.target.onerror = null; }}
              />
          )}
          <div className="product-detail-content">
            <div className="product-detail-header">
              <div>
                <h1 className="product-detail-title">{currentProduct.title}</h1>
                <div className="product-detail-meta">
                  <span className="badge badge-info">{currentProduct.category}</span>
                  <span className="badge badge-success">{currentProduct.condition}</span>
                  <span className="badge badge-info">Seller: {currentProduct.seller_name}</span>
                </div>
              </div>
              <div className="product-detail-price">
                ₹{parseInt(currentProduct.price).toLocaleString('en-IN')}
              </div>
            </div>

            <p className="product-detail-description">{currentProduct.description}</p>

            <div className="product-detail-actions">
              {!isOwner && (
                  <>
                    <button
                        className="btn btn-primary"
                        onClick={handleMessageSeller}
                    >
                      Message Seller
                    </button>

                    <button
                        onClick={handleAddToWishlist}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                    >
                      ♡ В желания
                    </button>

                    <button
                        onClick={handleBuy}
                        style={{
                          padding: '10px 20px',
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                    >
                      🛒 Купить
                    </button>
                  </>
              )}

              {isOwner && (
                  <>
                    <Link
                        to={`/edit-product/${currentProduct.id}`}
                        className="btn btn-outline"
                    >
                      Edit Listing
                    </Link>
                    <button
                        className="btn btn-danger"
                        onClick={handleDelete}
                    >
                      Delete Listing
                    </button>
                  </>
              )}
            </div>

            {/* Блок "Также купили" */}
            <AlsoBought productId={currentProduct.id} />

          </div>
        </div>
      </div>
  );
};

export default ProductDetail;