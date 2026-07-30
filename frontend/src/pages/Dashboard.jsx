// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Bell,
//   Home,
//   Users,
//   Wallet,
//   Package,
//   StickyNote,
//   Menu,
//   X,
//   ChevronRight,
//   Settings,
//   Plus,
//   CalendarDays,
//   Boxes,
// } from "lucide-react";

// import { useHouse } from "../context/HouseContext";
// import { useActivity } from "../context/ActivityContext";

// export default function Dashboard() {
//   const { houseId } = useParams();
//   const navigate = useNavigate();

//   const {getHouse,currentHouse,houses,getAllHouses,} = useHouse();
//   const {getActivities,activities } = useActivity();
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   useEffect(() => {
//     getHouse(houseId);
//     getActivities(houseId);
//     getAllHouses();
//   }, [houseId]);

//   const navItems = [
//     { name: "Dashboard", icon: Home, active: true },
//     { name: "Expenses", icon: Wallet, active: false },
//     { name: "Inventory", icon: Boxes, active: false },
//     { name: "Reminders", icon: Bell, active: false },
//     { name: "Notes", icon: StickyNote, active: false },
//     { name: "Members", icon: Users, active: false },
//     { name: "Settings", icon: Settings, active: false },
//   ];

//   const getIcon = (type) => {
//     switch (type) {
//       case "EXPENSE_ADDED":
//       case "EXPENSE_UPDATED":
//         return <Wallet size={18} />;
//       case "NOTE_CREATED":
//       case "NOTE_UPDATED":
//       case "NOTE_DELETED":
//         return <StickyNote size={18} />;
//       case "INVENTORY_ADDED":
//       case "INVENTORY_UPDATED":
//       case "INVENTORY_DELETED":
//         return <Package size={18} />;
//       default:
//         return <Bell size={18} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#171717] text-white flex">
//       {sidebarOpen && (
//         <div
//           onClick={() => setSidebarOpen(false)}
//           className="fixed inset-0 bg-black/60 z-40 lg:hidden"
//         />
//       )}
//       <aside
//         className={`fixed lg:static top-0 left-0 z-50 h-screen w-[280px] bg-[#1b1b1b]  border-r border-white/5 flex flex-col transition-transform duration-300 ease-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
//       >
//         <div className="px-6 py-7 border-b border-white/5">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-[#5b3df5] flex items-center justify-center shadow-lg">
//               <Home size={18} />
//             </div>
//             <h1 className="text-2xl font-bold tracking-tight">RoomiesHub</h1>
//           </div>
//         </div>

//         <div className="px-4 py-6 space-y-1">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <button
//                 key={item.name}
//                 className={` w-full flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-200 ${item.active? "bg-white/10 text-[#6b4eff]": "text-white/70 hover:bg-white/5 hover:text-white"}`}
//               >
//                 <Icon size={20} />
//                 <span className="text-[15px] font-medium">{item.name}</span>
//               </button>
//             );
//           })}
//         </div>

//         <div className="mt-2 px-6 flex-1">
//           <p className="text-[11px] font-semibold tracking-wider text-white/40 uppercase mb-4">
//             Your houses
//           </p>
//           <div className="space-y-1">
//             {houses.map((house) => (
//               <button
//                 key={house._id}
//                 onClick={() => navigate(`/house/${house._id}/dashboard`)}
//                 className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition group"
//               >
//                 <span
//                   className={`
//                     text-[15px] font-medium truncate
//                     ${currentHouse?._id === house._id? "text-white": "text-white/60 group-hover:text-white/80"}`}
//                 >
//                   {house.name}
//                 </span>
//                 {currentHouse?._id === house._id && (
//                   <div className="w-1.5 h-1.5 rounded-full bg-[#6b4eff]" />
//                 )}
//               </button>
//             ))}
//           </div>

//           <button
//             onClick={() => navigate("/welcome")}
//             className="mt-6 w-full border border-dashed border-white/15 hover:border-white/30 rounded-xl py-3.5 flex items-center justify-center gap-2 text-white/60 hover:text-white/80 hover:bg-white/5 transition-all duration-200"
//           >
//             <Plus size={16} />
//             <span className="text-sm font-medium">New house</span>
//           </button>
//         </div>
//       </aside>

//       <div className="flex-1 min-w-0">
//         <div className="sticky top-0 z-30 bg-[#171717]/90 backdrop-blur-md border-b border-white/5 px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
//           <div className="flex items-center gap-4 min-w-0">
//             <button
//               className="lg:hidden p-1 rounded-lg hover:bg-white/5 transition"
//               onClick={() => setSidebarOpen(true)}
//             >
//               <Menu size={22} />
//             </button>
//             <div className="min-w-0">
//               <h1 className="text-2xl lg:text-3xl font-bold truncate">
//                 {currentHouse?.name}
//               </h1>
//               <div className="flex items-center gap-5 mt-1 text-white/40 text-xs lg:text-sm">
//                 <div className="flex items-center gap-1.5">
//                   <Users size={14} />
//                   <span>{currentHouse?.members?.length} members</span>
//                 </div>
//                 <div className="flex items-center gap-1.5">
//                   <CalendarDays size={14} />
//                   <span>{currentHouse &&
//                     new Date(currentHouse.createdAt).toLocaleDateString("en-US", {month: "long",year: "numeric",})}
//                 </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white/60 text-sm">
//               <Users size={14} />
//               <span className="font-mono font-semibold text-white">
//                 {currentHouse?.inviteCode}
//               </span>
//             </div>

//             <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition">
//               <Bell size={18} />
//             </button>

//             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6b4eff] to-[#8d79ff] flex items-center justify-center font-semibold text-white shadow-md">
//               U
//             </div>
//           </div>
//         </div>

//         <div className="p-6 lg:p-8 space-y-8">
//           <div className="rounded-2xl  p-6 lg:p-8">
//             <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//               <div className="space-y-4">
                
//                 <div>
//                   <h2 className="text-2xl lg:text-2xl font-bold">Welcome back </h2>
//                   <p className="text-white/50 text-base lg:text-md max-w-xl mt-1">
//                     Manage expenses, inventory, reminders and activities together with your roommates.
//                   </p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3 min-w-[240px]">
//                 <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
//                   <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Members</p>
//                   <h3 className="text-2xl font-bold">{currentHouse?.members?.length}</h3>
//                 </div>
//                 <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
//                   <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Activities</p>
//                   <h3 className="text-2xl font-bold">{activities.length}</h3>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div>
//             <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
//               <div>
//                 <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Recent Activity</h2>
//                 <p className="text-white/40 text-sm mt-1">Latest updates from your house.</p>
//               </div>
//               <button className="flex items-center gap-1 text-white/50 hover:text-white text-sm transition">
//                 View all <ChevronRight size={16} />
//               </button>
//             </div>

//             <div className="space-y-3">
//               {activities.length === 0 ? (
//                 <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center text-white/40">
//                   No recent activity yet.
//                 </div>
//               ) : (
//                 activities.map((activity) => (
//                   <div
//                     key={activity._id}
//                     className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200"
//                   >
//                     <div className="flex items-start gap-4 p-4">
//                       <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#8d79ff] shrink-0">
//                         {getIcon(activity.type)}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm lg:text-base text-white/90 break-words">
//                           {activity.message}
//                         </p>
//                         <p className="text-white/30 text-xs mt-1.5">
//                           {new Date(activity.createdAt).toLocaleString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }