import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateMe, deleteMe } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, signin, signout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const { data } = await updateMe({ name, avatar_url: avatarUrl });
      signin(data, localStorage.getItem('token'));
      setSuccess('Perfil atualizado!');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao atualizar');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza? Essa ação não pode ser desfeita.')) return;
    setError('');
    try {
      await deleteMe(password);
      signout();
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Senha incorreta');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

      <form onSubmit={handleUpdate} className="flex flex-col gap-4 mb-8">
        <label className="text-sm font-medium text-gray-700">Nome</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label className="text-sm font-medium text-gray-700">URL do avatar</label>
        <input type="text" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)}
          placeholder="https://..." 
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        {avatarUrl && (
          <img src={avatarUrl} alt="avatar"
            className="w-16 h-16 rounded-full object-cover" />
        )}
        <button type="submit"
          className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Salvar alterações
        </button>
      </form>

      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold text-red-600 mb-4">Excluir conta</h2>
        <p className="text-sm text-gray-500 mb-3">
          Digite sua senha para confirmar. Todos os seus livros serão excluídos.
        </p>
        <input type="password" placeholder="Sua senha" value={password}
          onChange={e => setPassword(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-red-400" />
        <button onClick={handleDelete}
          className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700">
          Excluir minha conta
        </button>
      </div>
    </div>
  );
}
