import { useEffect, useRef } from "react";
import moment from "moment";
import { Bell } from "lucide-react";
import { useNotification } from "../../../context/NotificationContext";

export default function NotificationDropdown({notifications,showNotifications,setShowNotifications}) {
  const dropdownRef = useRef(null);
  const {markAsRead} = useNotification();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown",handleClickOutside);
    };
  }, [setShowNotifications]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() =>
          setShowNotifications(!showNotifications)
        }
        className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
      >
        <Bell size={18} />

        {notifications.filter((n) => !n.read).length > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-[10px] flex items-center justify-center">
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-[270px] sm:w-[350px] bg-[#1b1b1b] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-white/10">
            <h3 className="font-semibold">Notifications</h3>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-sm text-white/40">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification._id);
                    }
                  }}
                  className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 transition cursor-pointer ${!notification.read? "bg-white/[0.03]": ""
                  }`}
                >
                  <p className="text-sm text-white">
                    {notification.message}
                  </p>

                  <p className="text-xs text-white/40 mt-1">
                    {moment(notification.createdAt).format(
                      "MMM DD YYYY h:mm A"
                    )}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}