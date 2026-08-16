import { useEffect, useState } from "react";
import { Users, Briefcase, Building2, ClipboardList, BarChart3, TrendingUp, Send, Award } from "lucide-react";
import Loader from "../../components/common/Loader";
import StatCard from "../../components/student/StatCard";
import ActionTile from "../../components/common/ActionTile";
import api from "../../services/api";

const quickLinks = [
  { title: "Manage Students", desc: "View & remove student accounts", to: "/admin/students", icon: Users, color: "primary" },
  { title: "Job Postings", desc: "Create & manage job listings", to: "/admin/jobs", icon: Briefcase, color: "accent" },
  { title: "Company Management", desc: "Add & manage companies", to: "/admin/companies", icon: Building2, color: "emerald" },
  { title: "Create Test", desc: "Build aptitude/coding tests", to: "/admin/create-test", icon: ClipboardList, color: "primary" },
  { title: "Result Analysis", desc: "Per-test stats & top performers", to: "/admin/result-analysis", icon: BarChart3, color: "rose" },
];

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get("/admin/analytics");
        setAnalytics(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <Loader text="Loading analytics..." />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <p className="text-primary-600 text-xs font-medium tracking-[0.2em] uppercase mb-1">Admin</p>
      <h1 className="font-display text-3xl font-semibold text-ink">Placement Overview</h1>
      <p className="text-gray-500 mt-1">Analytics across all students and jobs</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        <StatCard label="Total Students" value={analytics?.totalStudents || 0} accent="primary" icon={Users} delay={0} />
        <StatCard label="Active Jobs" value={analytics?.activeJobs || 0} accent="green" icon={Briefcase} delay={0.05} />
        <StatCard label="Total Applications" value={analytics?.totalApplications || 0} accent="orange" icon={Send} delay={0.1} />
        <StatCard label="Students Selected" value={analytics?.totalSelected || 0} accent="green" icon={Award} delay={0.15} />
        <StatCard label="Placement Rate" value={analytics?.placementRate || 0} suffix="%" accent="primary" icon={TrendingUp} delay={0.2} />
        <StatCard label="Avg ATS Score" value={analytics?.avgATSScore || 0} suffix="%" accent="orange" icon={BarChart3} delay={0.25} />
      </div>

      <h2 className="font-display text-lg font-semibold text-ink mt-10 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map((link, i) => (
          <ActionTile key={link.title} {...link} delay={i * 0.04} />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
