import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-700">NexusHR</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">
            {user?.firstName} {user?.lastName} <span className="text-slate-400">({user?.role})</span>
          </span>
          <button
            onClick={logout}
            className="text-sm bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded-lg"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="p-6">
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
          Welcome back, {user?.firstName}! 👋
        </h2>
        <p className="text-slate-500">This is your NexusHR dashboard.</p>
      </main>
    </div>
  );
}