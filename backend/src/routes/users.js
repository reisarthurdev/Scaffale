const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const auth = require('../middlewares/auth');
const router = express.Router();

// Ver perfil
router.get('/me', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, avatar_url, created_at FROM users WHERE id = $1',
      [req.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Editar perfil
router.patch('/me', auth, async (req, res) => {
  const { name, avatar_url } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET
        name = COALESCE($1, name),
        avatar_url = COALESCE($2, avatar_url)
       WHERE id = $3
       RETURNING id, name, email, avatar_url`,
      [name, avatar_url, req.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Excluir conta
router.delete('/me', auth, async (req, res) => {
  const { password } = req.body;
  try {
    const result = await pool.query('SELECT password FROM users WHERE id = $1', [req.userId]);
    const valid = await bcrypt.compare(password, result.rows[0].password);
    if (!valid)
      return res.status(400).json({ error: 'Senha incorreta' });

    await pool.query('DELETE FROM users WHERE id = $1', [req.userId]);
    res.json({ message: 'Conta excluída' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
