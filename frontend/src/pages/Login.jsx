import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { useHouse } from "../context/HouseContext";
import Header from "../components/layout/Header";
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  const { getAllHouses } = useHouse();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(form.email, form.password);
      const houses = await getAllHouses();

      if (houses?.length > 0) {
        navigate(`/house/${houses[0]._id}/dashboard`, {
          replace: true,
        });
      } else {
        navigate("/welcome");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);

    try {
      await googleLogin(credentialResponse.credential);
      const houses = await getAllHouses();

      if (houses?.length > 0) {
        navigate(`/house/${houses[0]._id}/dashboard`, {
          replace: true,
        });
      } else {
        navigate("/welcome");
      }
    } catch (err) {
      setError("Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

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
              <div className="text-xs font-bold tracking-widest text-white/40 mb-2">WELCOME BACK</div>
              <h1 className="text-2xl font-bold text-white mb-1">Sign in</h1>
              <p className="text-white/50 text-xs">Continue to your house dashboard</p>
            </div>

            {error && (
              <div className="mb-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
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
              </div>

            
              

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-600 rounded-xl px-4 py-2.5 text-white text-sm font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                {isLoading ? "Signing in..." : "Sign In"}
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
                  onError={() => setError("Google login failed")}
                  theme="filled_white"
                  size="medium"
                  text="signin_with"
                  shape="rectangular"
                  width="100%"
                />
              </div>
            </div>

            <p className="text-center text-white/40 text-xs mt-4">
              No account?{" "}
              <button onClick={() => navigate("/signup")} className="text-white/80 hover:text-white font-medium transition">
                Create one
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}