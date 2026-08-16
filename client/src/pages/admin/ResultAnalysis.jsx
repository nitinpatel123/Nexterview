import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import api from "../../services/api";

const ResultAnalysis = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: res } = await api.get("/admin/result-analysis");
        setData(res.data);
      } catch {
        toast.error("Failed to load result analysis");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader text="Loading result analysis..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <PageHeader icon={BarChart3} title="Result Analysis" />

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-4 py-3">Test</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Attempts</th>
              <th className="text-left px-4 py-3">Avg %</th>
              <th className="text-left px-4 py-3">Highest</th>
              <th className="text-left px-4 py-3">Lowest</th>
            </tr>
          </thead>
          <tbody>
            {data?.testAnalysis?.map((t) => (
              <tr key={t.testId} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium">{t.title}</td>
                <td className="px-4 py-3 text-gray-500">{t.category}</td>
                <td className="px-4 py-3">{t.attempts}</td>
                <td className="px-4 py-3">{t.avgPercentage}%</td>
                <td className="px-4 py-3 text-green-600">{t.highest}%</td>
                <td className="px-4 py-3 text-red-500">{t.lowest}%</td>
              </tr>
            ))}
            {(!data?.testAnalysis || data.testAnalysis.length === 0) && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">
                  No tests created yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="text-lg font-semibold mb-3">🏆 Top Performers</h2>
      <div className="space-y-2">
        {data?.topPerformers?.map((r, i) => (
          <div
            key={r._id}
            className="bg-white border border-gray-100 rounded-lg px-4 py-3 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">
                #{i + 1} {r.student?.name}
              </p>
              <p className="text-xs text-gray-400">{r.test?.title}</p>
            </div>
            <span className="text-primary-600 font-semibold">{r.percentage}%</span>
          </div>
        ))}
        {(!data?.topPerformers || data.topPerformers.length === 0) && (
          <p className="text-center text-gray-400 py-6">No test results yet</p>
        )}
      </div>
    </div>
  );
};

export default ResultAnalysis;
