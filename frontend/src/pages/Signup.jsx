import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Loader2, CheckCircle, XCircle } from "lucide-react";
import Header from "../components/layout/Header";
export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const navigate = useNavigate();
  const { signup, googleLogin } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
    if (name === "confirmPassword" || name === "password") {
      if (name === "confirmPassword") {
        setPasswordMatch(value === form.password);
      } else if (name === "password") {
        setPasswordMatch(value === form.confirmPassword);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setPasswordMatch(false);
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await signup(form.name, form.email, form.password);
      navigate("/welcome");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      await googleLogin(credentialResponse.credential);
      navigate("/welcome");
    } catch (err) {
      setError("Google signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const pwd = form.password;
    if (!pwd) return null;
    if (pwd.length < 6) return { text: "Weak", color: "text-red-400" };
    if (pwd.length < 10 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { text: "Medium", color: "text-yellow-400" };
    return { text: "Strong", color: "text-green-400" };
  };
  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-[#1a1c1c] text-white relative">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.05)_0%,_transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-4">
        <div className="w-full max-w-sm">
          <div className="sm:bg-white/5 backdrop-blur-sm sm:border sm:border-white/15 rounded-2xl p-5 sm:p-6">
            <div className="text-center mb-6">
              <div className="text-xs font-bold tracking-widest text-white/40 mb-2">JOIN THE HOUSE</div>
              <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
              <p className="text-white/50 text-xs">Start splitting expenses with your roommates</p>
            </div>

            {error && (
              <div className="mb-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  name="name"
                  type="text"
                  placeholder="Full name"
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-violet-500/50 transition"
                  required
                />
              </div>
              <div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-violet-500/50 transition"
                  required
                />
              </div>

              <div>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-violet-500/50 transition"
                  required
                />
                {strength && (
                  <div className={`text-xs mt-1 ${strength.color}`}>
                    Strength: {strength.text}
                  </div>
                )}
              </div>

              <div>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  onChange={handleChange}
                  className={`w-full bg-black/30 border rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 text-sm focus:outline-none transition ${
                    !passwordMatch && form.confirmPassword ? "border-red-500/50" : "border-white/10 focus:border-violet-500/50"
                  }`}
                  required
                />
                {!passwordMatch && form.confirmPassword && (
                  <div className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <XCircle size={12} /> Passwords do not match
                  </div>
                )}
                {passwordMatch && form.confirmPassword && form.confirmPassword.length > 0 && (
                  <div className="text-green-400 text-xs mt-1 flex items-center gap-1">
                    <CheckCircle size={12} /> Passwords match
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-600 rounded-xl px-4 py-2.5 text-white text-sm font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-transparent text-white/40">or</span>
              </div>
            </div>

            <div className="flex justify-center w-full">
              <div className="w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google signup failed")}
                  theme="filled_white"
                  size="medium"
                  text="signup_with"
                  shape="rectangular"
                  width="100%"
                />
              </div>
            </div>

            <p className="text-center text-white/40 text-xs mt-4">
              Already have an account?{" "}
              <button onClick={() => navigate("/login")} className="text-white/80 hover:text-white font-medium transition">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}