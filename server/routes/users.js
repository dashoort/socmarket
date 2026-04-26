const express = require('express');
const router = express.Router();

module.exports = (db) => {

    // Список всех пользователей (открытая база)
    router.get('/all', (req, res) => {
        db.all(
            `SELECT id, username, created_at FROM users ORDER BY username ASC`,
            [],
            (err, rows) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(rows);
            }
        );
    });

    // Профиль конкретного пользователя
    router.get('/profile/:userId', (req, res) => {
        db.get(
            `SELECT id, username, created_at FROM users WHERE id = ?`,
            [req.params.userId],
            (err, row) => {
                if (err) return res.status(500).json({ error: err.message });
                if (!row) return res.status(404).json({ error: 'Пользователь не найден' });
                res.json(row);
            }
        );
    });

    return router;
};