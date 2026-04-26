import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/users/all')
            .then((res) => res.json())
            .then((data) => {
                setUsers(Array.isArray(data) ? data : []);
                setLoading(false);
            });
    }, []);

    const filtered = users.filter((u) =>
        u.username.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div style={{ padding: '60px', textAlign: 'center' }}>
                <div className="loading-spinner"></div>
                <p>Загрузка...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px 20px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#1f2937' }}>
                👥 Все пользователи
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                Найдите друзей и посмотрите их покупки
            </p>

            <input
                type="text"
                placeholder="🔍 Найти пользователя..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    width: '100%', padding: '12px 16px', marginBottom: '20px',
                    border: '1px solid #e2e8f0', borderRadius: '10px',
                    fontSize: '15px', boxSizing: 'border-box',
                    outline: 'none'
                }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filtered.map((user) => (
                    <Link
                        key={user.id}
                        to={`/users/${user.id}`}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '16px 20px', backgroundColor: 'white', borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textDecoration: 'none',
                            color: 'inherit', border: '1px solid #f1f5f9',
                            transition: 'box-shadow 0.2s'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                color: 'white', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', fontWeight: '700', fontSize: '18px'
                            }}>
                                {user.username[0].toUpperCase()}
                            </div>
                            <div>
                                <p style={{ margin: '0 0 2px 0', fontWeight: '600', fontSize: '15px', color: '#1f2937' }}>
                                    {user.username}
                                </p>
                                <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
                                    На сайте с {new Date(user.created_at).toLocaleDateString('ru-RU')}
                                </p>
                            </div>
                        </div>
                        <span style={{ color: '#667eea', fontSize: '13px', fontWeight: '600' }}>
              Профиль →
            </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default UsersPage;