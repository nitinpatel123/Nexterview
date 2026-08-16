import { Map } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import * as aiService from "../../services/aiService";

const CareerRoadmap = () => {
  const [targetRole, setTargetRole] = useState("Full Stack Developer");
  const [experienceLevel, setExperienceLevel] = useState("beginner");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await aiService.careerRoadmap(targetRole, experienceLevel);
      setResult(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PageHeader icon={Map} title="AI Career Roadmap" subtitle="Get a personalized, phase-wise learning path" />

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <input
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            placeholder="Target role"
          />
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <Button onClick={handleGenerate} loading={loading} fullWidth>
          Generate Roadmap
        </Button>

        {result && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-gray-500">
              Estimated duration: <strong>{result.estimatedTotalDuration}</strong>
            </p>
            <div className="relative border-l-2 border-primary-200 pl-6 space-y-6">
              {result.roadmap?.map((phase, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-primary-500" />
                  <p className="font-semibold">{phase.phase}</p>
                  <p className="text-xs text-gray-400 mb-1">{phase.duration}</p>
                  <div className="flex flex-wrap gap-2">
                    {phase.topics?.map((t, j) => (
                      <span key={j} className="bg-primary-50 text-primary-600 text-xs px-3 py-1 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerRoadmap;
