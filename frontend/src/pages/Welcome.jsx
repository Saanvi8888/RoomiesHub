import { useEffect, useState } from "react";
import { useHouse } from "../context/HouseContext";
import { useNavigate } from "react-router-dom";
import { X, Copy, Check } from "lucide-react";

export default function Welcome() {
  const [houseName, setHouseName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [createdHouse, setCreatedHouse] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { createHouse, joinHouse } = useHouse();

  const handleCreateClick = () => {
    setHouseName("");
    setShowNameModal(true);
  };

  const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/login");
    };
    
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!houseName.trim()) return;
    try {
      const house = await createHouse(houseName);
      setCreatedHouse(house);
      setShowNameModal(false);
      setShowInviteModal(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create house");
    }
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    try {
      const house = await joinHouse(inviteCode);
      navigate(`/house/${house._id}/dashboard`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to join house");
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(createdHouse?.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#1a1c1c] text-white relative">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.05)_0%,_transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-6 py-3 sm:py-3 flex items-center justify-between">
        <div className="text-xl sm:text-2xl font-bold tracking-tight">
          Roomies <span className="text-violet-700">Hub</span>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-full border border-violet-500 text-violet-400 hover:bg-violet-500/10 transition shadow-sm shadow-violet-500/20 font-medium"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-4">
        <div className="w-full max-w-md text-center p-4 md:p-8 md:bg-white/5 md:backdrop-blur-sm md:border md:border-white/10 md:rounded-2xl md:shadow-xl">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
              Welcome Home
            </h1>
            <p className="text-white/50 text-sm">
              Create a shared space or join with an invite code.
            </p>
          </div>

          <button
            onClick={handleCreateClick}
            className="w-full bg-violet-500 hover:bg-violet-600 text-white font-medium py-3 rounded-xl shadow-lg shadow-violet-500/20 transition text-base"
          >
            Create house
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className=" px-3 text-white/30">or</span>
            </div>
          </div>

          <form onSubmit={handleJoinSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full px-4 py-3 bg-black/20 border border-white/15 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition text-center tracking-wide"
              autoComplete="off"
            />
            <button
              type="submit"
              className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium py-3 rounded-xl transition"
            >
              Join
            </button>
          </form>

          <p className="mt-6 text-xs text-white/20">
            No credit card required  Free forever
          </p>
        </div>
      </div>

      {showNameModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
          <div className="w-full max-w-md bg-[#1f2121] border border-white/10 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center p-5 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white">Name your house</h3>
              <button
                onClick={() => setShowNameModal(false)}
                className="text-white/40 hover:text-white/80 transition p-1"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="p-5">
                <input
                  type="text"
                  placeholder="e.g., Beach Villa, Downtown Loft"
                  value={houseName}
                  onChange={(e) => setHouseName(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition"
                  autoFocus
                  required
                />
              </div>
              <div className="p-5 pt-0 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowNameModal(false)}
                  className="px-4 py-2 text-white/60 hover:text-white/80 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-2 rounded-xl font-medium shadow-lg shadow-violet-500/20 transition"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showInviteModal && createdHouse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
          <div className="w-full max-w-md bg-[#1f2121] border border-white/10 rounded-2xl shadow-xl text-center">
            <div className="p-5 border-b border-white/10">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-white">House created!</h3>
              <p className="text-white/40 text-sm mt-1">Share this code with your roommates</p>
            </div>
            <div className="p-6">
              <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                <div className="text-xs font-medium text-white/30 tracking-wide mb-1">INVITE CODE</div>
                <div className="text-2xl font-mono font-bold tracking-wider text-white">
                  {createdHouse.inviteCode}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCopyCode}
                  className="flex-1 flex items-center justify-center gap-2 border border-white/15 hover:bg-white/5 rounded-xl py-2.5 text-white/80 transition"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() => navigate(`/house/${createdHouse._id}/dashboard`)}
                  className="flex-1 bg-violet-500 hover:bg-violet-600 text-white rounded-xl py-2.5 font-medium shadow-lg shadow-violet-500/20 transition"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}