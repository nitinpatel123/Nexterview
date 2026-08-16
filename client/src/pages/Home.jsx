import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText, Target, Mic, Brain, Map, BarChart3, Briefcase, FileSearch,
  MessageCircle, Linkedin, ArrowRight, Sparkles, CheckCircle2, Play,
  Zap, ShieldCheck, TrendingUp
} from "lucide-react";
import useAuth from "../hooks/useAuth";

const milestones = [
  { label: "Build", sub: "Resume & profile" },
  { label: "Prepare", sub: "Skills & tests" },
  { label: "Practice", sub: "AI interviews" },
  { label: "Get hired", sub: "Jobs & offers" },
];

const features = [
  { icon: FileText, title: "AI Resume Builder", desc: "Create a polished, ATS-ready resume in minutes.", tone: "violet" },
  { icon: Target, title: "ATS Intelligence", desc: "Find missing keywords and improve your match score.", tone: "blue" },
  { icon: Mic, title: "AI Mock Interviews", desc: "Practice realistic interviews with instant feedback.", tone: "pink" },
  { icon: Brain, title: "Tests & Coding", desc: "Sharpen aptitude and coding skills with real evaluation.", tone: "amber" },
  { icon: Map, title: "Career Roadmap", desc: "Follow a personalized path from skills to your target role.", tone: "emerald" },
  { icon: Briefcase, title: "Smart Job Matches", desc: "Discover opportunities ranked around your profile.", tone: "cyan" },
  { icon: FileSearch, title: "Resume vs JD", desc: "See exactly how strongly your resume matches a job.", tone: "indigo" },
  { icon: MessageCircle, title: "Career Copilot", desc: "Get 24×7 guidance for your next career decision.", tone: "fuchsia" },
  { icon: Linkedin, title: "LinkedIn Optimizer", desc: "Turn your profile into a stronger recruiter magnet.", tone: "sky" },
  { icon: BarChart3, title: "Progress Command Center", desc: "Track readiness, interview, ATS and skill progress.", tone: "orange" },
];

const stats = [
  ["01", "One workspace", "Everything you need for placement prep"],
  ["24/7", "AI guidance", "Always-on career support"],
  ["∞", "Practice", "Improve through repeatable feedback"],
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } }
};

