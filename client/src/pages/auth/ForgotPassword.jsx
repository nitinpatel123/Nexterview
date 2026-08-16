import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import PasswordInput from "../../components/common/PasswordInput";
import * as authService from "../../services/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP + new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success("Code sent! Check your email (or the backend terminal if running locally).");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("Passwords don't match");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      const res = await authService.resetPassword(email, otp, password);
      localStorage.setItem("cf_token", res.data.token);
      localStorage.setItem("cf_user", JSON.stringify(res.data));
      toast.success("Password reset! You're now logged in.");
      navigate(res.data.role === "admin" ? "/admin/dashboard" : "/dashboard");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md border border-gray-100"
      >
        <div className="flex items-center gap-2 justify-center mb-6">
          <span className="w-2 h-2 rounded-full bg-accent-400" />
          <span className="font-display text-sm font-semibold text-ink tracking-wide">
            NEXTERVIEW AI
          </span>
        </div>

        {step === 1 ? (
          <>
            <h1 className="font-display text-2xl font-semibold text-center mb-1">Forgot password?</h1>
            <p className="text-sm text-gray-500 text-center mb-7">
              Enter your email and we'll send you a 6-digit code
            </p>

            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 focus:outline-none transition-colors text-sm"
                  placeholder="you@example.com"
                />
              </div>
              <Button type="submit" fullWidth loading={loading} className="mt-2">
                Send code
              </Button>
            </form>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-semibold text-center mb-1">Enter your code</h1>
            <p className="text-sm text-gray-500 text-center mb-7">
              We sent a 6-digit code to <strong>{email}</strong>
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">6-digit code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full mt-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 focus:outline-none transition-colors text-center font-tabular text-lg tracking-[0.3em]"
                  placeholder="000000"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">New password</label>
                <PasswordInput
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 focus:outline-none transition-colors text-sm"
                  placeholder="At least 6 characters"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Confirm new password</label>
                <PasswordInput
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 focus:outline-none transition-colors text-sm"
                  placeholder="Re-enter new password"
                />
              </div>

              <Button type="submit" fullWidth loading={loading} className="mt-2">
                Reset password
              </Button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-xs text-gray-400 hover:text-gray-600 mt-1"
              >
                Didn't get a code? Try again
              </button>
            </form>
          </>
        )}

        <p className="text-sm text-center text-gray-500 mt-7">
          <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
            Back to log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
