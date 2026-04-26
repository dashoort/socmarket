import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const UserProfilePage = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [showcase, setShowcase] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [activeTab, setActiveTab] = useState('showcase');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch(`/api/users/profile/${userId}`).then((r) => r.json()),
            fetch(`/api/purchases/showcase/${userId}`).then((r) => r.json()),
            fetch(`/api/wishlist/user/${userId}`).then((r) => r.json()),
        ]).then(([userData, showcaseData, wishlistData]) => {
            setUser(userData);
            setShowcase(Array.isArray(showcaseData) ? showcaseData : []);
            setWishlist(Array.isArray(wishlistData) ? wishlistData : []);
            setLoading(false);
        });
    }, [userId]);

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

    const currentItems = activeTab === 'showcase' ? showcase : wishlist;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px 20px' }}>

            {/* Шапка профиля */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '24px', backgroundColor: 'white', borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '24px',
                flexWrap: 'wrap', gap: '16px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: 'white', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: '700', fontSize: '28px'
                    }}>
                        {user?.username[0].toUpperCase()}
                    </div>
                    <div>
                        <h2 style={{ margin: '0 0 4px 0', fontSize: '22px', color: '#1f2937' }}>
                            {user?.username}
                        </h2>
                        <p style={{ margin: 0, color: '#9ca3af', fontSize: '13px' }}>
                            На сайте с {new Date(user?.created_at).toLocaleDateString('ru-RU')}
                        </p>
                    </div>
                </div>
                <Link
                    to={`/chat?to=${userId}`}
                    style={{
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: 'white', borderRadius: '8px',
                        textDecoration: 'none', fontSize: '14px', fontWeight: '600'
                    }}
                >
                    ✉️ Написать сообщение
                </Link>
            </div>

            {/* Вкладки */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                <button
                    onClick={() => setActiveTab('showcase')}
                    style={{
                        padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                        border: 'none', fontSize: '14px', fontWeight: '600',
                        background: activeTab === 'showcase'
                            ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f3f4f6',
                        color: activeTab === 'showcase' ? 'white' : '#374151'
                    }}
                >
                    🛍️ Витрина ({showcase.length})
                </button>
                <button
                    onClick={() => setActiveTab('wishlist')}
                    style={{
                        padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                        border: 'none', fontSize: '14px', fontWeight: '600',
                        background: activeTab === 'wishlist'
                            ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f3f4f6',
                        color: activeTab === 'wishlist' ? 'white' : '#374151'
                    }}
                >
                    ♡ Желания ({wishlist.length})
                </button>
            </div>

            {/* Товары */}
            {currentItems.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '60px',
                    backgroundColor: '#f8fafc', borderRadius: '16px',
                    border: '2px dashed #e2e8f0'
                }}>
                    <p style={{ color: '#9ca3af', fontSize: '16px' }}>Здесь пока ничего нет</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '20px'
                }}>
                    {currentItems.map((item) => (
                        <div key={item.id} style={{
                            backgroundColor: 'white', borderRadius: '12px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.08)', overflow: 'hidden',
                            border: '1px solid #f1f5f9'
                        }}>
                            <div style={{ height: '150px', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
                                <img
                                    src={item.image_url || '/placeholder-image.svg'}
                                    alt={item.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = '/placeholder-image.svg'; }}
                                />
                            </div>
                            <div style={{ padding: '14px' }}>
                                <Link to={`/products/${item.id}`} style={{
                                    fontWeight: '700', fontSize: '14px', color: '#1f2937',
                                    textDecoration: 'none', display: 'block', marginBottom: '6px'
                                }}>
                                    {item.title}
                                </Link>
                                <p style={{ margin: 0, fontWeight: '800', color: '#1f2937', fontSize: '16px' }}>
                                    {formatPrice(item.price)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserProfilePage;