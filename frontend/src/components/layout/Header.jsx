import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  const scrollToHowItWorks = () => {
    if (window.location.pathname === "/") {
      document.querySelector("#how-it-works")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#how-it-works");
    }
  };

  const isSignup = path === "/signup";
  const isLogin = path === "/login";

  const primaryText = isSignup ? "Log in" : isLogin ? "Sign up" : "Get Started";
  const primaryLink = isSignup ? "/login" : isLogin ? "/signup" : user ? "/welcome" : "/signup";

  const showSecondary = !isSignup && !isLogin;

  const primaryButtonClasses = isSignup || isLogin
    ? "px-5 py-2 rounded-full border border-violet-500 text-violet-400 hover:bg-violet-500/10 transition shadow-sm shadow-violet-500/20 font-medium"
    : "px-5 py-2 rounded-full bg-violet-500 hover:bg-violet-600 transition shadow-sm shadow-violet-500/25 text-white font-medium";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-6 py-3 sm:py-3 flex items-center justify-between">
      <Link to="/" className="text-xl sm:text-2xl font-bold tracking-tight">
        Roomies <span className="text-violet-700">Hub</span>
      </Link>
      <nav className="flex items-center gap-3 sm:gap-4 text-sm">
        {showSecondary && (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition text-white/80 hover:text-white"
          >
            Log in
          </button>
        )}
        <button
          onClick={() => navigate(primaryLink)}
          className={primaryButtonClasses}
        >
          {primaryText}
        </button>
        <button
          onClick={scrollToHowItWorks}
          className="hidden md:inline text-white/60 hover:text-white transition"
        >
          How it works
        </button>
      </nav>
    </header>
  );
}