const express = require('express');
const router = express.Router();

module.exports = (db) => {

    // Купить товар
    router.post('/buy', (req, res) => {
        const { listing_id, is_public } = req.body;
        const user_id = req.session.userId;
        if (!user_id) return res.status(401).json({ error: 'Не авторизован' });

        db.run(
            `INSERT INTO purchases (user_id, listing_id, is_public) VALUES (?, ?, ?)`,
            [user_id, listing_id, is_public ? 1 : 0],
            function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true, purchase_id: this.lastID });
            }
        );
    });

    // Мои все покупки (для страницы "Витрина покупок")
    router.get('/my', (req, res) => {
        const user_id = req.session.userId;
        if (!user_id) return res.status(401).json({ error: 'Не авторизован' });

        db.all(
            `SELECT p.*, u.username as seller_name,
              pur.is_public, pur.created_at as purchased_at
       FROM products p
       JOIN purchases pur ON p.id = pur.listing_id
       JOIN users u ON p.seller_id = u.id
       WHERE pur.user_id = ?
       ORDER BY pur.created_at DESC`,
            [user_id],
            (err, rows) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(rows);
            }
        );
    });

    // Публичная витрина конкретного пользователя (для чужого профиля)
    router.get('/showcase/:userId', (req, res) => {
        db.all(
            `SELECT p.*, u.username as seller_name
       FROM products p
       JOIN purchases pur ON p.id = pur.listing_id
       JOIN users u ON p.seller_id = u.id
       WHERE pur.user_id = ? AND pur.is_public = 1
       ORDER BY pur.created_at DESC`,
            [req.params.userId],
            (err, rows) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(rows);
            }
        );
    });

    // Аналитика: кто ещё купил этот товар (отсортировано по схожести интересов)
    router.get('/also-bought/:productId', (req, res) => {
        const current_user_id = req.session.userId || 0;

        db.all(
            `SELECT DISTINCT u.id, u.username,
        (
          SELECT COUNT(*) FROM purchases p2
          WHERE p2.user_id = u.id
          AND p2.listing_id IN (
            SELECT listing_id FROM purchases WHERE user_id = ?
          )
        ) as common_purchases
       FROM users u
       JOIN purchases pur ON u.id = pur.user_id
       WHERE pur.listing_id = ?
         AND pur.is_public = 1
         AND u.id != ?
       ORDER BY common_purchases DESC`,
            [current_user_id, req.params.productId, current_user_id],
            (err, rows) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(rows);
            }
        );
    });

    return router;
};