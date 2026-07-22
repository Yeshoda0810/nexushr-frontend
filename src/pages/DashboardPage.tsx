import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import apiClient from '../api/client';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts';
import type { AttritionInsight, Employee } from '../types';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const fadeUp: import('framer-motion').Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' },
  }),
};

const GlassCard = ({
  children,
  className = '',
  glow,
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  glow?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={`rounded-2xl p-6 ${className}`}
    style={{
      background: 'rgba(30, 41, 59, 0.7)',
      border: '1px solid rgba(51, 65, 85, 0.8)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      boxShadow: glow
        ? `0 0 24px 2px ${glow}22, 0 4px 24px rgba(0,0,0,0.3)`
        : '0 4px 24px rgba(0,0,0,0.2)',
      ...style,
    }}
  >
    {children}
  </div>
);

function AnimatedCounter({ value }: { value: number | string }) {
  const [display, setDisplay] = useState(0);
  const target = typeof value === 'number' ? value : parseFloat(value as string) || 0;
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const step = target / 30;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setDisplay(target); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{typeof value === 'string' && value.includes('.') ? display.toFixed(1) : display}</span>;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const isManager = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [insights, setInsights] = useState<AttritionInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        if (isManager) {
          const [empRes, insightRes] = await Promise.all([
            apiClient.get<Employee[]>('/employees'),
            apiClient.get<AttritionInsight[]>('/insights/attrition'),
          ]);
          setEmployees(empRes.data);
          setInsights(insightRes.data);
        }
      } catch {}
      finally { setLoading(false); }
    }
    loadData();
  }, []);

  const roleData = ['ADMIN', 'MANAGER', 'EMPLOYEE'].map((role) => ({
    name: role,
    value: employees.filter((e) => e.role === role).length,
  })).filter((d) => d.value > 0);

  const riskData = [
    { level: 'LOW', count: insights.filter((i) => i.riskLevel === 'LOW').length, color: '#10b981' },
    { level: 'MEDIUM', count: insights.filter((i) => i.riskLevel === 'MEDIUM').length, color: '#f59e0b' },
    { level: 'HIGH', count: insights.filter((i) => i.riskLevel === 'HIGH').length, color: '#ef4444' },
  ];

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => ({
    month,
    riskScore: Math.max(0, (insights[0]?.riskScore || 60) - i * 3 + Math.sin(i) * 5).toFixed(1),
  }));

  const highRisk = insights.filter((i) => i.riskLevel === 'HIGH');
  const avgScore = insights.length
    ? (insights.reduce((a, b) => a + b.riskScore, 0) / insights.length).toFixed(1)
    : '-';

  const statCards = [
    { label: 'Total Employees', value: employees.length || 0, color: '#3b82f6', glow: '#3b82f6', icon: '👥', gradient: 'linear-gradient(135deg, #1e3a5f, #1e293b)' },
    { label: 'Active', value: employees.filter(e => e.active).length || 0, color: '#10b981', glow: '#10b981', icon: '✅', gradient: 'linear-gradient(135deg, #0d3321, #1e293b)' },
    { label: 'High Risk', value: highRisk.length, color: '#ef4444', glow: '#ef4444', icon: '⚠️', gradient: 'linear-gradient(135deg, #3b0d0d, #1e293b)' },
    { label: 'AI Avg Score', value: avgScore, color: '#8b5cf6', glow: '#8b5cf6', icon: '🤖', gradient: 'linear-gradient(135deg, #2d1b69, #1e293b)' },
  ];

  return (
    <Layout>
      <div className="p-6 lg:p-8 min-h-screen" style={{ background: 'transparent' }}>

        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-8 rounded-full" style={{ background: 'linear-gradient(180deg, #3b82f6, #8b5cf6)' }} />
            <h1 className="text-2xl font-bold text-white">
              Good morning, {user?.firstName}! 👋
            </h1>
          </div>
          <p className="text-sm ml-5" style={{ color: '#64748b' }}>
            AI-powered workforce intelligence dashboard • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div key={s.label} custom={i} variants={fadeUp} initial="hidden" animate="show">
              <div
                className="rounded-2xl p-5 relative overflow-hidden"
                style={{
                  background: s.gradient,
                  border: `1px solid ${s.color}33`,
                  boxShadow: `0 0 20px ${s.color}18`,
                }}
              >
                {/* glow orb */}
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20"
                  style={{ background: s.color, filter: 'blur(16px)' }} />
                <div className="text-2xl mb-3">{s.icon}</div>
                <p className="text-3xl font-bold text-white">
                  <AnimatedCounter value={s.value} />
                </p>
                <p className="text-xs mt-1 font-medium" style={{ color: s.color }}>{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {isManager && !loading && (
          <>
            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show">
                <GlassCard glow="#8b5cf6">
                  <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <span className="text-purple-400">📈</span> Attrition Risk Trend
                  </h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#334155" tick={{ fill: '#64748b', fontSize: 12 }} />
                      <YAxis stroke="#334155" tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff' }} />
                      <Line type="monotone" dataKey="riskScore" stroke="#8b5cf6" strokeWidth={2.5}
                        dot={{ fill: '#8b5cf6', r: 4 }}
                        activeDot={{ r: 6, fill: '#a78bfa', strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </GlassCard>
              </motion.div>

              <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show">
                <GlassCard glow="#3b82f6">
                  <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <span className="text-blue-400">👥</span> Team Composition
                  </h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={roleData} cx="50%" cy="50%" outerRadius={75} innerRadius={35}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                        labelLine={{ stroke: '#334155' }}>
                        {roleData.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </GlassCard>
              </motion.div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show">
                <GlassCard glow="#f59e0b">
                  <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <span className="text-yellow-400">⚠️</span> Risk Distribution
                  </h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={riskData} barSize={36}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="level" stroke="#334155" tick={{ fill: '#64748b', fontSize: 12 }} />
                      <YAxis stroke="#334155" tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff' }} />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {riskData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </GlassCard>
              </motion.div>

              <motion.div custom={7} variants={fadeUp} initial="hidden" animate="show">
                <GlassCard glow="#8b5cf6">
                  <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
                    <span className="text-purple-400">🤖</span> AI Risk Scores
                  </h2>
                  <div className="space-y-4">
                    {insights.map((ins) => (
                      <div key={ins.employeeId}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-white font-medium">{ins.employeeName}</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{
                              background: ins.riskLevel === 'HIGH' ? '#ef444422' : ins.riskLevel === 'MEDIUM' ? '#f59e0b22' : '#10b98122',
                              color: ins.riskLevel === 'HIGH' ? '#ef4444' : ins.riskLevel === 'MEDIUM' ? '#f59e0b' : '#10b981',
                            }}>
                            {ins.riskLevel}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full" style={{ background: '#0f172a' }}>
                          <motion.div
                            className="h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${ins.riskScore}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                            style={{
                              background: ins.riskLevel === 'HIGH'
                                ? 'linear-gradient(90deg, #dc2626, #ef4444)'
                                : ins.riskLevel === 'MEDIUM'
                                ? 'linear-gradient(90deg, #d97706, #f59e0b)'
                                : 'linear-gradient(90deg, #059669, #10b981)',
                            }}
                          />
                        </div>
                        <p className="text-xs mt-1" style={{ color: '#64748b' }}>Score: {ins.riskScore}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* High Risk AI Alert */}
            {highRisk.length > 0 && (
              <motion.div custom={8} variants={fadeUp} initial="hidden" animate="show">
                <div className="rounded-2xl p-6 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(127,29,29,0.5), rgba(69,10,10,0.4))',
                    border: '1px solid rgba(239,68,68,0.3)',
                    boxShadow: '0 0 32px rgba(239,68,68,0.12)',
                  }}>
                  {/* Animated pulse dot */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="absolute inset-0 w-3 h-3 rounded-full bg-red-500 animate-ping opacity-60" />
                    </div>
                    <h2 className="text-red-400 font-semibold text-sm tracking-wide uppercase">
                      AI Alert — High Attrition Risk Detected
                    </h2>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#fca5a5' }}>
                    <span className="font-semibold">{highRisk.map(e => e.employeeName).join(', ')}</span>{' '}
                    {highRisk.length === 1 ? 'has' : 'have'} been flagged with HIGH attrition risk based on leave
                    frequency, performance rating, and tenure analysis. Consider scheduling a 1:1 review.
                    Visit <span className="text-red-300 font-medium">AI Insights</span> for full analysis.
                  </p>
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Employee quick actions */}
        {!isManager && (
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
            <GlassCard glow="#3b82f6">
              <h2 className="text-white font-semibold mb-1">👋 Your Quick Actions</h2>
              <p className="text-sm mb-5" style={{ color: '#64748b' }}>Use the sidebar to navigate to your daily tasks.</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '📋 Mark Attendance', color: '#3b82f6' },
                  { label: '🏖️ Apply Leave', color: '#8b5cf6' },
                  { label: '💰 View Payslip', color: '#10b981' },
                  { label: '⭐ Submit Goals', color: '#f59e0b' },
                ].map((action) => (
                  <div key={action.label}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-white cursor-pointer transition-all duration-200 hover:scale-105 hover:opacity-90"
                    style={{
                      background: `${action.color}18`,
                      border: `1px solid ${action.color}33`,
                    }}>
                    {action.label}
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
