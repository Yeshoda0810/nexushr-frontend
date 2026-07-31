import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '⬡', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/employees', label: 'Employees', icon: '◈', roles: ['ADMIN', 'MANAGER'] },
  { to: '/attendance', label: 'Attendance', icon: '◉', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/leave', label: 'Leave', icon: '◫', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/payroll', label: 'Payroll', icon: '◈', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/performance', label: 'Performance', icon: '◆', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/insights', label: 'AI Insights', icon: '⬟', roles: ['ADMIN', 'MANAGER'] },
];

const emojiMap: Record<string, string> = {
  '/dashboard': '🏠',
  '/employees': '👥',
  '/attendance': '📋',
  '/leave': '🏖️',
  '/payroll': '💰',
  '/performance': '⭐',
  '/insights': '🤖',
};

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex" style={{
      background: 'linear-gradient(135deg, #060d1a 0%, #0a1628 50%, #060d1a 100%)',
    }}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col relative"
        style={{
          background: 'rgba(6, 13, 26, 0.95)',
          borderRight: '1px solid rgba(59,130,246,0.15)',
          boxShadow: '4px 0 32px rgba(0,0,0,0.5), inset -1px 0 0 rgba(139,92,246,0.1)',
          backdropFilter: 'blur(20px)',
          zIndex: 10,
        }}>

        {/* Glow effect top */}
        <div className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.15) 0%, transparent 70%)' }} />

        {/* Logo */}
        <div className="px-5 py-5 relative" style={{ borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg relative z-10"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  boxShadow: '0 0 20px rgba(139,92,246,0.5), 0 4px 12px rgba(0,0,0,0.4)',
                  transform: 'perspective(100px) rotateX(5deg)',
                }}>
                N
              </div>
              <div className="absolute inset-0 rounded-xl opacity-40 blur-sm"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }} />
            </div>
            <div>
              <span className="text-white font-black text-lg tracking-tight"
                style={{ textShadow: '0 0 20px rgba(139,92,246,0.5)' }}>
                NexusHR
              </span>
              <p className="text-xs" style={{ color: '#475569' }}>Workforce Intelligence</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-3" style={{ color: '#334155' }}>
            Navigation
          </p>
          {navItems
            .filter((item) => user && item.roles.includes(user.role))
            .map((item, i) => {
              const isActive = location.pathname === item.to;
              return (
                <motion.div key={item.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}>
                  <Link to={item.to}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden"
                    style={isActive ? {
                      background: 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.25))',
                      color: 'white',
                      border: '1px solid rgba(139,92,246,0.3)',
                      boxShadow: '0 4px 16px rgba(139,92,246,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
                      transform: 'perspective(200px) translateZ(4px)',
                    } : {
                      color: '#64748b',
                      border: '1px solid transparent',
                    }}>

                    {/* Active glow line */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full"
                        style={{ background: 'linear-gradient(180deg, #3b82f6, #8b5cf6)', boxShadow: '0 0 8px rgba(139,92,246,0.8)' }} />
                    )}

                    {/* Icon */}
                    <span className="text-base w-6 text-center transition-transform duration-200 group-hover:scale-110"
                      style={{ filter: isActive ? 'drop-shadow(0 0 6px rgba(139,92,246,0.8))' : 'none' }}>
                      {emojiMap[item.to]}
                    </span>

                    <span className={isActive ? 'text-white font-semibold' : 'group-hover:text-slate-300 transition-colors'}>
                      {item.label}
                    </span>

                    {/* Hover shimmer */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
                      style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.05), rgba(139,92,246,0.05))' }} />
                  </Link>
                </motion.div>
              );
            })}
        </nav>

        {/* User section */}
        <div className="px-4 py-4 relative z-10" style={{ borderTop: '1px solid rgba(51,65,85,0.4)' }}>
          {/* Glow bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(59,130,246,0.08) 0%, transparent 70%)' }} />

          <div className="flex items-center gap-3 mb-3 relative">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  boxShadow: '0 0 14px rgba(139,92,246,0.4)',
                  transform: 'perspective(100px) rotateX(4deg)',
                }}>
                {user?.firstName?.[0]}
              </div>
              {/* Online dot */}
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                style={{ background: '#10b981', borderColor: '#060d1a', boxShadow: '0 0 6px rgba(16,185,129,0.6)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs font-medium" style={{ color: '#8b5cf6' }}>{user?.role}</p>
            </div>
          </div>

          <button onClick={logout}
            className="w-full text-sm py-2.5 rounded-xl font-semibold transition-all duration-200 hover:scale-105 relative overflow-hidden group"
            style={{
              background: 'rgba(239,68,68,0.08)',
              color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(239,68,68,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto relative"
        style={{
          background: 'linear-gradient(135deg, #060d1a 0%, #0a1628 60%, #080f1e 100%)',
        }}>
        {/* Subtle grid background */}
        <div className="fixed inset-0 pointer-events-none opacity-3"
          style={{
            backgroundImage: 'linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            zIndex: 0,
          }} />

        {/* Ambient glow top-right */}
        <div className="fixed top-0 right-0 w-96 h-96 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
            zIndex: 0,
          }} />

        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
