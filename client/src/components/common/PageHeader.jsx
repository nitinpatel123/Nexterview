import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const PageHeader = ({ icon: Icon, title, subtitle }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClose = () => {
    // Go back in history if we got here by navigating within the app;
    // otherwise (direct link / page refresh) fall back to the dashboard.
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(user?.role === "admin" ? "/admin/dashboard" : "/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
          <Icon size={20} strokeWidth={2} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
          {subtitle && <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <button
        type="button"
        onClick={handleClose}
        aria-label="Close and go back"
        className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-white/10 dark:hover:text-gray-200 transition-colors"
      >
        <X size={19} />
      </button>
    </div>
  );
};

export default PageHeader;
