import { useEffect, useRef, useState } from "react";
import {Bell,Home,Users,Wallet,StickyNote,Menu,Settings,Plus,CalendarDays,Boxes} from "lucide-react";
import { socket } from "../../../socket/socket";
import {Outlet,useLocation,useNavigate,useParams} from "react-router-dom";
import axios from "axios";
import { useHouse } from "../../../context/HouseContext";
// import { notificationAPI } from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import Chat from "../../../pages/Chat";
import FloatingAIButton from "./FloatingAIButton";
import moment from 'moment'
import NotificationDropdown from "./NotificationDropdown";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavBar";
import { useNotification } from "../../../context/NotificationContext";

export default function DashboardLayout() {
  const { houseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {getHouse,currentHouse,houses,getAllHouses} = useHouse();
  const {user}=useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {notifications,fetchNotifications,setNotifications} = useNotification();
 

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
    if (houseId) {
      fetchNotifications(houseId);
    }
  }, [houseId]);

  // useEffect(()=>{
  //   const handleClickOutside=(e)=>{
  //     if(profileref.current && !profileref.current.contains(e.target)){
  //       setShowProfile(false);
  //     }
  //   }
  //     document.addEventListener("mousedown",handleClickOutside);
  //     return ()=>document.removeEventListener("mousedown",handleClickOutside);
  // },[])

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
            // sidebarOpen={sidebarOpen}
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