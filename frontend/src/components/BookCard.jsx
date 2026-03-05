import { useState } from 'react';

export default function BookCard({ book, onSave, onDelete, onUpdate, showActions, alreadySaved }) {
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(book.status || 'want_to_read');
  const [rating, setRating] = useState(book.rating || 0);
  const [notes, setNotes] = useState(book.notes || '');

  const handleUpdate = () => {
    onUpdate(book.id, { status, rating, notes });
    setEditing(false);
  };

  const statusLabel = {
    want_to_read: '📋 Quero ler',
    reading: '📖 Lendo',
    read: '✅ Lido',
  };

  const cardStyle = {
    backgroundColor: 'var(--card-bg)',
    borderRadius: 20,
    padding: '20px 24px',
    display: 'flex',
    gap: 20,
    boxShadow: '0 0 3px rgba(0,0,0,0.15)',
    border: '1.8px solid transparent',
    background: 'linear-gradient(var(--card-bg), var(--card-bg)) padding-box, linear-gradient(145deg, #d4d4d4, #fff, #a8a8a8) border-box',
  };

  return (
    <div style={cardStyle}>
      {book.cover_url ? (
        <img src={book.cover_url} alt={book.title}
          style={{ width: 56, height: 80, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
      ) : (
        <div style={{ width: 56, height: 80, backgroundColor: '#e5e7eb', borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 11 }}>
          Sem capa
        </div>
      )}
      <div style={{ flex: 1 }}>
        <h3 style={{ color: 'var(--text)', font: 'bold 18px justsans', margin: '0 0 4px' }}>{book.title}</h3>
        <p style={{ color: 'var(--muted)', font: '15px justsans', margin: '0 0 8px' }}>{book.author}</p>

        {book.status && !editing && (
          <span style={{ font: '13px justsans', color: 'var(--muted)', borderBottom: '1px solid var(--muted)' }}>
            {statusLabel[book.status] || book.status}
          </span>
        )}

        {book.rating > 0 && !editing && (
          <p style={{ color: '#d97706', font: '15px justsans', margin: '6px 0 0' }}>
            {'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}
          </p>
        )}

        {book.notes && !editing && (
          <p style={{ color: 'var(--muted)', font: 'italic 14px justsans', margin: '6px 0 0' }}>"{book.notes}"</p>
        )}

        {editing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
            <select value={status} onChange={e => setStatus(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 10, border: '1.5px solid #d4d4d4', background: 'none', font: '15px justsans', color: 'var(--text)' }}>
              <option value="want_to_read">📋 Quero ler</option>
              <option value="reading">📖 Lendo</option>
              <option value="read">✅ Lido</option>
            </select>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1,2,3,4,5].map(star => (
                <button key={star} onClick={() => setRating(star)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: star <= rating ? '#d97706' : '#d1d5db' }}>
                  ★
                </button>
              ))}
            </div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Anotações..."
              rows={2}
              style={{ padding: '8px 12px', borderRadius: 10, border: '1.5px solid #d4d4d4', background: 'none', font: '15px justsans', color: 'var(--text)', resize: 'none' }} />
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={handleUpdate}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', font: '15px justsans', borderBottom: '1px solid var(--text)', padding: 0 }}>
                Salvar
              </button>
              <button onClick={() => setEditing(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', font: '15px justsans', padding: 0 }}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 20, marginTop: 10 }}>
          {showActions && (
            <button
              onClick={() => !alreadySaved && onSave(book)}
              disabled={alreadySaved}
              style={{
                background: 'none', border: 'none', padding: 0,
                font: '15px justsans', cursor: alreadySaved ? 'default' : 'pointer',
                color: alreadySaved ? 'var(--muted)' : 'var(--text)',
                borderBottom: alreadySaved ? 'none' : '1px solid var(--text)',
              }}>
              {alreadySaved ? '✓ Salvo' : 'Salvar na estante'}
            </button>
          )}
          {onUpdate && !editing && (
            <button onClick={() => setEditing(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', font: '15px justsans', padding: 0 }}>
              Editar
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(book.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53e3e', font: '15px justsans', padding: 0 }}>
              Remover
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
