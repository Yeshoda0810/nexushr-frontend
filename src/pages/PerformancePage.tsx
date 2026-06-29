import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import Layout from '../components/Layout';
import type { PerformanceReviewItem } from '../types';

export default function PerformancePage() {
  const [reviews, setReviews] = useState<PerformanceReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

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
    } catch {
      setMessage('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  async function handleCreateGoals(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      await apiClient.post('/performance/goals', { reviewYear, reviewPeriod, goals, achievements });
      setMessage('Goals submitted successfully!');
      setGoals('');
      setAchievements('');
      loadReviews();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Failed to submit goals');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAcknowledge(id: number) {
    try {
      await apiClient.put(`/performance/${id}/acknowledge`);
      loadReviews();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Failed to acknowledge');
    }
  }

  function statusBadge(status: string) {
    const colors: Record<string, string> = {
      DRAFT: 'bg-slate-100 text-slate-600',
      SUBMITTED: 'bg-blue-100 text-blue-700',
      ACKNOWLEDGED: 'bg-green-100 text-green-700',
    };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>{status}</span>;
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Performance</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-medium text-slate-700 mb-4">Submit Goals / Achievements</h2>
        {message && <p className="text-sm text-blue-600 mb-3">{message}</p>}
        <form onSubmit={handleCreateGoals} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Year</label>
              <input type="number" value={reviewYear} onChange={(e) => setReviewYear(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-lg px-2 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Period</label>
              <select value={reviewPeriod} onChange={(e) => setReviewPeriod(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-2 py-2 text-sm">
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
                <option value="Annual">Annual</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Goals</label>
            <textarea value={goals} onChange={(e) => setGoals(e.target.value)} required rows={2}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Achievements</label>
            <textarea value={achievements} onChange={(e) => setAchievements(e.target.value)} rows={2}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <button type="submit" disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-slate-400">No reviews yet</div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-slate-700">{r.reviewPeriod} {r.reviewYear}</h3>
                {statusBadge(r.status)}
              </div>
              <p className="text-sm text-slate-600 mb-2"><span className="text-slate-400">Goals:</span> {r.goals}</p>
              {r.achievements && (
                <p className="text-sm text-slate-600 mb-2"><span className="text-slate-400">Achievements:</span> {r.achievements}</p>
              )}
              {r.managerFeedback && (
                <div className="bg-slate-50 rounded-lg p-3 mt-3">
                  <p className="text-sm text-slate-700"><span className="text-slate-400">Manager feedback:</span> {r.managerFeedback}</p>
                  {r.rating && <p className="text-sm text-slate-700 mt-1">Rating: {'⭐'.repeat(r.rating)}</p>}
                </div>
              )}
              {r.status === 'SUBMITTED' && (
                <button onClick={() => handleAcknowledge(r.id)}
                  className="mt-3 bg-green-600 text-white text-sm px-4 py-1.5 rounded-lg">
                  Acknowledge
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}