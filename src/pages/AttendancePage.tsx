import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../api/client';
import Layout from '../components/Layout';
import type { AttendanceRecord } from '../types';

const cardStyle = {
  background: 'rgba(30, 41, 59, 0.7)',
  border: '1px solid rgba(51, 65, 85, 0.8)',
  backdropFilter: 'blur(12px)',
};

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  async function loadAttendance() {
    setLoading(true);
    try {
      const res = await apiClient.get<AttendanceRecord[]>('/attendance/me');
      setRecords(res.data);
    } catch {
      setMessage('Failed to load attendance');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAttendance(); }, []);

  async function handleCheckIn() {
    setActionLoading(true); setMessage('');
    try {
      await apiClient.post('/attendance/check-in');
      setMessage('✅ Checked in successfully!'); setMessageType('success');
      loadAttendance();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Check-in failed (maybe already checked in today)');
      setMessageType('error');
    } finally { setActionLoading(false); }
  }

  async function handleCheckOut() {
    setActionLoading(true); setMessage('');
    try {
      await apiClient.post('/attendance/check-out');
      setMessage('✅ Checked out successfully!'); setMessageType('success');
      loadAttendance();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Check-out failed');
      setMessageType('error');
    } finally { setActionLoading(false); }
  }

  return (
    <Layout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.4, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-8 rounded-full" style={{ background: 'linear-gradient(180deg, #10b981, #3b82f6)' }} />
            <h1 className="text-2xl font-bold text-white">Attendance</h1>
          </div>
          <p className="text-sm ml-5" style={{ color: '#64748b' }}>Track your daily check-in and check-out</p>
        </motion.div>

        {/* Action card */}
        <motion.div
          className="rounded-2xl p-6 mb-6"
          style={cardStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07, duration: 0.4, ease: 'easeOut' }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#64748b' }}>Today's Attendance</h2>
          <div className="flex flex-wrap gap-3 items-center">
            <button onClick={handleCheckIn} disabled={actionLoading}
              className="px-6 py-2.5 rounded-xl font-semibold text-white text-sm transition-all duration-200 disabled:opacity-50 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 4px 16px rgba(16,185,129,0.3)' }}>
              ✅ Check In
            </button>
            <button onClick={handleCheckOut} disabled={actionLoading}
              className="px-6 py-2.5 rounded-xl font-semibold text-white text-sm transition-all duration-200 disabled:opacity-50 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)', boxShadow: '0 4px 16px rgba(245,158,11,0.3)' }}>
              🚪 Check Out
            </button>
            {message && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm font-medium"
                style={{ color: messageType === 'success' ? '#10b981' : '#ef4444' }}>
                {message}
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* Records table */}
        <motion.div
          className="rounded-2xl overflow-hidden"
          style={cardStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.4, ease: 'easeOut' }}
        >
          <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(51,65,85,0.5)' }}>
            <h2 className="text-white font-semibold">Attendance History</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(15,23,42,0.5)' }}>
                {['Date', 'Check In', 'Check Out', 'Status'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#64748b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-6 py-8 text-center" style={{ color: '#475569' }} colSpan={4}>
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                    Loading...
                  </div>
                </td></tr>
              ) : records.length === 0 ? (
                <tr><td className="px-6 py-12 text-center" style={{ color: '#475569' }} colSpan={4}>
                  <div className="text-4xl mb-2">📋</div>
                  No attendance records yet
                </td></tr>
              ) : records.map((r, i) => (
                <motion.tr key={r.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="border-t transition-colors hover:bg-white/5"
                  style={{ borderColor: 'rgba(51,65,85,0.4)' }}>
                  <td className="px-6 py-4 text-white font-medium">{r.attendanceDate}</td>
                  <td className="px-6 py-4" style={{ color: '#94a3b8' }}>
                    {r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : '—'}
                  </td>
                  <td className="px-6 py-4" style={{ color: '#94a3b8' }}>
                    {r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                      {r.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </Layout>
  );
}
