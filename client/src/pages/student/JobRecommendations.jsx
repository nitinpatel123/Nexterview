import { useEffect, useState } from "react";
import { Briefcase, MapPin, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import * as jobService from "../../services/jobService";

const matchColor = (pct) => {
  if (pct >= 70) return "text-emerald-600 bg-emerald-50";
  if (pct >= 40) return "text-accent-600 bg-accent-50";
  return "text-gray-500 bg-gray-100";
};

const JobRecommendations = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState({});

  const load = async () => {
    try {
      const data = await jobService.getRecommendedJobs();
      setJobs(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleApply = async (jobId) => {
    setApplying({ ...applying, [jobId]: true });
    try {
      await jobService.applyToJob(jobId);
      toast.success("Applied successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying({ ...applying, [jobId]: false });
    }
  };

  if (loading) return <Loader text="Finding jobs that match your skills..." />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PageHeader
        icon={Briefcase}
        title="Job Recommendations"
        subtitle="Ranked by how well your skills match each job's requirements"
      />

      {jobs.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-10">
          No active job postings right now. Check back later!
        </p>
      )}

      <div className="space-y-4">
        {jobs.map((item, i) => (
          <motion.div
            key={item.job._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="bg-white border border-gray-100 rounded-2xl shadow-card p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-ink">{item.job.title}</p>
                <p className="text-sm text-gray-500">{item.job.company}</p>
                {item.job.location && (
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {item.job.location}
                  </p>
                )}
              </div>
              <span className={`font-tabular text-sm font-semibold px-3 py-1 rounded-full shrink-0 ${matchColor(item.matchPercentage)}`}>
                {item.matchPercentage}% match
              </span>
            </div>

            {item.matchedSkills?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {item.matchedSkills.map((s, idx) => (
                  <span key={idx} className="text-xs bg-primary-50 text-primary-600 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={11} /> {s}
                  </span>
                ))}
              </div>
            )}

            <p className="text-sm text-gray-500 mt-3 line-clamp-2">{item.job.description}</p>

            <Button
              onClick={() => handleApply(item.job._id)}
              loading={applying[item.job._id]}
              variant="outline"
              className="mt-4 text-xs px-4 py-1.5"
            >
              Apply Now
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default JobRecommendations;
