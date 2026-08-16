import { useState } from "react";
import { Target, Upload } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import PageHeader from "../../components/common/PageHeader";
import * as aiService from "../../services/aiService";

const ATSChecker = () => {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && f.type !== "application/pdf") {
      return toast.error("Please upload a PDF file");
    }
    setFile(f);
  };

  const handleAnalyze = async () => {
    if (!file) return toast.error("Please upload your resume PDF first");
    setAnalyzing(true);
    try {
      const data = await aiService.checkResumeATS(file, targetRole);
      setResult(data);
      toast.success("Analysis complete!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PageHeader
        icon={Target}
        title="ATS Resume Checker"
        subtitle="Upload any resume PDF and get an instant ATS score — no need to use the Resume Builder"
      />

      <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
        <label className="block border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-primary-300 transition-colors">
          <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
          <Upload size={28} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            {file ? file.name : "Click to upload your resume (PDF only, max 5MB)"}
          </p>
        </label>

        <div className="flex gap-3 mt-4">
          <input
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:outline-none text-sm"
            placeholder="Target role e.g. Frontend Developer"
          />
          <Button onClick={handleAnalyze} loading={analyzing}>Check ATS Score</Button>
        </div>

        {result && (
          <div className="space-y-4 border-t border-gray-100 mt-6 pt-5">
            <p className="font-tabular text-4xl font-bold text-primary-600">{result.atsScore}/100</p>
            <div>
              <p className="font-medium text-emerald-600 text-sm">Strengths</p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                {result.strengths?.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div>
              <p className="font-medium text-rose-500 text-sm">Weaknesses</p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                {result.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
            <div>
              <p className="font-medium text-accent-600 text-sm">Suggestions</p>
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

export default ATSChecker;
