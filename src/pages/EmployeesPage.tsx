import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../api/client';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import type { Employee } from '../types';

const fadeUp = (i: number): Record<string, unknown> => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
});

const cardStyle = {
  background: 'rgba(30, 41, 59, 0.7)',
  border: '1px solid rgba(51, 65, 85, 0.8)',
  backdropFilter: 'blur(12px)',
};

const inputStyle = {
  background: 'rgba(15, 23, 42, 0.6)',
  border: '1px solid #334155',
  color: 'white',
};

const roleColors: Record<string, { bg: string; text: string; border: string }> = {
  ADMIN: { bg: 'rgba(139,92,246,0.15)', text: '#a78bfa', border: 'rgba(139,92,246,0.3)' },
  MANAGER: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
  EMPLOYEE: { bg: 'rgba(16,185,129,0.15)', text: '#34d399', border: 'rgba(16,185,129,0.3)' },
};

export default function EmployeesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [submitting, setSubmitting] = useState(false);

  async function loadEmployees() {
    setLoading(true);
    try {
      const res = await apiClient.get<Employee[]>('/employees');
      setEmployees(res.data);
    } catch {
      setMessage('Failed to load employees'); setMessageType('error');
    } finally { setLoading(false); }
  }

  useEffect(() => { loadEmployees(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault(); setSubmitting(true); setMessage('');
    try {
      await apiClient.post('/employees', { firstName, lastName, email, password, role });
      setMessage('Employee created successfully!'); setMessageType('success');
      setFirstName(''); setLastName(''); setEmail(''); setPassword(''); setRole('EMPLOYEE');
      setShowForm(false); loadEmployees();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Failed to create employee'); setMessageType('error');
    } finally { setSubmitting(false); }
  }

  return (
    <Layout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div className="flex justify-between items-center mb-8" {...fadeUp(0)}>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-8 rounded-full" style={{ background: 'linear-gradient(180deg, #3b82f6, #8b5cf6)' }} />
              <h1 className="text-2xl font-bold text-white">Employees</h1>
            </div>
            <p className="text-sm ml-5" style={{ color: '#64748b' }}>{employees.length} team members</p>
          </div>
          {isAdmin && (
            <button onClick={() => setShowForm(!showForm)}
              className="px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:scale-105"
              style={{ background: showForm ? 'rgba(51,65,85,0.8)' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: showForm ? 'none' : '0 4px 16px rgba(59,130,246,0.3)' }}>
              {showForm ? '✕ Cancel' : '+ Add Employee'}
            </button>
          )}
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

        {/* Add Employee Form */}
        {showForm && isAdmin && (
          <motion.div className="rounded-2xl p-6 mb-6" style={cardStyle}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
            <h2 className="text-white font-semibold mb-5">New Employee Details</h2>
            <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
              {[
                { p: 'First name', v: firstName, s: setFirstName },
                { p: 'Last name', v: lastName, s: setLastName },
                { p: 'Email', v: email, s: setEmail, t: 'email' },
                { p: 'Password', v: password, s: setPassword, t: 'password' },
              ].map(({ p, v, s, t }) => (
                <input key={p} placeholder={p} value={v} onChange={(e) => s(e.target.value)}
                  required type={t || 'text'}
                  className="rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#334155'} />
              ))}
              <select value={role} onChange={(e) => setRole(e.target.value)}
                className="rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{ ...inputStyle, background: 'rgba(15,23,42,0.8)' }}>
                <option value="EMPLOYEE">Employee</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
              <button type="submit" disabled={submitting}
                className="rounded-xl py-2.5 font-semibold text-white text-sm disabled:opacity-50 transition-all"
                style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 4px 14px rgba(16,185,129,0.3)' }}>
                {submitting ? 'Creating...' : '✓ Create Employee'}
              </button>
            </form>
          </motion.div>
        )}

        {/* Table */}
        <motion.div className="rounded-2xl overflow-hidden" style={cardStyle} {...fadeUp(2)}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(15,23,42,0.5)' }}>
                {['Code', 'Name', 'Email', 'Role', 'Status'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-6 py-8 text-center" style={{ color: '#475569' }} colSpan={5}>
                  <div className="flex items-center justify-center gap-2">
                    <motion.div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                    Loading...
                  </div>
                </td></tr>
              ) : employees.map((emp, i) => {
                const rc = roleColors[emp.role] || roleColors.EMPLOYEE;
                return (
                  <motion.tr key={emp.id} {...fadeUp(i + 1)}
                    className="border-t transition-colors hover:bg-white/5"
                    style={{ borderColor: 'rgba(51,65,85,0.4)' }}>
                    <td className="px-6 py-4 font-mono text-xs" style={{ color: '#64748b' }}>{emp.employeeCode}</td>
                    <td className="px-6 py-4 text-white font-medium">{emp.firstName} {emp.lastName}</td>
                    <td className="px-6 py-4" style={{ color: '#94a3b8' }}>{emp.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: rc.bg, color: rc.text, border: `1px solid ${rc.border}` }}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {emp.active
                        ? <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                            style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>Active</span>
                        : <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                            style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>Inactive</span>
                      }
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
