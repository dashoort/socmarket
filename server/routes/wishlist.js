const express = require('express');
const router = express.Router();

module.exports = (db) => {

    // Добавить товар в желания
    router.post('/add', (req, res) => {
        const { listing_id } = req.body;
        const user_id = req.session.userId;
        if (!user_id) return res.status(401).json({ error: 'Не авторизован' });

        // СТАЛО:
        db.run(
            `INSERT OR IGNORE INTO wishlists (user_id, listing_id) VALUES (?, ?)`,
            [user_id, listing_id],
            function(err) {
                if (err) return res.status(500).json({ error: err.message });
                // Возвращаем listing_id чтобы slice мог обновить состояние
                res.json({ success: true, listing_id: Number(listing_id) });
            }
        );
    });

    // Удалить из желаний
    router.delete('/remove/:listing_id', (req, res) => {
        const user_id = req.session.userId;
        if (!user_id) return res.status(401).json({ error: 'Не авторизован' });

        db.run(
            `DELETE FROM wishlists WHERE user_id = ? AND listing_id = ?`,
            [user_id, req.params.listing_id],
            (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true });
            }
        );
    });

    // Получить все желания текущего пользователя
    router.get('/my', (req, res) => {
        const user_id = req.session.userId;
        if (!user_id) return res.status(401).json({ error: 'Не авторизован' });

        db.all(
            `SELECT p.*, u.username as seller_name
       FROM products p
       JOIN wishlists w ON p.id = w.listing_id
       JOIN users u ON p.seller_id = u.id
       WHERE w.user_id = ?
       ORDER BY w.created_at DESC`,
            [user_id],
            (err, rows) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(rows);
            }
        );
    });

    // Получить желания конкретного пользователя (для просмотра чужого профиля)
    router.get('/user/:userId', (req, res) => {
        db.all(
            `SELECT p.*, u.username as seller_name
       FROM products p
       JOIN wishlists w ON p.id = w.listing_id
       JOIN users u ON p.seller_id = u.id
       WHERE w.user_id = ?
       ORDER BY w.created_at DESC`,
            [req.params.userId],
            (err, rows) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(rows);
            }
        );
    });

    return router;
};