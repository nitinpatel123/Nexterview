import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, LockKeyhole, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import PasswordInput from "../../components/common/PasswordInput";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const data = await login(form); toast.success("Welcome back to Nexterview!"); navigate(data.role === "admin" ? "/admin/dashboard" : "/dashboard"); }
    catch (err) { toast.error(err.response?.data?.message || "Login failed"); }
    finally { setLoading(false); }
  };
  return <div className="app-bg flex items-center px-4 py-12">
    <div className="max-w-6xl w-full mx-auto grid lg:grid-cols-2 gap-8 items-stretch">
      <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} className="hidden lg:flex premium-card p-10 flex-col justify-between overflow-hidden relative">
        <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-indigo-500/15 blur-2xl" />
        <div><div className="eyebrow"><Sparkles size={14}/> Nexterview AI</div><h1 className="mt-6 text-5xl font-display font-extrabold leading-tight">Your career journey,<span className="hero-gradient block">one smart step at a time.</span></h1><p className="mt-5 text-gray-500 leading-relaxed max-w-md">Resume intelligence, AI interviews, skill gaps, tests and job matching — all connected in one command center.</p></div>
        <div className="grid grid-cols-2 gap-3 mt-10">{["AI interview feedback","ATS-ready resumes","Personalized roadmap","Job match insights"].map(x=><div key={x} className="rounded-2xl border border-gray-100 bg-white/70 p-4 text-sm font-semibold"><CheckCircle2 size={16} className="text-emerald-500 mb-2"/>{x}</div>)}</div>
      </motion.div>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="premium-card p-7 sm:p-10">
        <div className="flex items-center gap-3 mb-8"><div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white grid place-items-center shadow-lg shadow-indigo-500/20"><LockKeyhole size={19}/></div><div><p className="font-display font-extrabold text-xl">Welcome back</p><p className="text-xs text-gray-500">Continue your interview journey</p></div></div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block"><span className="text-xs font-bold text-gray-600">Email</span><input className="premium-input mt-2" type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" /></label>
          <label className="block"><div className="flex justify-between"><span className="text-xs font-bold text-gray-600">Password</span><Link to="/forgot-password" className="text-xs font-bold text-indigo-600">Forgot password?</Link></div><PasswordInput className="premium-input mt-2" name="password" required value={form.password} onChange={handleChange} placeholder="••••••••" /></label>
          <button disabled={loading} className="btn-primary w-full disabled:opacity-50">{loading ? "Signing in…" : "Sign in to Nexterview"}<ArrowRight size={17}/></button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-7">New here? <Link to="/signup" className="font-bold text-indigo-600">Create your free account</Link></p>
      </motion.div>
    </div>
  </div>;
};
export default Login;
