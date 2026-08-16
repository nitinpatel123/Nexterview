import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Radar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Target,
  TrendingUp,
  ListChecks,
  Award,
  FileText,
  Mic,
  Puzzle,
  Map,
  Brain,
  Mail,
  Linkedin,
  UserCircle,
  MessageCircle,
  Briefcase,
  FileSearch,
  Code2,
  UserCheck,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import StatCard from "../../components/student/StatCard";
import ActionTile from "../../components/common/ActionTile";
import { SkeletonStatCard, SkeletonChart } from "../../components/common/Skeleton";
import * as studentService from "../../services/studentService";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const quickLinks = [
  { title: "Resume Builder", desc: "Build & download your resume", to: "/resume-builder", icon: FileText, color: "primary" },
  { title: "ATS Resume Checker", desc: "Upload a PDF & get instant ATS score", to: "/ats-checker", icon: Target, color: "rose" },
  { title: "Mock Interview", desc: "Practice with AI interviewer", to: "/mock-interview", icon: Mic, color: "accent" },
  { title: "Skill Gap Analysis", desc: "Find missing skills for your role", to: "/skill-gap", icon: Puzzle, color: "emerald" },
  { title: "Career Roadmap", desc: "Your personalized learning path", to: "/career-roadmap", icon: Map, color: "primary" },
  { title: "Aptitude & Coding Tests", desc: "Sharpen your skills", to: "/tests", icon: Brain, color: "rose" },
  { title: "Job Recommendations", desc: "Jobs matched to your skills", to: "/job-recommendations", icon: Briefcase, color: "emerald" },
  { title: "Resume vs JD Match", desc: "Check match % against a job", to: "/resume-match", icon: FileSearch, color: "accent" },
  { title: "Cover Letter Generator", desc: "AI-written cover letters", to: "/cover-letter", icon: Mail, color: "primary" },
  { title: "LinkedIn Tips", desc: "Improve your LinkedIn profile", to: "/linkedin-tips", icon: Linkedin, color: "rose" },
  { title: "Career Chatbot", desc: "24×7 AI career guidance", to: "/career-chat", icon: MessageCircle, color: "emerald" },
  { title: "My Profile", desc: "Edit profile & certificates", to: "/profile", icon: UserCircle, color: "accent" },
];

const motivationLines = [
  "Every application is one step closer to your offer letter.",
  "Small daily progress adds up to big placement results.",
  "Your next mock interview could be the one that counts.",
  "Consistency beats intensity — keep showing up.",
  "The best time to sharpen your skills is right now.",
];

// Sample data shown when the student has no real activity yet, so the
// dashboard never looks broken/empty on first login.
const sampleSkillGraph = {
  labels: ["Aptitude", "Reasoning", "Coding"],
  data: [62, 58, 70],
};
const sampleWeeklyProgress = {
  labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4"],
  data: [40, 52, 61, 68],
};

const Dashboard = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [motivation] = useState(
    motivationLines[Math.floor(Math.random() * motivationLines.length)]
  );
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");

    const loadSummary = async () => {
      try {
        const data = await studentService.getDashboardSummary();
        setSummary(data);
      } catch {
        // fine — just show defaults
      } finally {
        setLoading(false);
      }
    };
    loadSummary();
  }, []);

  const hasSkillData = summary?.skillGraph?.length > 0;
  const hasWeeklyData = summary?.weeklyProgress?.length > 0;

  const skillGraphData = {
    labels: hasSkillData ? summary.skillGraph.map((s) => s.category) : sampleSkillGraph.labels,
    datasets: [
      {
        label: hasSkillData ? "Your Score" : "Sample",
        data: hasSkillData ? summary.skillGraph.map((s) => s.score) : sampleSkillGraph.data,
        backgroundColor: "rgba(59, 63, 158, 0.15)",
        borderColor: "rgba(59, 63, 158, 1)",
        pointBackgroundColor: "rgba(59, 63, 158, 1)",
      },
    ],
  };

  const weeklyProgressData = {
    labels: hasWeeklyData ? summary.weeklyProgress.map((w) => w.week) : sampleWeeklyProgress.labels,
    datasets: [
      {
        label: hasWeeklyData ? "Weekly Avg Score (%)" : "Sample trend",
        data: hasWeeklyData ? summary.weeklyProgress.map((w) => w.score) : sampleWeeklyProgress.data,
        borderColor: "rgba(59, 63, 158, 1)",
        backgroundColor: "rgba(59, 63, 158, 0.08)",
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero / welcome section */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center gap-4 bg-gradient-to-r from-primary-800 to-primary-600 rounded-2xl px-6 py-6 text-white mb-8"
      >
        <span className="w-14 h-14 rounded-full bg-white/15 border-2 border-white/30 text-lg font-semibold flex items-center justify-center shrink-0">
          {initials}
        </span>
        <div>
          <p className="text-primary-100 text-xs font-medium tracking-[0.15em] uppercase">{greeting}</p>
          <h1 className="font-display text-2xl font-semibold text-white">Welcome back, {user?.name?.split(" ")[0]}</h1>
          <p className="text-primary-100 text-sm mt-1">{motivation}</p>
        </div>
      </motion.div>

      {loading ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <SkeletonStatCard key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <SkeletonChart />
            <SkeletonChart />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="ATS Score" value={summary?.atsScore || 0} suffix="%" accent="primary" icon={Target} delay={0} />
            <StatCard
              label="Placement Readiness"
              value={summary?.placementReadinessScore || 0}
              suffix="%"
              accent="green"
              icon={TrendingUp}
              delay={0.05}
            />
            <StatCard label="Tests Attempted" value={summary?.testsAttempted || 0} accent="orange" icon={ListChecks} delay={0.1} />
            <StatCard label="Certificates" value={summary?.certificatesCount || 0} accent="primary" icon={Award} delay={0.15} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <StatCard label="Interview Score" value={summary?.interviewScore || 0} suffix="%" accent="orange" icon={Mic} delay={0.2} />
            <StatCard label="Coding Progress" value={summary?.codingProgress || 0} suffix="%" accent="green" icon={Code2} delay={0.25} />
            <StatCard label="Profile Completion" value={summary?.profileCompletion || 0} suffix="%" accent="primary" icon={UserCheck} delay={0.3} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-ink">Skill Graph</p>
                {!hasSkillData && (
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Sample data</span>
                )}
              </div>
              <div className="h-64">
                <Radar
                  data={skillGraphData}
                  options={{
                    maintainAspectRatio: false,
                    scales: { r: { min: 0, max: 100, ticks: { stepSize: 25 } } },
                    plugins: { legend: { labels: { boxWidth: 12, font: { size: 11 } } } },
                  }}
                />
              </div>
              {!hasSkillData && (
                <p className="text-xs text-gray-400 text-center mt-2">Attempt a test to replace this with your data</p>
              )}
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-ink">Weekly Progress</p>
                {!hasWeeklyData && (
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Sample data</span>
                )}
              </div>
              <div className="h-64">
                <Line
                  data={weeklyProgressData}
                  options={{
                    maintainAspectRatio: false,
                    scales: { y: { min: 0, max: 100 } },
                    plugins: { legend: { labels: { boxWidth: 12, font: { size: 11 } } } },
                  }}
                />
              </div>
              {!hasWeeklyData && (
                <p className="text-xs text-gray-400 text-center mt-2">Your real trend appears after a few test attempts</p>
              )}
            </div>
          </div>
        </>
      )}

      <h2 className="font-display text-lg font-semibold text-ink mt-10 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map((link, i) => (
          <ActionTile key={link.title} {...link} delay={i * 0.04} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
