import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import Button from "../../components/common/Button";
import PasswordInput from "../../components/common/PasswordInput";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(form);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md border border-gray-100">
        <div className="flex items-center gap-2 justify-center mb-6">
          <span className="w-2 h-2 rounded-full bg-accent-400" />
          <span className="font-display text-sm font-semibold text-ink tracking-wide">
            NEXTERVIEW AI
          </span>
        </div>
        <h1 className="font-display text-2xl font-semibold text-center mb-1">Create account</h1>
        <p className="text-sm text-gray-500 text-center mb-7">
          Start your placement journey with AI
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Full name</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 focus:outline-none transition-colors text-sm"
              placeholder="Nitin Patel"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 focus:outline-none transition-colors text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <PasswordInput
              name="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 focus:outline-none transition-colors text-sm"
              placeholder="At least 6 characters"
            />
          </div>

          <Button type="submit" fullWidth loading={loading} className="mt-2">
            Create account
          </Button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-7">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
