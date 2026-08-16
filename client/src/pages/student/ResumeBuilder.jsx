import { useState, useEffect } from "react";
import { GraduationCap, Briefcase, Rocket, Target } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import * as resumeService from "../../services/resumeService";
import * as aiService from "../../services/aiService";

const emptyResume = {
  fullName: "",
  email: "",
  phone: "",
  summary: "",
  skills: [],
  education: [],
  experience: [],
  projects: [],
  certifications: [],
};

const emptyEducation = { degree: "", institution: "", year: "", score: "" };
const emptyExperience = { role: "", company: "", duration: "", description: "" };
const emptyProject = { title: "", description: "", techStack: [], link: "" };

const ResumeBuilder = () => {
  const [resume, setResume] = useState(emptyResume);
  const [skillsInput, setSkillsInput] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const data = await resumeService.getMyResume();
        setResume({ ...emptyResume, ...data });
        setSkillsInput(data.skills?.join(", ") || "");
      } catch {
        // no resume yet — that's fine, start fresh
      } finally {
        setLoading(false);
      }
    };
    loadResume();
  }, []);

  // ---------- Education handlers ----------
  const addEducation = () => setResume({ ...resume, education: [...resume.education, { ...emptyEducation }] });
  const updateEducation = (idx, field, value) => {
    const updated = [...resume.education];
    updated[idx][field] = value;
    setResume({ ...resume, education: updated });
  };
  const removeEducation = (idx) =>
    setResume({ ...resume, education: resume.education.filter((_, i) => i !== idx) });

  // ---------- Experience handlers ----------
  const addExperience = () => setResume({ ...resume, experience: [...resume.experience, { ...emptyExperience }] });
  const updateExperience = (idx, field, value) => {
    const updated = [...resume.experience];
    updated[idx][field] = value;
    setResume({ ...resume, experience: updated });
  };
  const removeExperience = (idx) =>
    setResume({ ...resume, experience: resume.experience.filter((_, i) => i !== idx) });

  // ---------- Projects handlers ----------
  const addProject = () => setResume({ ...resume, projects: [...resume.projects, { ...emptyProject, techStack: [] }] });
  const updateProject = (idx, field, value) => {
    const updated = [...resume.projects];
    updated[idx][field] = value;
    setResume({ ...resume, projects: updated });
  };
  const updateProjectTech = (idx, value) => {
    const updated = [...resume.projects];
    updated[idx].techStack = value.split(",").map((s) => s.trim()).filter(Boolean);
    setResume({ ...resume, projects: updated });
  };
  const removeProject = (idx) =>
    setResume({ ...resume, projects: resume.projects.filter((_, i) => i !== idx) });

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...resume,
        skills: skillsInput.split(",").map((s) => s.trim()).filter(Boolean),
      };
      const saved = await resumeService.saveResume(payload);
      setResume({ ...emptyResume, ...saved });
      toast.success("Resume saved!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await aiService.analyzeResume(targetRole);
      setAnalysis(result);
      toast.success("AI analysis complete!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Analysis failed. Save your resume first.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDownload = async () => {
    try {
      await resumeService.downloadResumePDF();
    } catch {
      toast.error("Failed to download. Save your resume first.");
    }
  };

  if (loading) return <Loader text="Loading your resume..." />;

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader icon={Target} title="Resume Builder" subtitle="Build your resume and get instant AI-powered ATS feedback" />

      {/* Basic Info */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Basic Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              value={resume.fullName}
              onChange={(e) => setResume({ ...resume, fullName: e.target.value })}
              className={`mt-1 ${inputClass}`}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input
              value={resume.phone}
              onChange={(e) => setResume({ ...resume, phone: e.target.value })}
              className={`mt-1 ${inputClass}`}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            value={resume.email}
            onChange={(e) => setResume({ ...resume, email: e.target.value })}
            className={`mt-1 ${inputClass}`}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Professional Summary</label>
          <textarea
            rows={3}
            value={resume.summary}
            onChange={(e) => setResume({ ...resume, summary: e.target.value })}
            className={`mt-1 ${inputClass}`}
            placeholder="2-3 lines about yourself..."
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Skills (comma separated)</label>
          <input
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            className={`mt-1 ${inputClass}`}
            placeholder="React, Node.js, MongoDB, Python"
          />
        </div>
      </div>

      {/* Education */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mt-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2"><GraduationCap size={17} className="text-primary-500" /> Education</h2>
          <button type="button" onClick={addEducation} className="text-primary-600 text-sm font-medium">
            + Add
          </button>
        </div>
        {resume.education.map((edu, idx) => (
          <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-3 border border-gray-100 rounded-lg p-3 relative">
            <button
              type="button"
              onClick={() => removeEducation(idx)}
              className="absolute top-2 right-2 text-red-400 text-xs hover:text-red-600"
            >
              ✕
            </button>
            <input
              placeholder="Degree (e.g. B.Tech CSE)"
              value={edu.degree}
              onChange={(e) => updateEducation(idx, "degree", e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) => updateEducation(idx, "institution", e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="Year (e.g. 2022-2026)"
              value={edu.year}
              onChange={(e) => updateEducation(idx, "year", e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="Score / CGPA"
              value={edu.score}
              onChange={(e) => updateEducation(idx, "score", e.target.value)}
              className={inputClass}
            />
          </div>
        ))}
        {resume.education.length === 0 && (
          <p className="text-sm text-gray-400">No education added yet. Click "+ Add" to add one.</p>
        )}
      </div>

      {/* Experience */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mt-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2"><Briefcase size={17} className="text-primary-500" /> Experience</h2>
          <button type="button" onClick={addExperience} className="text-primary-600 text-sm font-medium">
            + Add
          </button>
        </div>
        {resume.experience.map((exp, idx) => (
          <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-3 border border-gray-100 rounded-lg p-3 relative">
            <button
              type="button"
              onClick={() => removeExperience(idx)}
              className="absolute top-2 right-2 text-red-400 text-xs hover:text-red-600"
            >
              ✕
            </button>
            <input
              placeholder="Role (e.g. Frontend Intern)"
              value={exp.role}
              onChange={(e) => updateExperience(idx, "role", e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="Company"
              value={exp.company}
              onChange={(e) => updateExperience(idx, "company", e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="Duration (e.g. Jun 2025 - Aug 2025)"
              value={exp.duration}
              onChange={(e) => updateExperience(idx, "duration", e.target.value)}
              className={`col-span-2 ${inputClass}`}
            />
            <textarea
              rows={2}
              placeholder="What did you do?"
              value={exp.description}
              onChange={(e) => updateExperience(idx, "description", e.target.value)}
              className={`col-span-2 ${inputClass}`}
            />
          </div>
        ))}
        {resume.experience.length === 0 && (
          <p className="text-sm text-gray-400">No experience added yet — that's okay if you're a fresher!</p>
        )}
      </div>

      {/* Projects */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mt-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2"><Rocket size={17} className="text-primary-500" /> Projects</h2>
          <button type="button" onClick={addProject} className="text-primary-600 text-sm font-medium">
            + Add
          </button>
        </div>
        {resume.projects.map((proj, idx) => (
          <div key={idx} className="grid grid-cols-1 gap-3 border border-gray-100 rounded-lg p-3 relative">
            <button
              type="button"
              onClick={() => removeProject(idx)}
              className="absolute top-2 right-2 text-red-400 text-xs hover:text-red-600"
            >
              ✕
            </button>
            <input
              placeholder="Project Title"
              value={proj.title}
              onChange={(e) => updateProject(idx, "title", e.target.value)}
              className={inputClass}
            />
            <textarea
              rows={2}
              placeholder="Brief description"
              value={proj.description}
              onChange={(e) => updateProject(idx, "description", e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="Tech Stack (comma separated)"
              value={proj.techStack?.join(", ") || ""}
              onChange={(e) => updateProjectTech(idx, e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="Project Link (GitHub/Live demo)"
              value={proj.link}
              onChange={(e) => updateProject(idx, "link", e.target.value)}
              className={inputClass}
            />
          </div>
        ))}
        {resume.projects.length === 0 && (
          <p className="text-sm text-gray-400">No projects added yet. Add your BazaarAI, chat app, etc.!</p>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <Button onClick={handleSave} loading={saving}>Save Resume</Button>
        <Button onClick={handleDownload} variant="outline">Download PDF</Button>
      </div>

      {/* AI ATS Analysis Section */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mt-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Target size={18} className="text-primary-500" /> AI ATS Score Analysis</h2>
        <div className="flex gap-3 mb-4">
          <input
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            placeholder="Target role e.g. Frontend Developer"
          />
          <Button onClick={handleAnalyze} loading={analyzing}>Analyze with AI</Button>
        </div>

        {analysis && (
          <div className="space-y-3 border-t pt-4">
            <p className="text-3xl font-bold text-primary-600">{analysis.atsScore}/100</p>
            <div>
              <p className="font-medium text-green-600 text-sm">Strengths</p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                {analysis.strengths?.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div>
              <p className="font-medium text-red-500 text-sm">Weaknesses</p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                {analysis.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
            <div>
              <p className="font-medium text-orange-500 text-sm">Suggestions</p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                {analysis.suggestions?.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
