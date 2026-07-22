import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../api/client';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import type { LeaveRequestItem } from '../types';

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
  PENDING: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  APPROVED: { bg: 'rgba(16,185,129,0.15)', text: '#10b981', border: 'rgba(16,185,129,0.3)' },
  REJECTED: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', border: 'rgba(239,68,68,0.3)' },
};

export default function LeavePage() {
  const { user } = useAuth();
  const isApprover = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const [myLeaves, setMyLeaves] = useState<LeaveRequestItem[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [leaveType, setLeaveType] = useState('CASUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const mine = await apiClient.get<LeaveRequestItem[]>('/leaves/me');
      setMyLeaves(mine.data);
      if (isApprover) {
        const pending = await apiClient.get<LeaveRequestItem[]>('/leaves/pending');
        setPendingLeaves(pending.data);
      }
    } catch {
      setMessage('Failed to load leave data'); setMessageType('error');
    } finally { setLoading(false); }
  }

  useEffect(() => { loadData(); }, []);

  async function handleApply(e: React.FormEvent) {
    e.preventDefault(); setSubmitting(true); setMessage('');
    try {
      await apiClient.post('/leaves/apply', { leaveType, startDate, endDate, reason });
      setMessage('Leave applied successfully!'); setMessageType('success');
      setStartDate(''); setEndDate(''); setReason('');
      loadData();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Failed to apply leave'); setMessageType('error');
    } finally { setSubmitting(false); }
  }

  async function handleDecision(id: number, action: 'approve' | 'reject') {
    try {
      await apiClient.put(`/leaves/${id}/${action}`);
      loadData();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || `Failed to ${action} leave`); setMessageType('error');
    }
  }

  return (
    <Layout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-8 rounded-full" style={{ background: 'linear-gradient(180deg, #f59e0b, #ef4444)' }} />
            <h1 className="text-2xl font-bold text-white">Leave Management</h1>
          </div>
          <p className="text-sm ml-5" style={{ color: '#64748b' }}>Apply, track, and manage leave requests</p>
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

        {/* Apply form */}
        <motion.div className="rounded-2xl p-6 mb-6" style={cardStyle}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-white font-semibold mb-5">Apply for Leave</h2>
          <form onSubmit={handleApply}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#64748b' }}>Type</label>
                <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} style={{ ...inputStyle, background: 'rgba(15,23,42,0.8)' }}>
                  {['CASUAL', 'SICK', 'EARNED', 'UNPAID'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#64748b' }}>Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required style={{ ...inputStyle, colorScheme: 'dark' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#64748b' }}>End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required style={{ ...inputStyle, colorScheme: 'dark' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#64748b' }}>Reason</label>
                <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Optional" style={inputStyle} />
              </div>
            </div>
            <button type="submit" disabled={submitting}
              className="w-full py-2.5 rounded-xl font-semibold text-white text-sm disabled:opacity-50 transition-all"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 4px 16px rgba(139,92,246,0.3)' }}>
              {submitting ? 'Submitting...' : '🏖️ Apply for Leave'}
            </button>
          </form>
        </motion.div>

        {/* Pending approvals */}
        {isApprover && (
          <motion.div className="rounded-2xl p-6 mb-6" style={cardStyle}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
              Pending Approvals
              {pendingLeaves.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
                  {pendingLeaves.length}
                </span>
              )}
            </h2>
            {pendingLeaves.length === 0 ? (
              <p className="text-sm" style={{ color: '#475569' }}>✅ No pending leave requests</p>
            ) : (
              <div className="space-y-3">
                {pendingLeaves.map((l) => (
                  <div key={l.id} className="flex items-center justify-between rounded-xl px-4 py-3"
                    style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(51,65,85,0.5)' }}>
                    <div>
                      <p className="text-white font-medium text-sm">{l.employee?.firstName} {l.employee?.lastName}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                        {l.leaveType} • {l.startDate} → {l.endDate} {l.reason && `• ${l.reason}`}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleDecision(l.id, 'approve')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105"
                        style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>Approve</button>
                      <button onClick={() => handleDecision(l.id, 'reject')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105"
                        style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)' }}>Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Leave history */}
        <motion.div className="rounded-2xl overflow-hidden" style={cardStyle}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(51,65,85,0.5)' }}>
            <h2 className="text-white font-semibold">My Leave History</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(15,23,42,0.5)' }}>
                {['Type', 'Dates', 'Reason', 'Status'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-6 py-6 text-center" style={{ color: '#475569' }} colSpan={4}>Loading...</td></tr>
              ) : myLeaves.length === 0 ? (
                <tr><td className="px-6 py-10 text-center" style={{ color: '#475569' }} colSpan={4}>
                  <div className="text-3xl mb-2">📭</div>No leave requests yet
                </td></tr>
              ) : myLeaves.map((l, i) => {
                const sc = statusConfig[l.status] || statusConfig.PENDING;
                return (
                  <motion.tr key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="border-t transition-colors hover:bg-white/5"
                    style={{ borderColor: 'rgba(51,65,85,0.4)' }}>
                    <td className="px-6 py-4 text-white font-medium">{l.leaveType}</td>
                    <td className="px-6 py-4" style={{ color: '#94a3b8' }}>{l.startDate} → {l.endDate}</td>
                    <td className="px-6 py-4" style={{ color: '#94a3b8' }}>{l.reason || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                        {l.status}
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
