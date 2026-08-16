import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, ChevronDown, User, LogOut, LayoutDashboard, Sparkles, Menu, X } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(); setDropdownOpen(false); setMobileOpen(false); navigate("/login");
  };
  const initials = user?.name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const dashboard = user?.role === "admin" ? "/admin/dashboard" : "/dashboard";
  const onHome = location.pathname === "/";

  return (
    <nav className="sticky top-0 z-50 px-4 sm:px-6 pt-3">
      <div className="max-w-7xl mx-auto h-[58px] rounded-2xl border border-white/70 dark:border-white/10 bg-white/80 dark:bg-[#0b0d1b]/80 backdrop-blur-2xl shadow-[0_12px_40px_-24px_rgba(20,25,80,.4)] flex items-center justify-between px-3 sm:px-4">
        <Link to="/" className="flex items-center gap-2.5 group px-2">
          <span className="relative w-8 h-8 rounded-[10px] bg-gradient-to-br from-indigo-500 to-violet-600 text-white grid place-items-center shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-transform">
            <Sparkles size={15} />
          </span>
          <span className="font-display text-[17px] font-extrabold tracking-tight text-ink">
            Nexterview <span className="brand-ai">AI</span>
          </span>
        </Link>

        {onHome && !user && (
          <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-gray-500 dark:text-gray-400">
            <a href="#features" className="hover:text-primary-600">Platform</a>
            <a href="#features" className="hover:text-primary-600">AI tools</a>
            <a href="#why" className="hover:text-primary-600">Why Nexterview</a>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          {onHome && !user && <button onClick={() => setMobileOpen((v) => !v)} className="md:hidden w-9 h-9 rounded-xl grid place-items-center text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5" aria-label="Open menu">{mobileOpen ? <X size={17}/> : <Menu size={17}/>}</button>}
          <button onClick={toggleTheme} className="w-9 h-9 rounded-xl grid place-items-center text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5" aria-label="Toggle dark mode">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen((o) => !o)} className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5">
                <span className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-[11px] font-extrabold grid place-items-center">{initials}</span>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200 hidden sm:inline">{user.name?.split(" ")[0]}</span>
                <ChevronDown size={13} className="text-gray-400" />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div initial={{opacity:0,y:-8,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-8,scale:.97}}
                    className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#121529] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl p-2 overflow-hidden">
                    <div className="px-3 py-3 mb-1 rounded-xl bg-gray-50 dark:bg-white/[.04]">
                      <p className="text-sm font-bold text-ink truncate">{user.name}</p>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">{user.email}</p>
                    </div>
                    <Link to={dashboard} onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"><LayoutDashboard size={15}/> Dashboard</Link>
                    {user.role === "student" && <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"><User size={15}/> Profile</Link>}
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-xl text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"><LogOut size={15}/> Log out</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block text-xs font-bold text-gray-600 dark:text-gray-300 px-3 py-2.5 hover:text-primary-600">Log in</Link>
              <Link to="/signup" className="text-xs font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 sm:px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/15 hover:-translate-y-0.5 transition-transform">Get started</Link>
            </>
          )}
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && onHome && !user && <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="md:hidden max-w-7xl mx-auto mt-2 rounded-2xl border border-white/70 dark:border-white/10 bg-white/95 dark:bg-[#0b0d1b]/95 backdrop-blur-xl shadow-xl p-2">
          {[['#features','Platform'],['#features','AI tools'],['#why','Why Nexterview']].map(([href,label]) => <a key={label} href={href} onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10">{label}</a>)}
          <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-semibold text-indigo-600">Log in</Link>
        </motion.div>}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
