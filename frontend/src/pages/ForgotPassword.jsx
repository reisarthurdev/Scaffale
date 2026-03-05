import { useState } from 'react';
import { forgotPassword, resetPassword } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [generatedToken, setGeneratedToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleForgot = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await forgotPassword(email);
      setGeneratedToken(data.reset_token);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao gerar token');
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await resetPassword({ token, password: newPassword });
      alert('Senha redefinida! Faça login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Token inválido ou expirado');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Recuperar senha</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {step === 1 && (
          <form onSubmit={handleForgot} className="flex flex-col gap-4">
            <input type="email" placeholder="Seu email" value={email}
              onChange={e => setEmail(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="submit"
              className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Gerar token
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
              <p className="text-sm text-yellow-800 font-semibold">Seu token de recuperação:</p>
              <p className="font-mono text-sm break-all mt-1">{generatedToken}</p>
            </div>
            <form onSubmit={handleReset} className="flex flex-col gap-4">
              <input type="text" placeholder="Cole o token aqui" value={token}
                onChange={e => setToken(e.target.value)}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="password" placeholder="Nova senha" value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="submit"
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Redefinir senha
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
