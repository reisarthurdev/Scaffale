const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Informe o termo de busca' });

  try {
    const response = await axios.get(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=10`
    );

    const books = response.data.docs.map(book => ({
      open_library_id: book.key,
      title: book.title,
      author: book.author_name ? book.author_name[0] : 'Autor desconhecido',
      cover_url: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : null
    }));

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar livros' });
  }
});

module.exports = router;
