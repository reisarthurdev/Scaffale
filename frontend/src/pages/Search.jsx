import { useState } from 'react';
import { searchBooks, saveBook } from '../services/api';
import BookCard from '../components/BookCard';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const { data } = await searchBooks(query);
      setResults(data);
    } catch (err) {
      alert('Erro na busca');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (book) => {
    try {
      await saveBook({ ...book, status: 'want_to_read' });
      alert('Livro salvo na sua estante!');
    } catch (err) {
      alert('Erro ao salvar');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Buscar Livros</h1>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Nome do livro ou autor..."
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none
          focus:ring-2 focus:ring-blue-500" />
        <button type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>
      <div className="flex flex-col gap-4">
        {results.map(book => (
          <BookCard key={book.open_library_id} book={book}
            onSave={handleSave} showActions={true} />
        ))}
      </div>
    </div>
  );
}
