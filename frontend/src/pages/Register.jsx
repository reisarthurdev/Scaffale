import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await register({ name, email, password });
      signin(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao cadastrar');
    }
  };

  const input = {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    border: '1.5px solid #d4d4d4', background: 'none',
    font: '18px justsans', color: 'var(--text)',
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        backgroundColor: 'var(--card-bg)', borderRadius: 30, padding: '48px',
        width: '100%', maxWidth: 440,
        boxShadow: '0 0 3px rgba(0,0,0,0.3)',
        border: '1.8px solid transparent',
        background: 'linear-gradient(var(--card-bg), var(--card-bg)) padding-box, linear-gradient(145deg, #d4d4d4, #fff, #a8a8a8) border-box',
      }}>
        <h1 style={{ color: 'var(--text)', font: 'normal 2.5em justsans', textAlign: 'center', margin: '0 0 8px' }}>Scaffale</h1>
        <p style={{ color: 'var(--muted)', font: '18px justsans', textAlign: 'center', margin: '0 0 32px' }}>Criar uma conta</p>
        {error && <p style={{ color: '#e53e3e', font: '16px justsans', marginBottom: 16 }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input style={input} type="text" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
          <input style={input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input style={input} type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" style={{
            padding: '12px', borderRadius: 12, border: 'none',
            backgroundColor: '#0A0A0A', color: '#FFF',
            font: '18px justsans', cursor: 'pointer', marginTop: 8
          }}>Cadastrar</button>
        </form>
        <p style={{ color: 'var(--muted)', font: '16px justsans', textAlign: 'center', margin: '24px 0 0' }}>
          Já tem conta?{' '}
          <Link to="/login" style={{ color: 'var(--text)', borderBottom: '1px solid var(--text)' }}>Entrar</Link>
        </p>
      </div>
    </div>
  );
}
