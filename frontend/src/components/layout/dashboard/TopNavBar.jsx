import {Menu,Users,CalendarDays} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import NotificationDropdown from "./NotificationDropdown";
import { useNotification } from "../../../context/NotificationContext";
export default function TopNavbar({currentHouse,setSidebarOpen,user,houseId,navigate,handleLogout}) {

  const [showNotifications,setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const {notifications} = useNotification();
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div className="sticky top-0 z-30 bg-[#171717]/90 backdrop-blur-md border-b border-white/5 px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <button
          className="lg:hidden p-1 rounded-lg hover:bg-white/5 transition"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <h1 className="text-2xl lg:text-3xl font-bold truncate">
            {currentHouse?.name}
          </h1>

          <div className="flex items-center gap-5 mt-1 text-white/40 text-xs lg:text-sm">
            <div className="flex items-center gap-1.5">
              <Users size={14} />
              <span>{currentHouse?.members?.length} members</span>
            </div>

            <div className="flex items-center gap-1.5">
              <CalendarDays size={14} />
              <span>
                {currentHouse &&
                  new Date(currentHouse.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      year: "numeric",
                    }
                  )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">

        <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white/60 text-sm">
          <Users size={14} />
          <span className="font-mono font-semibold text-white">
            {currentHouse?.inviteCode}
          </span>
        </div>

        <NotificationDropdown
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
        />

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile((prev) => !prev)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6b4eff] to-[#8d79ff] flex items-center justify-center font-semibold text-white shadow-md hover:scale-105 transition"
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 bg-[#1b1b1b] border border-white/10 rounded-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-white/10">
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-white/50">
                  {user?.email}
                </p>
              </div>

              <button
                onClick={() =>
                  navigate(`/house/${houseId}/dashboard/settings`)
                }
                className="w-full text-left px-4 py-3 hover:bg-white/5 transition"
              >
                My Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}