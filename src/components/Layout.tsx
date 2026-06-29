import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/employees', label: 'Employees', roles: ['ADMIN', 'MANAGER'] },
  { to: '/attendance', label: 'Attendance', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/leave', label: 'Leave', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/payroll', label: 'Payroll', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/performance', label: 'Performance', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/insights', label: 'AI Insights', roles: ['ADMIN', 'MANAGER'] },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-56 bg-slate-900 text-white flex flex-col">
        <div className="px-6 py-5 text-xl font-bold border-b border-slate-700">NexusHR</div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems
            .filter((item) => user && item.roles.includes(user.role))
            .map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${
                  location.pathname === item.to
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
        </nav>
        <div className="px-4 py-4 border-t border-slate-700">
          <p className="text-sm text-slate-300">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs text-slate-500 mb-3">{user?.role}</p>
          <button
            onClick={logout}
            className="w-full text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}