const express = require('express');
const pool = require('../db');
const auth = require('../middlewares/auth');
const router = express.Router();

// Todas as rotas exigem login
router.use(auth);

// Listar livros do usuário logado
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM books WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Salvar livro
router.post('/', async (req, res) => {
  const { open_library_id, title, author, cover_url, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO books (open_library_id, title, author, cover_url, status, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (open_library_id) DO UPDATE SET status = $5
       RETURNING *`,
      [open_library_id, title, author, cover_url, status || 'want_to_read', req.userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar livro
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { status, rating, notes } = req.body;
  try {
    const result = await pool.query(
      `UPDATE books SET
        status = COALESCE($1, status),
        rating = COALESCE($2, rating),
        notes = COALESCE($3, notes)
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [status, rating, notes, id, req.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar livro
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM books WHERE id = $1 AND user_id = $2', [id, req.userId]);
    res.json({ message: 'Livro removido' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
