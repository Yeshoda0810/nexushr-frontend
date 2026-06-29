import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import Layout from '../components/Layout';
import type { AttritionInsight } from '../types';

export default function InsightsPage() {
  const [insights, setInsights] = useState<AttritionInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<AttritionInsight[]>('/insights/attrition')
      .then((res) => setInsights(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function riskColor(level: string) {
    if (level === 'HIGH') return 'bg-red-100 text-red-700';
    if (level === 'MEDIUM') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold text-slate-800 mb-2">AI Workforce Insights</h1>
      <p className="text-sm text-slate-500 mb-6">
        Rule-based attrition risk scoring (leave frequency, performance rating, tenure)
      </p>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Leave Count</th>
              <th className="px-4 py-3">Latest Rating</th>
              <th className="px-4 py-3">Tenure (months)</th>
              <th className="px-4 py-3">Risk Score</th>
              <th className="px-4 py-3">Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-4 text-slate-400" colSpan={6}>Loading...</td></tr>
            ) : (
              insights.map((i) => (
                <tr key={i.employeeId} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{i.employeeName}</td>
                  <td className="px-4 py-3">{i.leaveCount}</td>
                  <td className="px-4 py-3">{i.latestRating ?? '-'}</td>
                  <td className="px-4 py-3">{i.tenureMonths}</td>
                  <td className="px-4 py-3">{i.riskScore.toFixed(1)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${riskColor(i.riskLevel)}`}>
                      {i.riskLevel}
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