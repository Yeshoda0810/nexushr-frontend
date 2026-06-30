import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

const navItems = [
  { to: '/dashboard', label: '🏠 Dashboard', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/employees', label: '👥 Employees', roles: ['ADMIN', 'MANAGER'] },
  { to: '/attendance', label: '📋 Attendance', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/leave', label: '🏖️ Leave', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/payroll', label: '💰 Payroll', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/performance', label: '⭐ Performance', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/insights', label: '🤖 AI Insights', roles: ['ADMIN', 'MANAGER'] },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex" style={{ background: '#0f172a' }}>
      <aside className="w-64 flex flex-col" style={{ background: '#0f1629', borderRight: '1px solid #1e293b' }}>
        <div className="px-6 py-5 border-b" style={{ borderColor: '#1e293b' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>N</div>
            <span className="text-white font-bold text-lg">NexusHR</span>
          </div>
          <p className="text-xs mt-1" style={{ color: '#64748b' }}>Workforce Intelligence</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems
            .filter((item) => user && item.roles.includes(user.role))
            .map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={location.pathname === item.to
                  ? { background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white' }
                  : { color: '#94a3b8' }}
              >
                {item.label}
              </Link>
            ))}
        </nav>

        <div className="px-4 py-4" style={{ borderTop: '1px solid #1e293b' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
              {user?.firstName?.[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs" style={{ color: '#64748b' }}>{user?.role}</p>
            </div>
          </div>
          <button onClick={logout}
            className="w-full text-sm py-2 rounded-lg font-medium transition"
            style={{ background: '#1e293b', color: '#94a3b8' }}>
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto" style={{ background: '#0f172a' }}>
        {children}
      </main>
    </div>
  );
}