import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const stats = [
  { label: 'Total Employees', value: '4', color: '#3b82f6' },
  { label: 'Present Today', value: '1', color: '#10b981' },
  { label: 'On Leave', value: '0', color: '#f59e0b' },
  { label: 'AI Risk Alerts', value: '1', color: '#ef4444' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Good morning, {user?.firstName}! 👋
          </h1>
          <p style={{ color: '#64748b' }} className="text-sm mt-1">
            Here's what's happening at your organization today.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl p-5" style={{ background: '#1e293b', border: '1px solid #334155' }}>
              <div className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center"
                style={{ background: s.color + '20' }}>
                <div className="w-4 h-4 rounded-full" style={{ background: s.color }} />
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-sm mt-1" style={{ color: '#64748b' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl p-6" style={{ background: 'linear-gradient(135deg, #1e3a5f, #1e1b4b)', border: '1px solid #334155' }}>
          <h2 className="text-white font-semibold mb-2">🤖 AI Workforce Insight</h2>
          <p style={{ color: '#94a3b8' }} className="text-sm">
            1 employee has a <span className="text-red-400 font-medium">HIGH attrition risk</span> based on leave frequency and performance data. 
            Visit AI Insights for details.
          </p>
        </div>
      </div>
    </Layout>
  );
}