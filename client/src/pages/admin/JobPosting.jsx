import { useState, useEffect } from "react";
import { Briefcase } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import api from "../../services/api";
import * as companyService from "../../services/companyService";

const emptyJob = {
  title: "",
  company: "",
  description: "",
  requiredSkills: "",
  location: "",
  jobType: "Full-time",
};

const JobPosting = () => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState(emptyJob);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get("/jobs");
      setJobs(data.data);
    } catch (err) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const data = await companyService.getCompanies();
      setCompanies(data);
    } catch {
      // non-critical — just won't show suggestions
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      const payload = {
        ...form,
        requiredSkills: form.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
      };
      await api.post("/jobs", payload);
      toast.success("Job posted successfully!");
      setForm(emptyJob);
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job posting?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      toast.success("Job deleted");
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch {
      toast.error("Failed to delete job");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader icon={Briefcase} title="Job Postings" />
      <p className="text-sm text-gray-500 -mt-4 mb-6">
        Tip: add companies in <a href="/admin/companies" className="text-primary-600 hover:underline">Company Management</a> first so they show up as suggestions here.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-4 mb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            required
            placeholder="Job Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
          <input
            required
            list="company-options"
            placeholder="Company (pick existing or type new)"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
          <datalist id="company-options">
            {companies.map((c) => (
              <option key={c._id} value={c.name} />
            ))}
          </datalist>
        </div>
        <textarea
          required
          rows={3}
          placeholder="Job Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
        />
        <input
          placeholder="Required Skills (comma separated)"
          value={form.requiredSkills}
          onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
          <select
            value={form.jobType}
            onChange={(e) => setForm({ ...form, jobType: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
          >
            <option>Full-time</option>
            <option>Internship</option>
            <option>Part-time</option>
          </select>
        </div>
        <Button type="submit" loading={posting}>Post Job</Button>
      </form>

      {loading ? (
        <Loader text="Loading jobs..." />
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex justify-between items-start"
            >
              <div>
                <p className="font-semibold">{job.title} — {job.company}</p>
                <p className="text-sm text-gray-500">{job.location} · {job.jobType}</p>
                <p className="text-sm text-gray-400 mt-1">{job.applicants?.length || 0} applicants</p>
              </div>
              <button
                onClick={() => handleDelete(job._id)}
                className="text-red-500 hover:text-red-600 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          ))}
          {jobs.length === 0 && <p className="text-center text-gray-400 py-6">No jobs posted yet</p>}
        </div>
      )}
    </div>
  );
};

export default JobPosting;
