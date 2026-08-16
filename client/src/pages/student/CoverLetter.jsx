import { Mail } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import * as aiService from "../../services/aiService";

const CoverLetter = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) return toast.error("Please paste a job description");
    setLoading(true);
    try {
      const result = await aiService.generateCoverLetter(jobDescription);
      setLetter(result.coverLetter);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate cover letter");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PageHeader icon={Mail} title="AI Cover Letter Generator" subtitle="Paste a job description and get a tailored cover letter" />

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
        <textarea
          rows={6}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
          placeholder="Paste the job description here..."
        />
        <Button onClick={handleGenerate} loading={loading} className="mt-3">
          Generate Cover Letter
        </Button>

        {letter && (
          <div className="mt-6 border-t pt-4">
            <div className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap text-gray-700">
              {letter}
            </div>
            <Button onClick={handleCopy} variant="outline" className="mt-3">
              Copy to Clipboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverLetter;
