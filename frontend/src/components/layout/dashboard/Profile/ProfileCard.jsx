import { LogOut, Home, Mail, User, ChevronRight, Bluetooth, Delete, Trash, Trash2 } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { useHouse } from "../../../../context/HouseContext";
import ContributionChart from "./ContributionChart";
import { useExpense } from "../../../../context/ExpenseContext";
import { useInventory } from "../../../../context/InventoryContext";
import { useNotes } from "../../../../context/NoteContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const { houses } = useHouse();
  const { currentHouse,deleteHouse } = useHouse();
  const { getExpenses } = useExpense();
  const { getItems } = useInventory();
  const { getNotes } = useNotes();
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentHouse?._id) return;
    getExpenses(currentHouse._id);
    getItems(currentHouse._id);
    getNotes(currentHouse._id);
  }, [currentHouse]);
  
  const handleDeleteHouse = async () => {
    if (!currentHouse?._id) return;
    const confirmDelete = window.confirm(
      `Delete "${currentHouse.name}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;
    try {
      await deleteHouse(currentHouse._id);
      navigate("/welcome");
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">Profile</h1>
        <p className="text-white/40 mt-1 text-sm">Manage your account and view your contributions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className=" overflow-hidden  bg-white/[0.03] rounded-3xl p-4">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-[#7F77DD]/20 text-[#7F77DD] flex items-center justify-center text-2xl font-bold mx-auto">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <h2 className="mt-3 text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-white/50 text-sm mt-0.5">{user?.email}</p>
          </div>

          <div className=" rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10">
              <h2 className="text-sm font-semibold text-white">Your Houses</h2>
            </div>
            {houses?.length === 0 ? (
              <div className="p-4 text-center text-white/40 text-sm">
                You haven't joined any houses yet.
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {houses.map((house) => (
                  <div
                    key={house._id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.03] transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#7F77DD]/20 flex items-center justify-center">
                        <Home size={14} className="text-[#7F77DD]" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{house.name}</p>
                        <p className="text-white/40 text-xs">Member</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-white/30" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <ContributionChart />
        </div>
      </div>

      <div className="overflow-hidden  bg-white/[0.03] rounded-3xl p-4  ">
        <div className="divide-y divide-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-red-500/10 transition text-left"
          >
            <div className="flex items-center gap-3">
              <LogOut size={16} className="text-red-400" />
              <span className="text-red-400 text-sm">Logout</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/[0.03] transition text-left"
          onClick={handleDeleteHouse}>
            <div className="flex items-center gap-3">
              <Trash2 size={16} className="text-[#7F77DD]" />
              <span className="text-white text-sm">Delete House</span>
            </div>
            <ChevronRight size={14} className="text-white/30" />
          </button>
        </div>
      </div>
    </div>
  );
}