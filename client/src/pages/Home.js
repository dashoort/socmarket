import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import ImageCarousel from '../components/ImageCarousel';
import './Home.css';
import { FaMobileAlt, FaLaptop, FaHeadphones, FaCamera, FaGamepad, FaHome, FaMicrochip } from 'react-icons/fa';

const carouselImages = [
  '/project_image.webp',
  '/project_image2.jpg',
  '/project_image3.jpg'
];

const categories = [
  { name: 'Smartphones', icon: FaMobileAlt },
  { name: 'Laptops', icon: FaLaptop },
  { name: 'Tablets', icon: FaMicrochip },
  { name: 'Gaming', icon: FaGamepad },
  { name: 'Audio', icon: FaHeadphones },
  { name: 'Cameras', icon: FaCamera },
  { name: 'Smart Home', icon: FaHome },
  { name: 'Other', icon: FaMicrochip }
];

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  const handleCategoryClick = (category) => {
    dispatch(fetchProducts({ category }));
  };

  const featuredProducts = products.slice(0, 8);

  return (
      <div className="home-page">
        {/* Header */}
        <header className="modern-header">
          <div className="header-content">
            <h1 className="brand-title">ElectroMarket</h1>
            <nav className="header-nav">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/products" className="nav-link">Browse</Link>
              <Link to="/profile" className="nav-link">Account</Link>
              <Link to="/users" className="nav-link">👥 Пользователи</Link>
            </nav>
          </div>
        </header>

        {/* Carousel */}
        <section className="carousel-section">
          <ImageCarousel images={carouselImages} />
        </section>

        {/* Categories */}
        <section className="categories-section">
          <div className="container">
            <h2 className="section-title">Shop by Category</h2>
            <div className="categories-grid">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                    <div
                        key={cat.name}
                        className="category-card"
                        onClick={() => handleCategoryClick(cat.name)}
                        style={{ cursor: 'pointer' }}
                    >
                      <Icon className="category-icon" />
                      <span className="category-name">{cat.name}</span>
                    </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Модули: Мои желания и Витрина покупок */}
        {isAuthenticated && (
            <section style={{ padding: '20px 0' }}>
              <div className="container">
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>

                  <Link to="/wishlist" style={{ textDecoration: 'none', flex: '1', minWidth: '200px' }}>
                    <div
                        style={{
                          padding: '24px', backgroundColor: 'white',
                          borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          textAlign: 'center', border: '1px solid #f1f5f9',
                          transition: 'transform 0.2s ease', cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ fontSize: '36px', marginBottom: '10px' }}>♡</div>
                      <div style={{ fontWeight: '700', fontSize: '16px', color: '#1f2937' }}>
                        Мои желания
                      </div>
                      <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px' }}>
                        Сохранённые товары
                      </div>
                    </div>
                  </Link>

                  <Link to="/showcase" style={{ textDecoration: 'none', flex: '1', minWidth: '200px' }}>
                    <div
                        style={{
                          padding: '24px', backgroundColor: 'white',
                          borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          textAlign: 'center', border: '1px solid #f1f5f9',
                          transition: 'transform 0.2s ease', cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ fontSize: '36px', marginBottom: '10px' }}>🛍️</div>
                      <div style={{ fontWeight: '700', fontSize: '16px', color: '#1f2937' }}>
                        Витрина покупок
                      </div>
                      <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px' }}>
                        Мои публичные покупки
                      </div>
                    </div>
                  </Link>

                </div>
              </div>
            </section>
        )}

        {/* Featured Products */}
        <section className="featured-section">
          <div className="container">
            <div className="featured-header">
              <h2 className="section-title">Featured Products</h2>
              <Link to="/products" className="view-all-link">View All</Link>
            </div>
            {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading products...</p>
                </div>
            ) : featuredProducts.length > 0 ? (
                <div className="products-grid">
                  {featuredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                  ))}
                </div>
            ) : (
                <div className="empty-state">
                  <h3>No products yet</h3>
                  <p>Be the first to list an item and start selling!</p>
                  {isAuthenticated ? (
                      <Link to="/create-product" className="btn btn-primary">
                        List Your First Item
                      </Link>
                  ) : (
                      <Link to="/register" className="btn btn-primary">
                        Join the Community
                      </Link>
                  )}
                </div>
            )}
          </div>
        </section>
      </div>
  );
};

export default Home;