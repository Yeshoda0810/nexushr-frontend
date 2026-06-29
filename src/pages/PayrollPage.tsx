import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import Layout from '../components/Layout';
import type { Payslip } from '../types';

export default function PayrollPage() {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    apiClient.get<Payslip[]>('/payroll/me')
      .then((res) => setPayslips(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function formatCurrency(amount: number) {
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Payroll</h1>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : payslips.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-6 text-slate-400">
          No payslips generated yet. Contact your admin.
        </div>
      ) : (
        <div className="space-y-4">
          {payslips.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                className="w-full flex justify-between items-center px-6 py-4 hover:bg-slate-50"
              >
                <span className="font-medium text-slate-700">
                  {monthNames[p.month]} {p.year}
                </span>
                <span className="font-semibold text-green-700">{formatCurrency(p.netSalary)} net</span>
              </button>

              {expandedId === p.id && (
                <div className="px-6 pb-6 grid grid-cols-2 gap-y-2 text-sm border-t border-slate-100 pt-4">
                  <span className="text-slate-500">Basic Salary</span>
                  <span className="text-right font-medium">{formatCurrency(p.basicSalary)}</span>

                  <span className="text-slate-500">HRA</span>
                  <span className="text-right font-medium">{formatCurrency(p.hra)}</span>

                  <span className="text-slate-500">Conveyance Allowance</span>
                  <span className="text-right font-medium">{formatCurrency(p.conveyanceAllowance)}</span>

                  <span className="text-slate-500">Medical Allowance</span>
                  <span className="text-right font-medium">{formatCurrency(p.medicalAllowance)}</span>

                  <span className="text-slate-700 font-medium border-t pt-2">Gross Salary</span>
                  <span className="text-right font-semibold border-t pt-2">{formatCurrency(p.grossSalary)}</span>

                  <span className="text-red-500">PF Deduction</span>
                  <span className="text-right font-medium text-red-500">- {formatCurrency(p.pfDeduction)}</span>

                  <span className="text-red-500">Professional Tax</span>
                  <span className="text-right font-medium text-red-500">- {formatCurrency(p.professionalTax)}</span>

                  <span className="text-slate-800 font-semibold border-t pt-2">Net Salary</span>
                  <span className="text-right font-bold text-green-700 border-t pt-2">{formatCurrency(p.netSalary)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}