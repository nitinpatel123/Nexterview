import { motion } from "framer-motion";

const accentStyles = {
  primary: { bar: "bg-primary-500", badge: "bg-primary-50 text-primary-600", text: "text-primary-700" },
  green: { bar: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-600", text: "text-emerald-700" },
  orange: { bar: "bg-accent-400", badge: "bg-accent-50 text-accent-600", text: "text-accent-600" },
  red: { bar: "bg-rose-500", badge: "bg-rose-50 text-rose-600", text: "text-rose-600" },
};

const StatCard = ({ label, value, suffix = "", accent = "primary", icon: Icon, delay = 0 }) => {
  const s = accentStyles[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -3 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 relative overflow-hidden hover:shadow-md transition-shadow"
    >
      <span className={`absolute top-0 left-0 w-full h-1 ${s.bar}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
          <p className={`font-tabular text-3xl font-semibold mt-2.5 ${s.text}`}>
            {value}
            <span className="text-lg">{suffix}</span>
          </p>
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.badge}`}>
            <Icon size={18} strokeWidth={2} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
