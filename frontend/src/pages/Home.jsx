import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { searchBooks, saveBook } from '../services/api';
import BookCard from '../components/BookCard';

export default function Home() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (msg, error = false) => {
    setToast({ msg, error });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSaved({});
    try {
      const { data } = await searchBooks(query);
      setResults(data);
    } catch {
      showToast('Erro ao buscar livros.', true);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (book) => {
    try {
      await saveBook({ ...book, status: 'want_to_read' });
      setSaved(prev => ({ ...prev, [book.open_library_id]: true }));
      showToast(`"${book.title}" salvo na estante!`);
    } catch {
      showToast('Erro ao salvar o livro.', true);
    }
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          backgroundColor: toast.error ? '#e53e3e' : 'var(--text)',
          color: toast.error ? '#fff' : 'var(--bg)',
          font: '16px justsans', padding: '14px 28px', borderRadius: 14,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)', zIndex: 100,
          transition: 'opacity .3s',
        }}>
          {toast.msg}
        </div>
      )}

      <header style={{ padding: '60px 0 40px', backgroundColor: 'var(--bg)', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--text)', font: 'normal 5em justsans', margin: 0 }}>Scaffale</h1>
        <p style={{ color: 'var(--muted)', font: '20px justsans', marginTop: '-10px' }}>
          Olá, {user?.name}. Pesquise livros abaixo ou acesse sua{' '}
          <Link to="/my-books" style={{ color: 'var(--text)', borderBottom: '1px solid var(--muted)' }}>
            estante
          </Link>.
        </p>
      </header>

      <main style={{ backgroundColor: 'var(--bg-main)', paddingBottom: 80 }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 40px 0' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12 }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Nome do livro ou autor..."
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 12,
                border: '1.5px solid #d4d4d4', background: 'none',
                font: '18px justsans', color: 'var(--text)', outline: 'none',
              }}
            />
            <button type="submit" style={{
              padding: '12px 28px', borderRadius: 12, border: 'none',
              backgroundColor: '#0A0A0A', color: '#FFF',
              font: '18px justsans', cursor: 'pointer',
            }}>
              {loading ? '...' : 'Buscar'}
            </button>
          </form>
        </div>

        <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 40px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {results.map(book => (
            <BookCard
              key={book.open_library_id}
              book={book}
              onSave={handleSave}
              showActions={true}
              alreadySaved={saved[book.open_library_id] || false}
            />
          ))}
        </div>
      </main>

      <footer style={{
        display: 'flex', backgroundColor: 'var(--bg)', alignItems: 'center',
        padding: '40px 20px 30px', justifyContent: 'center',
        boxShadow: '5px 5px 10px 10px rgba(0,0,0,0.015)'
      }}>
        <p style={{ color: 'var(--muted)', font: '16px justsans', margin: 0 }}>
          © 2025 Scaffale
        </p>
      </footer>
    </div>
  );
}
