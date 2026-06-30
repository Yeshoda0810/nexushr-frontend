import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f172a' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>N</div>
          <h1 className="text-2xl font-bold text-white">Welcome to NexusHR</h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>AI-Enabled Workforce Intelligence Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl p-8"
          style={{ background: '#1e293b', border: '1px solid #334155' }}>
          {error && (
            <div className="rounded-lg px-4 py-3 mb-4 text-sm text-red-400"
              style={{ background: '#450a0a' }}>{error}</div>
          )}

          <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full rounded-lg px-3 py-2.5 mb-4 text-white outline-none focus:ring-2 focus:ring-blue-500"
            style={{ background: '#0f172a', border: '1px solid #334155' }} />

          <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="w-full rounded-lg px-3 py-2.5 mb-6 text-white outline-none focus:ring-2 focus:ring-blue-500"
            style={{ background: '#0f172a', border: '1px solid #334155' }} />

          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg font-semibold text-white transition disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-sm text-center mt-4" style={{ color: '#64748b' }}>
            No account? <Link to="/signup" className="text-blue-400 font-medium">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}