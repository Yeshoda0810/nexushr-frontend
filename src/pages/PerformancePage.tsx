import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../api/client';
import Layout from '../components/Layout';
import type { PerformanceReviewItem } from '../types';

const cardStyle = {
  background: 'rgba(30, 41, 59, 0.7)',
  border: '1px solid rgba(51, 65, 85, 0.8)',
  backdropFilter: 'blur(12px)',
};

const inputStyle: React.CSSProperties = {
  background: 'rgba(15, 23, 42, 0.6)',
  border: '1px solid #334155',
  color: 'white',
  width: '100%',
  borderRadius: '0.75rem',
  padding: '0.625rem 1rem',
  fontSize: '0.875rem',
  outline: 'none',
};

const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
  DRAFT: { bg: 'rgba(100,116,139,0.15)', text: '#94a3b8', border: 'rgba(100,116,139,0.3)' },
  SUBMITTED: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
  ACKNOWLEDGED: { bg: 'rgba(16,185,129,0.15)', text: '#10b981', border: 'rgba(16,185,129,0.3)' },
};

export default function PerformancePage() {
  const [reviews, setReviews] = useState<PerformanceReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success'|'error'>('success');

  const [reviewYear, setReviewYear] = useState(new Date().getFullYear());
  const [reviewPeriod, setReviewPeriod] = useState('Q1');
  const [goals, setGoals] = useState('');
  const [achievements, setAchievements] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadReviews() {
    setLoading(true);
    try {
      const res = await apiClient.get<PerformanceReviewItem[]>('/performance/me');
      setReviews(res.data);
    } catch { setMessage('Failed to load reviews'); setMessageType('error'); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadReviews(); }, []);

  async function handleCreateGoals(e: React.FormEvent) {
    e.preventDefault(); setSubmitting(true); setMessage('');
    try {
      await apiClient.post('/performance/goals', { reviewYear, reviewPeriod, goals, achievements });
      setMessage('Goals submitted successfully!'); setMessageType('success');
      setGoals(''); setAchievements(''); loadReviews();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Failed to submit goals'); setMessageType('error');
    } finally { setSubmitting(false); }
  }

  async function handleAcknowledge(id: number) {
    try {
      await apiClient.put(`/performance/${id}/acknowledge`);
      loadReviews();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Failed to acknowledge'); setMessageType('error');
    }
  }

  return (
    <Layout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-8 rounded-full" style={{ background: 'linear-gradient(180deg, #f59e0b, #8b5cf6)' }} />
            <h1 className="text-2xl font-bold text-white">Performance</h1>
          </div>
          <p className="text-sm ml-5" style={{ color: '#64748b' }}>Track your goals, achievements, and manager feedback</p>
        </motion.div>

        {message && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl px-4 py-3 mb-5 text-sm flex items-center gap-2"
            style={{
              background: messageType === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${messageType === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              color: messageType === 'success' ? '#10b981' : '#ef4444',
            }}>
            {messageType === 'success' ? '✅' : '⚠️'} {message}
          </motion.div>
        )}

        {/* Submit form */}
        <motion.div className="rounded-2xl p-6 mb-6" style={cardStyle}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-white font-semibold mb-5">Submit Goals / Achievements</h2>
          <form onSubmit={handleCreateGoals} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#64748b' }}>Year</label>
                <input type="number" value={reviewYear} onChange={(e) => setReviewYear(Number(e.target.value))} style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#64748b' }}>Period</label>
                <select value={reviewPeriod} onChange={(e) => setReviewPeriod(e.target.value)}
                  style={{ ...inputStyle, background: 'rgba(15,23,42,0.8)' }}>
                  {['Q1','Q2','Q3','Q4','Annual'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#64748b' }}>Goals</label>
              <textarea value={goals} onChange={(e) => setGoals(e.target.value)} required rows={3}
                placeholder="Describe your goals for this period..."
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#64748b' }}>Achievements</label>
              <textarea value={achievements} onChange={(e) => setAchievements(e.target.value)} rows={3}
                placeholder="What did you accomplish?"
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <button type="submit" disabled={submitting}
              className="px-6 py-2.5 rounded-xl font-semibold text-white text-sm disabled:opacity-50 transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #d97706, #8b5cf6)', boxShadow: '0 4px 16px rgba(139,92,246,0.3)' }}>
              {submitting ? 'Submitting...' : '⭐ Submit Goals'}
            </button>
          </form>
        </motion.div>

        {/* Reviews */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center gap-2 py-8" style={{ color: '#64748b' }}>
              <motion.div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <motion.div className="rounded-2xl p-10 text-center" style={cardStyle}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-4xl mb-3">⭐</div>
              <p className="text-white font-medium">No reviews yet</p>
              <p className="text-sm mt-1" style={{ color: '#475569' }}>Submit your first goals above</p>
            </motion.div>
          ) : reviews.map((r, i) => {
            const sc = statusConfig[r.status] || statusConfig.DRAFT;
            return (
              <motion.div key={r.id} className="rounded-2xl p-6" style={cardStyle}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-semibold">{r.reviewPeriod} {r.reviewYear}</h3>
                    <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>Performance Review</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                    {r.status}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="rounded-xl p-3" style={{ background: 'rgba(15,23,42,0.5)' }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#64748b' }}>Goals</p>
                    <p className="text-sm text-white">{r.goals}</p>
                  </div>
                  {r.achievements && (
                    <div className="rounded-xl p-3" style={{ background: 'rgba(15,23,42,0.5)' }}>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#64748b' }}>Achievements</p>
                      <p className="text-sm text-white">{r.achievements}</p>
                    </div>
                  )}
                  {r.managerFeedback && (
                    <div className="rounded-xl p-3" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#60a5fa' }}>Manager Feedback</p>
                      <p className="text-sm text-white">{r.managerFeedback}</p>
                      {r.rating && (
                        <p className="text-sm mt-2">
                          {'⭐'.repeat(r.rating)}
                          <span className="ml-2 text-xs" style={{ color: '#64748b' }}>Rating: {r.rating}/5</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {r.status === 'SUBMITTED' && (
                  <button onClick={() => handleAcknowledge(r.id)}
                    className="mt-4 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
                    ✓ Acknowledge
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
