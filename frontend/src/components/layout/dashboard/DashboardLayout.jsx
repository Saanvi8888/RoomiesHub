import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Home,
  Users,
  Wallet,
  StickyNote,
  Menu,
  Settings,
  Plus,
  CalendarDays,
  Boxes,
} from "lucide-react";
import { socket } from "../../../socket/socket";
import {
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";
import { useHouse } from "../../../context/HouseContext";
import { notificationAPI } from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import Chat from "../../../pages/Chat";
import FloatingAIButton from "./FloatingAIButton";
import moment from 'moment'
import NotificationDropdown from "./NotificationDropdown";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavBar";
export default function DashboardLayout() {
  const { houseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    getHouse,
    currentHouse,
    houses,
    getAllHouses,
  } = useHouse();
  const {user}=useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] =useState(false);
  const [showProfile,setShowProfile] = useState(false);
  const profileref = useRef(null);
  // const dropdownref = useRef();
  useEffect(() => {
    getHouse(houseId);
    getAllHouses();
  }, [houseId]);

  useEffect(() => {
    if (!houseId) return;

    socket.emit("joinHouse", houseId);

    return () => {
      socket.emit("leaveHouse", houseId);
    };
  }, [houseId]);
  useEffect(() => {
    socket.on("notification", (notification) => {
      setNotifications((prev) => [
        notification,
        ...prev,
      ]);
    });

    return () => {
      socket.off("notification");
    };
  }, []);
  useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const res =
        await notificationAPI.getNotifications(
          houseId
        );

      console.log(res.data);

      setNotifications(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch notifications:",
        error
      );

      setNotifications([]);
    }
  };

  if (houseId) {
    fetchNotifications();
  }
}, [houseId]);

  useEffect(()=>{
    const handleClickOutside=(e)=>{
      if(profileref.current && !profileref.current.contains(e.target)){
        setShowProfile(false);
      }

    }
    
      document.addEventListener("mousedown",handleClickOutside);
      return ()=>document.removeEventListener("mousedown",handleClickOutside);
  },[])
  const navItems = [
    {
      name: "Dashboard",
      icon: Home,
      path: "",
    },
    {
      name: "Expenses",
      icon: Wallet,
      path: "expenses",
    },
    {
      name: "Inventory",
      icon: Boxes,
      path: "inventory",
    },
    {
      name: "Reminders",
      icon: Bell,
      path: "reminders",
    },
    {
      name: "Notes",
      icon: StickyNote,
      path: "notes",
    },
    
    {
      name: "Settings",
      icon: Settings,
      path: "settings",
    },
  ];
  const handleLogout = () => {
      localStorage.removeItem("token");

      navigate("/login");
    };

  return (
    <div className="min-h-screen bg-[#171717] text-white flex">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        />
      )}

      {/* <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-auto min-h-screen w-[280px] bg-[#1b1b1b] border-r border-white/5 flex flex-col transition-transform duration-300 ease-out mb-7 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="px-6 py-7 border-b border-white/5 text-center">
          <div className="flex items-center gap-3 justify-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Roomies <span className="text-2xl font-bold  tracking-tight text-violet-700">Hub</span>
            </h1>
            
          </div>
        </div>

        <div className="px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            const fullPath = item.path
              ? `/house/${houseId}/dashboard/${item.path}`
              : `/house/${houseId}/dashboard`;

            const isActive = location.pathname === fullPath;

            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(fullPath);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-white/10 text-[#6b4eff]"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={20} />

                <span className="text-[15px] font-medium">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-2 px-6 flex-1">
          <p className="text-[11px] font-semibold tracking-wider text-white/40 uppercase mb-4">
            Your houses
          </p>

          <div className="space-y-1">
            {houses.map((house) => (
              <button
                key={house._id}
                onClick={() =>
                  navigate(`/house/${house._id}/dashboard`)
                }
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition group"
              >
                <span
                  className={`text-[15px] font-medium truncate ${
                    currentHouse?._id === house._id
                      ? "text-white"
                      : "text-white/60 group-hover:text-white/80"
                  }`}
                >
                  {house.name}
                </span>

                {currentHouse?._id === house._id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6b4eff]" />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate("/welcome")}
            className="mt-6 w-full border border-dashed border-white/15 hover:border-white/30 rounded-xl py-3.5 flex items-center justify-center gap-2 text-white/60 hover:text-white/80 hover:bg-white/5 transition-all duration-200"
          >
            <Plus size={16} />

            <span className="text-sm font-medium">
              New house
            </span>
          </button>
        </div>
      </aside> */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        houseId={houseId}
        houses={houses}
        currentHouse={currentHouse}
      />
      <div className="flex-1 min-w-0">
        
        <TopNavbar
            currentHouse={currentHouse}
            notifications={notifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            user={user}
            houseId={houseId}
            navigate={navigate}
            handleLogout={handleLogout}
        />
        <div className="p-6 lg:p-8">
          <Outlet />
          <Chat houseId={houseId}/>
          <FloatingAIButton/>
        </div>

      </div>
    </div>
  );
}