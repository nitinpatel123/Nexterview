import { Linkedin } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import * as aiService from "../../services/aiService";

const LinkedInTips = () => {
  const [headline, setHeadline] = useState("");
  const [about, setAbout] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!headline.trim() && !about.trim()) {
      return toast.error("Please fill at least your headline or about section");
    }
    setLoading(true);
    try {
      const data = await aiService.getLinkedInSuggestions(headline, about);
      setResult(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate suggestions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PageHeader icon={Linkedin} title="LinkedIn Profile Suggestions" subtitle="Get AI feedback to make your profile recruiter-ready" />

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Current Headline</label>
          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            placeholder="e.g. Computer Science Student at XYZ University"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Current About Section</label>
          <textarea
            rows={4}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>
        <Button onClick={handleAnalyze} loading={loading}>Get Suggestions</Button>

        {result && (
          <div className="border-t pt-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-primary-600">Improved Headline</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 mt-1">{result.improvedHeadline}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-primary-600">Improved About</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 mt-1 whitespace-pre-wrap">
                {result.improvedAbout}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-primary-600 mb-1">Skills to Add</p>
              <div className="flex flex-wrap gap-2">
                {result.suggestedSkillsToAdd?.map((s, i) => (
                  <span key={i} className="bg-primary-50 text-primary-600 text-xs px-3 py-1 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkedInTips;
