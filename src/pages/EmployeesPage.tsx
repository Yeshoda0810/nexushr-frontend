import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import type { Employee } from '../types';

export default function EmployeesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');

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
      setMessage('Failed to load employees');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      await apiClient.post('/employees', { firstName, lastName, email, password, role });
      setMessage('Employee created successfully!');
      setFirstName(''); setLastName(''); setEmail(''); setPassword(''); setRole('EMPLOYEE');
      setShowForm(false);
      loadEmployees();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Failed to create employee');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Employees</h1>
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm">
            {showForm ? 'Cancel' : '+ Add Employee'}
          </button>
        )}
      </div>

      {message && <p className="text-sm text-blue-600 mb-4">{message}</p>}

      {showForm && isAdmin && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl shadow-sm p-6 mb-6 grid grid-cols-2 gap-4">
          <input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <select value={role} onChange={(e) => setRole(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
            <option value="EMPLOYEE">Employee</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit" disabled={submitting}
            className="col-span-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg disabled:opacity-50">
            {submitting ? 'Creating...' : 'Create Employee'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-4 text-slate-400" colSpan={5}>Loading...</td></tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{emp.employeeCode}</td>
                  <td className="px-4 py-3">{emp.firstName} {emp.lastName}</td>
                  <td className="px-4 py-3">{emp.email}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">{emp.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    {emp.active
                      ? <span className="text-green-600 text-xs font-medium">Active</span>
                      : <span className="text-red-500 text-xs font-medium">Inactive</span>}
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