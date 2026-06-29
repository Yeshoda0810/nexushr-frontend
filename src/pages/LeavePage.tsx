
import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import type { LeaveRequestItem } from '../types';

export default function LeavePage() {
  const { user } = useAuth();
  const isApprover = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const [myLeaves, setMyLeaves] = useState<LeaveRequestItem[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

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
      setMessage('Failed to load leave data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      await apiClient.post('/leaves/apply', { leaveType, startDate, endDate, reason });
      setMessage('Leave applied successfully!');
      setStartDate('');
      setEndDate('');
      setReason('');
      loadData();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Failed to apply leave');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDecision(id: number, action: 'approve' | 'reject') {
    try {
      await apiClient.put(`/leaves/${id}/${action}`);
      loadData();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || `Failed to ${action} leave`);
    }
  }

  function statusBadge(status: string) {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      APPROVED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-700',
    };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>{status}</span>;
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Leave Management</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-medium text-slate-700 mb-4">Apply for Leave</h2>
        {message && <p className="text-sm text-blue-600 mb-3">{message}</p>}
        <form onSubmit={handleApply} className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
            <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-2 py-2 text-sm">
              <option value="CASUAL">Casual</option>
              <option value="SICK">Sick</option>
              <option value="EARNED">Earned</option>
              <option value="UNPAID">Unpaid</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Start date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required
              className="w-full border border-slate-300 rounded-lg px-2 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">End date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required
              className="w-full border border-slate-300 rounded-lg px-2 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Reason</label>
            <input value={reason} onChange={(e) => setReason(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-2 py-2 text-sm" />
          </div>
          <button type="submit" disabled={submitting}
            className="col-span-2 md:col-span-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Apply for Leave'}
          </button>
        </form>
      </div>

      {isApprover && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-medium text-slate-700 mb-4">Pending Approvals</h2>
          {pendingLeaves.length === 0 ? (
            <p className="text-sm text-slate-400">No pending leave requests</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-slate-500 text-left">
                <tr><th className="py-2">Employee</th><th>Type</th><th>Dates</th><th>Reason</th><th>Action</th></tr>
              </thead>
              <tbody>
                {pendingLeaves.map((l) => (
                  <tr key={l.id} className="border-t border-slate-100">
                    <td className="py-2">{l.employee?.firstName} {l.employee?.lastName}</td>
                    <td>{l.leaveType}</td>
                    <td>{l.startDate} to {l.endDate}</td>
                    <td>{l.reason}</td>
                    <td className="py-2 space-x-2">
                      <button onClick={() => handleDecision(l.id, 'approve')}
                        className="bg-green-600 text-white text-xs px-3 py-1 rounded-lg">Approve</button>
                      <button onClick={() => handleDecision(l.id, 'reject')}
                        className="bg-red-500 text-white text-xs px-3 py-1 rounded-lg">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-medium text-slate-700 mb-4">My Leave History</h2>
        <table className="w-full text-sm">
          <thead className="text-slate-500 text-left">
            <tr><th className="py-2">Type</th><th>Dates</th><th>Reason</th><th>Status</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="py-3 text-slate-400" colSpan={4}>Loading...</td></tr>
            ) : myLeaves.length === 0 ? (
              <tr><td className="py-3 text-slate-400" colSpan={4}>No leave requests yet</td></tr>
            ) : (
              myLeaves.map((l) => (
                <tr key={l.id} className="border-t border-slate-100">
                  <td className="py-2">{l.leaveType}</td>
                  <td>{l.startDate} to {l.endDate}</td>
                  <td>{l.reason}</td>
                  <td className="py-2">{statusBadge(l.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}