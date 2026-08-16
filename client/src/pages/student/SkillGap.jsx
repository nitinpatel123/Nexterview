import { Puzzle } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import * as aiService from "../../services/aiService";

const SkillGap = () => {
  const [targetRole, setTargetRole] = useState("Full Stack Developer");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const data = await aiService.skillGap(targetRole);
      setResult(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PageHeader
        icon={Puzzle}
        title="AI Skill Gap Analysis"
        subtitle="Find out what skills you're missing for your dream role"
      />

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
        <div className="flex gap-3 mb-4">
          <input
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            placeholder="e.g. Backend Developer"
          />
          <Button onClick={handleAnalyze} loading={loading}>Analyze</Button>
        </div>

        {result && (
          <div className="space-y-4 border-t pt-4">
            <div>
              <p className="font-medium text-red-500 text-sm mb-1">Missing Skills</p>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills?.map((s, i) => (
                  <span key={i} className="bg-red-50 text-red-600 text-xs px-3 py-1 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="font-medium text-primary-600 text-sm mb-1">Recommended Courses</p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                {result.recommendedCourses?.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
            <div>
              <p className="font-medium text-orange-500 text-sm mb-1">Priority Order to Learn</p>
              <ol className="text-sm text-gray-600 list-decimal list-inside">
                {result.priorityOrder?.map((p, i) => <li key={i}>{p}</li>)}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillGap;
