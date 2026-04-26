import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { buyItem } from '../store/slices/purchasesSlice';

const BuyPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [product, setProduct] = useState(null);
    const [isPublic, setIsPublic] = useState(false);
    const [purchased, setPurchased] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/products/${productId}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                setLoading(false);
            });
    }, [productId]);

    const handleBuy = async () => {
        await dispatch(buyItem({ listing_id: parseInt(productId), is_public: isPublic }));
        setPurchased(true);
        setTimeout(() => navigate('/showcase'), 2000);
    };

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
        <div style={{
            maxWidth: '500px', margin: '60px auto', padding: '0 20px'
        }}>
            <div style={{
                backgroundColor: 'white', borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)', overflow: 'hidden'
            }}>
                {product?.image_url && (
                    <img
                        src={product.image_url}
                        alt={product.title}
                        style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                    />
                )}
                <div style={{ padding: '28px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px', color: '#1f2937' }}>
                        Подтверждение покупки
                    </h2>
                    <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '14px' }}>
                        Проверьте детали перед покупкой
                    </p>

                    <div style={{
                        padding: '16px', backgroundColor: '#f8fafc',
                        borderRadius: '10px', marginBottom: '20px'
                    }}>
                        <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', color: '#1f2937' }}>
                            {product?.title}
                        </h3>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#6b7280' }}>
                            {product?.category} · {product?.condition}
                        </p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '800', color: '#1f2937' }}>
                            {formatPrice(product?.price)}
                        </p>
                    </div>

                    <label style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '16px', backgroundColor: '#eff6ff',
                        borderRadius: '10px', marginBottom: '20px',
                        cursor: 'pointer', border: '1px solid #bfdbfe'
                    }}>
                        <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <div>
                            <p style={{ margin: '0 0 2px 0', fontWeight: '600', fontSize: '14px', color: '#1e40af' }}>
                                📢 Опубликовать на витрине покупок
                            </p>
                            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                                Другие пользователи смогут видеть эту покупку
                            </p>
                        </div>
                    </label>

                    {purchased ? (
                        <div style={{
                            padding: '16px', backgroundColor: '#d1fae5',
                            borderRadius: '10px', textAlign: 'center',
                            color: '#065f46', fontWeight: '600'
                        }}>
                            ✓ Куплено! Переходим на витрину...
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => navigate(-1)}
                                style={{
                                    flex: 1, padding: '12px', backgroundColor: '#f3f4f6',
                                    color: '#374151', border: 'none', borderRadius: '8px',
                                    cursor: 'pointer', fontSize: '15px', fontWeight: '600'
                                }}
                            >
                                Назад
                            </button>
                            <button
                                onClick={handleBuy}
                                style={{
                                    flex: 2, padding: '12px',
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                    color: 'white', border: 'none', borderRadius: '8px',
                                    cursor: 'pointer', fontSize: '15px', fontWeight: '700'
                                }}
                            >
                                ✓ Купить
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuyPage;