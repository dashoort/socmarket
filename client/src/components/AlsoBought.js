import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AlsoBought = ({ productId }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!productId) return;
        fetch(`/api/purchases/also-bought/${productId}`, { credentials: 'include' })
            .then((res) => res.json())
            .then((data) => {
                setUsers(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [productId]);

    // Пока загружается или нет пользователей — ничего не показываем
    if (loading || users.length === 0) return null;

    // Цвета медалей для топ-3
    const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
    const medalEmojis = ['🥇', '🥈', '🥉'];

    return (
        <div style={{
            marginTop: '32px',
            padding: '24px',
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            border: '1px solid #e2e8f0'
        }}>
            <h3 style={{
                margin: '0 0 6px 0',
                fontSize: '18px',
                fontWeight: '700',
                color: '#1f2937'
            }}>
                🤝 Также купили этот товар
            </h3>
            <p style={{
                margin: '0 0 20px 0',
                fontSize: '13px',
                color: '#9ca3af'
            }}>
                Пользователи отсортированы по схожести интересов с вами
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {users.map((user, index) => (
                    <Link
                        key={user.id}
                        to={`/users/${user.id}`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 18px',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            color: 'inherit',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            border: index === 0 ? '1px solid #fbbf24' : '1px solid #f1f5f9',
                            transition: 'transform 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        {/* Левая часть: медаль + аватар + имя */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

                            {/* Медаль или номер */}
                            <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: index < 3 ? medalColors[index] : '#e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: index < 3 ? '16px' : '12px',
                                fontWeight: '700',
                                color: index < 3 ? 'white' : '#6b7280',
                                flexShrink: 0
                            }}>
                                {index < 3 ? medalEmojis[index] : index + 1}
                            </div>

                            {/* Аватар с буквой */}
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '17px',
                                flexShrink: 0
                            }}>
                                {user.username[0].toUpperCase()}
                            </div>

                            {/* Имя и подпись */}
                            <div>
                                <p style={{
                                    margin: '0 0 2px 0',
                                    fontWeight: '600',
                                    fontSize: '15px',
                                    color: '#1f2937'
                                }}>
                                    {user.username}
                                </p>
                                <p style={{
                                    margin: 0,
                                    fontSize: '12px',
                                    color: '#9ca3af'
                                }}>
                                    Нажмите чтобы открыть профиль
                                </p>
                            </div>
                        </div>

                        {/* Правая часть: схожесть интересов */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {user.common_purchases > 0 && (
                                <div style={{
                                    backgroundColor: '#d1fae5',
                                    color: '#065f46',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}>
                                    {user.common_purchases} общих {user.common_purchases === 1 ? 'покупка' : 'покупок'}
                                </div>
                            )}
                            {user.common_purchases === 0 && (
                                <div style={{
                                    backgroundColor: '#f3f4f6',
                                    color: '#6b7280',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '12px'
                                }}>
                                    Новый
                                </div>
                            )}
                            <span style={{
                                color: '#667eea',
                                fontSize: '13px',
                                fontWeight: '600'
                            }}>
                →
              </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AlsoBought;