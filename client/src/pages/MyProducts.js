import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserProducts, deleteProduct } from '../store/slices/productSlice';

const MyProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { userProducts, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchUserProducts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Delete this product?');
    if (!confirmDelete) return;
    await dispatch(deleteProduct(id));
  };

  const handleCreate = () => {
    navigate('/create-product');
  };

  return (
    <div className="container">
      <div className="profile-header">
        <div className="profile-avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
        <h2 className="profile-name">{user?.username}'s Listings</h2>
        <p className="profile-email">{user?.email}</p>
        <div className="form-actions" style={{ marginTop: 20 }}>
          <button className="btn btn-primary" onClick={handleCreate}>Create New Listing</button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your products...</p>
        </div>
      ) : userProducts.length === 0 ? (
        <div className="no-products">
          <div className="no-products-content">
            <h3>No listings yet</h3>
            <p>Start by creating your first product listing.</p>
            <button className="btn btn-primary" onClick={handleCreate}>List Your First Item</button>
          </div>
        </div>
      ) : (
        <div className="products-grid">
          {userProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.title}
                    className="product-image"
                    onError={(e) => { e.target.src = '/placeholder-image.svg'; e.target.onerror = null; }}
                  />
                ) : (
                  <div className="product-image-placeholder"><span>No Image</span></div>
                )}
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <div className="product-price">${parseFloat(product.price).toFixed(2)}</div>
                <div className="product-meta">
                  <span className="badge badge-info">{product.category}</span>
                  <span className="badge badge-success">{product.condition}</span>
                </div>
                <div className="product-detail-actions" style={{ marginTop: 10 }}>
                  <Link to={`/products/${product.id}`} className="btn btn-outline">View</Link>
                  <Link to={`/edit-product/${product.id}`} className="btn btn-primary">Edit</Link>
                  <button className="btn btn-danger" onClick={() => handleDelete(product.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
