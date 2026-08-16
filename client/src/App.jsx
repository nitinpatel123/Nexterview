import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Student pages
import Dashboard from "./pages/student/Dashboard";
import Profile from "./pages/student/Profile";
import ResumeBuilder from "./pages/student/ResumeBuilder";
import MockInterview from "./pages/student/MockInterview";
import SkillGap from "./pages/student/SkillGap";
import CareerRoadmap from "./pages/student/CareerRoadmap";
import CoverLetter from "./pages/student/CoverLetter";
import LinkedInTips from "./pages/student/LinkedInTips";
import Tests from "./pages/student/Tests";
import TakeTest from "./pages/student/TakeTest";
import ATSChecker from "./pages/student/ATSChecker";
import JobRecommendations from "./pages/student/JobRecommendations";
import ResumeMatch from "./pages/student/ResumeMatch";
import CareerChat from "./pages/student/CareerChat";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageStudents from "./pages/admin/ManageStudents";
import JobPosting from "./pages/admin/JobPosting";
import CompanyManagement from "./pages/admin/CompanyManagement";
import CreateTest from "./pages/admin/CreateTest";
import ResultAnalysis from "./pages/admin/ResultAnalysis";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f7f7fb] dark:bg-[#080a14] text-ink dark:text-white">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Student Routes */}
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["student"]}><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={["student"]}><Profile /></ProtectedRoute>} />
        <Route path="/resume-builder" element={<ProtectedRoute allowedRoles={["student"]}><ResumeBuilder /></ProtectedRoute>} />
        <Route path="/mock-interview" element={<ProtectedRoute allowedRoles={["student"]}><MockInterview /></ProtectedRoute>} />
        <Route path="/skill-gap" element={<ProtectedRoute allowedRoles={["student"]}><SkillGap /></ProtectedRoute>} />
        <Route path="/career-roadmap" element={<ProtectedRoute allowedRoles={["student"]}><CareerRoadmap /></ProtectedRoute>} />
        <Route path="/cover-letter" element={<ProtectedRoute allowedRoles={["student"]}><CoverLetter /></ProtectedRoute>} />
        <Route path="/linkedin-tips" element={<ProtectedRoute allowedRoles={["student"]}><LinkedInTips /></ProtectedRoute>} />
        <Route path="/tests" element={<ProtectedRoute allowedRoles={["student"]}><Tests /></ProtectedRoute>} />
        <Route path="/tests/:id" element={<ProtectedRoute allowedRoles={["student"]}><TakeTest /></ProtectedRoute>} />
        <Route path="/ats-checker" element={<ProtectedRoute allowedRoles={["student"]}><ATSChecker /></ProtectedRoute>} />
        <Route path="/job-recommendations" element={<ProtectedRoute allowedRoles={["student"]}><JobRecommendations /></ProtectedRoute>} />
        <Route path="/resume-match" element={<ProtectedRoute allowedRoles={["student"]}><ResumeMatch /></ProtectedRoute>} />
        <Route path="/career-chat" element={<ProtectedRoute allowedRoles={["student"]}><CareerChat /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute allowedRoles={["admin"]}><ManageStudents /></ProtectedRoute>} />
        <Route path="/admin/jobs" element={<ProtectedRoute allowedRoles={["admin"]}><JobPosting /></ProtectedRoute>} />
        <Route path="/admin/companies" element={<ProtectedRoute allowedRoles={["admin"]}><CompanyManagement /></ProtectedRoute>} />
        <Route path="/admin/create-test" element={<ProtectedRoute allowedRoles={["admin"]}><CreateTest /></ProtectedRoute>} />
        <Route path="/admin/result-analysis" element={<ProtectedRoute allowedRoles={["admin"]}><ResultAnalysis /></ProtectedRoute>} />

        <Route path="*" element={<div className="text-center py-20">404 - Page Not Found</div>} />
      </Routes>
        </motion.div>
      </AnimatePresence>
      <footer className="border-t border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-[#080a14]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-7 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200"><span className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white grid place-items-center text-[10px]">N</span>Nexterview AI</div>
          <span>Prepare smarter. Interview stronger. Get hired.</span>
          <span>© {new Date().getFullYear()} Nexterview</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
