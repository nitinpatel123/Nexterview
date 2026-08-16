import { useState } from "react";
import { FileSearch } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import PageHeader from "../../components/common/PageHeader";
import * as aiService from "../../services/aiService";

const ResumeMatch = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleMatch = async () => {
    if (!jobDescription.trim()) return toast.error("Please paste a job description");
    setLoading(true);
    try {
      const data = await aiService.matchResumeToJD(jobDescription);
      setResult(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to match. Save your resume first.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor =
    result?.matchPercentage >= 70 ? "text-emerald-600" : result?.matchPercentage >= 40 ? "text-accent-600" : "text-rose-500";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PageHeader
        icon={FileSearch}
        title="Resume vs Job Description Match"
        subtitle="See how well your saved resume matches a specific job posting"
      />

      <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
        <textarea
          rows={7}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:outline-none text-sm"
          placeholder="Paste the job description here..."
        />
        <Button onClick={handleMatch} loading={loading} className="mt-3">
          Calculate Match
        </Button>

        {result && (
          <div className="border-t border-gray-100 mt-6 pt-5 space-y-4">
            <div className="text-center">
              <p className={`font-tabular text-5xl font-bold ${scoreColor}`}>{result.matchPercentage}%</p>
              <p className="text-sm text-gray-400 mt-1">Match Score</p>
            </div>
            <div>
              <p className="font-medium text-emerald-600 text-sm mb-1">Matching Skills</p>
              <div className="flex flex-wrap gap-2">
                {result.matchingSkills?.map((s, i) => (
                  <span key={i} className="bg-emerald-50 text-emerald-600 text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="font-medium text-rose-500 text-sm mb-1">Missing Skills</p>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills?.map((s, i) => (
                  <span key={i} className="bg-rose-50 text-rose-600 text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="font-medium text-primary-600 text-sm mb-1">Suggestions</p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                {result.suggestions?.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeMatch;
