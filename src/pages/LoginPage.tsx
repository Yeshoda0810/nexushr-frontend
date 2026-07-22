import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#060d1a' }}>

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute rounded-full opacity-20"
          style={{ width: 500, height: 500, top: '-10%', left: '-10%', background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], x: [0, 20, 0], y: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full opacity-15"
          style={{ width: 400, height: 400, bottom: '-10%', right: '-5%', background: 'radial-gradient(circle, #8b5cf6, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], x: [0, -20, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute rounded-full opacity-10"
          style={{ width: 300, height: 300, top: '40%', right: '20%', background: 'radial-gradient(circle, #06b6d4, transparent 70%)' }}
          animate={{ scale: [1, 1.1, 1], y: [0, -30, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
      </div>

      {/* Card */}
      <motion.div
        className="w-full max-w-sm relative z-10 mx-4"
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        {/* Logo + title */}
        <div className="text-center mb-8">
          <motion.div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-5 relative"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200 }}
          >
            N
            {/* glow */}
            <div className="absolute inset-0 rounded-2xl"
              style={{ boxShadow: '0 0 32px rgba(139,92,246,0.5)', zIndex: -1 }} />
          </motion.div>

          <motion.h1
            className="text-2xl font-bold text-white mb-1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Welcome to NexusHR
          </motion.h1>
          <motion.p
            className="text-sm"
            style={{ color: '#64748b' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            AI-Enabled Workforce Intelligence Platform
          </motion.p>
        </div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.45 }}
        >
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl p-8"
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(51, 65, 85, 0.8)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(139,92,246,0.08)',
            }}
          >
            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl px-4 py-3 mb-5 text-sm text-red-400 flex items-center gap-2"
                style={{ background: 'rgba(69,10,10,0.6)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <span>⚠️</span> {error}
              </motion.div>
            )}

            {/* Email */}
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-2 tracking-wider uppercase"
                style={{ color: '#64748b' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none transition-all duration-200"
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid #334155',
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#334155'}
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-xs font-semibold mb-2 tracking-wider uppercase"
                style={{ color: '#64748b' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none transition-all duration-200"
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid #334155',
                }}
                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                onBlur={(e) => e.target.style.borderColor = '#334155'}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 relative overflow-hidden disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                boxShadow: '0 4px 20px rgba(139,92,246,0.35)',
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.boxShadow = '0 6px 28px rgba(139,92,246,0.55)')}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 20px rgba(139,92,246,0.35)'}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>

            <p className="text-xs text-center mt-5" style={{ color: '#475569' }}>
              No account?{' '}
              <Link to="/signup" className="font-semibold transition-colors"
                style={{ color: '#818cf8' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#a5b4fc'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#818cf8'}>
                Sign up
              </Link>
            </p>
          </form>
        </motion.div>

        {/* Bottom badge */}
        <motion.p
          className="text-center text-xs mt-6"
          style={{ color: '#1e293b' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <span className="px-3 py-1 rounded-full text-xs"
            style={{ background: 'rgba(30,41,59,0.5)', color: '#334155', border: '1px solid #1e293b' }}>
            🔒 Secured with JWT Authentication
          </span>
        </motion.p>
      </motion.div>
    </div>
  );
}
