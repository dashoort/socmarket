import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProducts } from '../store/slices/productSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userProducts } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchUserProducts());
  }, [dispatch]);

  return (
    <div className="container">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
          <div className="profile-name">{user?.username}</div>
          <div className="profile-email">{user?.email}</div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-number">{userProducts.length}</div>
            <div className="stat-label">Active Listings</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{userProducts.filter(p => p.status !== 'sold').length}</div>
            <div className="stat-label">Available</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{userProducts.filter(p => p.status === 'sold').length}</div>
            <div className="stat-label">Sold</div>
          </div>
        </div>

        <div className="alert alert-info">
          Tip: Keep your listings fresh with accurate descriptions and clear photos to attract more buyers.
        </div>
      </div>
    </div>
  );
};

export default Profile;
