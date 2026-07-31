import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const quickAccess = [
  { role: 'Admin', email: 'yashoda@test.com', password: 'test123', icon: '👑', color: '#8b5cf6' },
  { role: 'Manager', email: 'raj@test.com', password: 'test123', icon: '💼', color: '#3b82f6' },
  { role: 'Employee', email: 'test2@test.com', password: 'test123', icon: '👤', color: '#10b981' },
];

const features = ['AI Analytics', 'RBAC Security', 'Real-time Insights', 'Payroll Automation'];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
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
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function fillQuick(acc: typeof quickAccess[0]) {
    setEmail(acc.email);
    setPassword(acc.password);
    setSelected(acc.role);
    setError('');
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#060d1a' }}>

      {/* LEFT — Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0f2e 0%, #0d1535 50%, #0a0a2e 100%)' }}>

        {/* Background orbs */}
        <motion.div className="absolute rounded-full pointer-events-none"
          style={{ width: 500, height: 500, top: '-20%', left: '-20%', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 65%)' }}
          animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute rounded-full pointer-events-none"
          style={{ width: 400, height: 400, bottom: '-15%', right: '-10%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 65%)' }}
          animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }} />
        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(139,92,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.4) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />

        {/* Logo */}
        <motion.div className="relative z-10"
          initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                boxShadow: '0 0 30px rgba(139,92,246,0.5), 0 8px 20px rgba(0,0,0,0.4)',
                transform: 'perspective(200px) rotateX(10deg) rotateY(-5deg)',
              }}>✦</div>
            <span className="text-white font-black text-xl tracking-tight"
              style={{ textShadow: '0 0 20px rgba(139,92,246,0.4)' }}>NexusHR</span>
          </div>
        </motion.div>

        {/* Main text */}
        <motion.div className="relative z-10"
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>
          <h1 className="text-5xl font-black leading-tight mb-6">
            <span className="text-white">AI-Enabled</span><br />
            <span style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Workforce</span><br />
            <span className="text-white">Intelligence</span><br />
            <span className="text-white">Platform</span>
          </h1>
          <p className="text-base leading-relaxed mb-8" style={{ color: '#64748b' }}>
            AI-powered HR management for modern enterprises. Streamline hiring, performance, payroll, and employee experience — all in one platform.
          </p>
          <div className="flex flex-wrap gap-2">
            {features.map((f) => (
              <span key={f} className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: 'rgba(139,92,246,0.12)',
                  border: '1px solid rgba(139,92,246,0.25)',
                  color: '#a78bfa',
                }}>{f}</span>
            ))}
          </div>
        </motion.div>

        {/* 3D floating card */}
        <motion.div className="relative z-10"
          initial={{ opacity: 0, y: 24 }} animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
          <div className="rounded-2xl p-5"
            style={{
              background: 'rgba(15,23,42,0.7)',
              border: '1px solid rgba(139,92,246,0.2)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(139,92,246,0.1)',
              transform: 'perspective(800px) rotateX(4deg) rotateY(-2deg)',
            }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 opacity-80" />
              <span className="text-xs ml-2" style={{ color: '#334155' }}>AI Insight Engine</span>
            </div>
            <div className="space-y-2">
              {[
                { name: 'Yashoda G.', score: 62, level: 'HIGH', color: '#ef4444' },
                { name: 'Test User', score: 38, level: 'MEDIUM', color: '#f59e0b' },
                { name: 'Raj Kumar', score: 8, level: 'LOW', color: '#10b981' },
              ].map((e) => (
                <div key={e.name} className="flex items-center gap-3">
                  <span className="text-xs text-white w-20 truncate">{e.name}</span>
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(51,65,85,0.5)' }}>
                    <motion.div className="h-1.5 rounded-full"
                      initial={{ width: 0 }} animate={{ width: `${e.score}%` }}
                      transition={{ delay: 1, duration: 1 }}
                      style={{ background: e.color }} />
                  </div>
                  <span className="text-xs font-bold w-14 text-right" style={{ color: e.color }}>{e.level}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT — Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden"
        style={{ background: '#07101f' }}>

        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 60%)' }} />

        <motion.div className="w-full max-w-sm relative z-10"
          initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>

          <div className="mb-8">
            <h2 className="text-2xl font-black text-white mb-1">Welcome back</h2>
            <p className="text-sm" style={{ color: '#475569' }}>Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: '#475569' }}>
                Work Email
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#334155' }}>✉</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder="you@company.com"
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-white text-sm outline-none transition-all duration-200"
                  style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid #1e293b' }}
                  onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#1e293b'; e.target.style.boxShadow = 'none'; }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: '#475569' }}>
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#334155' }}>🔒</span>
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full rounded-xl pl-10 pr-12 py-3 text-white text-sm outline-none transition-all duration-200"
                  style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid #1e293b' }}
                  onFocus={(e) => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#1e293b'; e.target.style.boxShadow = 'none'; }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs transition-colors"
                  style={{ color: '#475569' }}>
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-xs" style={{ color: '#475569' }}>Remember me</span>
              </label>
              <span className="text-xs" style={{ color: '#6366f1' }}>Forgot password?</span>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl px-4 py-3 text-sm flex items-center gap-2"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
                ⚠️ {error}
              </motion.div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white text-sm disabled:opacity-60 transition-all"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: '0 4px 24px rgba(139,92,246,0.4)',
              }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block"
                    animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                  Signing in...
                </span>
              ) : 'Sign in to Dashboard →'}
            </button>
          </form>

          {/* Quick Access */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px" style={{ background: 'rgba(30,41,59,0.8)' }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#334155' }}>Quick Access</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(30,41,59,0.8)' }} />
            </div>
            <div className="space-y-2">
              {quickAccess.map((acc) => (
                <button key={acc.role} onClick={() => fillQuick(acc)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] group"
                  style={{
                    background: selected === acc.role ? `${acc.color}15` : 'rgba(15,23,42,0.6)',
                    border: `1px solid ${selected === acc.role ? `${acc.color}40` : 'rgba(30,41,59,0.8)'}`,
                  }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                      style={{
                        background: `${acc.color}20`,
                        border: `1px solid ${acc.color}30`,
                        boxShadow: selected === acc.role ? `0 0 12px ${acc.color}30` : 'none',
                      }}>
                      {acc.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-white">{acc.role}</p>
                      <p className="text-xs" style={{ color: '#334155' }}>{acc.email}</p>
                    </div>
                  </div>
                  {selected === acc.role && (
                    <span className="text-xs font-bold" style={{ color: acc.color }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-center mt-6" style={{ color: '#1e293b' }}>
            No account?{' '}
            <Link to="/signup" className="font-semibold" style={{ color: '#6366f1' }}>Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
