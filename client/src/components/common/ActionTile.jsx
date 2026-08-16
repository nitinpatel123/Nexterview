import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const colorMap = {
  primary: "bg-primary-50 text-primary-600 group-hover:bg-primary-100",
  accent: "bg-accent-50 text-accent-600 group-hover:bg-accent-100",
  emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
  rose: "bg-rose-50 text-rose-600 group-hover:bg-rose-100",
};

const ActionTile = ({ to, icon: Icon, title, desc, color = "primary", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    whileHover={{ y: -4, scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
  >
    <Link
      to={to}
      className="group block bg-white border border-gray-100 rounded-2xl shadow-card p-6 hover:shadow-md transition-shadow duration-200 flex items-start gap-4"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${colorMap[color]}`}>
        <Icon size={21} strokeWidth={2} />
      </div>
      <div>
        <p className="font-semibold text-ink">{title}</p>
        {desc && <p className="text-sm text-gray-500 mt-0.5">{desc}</p>}
      </div>
    </Link>
  </motion.div>
);

export default ActionTile;
