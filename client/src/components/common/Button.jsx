import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-sm hover:shadow-md",
  outline:
    "border border-primary-200 text-primary-600 hover:bg-primary-50 hover:border-primary-300 dark:border-primary-800 dark:hover:bg-primary-900/20",
  accent:
    "bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-ink shadow-sm hover:shadow-md",
  danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-sm hover:shadow-md",
};

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "",
}) => {
  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-5 py-2.5 rounded-full font-medium text-sm tracking-wide transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
        variants[variant]
      } ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {loading ? "Please wait…" : children}
    </motion.button>
  );
};

export default Button;
