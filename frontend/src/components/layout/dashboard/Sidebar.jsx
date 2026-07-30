
import {
  Home,
  Wallet,
  StickyNote,
  Bell,
  Settings,
  Plus,
  Boxes,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  houseId,
  houses,
  currentHouse,
}) {
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <aside
      className={`fixed md:sticky top-0 left-0 z-50 md:z-auto min-h-screen w-[280px] bg-[#1b1b1b] border-r border-white/5 flex flex-col transition-transform duration-300 ease-out mb-7 ${
        sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full md:translate-x-0"
      }`}
    >
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/5 text-center">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">
            Roomies{" "}
            <span className="text-violet-700">
              Hub
            </span>
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          const fullPath = item.path
            ? `/house/${houseId}/dashboard/${item.path}`
            : `/house/${houseId}/dashboard`;

          const isActive =
            location.pathname === fullPath;

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

      {/* Houses */}
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
    </aside>
  );
}