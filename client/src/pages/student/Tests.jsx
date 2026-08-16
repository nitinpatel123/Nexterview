import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calculator, Code2, Brain, Cog, ClipboardList } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import * as testService from "../../services/testService";

const categoryIcons = {
  Aptitude: Calculator,
  Coding: Code2,
  Reasoning: Brain,
  Technical: Cog,
};

const categoryColors = {
  Aptitude: "bg-primary-50 text-primary-600",
  Coding: "bg-rose-50 text-rose-600",
  Reasoning: "bg-emerald-50 text-emerald-600",
  Technical: "bg-accent-50 text-accent-600",
};

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await testService.getTests();
        setTests(data);
      } catch {
        toast.error("Failed to load tests");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader text="Loading tests..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader icon={Brain} title="Aptitude & Coding Tests" subtitle="Sharpen your skills before placements" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tests.map((test, i) => {
          const Icon = categoryIcons[test.category] || ClipboardList;
          return (
            <motion.div
              key={test._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ y: -3 }}
            >
              <Link
                to={`/tests/${test._id}`}
                className="bg-white border border-gray-100 rounded-2xl shadow-card p-6 hover:shadow-md transition-shadow flex items-start gap-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${categoryColors[test.category] || "bg-gray-50 text-gray-600"}`}>
                  <Icon size={21} strokeWidth={2} />
                </div>
                <div>
                  <p className="font-semibold text-ink">{test.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {test.category} · {test.duration} mins · {test.totalMarks} marks
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
        {tests.length === 0 && (
          <p className="text-gray-400 text-sm col-span-2 text-center py-8">
            No tests available right now. Check back later!
          </p>
        )}
      </div>
    </div>
  );
};

export default Tests;
