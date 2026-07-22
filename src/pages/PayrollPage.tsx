import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../api/client';
import Layout from '../components/Layout';
import type { Payslip } from '../types';

const cardStyle = {
  background: 'rgba(30, 41, 59, 0.7)',
  border: '1px solid rgba(51, 65, 85, 0.8)',
  backdropFilter: 'blur(12px)',
};

const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

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

  return (
    <Layout>
      <div className="p-6 lg:p-8">
        <motion.div className="mb-8" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-8 rounded-full" style={{ background: 'linear-gradient(180deg, #10b981, #f59e0b)' }} />
            <h1 className="text-2xl font-bold text-white">Payroll</h1>
          </div>
          <p className="text-sm ml-5" style={{ color: '#64748b' }}>Your payslips and salary breakdown</p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
            <span className="ml-3 text-sm" style={{ color: '#64748b' }}>Loading payslips...</span>
          </div>
        ) : payslips.length === 0 ? (
          <motion.div className="rounded-2xl p-12 text-center" style={cardStyle}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-5xl mb-4">💰</div>
            <p className="text-white font-medium mb-1">No payslips yet</p>
            <p className="text-sm" style={{ color: '#475569' }}>Contact your admin to generate payroll</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {payslips.map((p, i) => (
              <motion.div key={p.id} className="rounded-2xl overflow-hidden" style={cardStyle}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <button onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                  className="w-full flex justify-between items-center px-6 py-4 transition-colors hover:bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                      style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
                      💵
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">{monthNames[p.month]} {p.year}</p>
                      <p className="text-xs" style={{ color: '#64748b' }}>Click to view breakdown</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs mb-0.5" style={{ color: '#64748b' }}>Net Salary</p>
                      <p className="text-lg font-bold" style={{ color: '#10b981' }}>{formatCurrency(p.netSalary)}</p>
                    </div>
                    <motion.div animate={{ rotate: expandedId === p.id ? 180 : 0 }} transition={{ duration: 0.2 }}
                      style={{ color: '#475569' }}>▼</motion.div>
                  </div>
                </button>
                <AnimatePresence>
                  {expandedId === p.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                      style={{ borderTop: '1px solid rgba(51,65,85,0.5)' }}>
                      <div className="px-6 py-5">
                        <div className="grid grid-cols-2 gap-y-3">
                          <p className="text-xs font-semibold uppercase tracking-wider col-span-2 mb-1" style={{ color: '#64748b' }}>Earnings</p>
                          {[
                            ['Basic Salary', p.basicSalary], ['HRA', p.hra],
                            ['Conveyance Allowance', p.conveyanceAllowance], ['Medical Allowance', p.medicalAllowance],
                          ].map(([label, value]) => (
                            <>
                              <span key={String(label)+'l'} className="text-sm" style={{ color: '#94a3b8' }}>{label}</span>
                              <span key={String(label)+'v'} className="text-sm text-right text-white font-medium">{formatCurrency(Number(value))}</span>
                            </>
                          ))}
                          <div className="col-span-2 border-t my-2" style={{ borderColor: 'rgba(51,65,85,0.5)' }} />
                          <span className="text-sm font-semibold text-white">Gross Salary</span>
                          <span className="text-sm text-right font-bold text-white">{formatCurrency(p.grossSalary)}</span>
                          <p className="text-xs font-semibold uppercase tracking-wider col-span-2 mt-3 mb-1" style={{ color: '#64748b' }}>Deductions</p>
                          {[['PF Deduction', p.pfDeduction], ['Professional Tax', p.professionalTax]].map(([label, value]) => (
                            <>
                              <span key={String(label)+'l'} className="text-sm" style={{ color: '#ef4444' }}>{label}</span>
                              <span key={String(label)+'v'} className="text-sm text-right font-medium" style={{ color: '#ef4444' }}>− {formatCurrency(Number(value))}</span>
                            </>
                          ))}
                          <div className="col-span-2 border-t my-2" style={{ borderColor: 'rgba(51,65,85,0.5)' }} />
                          <span className="text-base font-bold text-white">Net Salary</span>
                          <span className="text-base text-right font-bold" style={{ color: '#10b981' }}>{formatCurrency(p.netSalary)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
