import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../api/client';
import Layout from '../components/Layout';
import type { AttritionInsight } from '../types';

const cardStyle = {
  background: 'rgba(30, 41, 59, 0.7)',
  border: '1px solid rgba(51, 65, 85, 0.8)',
  backdropFilter: 'blur(12px)',
};

const riskConfig: Record<string, { bg: string; text: string; border: string; bar: string }> = {
  HIGH: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', border: 'rgba(239,68,68,0.3)', bar: 'linear-gradient(90deg, #dc2626, #ef4444)' },
  MEDIUM: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', border: 'rgba(245,158,11,0.3)', bar: 'linear-gradient(90deg, #d97706, #f59e0b)' },
  LOW: { bg: 'rgba(16,185,129,0.15)', text: '#10b981', border: 'rgba(16,185,129,0.3)', bar: 'linear-gradient(90deg, #059669, #10b981)' },
};

export default function InsightsPage() {
  const [insights, setInsights] = useState<AttritionInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<AttritionInsight[]>('/insights/attrition')
      .then((res) => setInsights(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const high = insights.filter(i => i.riskLevel === 'HIGH');
  const medium = insights.filter(i => i.riskLevel === 'MEDIUM');
  const low = insights.filter(i => i.riskLevel === 'LOW');

  return (
    <Layout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-8 rounded-full" style={{ background: 'linear-gradient(180deg, #8b5cf6, #ef4444)' }} />
            <h1 className="text-2xl font-bold text-white">AI Workforce Insights</h1>
          </div>
          <p className="text-sm ml-5" style={{ color: '#64748b' }}>
            Rule-based attrition risk scoring — leave frequency · performance rating · tenure
          </p>
        </motion.div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'High Risk', count: high.length, color: '#ef4444', glow: '#ef444418', icon: '🚨' },
            { label: 'Medium Risk', count: medium.length, color: '#f59e0b', glow: '#f59e0b18', icon: '⚠️' },
            { label: 'Low Risk', count: low.length, color: '#10b981', glow: '#10b98118', icon: '✅' },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.4 }}
              className="rounded-2xl p-5"
              style={{ background: `rgba(30,41,59,0.7)`, border: `1px solid ${s.color}33`, boxShadow: `0 0 20px ${s.glow}` }}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <p className="text-3xl font-bold text-white">{s.count}</p>
              <p className="text-xs mt-1 font-medium" style={{ color: s.color }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* High risk alert */}
        {high.length > 0 && (
          <motion.div className="rounded-2xl p-5 mb-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ background: 'linear-gradient(135deg, rgba(127,29,29,0.4), rgba(69,10,10,0.3))', border: '1px solid rgba(239,68,68,0.3)', boxShadow: '0 0 28px rgba(239,68,68,0.1)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping opacity-60" />
              </div>
              <p className="text-red-400 font-semibold text-sm uppercase tracking-wide">AI Alert — Immediate Attention Required</p>
            </div>
            <p className="text-sm" style={{ color: '#fca5a5' }}>
              <span className="font-semibold">{high.map(e => e.employeeName).join(', ')}</span> {high.length === 1 ? 'has' : 'have'} been flagged with HIGH attrition risk. Consider scheduling 1:1 meetings and reviewing workload distribution.
            </p>
          </motion.div>
        )}

        {/* Main table */}
        <motion.div className="rounded-2xl overflow-hidden" style={cardStyle}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.45 }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(51,65,85,0.5)' }}>
            <h2 className="text-white font-semibold">Risk Analysis — All Employees</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(15,23,42,0.5)' }}>
                {['Employee', 'Leave Count', 'Latest Rating', 'Tenure (months)', 'Risk Score', 'Risk Level'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-6 py-8 text-center" style={{ color: '#475569' }} colSpan={6}>
                  <div className="flex items-center justify-center gap-2">
                    <motion.div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                    Analyzing workforce data...
                  </div>
                </td></tr>
              ) : insights.map((ins, i) => {
                const rc = riskConfig[ins.riskLevel] || riskConfig.LOW;
                return (
                  <motion.tr key={ins.employeeId}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    className="border-t transition-colors hover:bg-white/5"
                    style={{ borderColor: 'rgba(51,65,85,0.4)' }}>
                    <td className="px-6 py-4 text-white font-medium">{ins.employeeName}</td>
                    <td className="px-6 py-4" style={{ color: '#94a3b8' }}>{ins.leaveCount}</td>
                    <td className="px-6 py-4" style={{ color: '#94a3b8' }}>{ins.latestRating ?? '—'}</td>
                    <td className="px-6 py-4" style={{ color: '#94a3b8' }}>{ins.tenureMonths}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-1.5 rounded-full" style={{ background: '#0f172a' }}>
                          <motion.div className="h-1.5 rounded-full"
                            initial={{ width: 0 }} animate={{ width: `${ins.riskScore}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 + i * 0.05 }}
                            style={{ background: rc.bar }} />
                        </div>
                        <span className="text-white font-semibold">{ins.riskScore.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ background: rc.bg, color: rc.text, border: `1px solid ${rc.border}` }}>
                        {ins.riskLevel}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      </div>
    </Layout>
  );
}
