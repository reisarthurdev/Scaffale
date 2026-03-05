import { useEffect, useState } from 'react';
import { getMyBooks, updateBook, deleteBook } from '../services/api';
import BookCard from '../components/BookCard';

export default function MyBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    getMyBooks().then(({ data }) => setBooks(data));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Remover este livro?')) return;
    await deleteBook(id);
    setBooks(books.filter(b => b.id !== id));
  };

  const handleUpdate = async (id, data) => {
    const { data: updated } = await updateBook(id, data);
    setBooks(books.map(b => b.id === id ? updated : b));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Minha Estante</h1>
      {books.length === 0 ? (
        <p className="text-gray-500">Nenhum livro salvo ainda.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {books.map(book => (
            <BookCard key={book.id} book={book}
              onDelete={handleDelete}
              onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}
