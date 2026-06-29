import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import Layout from '../components/Layout';
import type { AttendanceRecord } from '../types';

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function loadAttendance() {
    setLoading(true);
    try {
      const res = await apiClient.get<AttendanceRecord[]>('/attendance/me');
      setRecords(res.data);
    } catch {
      setMessage('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAttendance();
  }, []);

  async function handleCheckIn() {
    setActionLoading(true);
    setMessage('');
    try {
      await apiClient.post('/attendance/check-in');
      setMessage('Checked in successfully!');
      loadAttendance();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Check-in failed (maybe already checked in today)');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCheckOut() {
    setActionLoading(true);
    setMessage('');
    try {
      await apiClient.post('/attendance/check-out');
      setMessage('Checked out successfully!');
      loadAttendance();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Check-out failed');
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Attendance</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex gap-4 items-center">
        <button
          onClick={handleCheckIn}
          disabled={actionLoading}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-lg disabled:opacity-50"
        >
          Check In
        </button>
        <button
          onClick={handleCheckOut}
          disabled={actionLoading}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-2.5 rounded-lg disabled:opacity-50"
        >
          Check Out
        </button>
        {message && <span className="text-sm text-slate-600">{message}</span>}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Check In</th>
              <th className="px-4 py-3">Check Out</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-4 text-slate-400" colSpan={4}>Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td className="px-4 py-4 text-slate-400" colSpan={4}>No attendance records yet</td></tr>
            ) : (
              records.map((r) => (
                <tr key={r.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{r.attendanceDate}</td>
                  <td className="px-4 py-3">{r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : '-'}</td>
                  <td className="px-4 py-3">{r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : '-'}</td>
                  <td className="px-4 py-3">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}