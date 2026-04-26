import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyPurchases } from '../store/slices/purchasesSlice';
import { Link } from 'react-router-dom';

const ShowcasePage = () => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.purchases);

    useEffect(() => {
        dispatch(fetchMyPurchases());
    }, [dispatch]);

    const publicItems = items.filter((item) => item.is_public === 1);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    if (loading) {
        return (
            <div style={{ padding: '60px', textAlign: 'center' }}>
                <div className="loading-spinner"></div>
                <p>Загрузка...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#1f2937' }}>
                🛍️ Витрина покупок
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '30px' }}>
                Публичных покупок: {publicItems.length} · Всего куплено: {items.length}
            </p>

            {publicItems.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '80px 40px',
                    backgroundColor: '#f8fafc', borderRadius: '16px',
                    border: '2px dashed #e2e8f0'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛍️</div>
                    <h3 style={{ color: '#374151', marginBottom: '8px' }}>Витрина пуста</h3>
                    <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
                        При покупке товара включите опцию «Опубликовать на витрине»
                    </p>
                    <Link to="/products" style={{
                        padding: '12px 24px', backgroundColor: '#667eea',
                        color: 'white', borderRadius: '8px', textDecoration: 'none',
                        fontWeight: '600'
                    }}>
                        Перейти к товарам
                    </Link>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '24px'
                }}>
                    {publicItems.map((item) => (
                        <div key={item.id} style={{
                            backgroundColor: 'white', borderRadius: '16px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            overflow: 'hidden', border: '1px solid #f1f5f9'
                        }}>
                            <div style={{ height: '180px', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
                                <img
                                    src={item.image_url || '/placeholder-image.svg'}
                                    alt={item.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = '/placeholder-image.svg'; }}
                                />
                            </div>
                            <div style={{ padding: '16px' }}>
                <span style={{
                    backgroundColor: '#f1f5f9', color: '#475569',
                    padding: '3px 10px', borderRadius: '20px', fontSize: '12px'
                }}>
                  {item.category}
                </span>
                                <Link to={`/products/${item.id}`} style={{
                                    display: 'block', marginTop: '8px', marginBottom: '4px',
                                    fontWeight: '700', fontSize: '15px', color: '#1f2937',
                                    textDecoration: 'none'
                                }}>
                                    {item.title}
                                </Link>
                                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                                    {item.condition}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <p style={{ fontSize: '20px', fontWeight: '800', color: '#1f2937', margin: 0 }}>
                                        {formatPrice(item.price)}
                                    </p>
                                    <span style={{
                                        backgroundColor: '#d1fae5', color: '#065f46',
                                        padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'
                                    }}>
                    ✓ Куплено
                  </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShowcasePage;