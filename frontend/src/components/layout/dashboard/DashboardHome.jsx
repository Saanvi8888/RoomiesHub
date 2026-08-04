import { Receipt, NotebookPen, Boxes, Activity, ChevronRight, Copy, Users, House, Calendar, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useActivity } from "../../../context/ActivityContext";
import { useHouse } from "../../../context/HouseContext";

export default function DashboardHome() {
  const { houseId } = useParams();
  const { currentHouse } = useHouse();
  const { getActivities, activities } = useActivity();
  const [copied, setCopied] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);

  useEffect(() => {
    if (houseId) {
      getActivities(houseId);
    }
  }, [houseId, getActivities]);
  
  const getIcon = (type) => {
    switch (true) {
      case type?.startsWith("EXPENSE"):
        return <Receipt size={14} />;
      case type?.startsWith("NOTE"):
        return <NotebookPen size={14} />;
      case type?.startsWith("INVENTORY"):
        return <Boxes size={14} />;
      default:
        return <Activity size={14} />;
    }
  };

  const getIconBg = (type) => {
    if (type?.startsWith("EXPENSE")) return "bg-[#EEEDFE] text-[#3C3489]";
    if (type?.startsWith("INVENTORY")) return "bg-[#E1F5EE] text-[#085041]";
    if (type?.startsWith("NOTE")) return "bg-[#FDF3DC] text-[#7A4F00]";
    return "bg-white/5 text-white/40";
  };

  const formatRelativeTime = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${hours === 1 ? "hr" : "hrs"} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`;
    return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const copyInviteCode = async () => {
    if (currentHouse?.inviteCode) {
      await navigator.clipboard.writeText(currentHouse.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 transition hover:bg-white/[0.07]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <House size={18} className="text-[#8d79ff]" />
              <h2 className="text-xl font-bold text-white uppercase tracking-wide">
                {currentHouse?.name}
              </h2>
            </div>
            <div className="flex items-center gap-4 mt-2 text-white/50 text-xs">
              <span className="flex items-center gap-1.5">
                <Users size={12} />
                {currentHouse?.members?.length} members
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={12} />
                Since {
                  currentHouse &&
                  new Date(currentHouse.createdAt).toLocaleDateString("en-IN", {
                    month: "long",
                    year: "numeric",
                  })
                }
              </span>
            </div>
          </div>
          <button
            onClick={copyInviteCode}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/50 hover:text-white transition shrink-0"
          >
            {copied ? "Copied!" : <><Copy size={12} /> Invite: {currentHouse?.inviteCode}</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <div className="flex gap-3 items-center">
              <Activity size={15} />
              <h3 className="text-md font-semibold text-white">Recent activity</h3>
            </div>
            <button
              onClick={() => setShowAllActivities(true)}
              className="flex items-center gap-0.5 text-[#8d79ff] text-xs hover:text-[#a89ef5] transition"
            >
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-white/5">
            {activities.length === 0 ? (
              <div className="text-center text-white/30 text-sm py-8">No recent activity yet.</div>
            ) : (
              activities.slice(0, 5).map((activity) => (
                <div key={activity._id} className="flex items-start gap-3 px-5 py-4 hover:bg-white/[0.03] transition">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getIconBg(activity.type)}`}>
                    {getIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 leading-relaxed">{activity.message}</p>
                    <p className="text-white/30 text-xs mt-0.5">{formatRelativeTime(activity.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <div className="flex gap-3 items-center">
              <Users size={15} />
              <h3 className="text-md font-semibold text-white">Members</h3>
            </div>
          </div>
          <div className="divide-y divide-white/5">
            {currentHouse?.members?.length === 0 ? (
              <div className="text-center text-white/30 text-sm py-6">No members yet.</div>
            ) : (
              currentHouse?.members?.map((member) => (
                <div key={member._id} className="flex items-center gap-3 px-5 py-4 hover:bg-white/[0.03] transition">
                  <div className="w-10 h-10 rounded-full bg-[#2a2538] text-[#a89ef5] flex items-center justify-center text-xs font-medium shrink-0">
                    {member.name
                      ?.split(" ")
                      .map(word => word[0])
                      .join("")
                      .slice(0,2)
                      .toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate">{member.name}</p>
                    <p className="text-white/40 text-xs">
                      {member._id === currentHouse?.createdBy ? "Admin" : "Member"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showAllActivities && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#1a1c1c] border border-white/15 rounded-2xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-3">
                <Activity size={20} className="text-[#7F77DD]" />
                <h2 className="text-xl font-mono font-bold text-white">All Activities</h2>
              </div>
              <button
                onClick={() => setShowAllActivities(false)}
                className="text-white/50 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="divide-y divide-white/5">
              {activities.length === 0 ? (
                <div className="text-center text-white/30 text-sm py-8">No activities yet.</div>
              ) : (
                activities.map((activity) => (
                  <div key={activity._id} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getIconBg(activity.type)}`}>
                      {getIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 leading-relaxed">{activity.message}</p> 
                    <p className="text-white/30 text-xs mt-0.5">{formatRelativeTime(activity.createdAt)}</p> 
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}