const Home = () => {
  const { user } = useAuth();
  const dashboard = user?.role === "admin" ? "/admin/dashboard" : "/dashboard";

  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[calc(100vh-73px)] flex items-center hero-grid">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="orb orb-three" />
        </div>

        <div className="max-w-7xl w-full mx-auto px-6 lg:px-10 py-20 lg:py-28 relative z-10">
          <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-14 items-center">
            <motion.div initial="hidden" animate="show" variants={fadeUp}>
              <div className="eyebrow">
                <Sparkles size={14} />
                AI-powered career operating system
              </div>

              <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-display font-semibold leading-[0.98] tracking-tight">
                Your next role
                <span className="hero-gradient block">starts here.</span>
              </h1>

              <p className="mt-7 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                Nexterview brings your resume, skills, interviews, tests and job search
                into one intelligent journey — so every hour of preparation moves you closer
                to the offer.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link to={user ? dashboard : "/signup"} className="btn-primary group">
                  {user ? "Open dashboard" : "Start for free"}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to={user ? "/mock-interview" : "/login"} className="btn-secondary group">
                  <Play size={16} fill="currentColor" />
                  {user ? "Try AI interview" : "I already have an account"}
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500 dark:text-gray-400">
                {["ATS-ready", "AI feedback", "Progress tracking"].map((x) => (
                  <span key={x} className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-500" /> {x}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Product preview */}
            <motion.div
              initial={{ opacity: 0, scale: .94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: .8, delay: .12 }}
              className="relative"
            >
              <div className="product-window glass-card">
                <div className="window-bar">
                  <div className="flex gap-1.5"><i /><i /><i /></div>
                  <span>Nexterview / Command Center</span>
                  <div className="w-12" />
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-400">Your readiness</p>
                      <p className="text-3xl font-bold mt-1">78<span className="text-base text-gray-400">%</span></p>
                    </div>
                    <div className="readiness-ring"><span>+12%</span></div>
                  </div>
                  <div className="mini-chart">
                    {[42, 58, 49, 70, 63, 78, 86].map((h, i) => (
                      <motion.span
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: .6, delay: .25 + i * .07 }}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-5">
                    {[
                      ["ATS score", "91", "text-emerald-500"],
                      ["Interview", "84", "text-violet-500"],
                      ["Skills", "76", "text-blue-500"],
                      ["Applications", "24", "text-amber-500"]
                    ].map(([a,b,c]) => (
                      <div key={a} className="mini-stat">
                        <span>{a}</span><strong className={c}>{b}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/[.04] border border-gray-100 dark:border-white/10 flex gap-3 items-center">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 grid place-items-center"><TrendingUp size={17}/></div>
                    <div><p className="text-sm font-semibold">You're interview-ready</p><p className="text-xs text-gray-500">Next best action: 15 min mock interview</p></div>
                  </div>
                </div>
              </div>
              <div className="floating-card floating-one"><Zap size={16}/> AI feedback in seconds</div>
              <div className="floating-card floating-two"><ShieldCheck size={16}/> Career progress, organized</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trajectory */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="trajectory glass-card p-6 sm:p-8">
          <div className="grid sm:grid-cols-4 gap-5">
            {milestones.map((m, i) => (
              <motion.div key={m.label} initial="hidden" whileInView="show" viewport={{once:true}} variants={fadeUp}
                className="relative flex items-center gap-4 sm:block">
                <div className="step-dot">{i + 1}</div>
                <div><p className="font-semibold mt-0 sm:mt-3">{m.label}</p><p className="text-sm text-gray-500 mt-1">{m.sub}</p></div>
                {i < milestones.length - 1 && <div className="hidden sm:block absolute left-10 right-0 top-5 h-px bg-gradient-to-r from-primary-400/50 to-transparent" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={fadeUp} className="max-w-2xl">
          <div className="eyebrow">Everything connected</div>
          <h2 className="mt-4 text-4xl sm:text-5xl font-display">One platform. <span className="hero-gradient">Every advantage.</span></h2>
          <p className="mt-5 text-gray-600 dark:text-gray-400 text-lg">Designed to feel less like a portal and more like your personal career command center.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {features.map((f, i) => (
            <motion.div key={f.title} initial="hidden" whileInView="show" viewport={{once:true, margin:"-50px"}} variants={fadeUp}
              transition={{delay:i%3*.06}} className="feature-card group">
              <div className={`feature-icon tone-${f.tone}`}><f.icon size={21}/></div>
              <div className="mt-5 flex items-start justify-between gap-3">
                <div><h3 className="font-sans text-lg font-bold">{f.title}</h3><p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{f.desc}</p></div>
                <ArrowRight size={17} className="text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all shrink-0 mt-1"/>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats / CTA */}
      <section id="why" className="relative max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <div className="cta-panel overflow-hidden relative">
          <div className="absolute inset-0 cta-glow" />
          <div className="relative z-10 grid lg:grid-cols-[1fr_auto] gap-10 items-center p-8 sm:p-12">
            <div>
              <div className="eyebrow eyebrow-light"><Sparkles size={14}/> Built for ambitious candidates</div>
              <h2 className="mt-5 text-4xl sm:text-5xl font-display text-white">Stop guessing. Start preparing with a system.</h2>
              <p className="mt-4 text-white/65 max-w-xl">Know what to fix, practice what matters, and see your progress compound.</p>
            </div>
            <Link to={user ? dashboard : "/signup"} className="btn-light group whitespace-nowrap">
              {user ? "Go to Nexterview" : "Build my career plan"}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          {stats.map(([n,t,d]) => <div key={t} className="stat-strip"><strong>{n}</strong><div><b>{t}</b><span>{d}</span></div></div>)}
        </div>
      </section>
    </main>
  );
};

export default Home;
