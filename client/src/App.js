import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './store/slices/authSlice';
import { fetchProducts } from './store/slices/productSlice';
import { fetchConversations } from './store/slices/chatSlice';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';
import MyProducts from './pages/MyProducts';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Products from './pages/Products';
import WishlistPage from './pages/WishlistPage';
import ShowcasePage from './pages/ShowcasePage';
import BuyPage from './pages/BuyPage';
import UsersPage from './pages/UsersPage';
import UserProfilePage from './pages/UserProfilePage';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProducts({}));
      dispatch(fetchConversations());
    }
  }, [isAuthenticated, dispatch]);

  if (loading) {
    return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
    );
  }

  return (
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/" /> : <Login />}
            />
            <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/" /> : <Register />}
            />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route
                path="/create-product"
                element={isAuthenticated ? <CreateProduct /> : <Navigate to="/login" />}
            />
            <Route
                path="/edit-product/:id"
                element={isAuthenticated ? <EditProduct /> : <Navigate to="/login" />}
            />
            <Route
                path="/my-products"
                element={isAuthenticated ? <MyProducts /> : <Navigate to="/login" />}
            />
            <Route
                path="/chat"
                element={isAuthenticated ? <Chat /> : <Navigate to="/login" />}
            />
            <Route
                path="/profile"
                element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
            />
            <Route
                path="/wishlist"
                element={isAuthenticated ? <WishlistPage /> : <Navigate to="/login" />}
            />
            <Route
                path="/showcase"
                element={isAuthenticated ? <ShowcasePage /> : <Navigate to="/login" />}
            />
            <Route
                path="/buy/:productId"
                element={isAuthenticated ? <BuyPage /> : <Navigate to="/login" />}
            />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:userId" element={<UserProfilePage />} />
          </Routes>
        </main>
      </div>
  );
}

export default App;