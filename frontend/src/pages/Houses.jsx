import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHouse } from "../context/HouseContext";

import {
  Plus,
  ArrowRight,
  Users,
  Home,
} from "lucide-react";

export default function Houses() {
  const navigate = useNavigate();

  const {
    houses,
    loading,
    getAllHouses,
  } = useHouse();

  
  useEffect(() => {
    getAllHouses();
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1c1c] ">

      <div className="fixed top-0 w-full backdrop-blur bg-black/30 border-b border-white/5 px-6 py-4 z-50 flex items-center justify-between">

        <div className="text-white text-lg font-semibold">
          RoomiesHub
        </div>

        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white text-sm font-medium">
          U
        </div>
      </div>

    
      <div className="pt-32 pb-20 px-4 flex flex-col items-center">

        <div className="text-center mb-12">

          <div className="text-xs tracking-[0.3em] font-bold text-white/35 mb-3">
            YOUR HOUSES
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Choose Your House 
          </h1>

          <p className="text-white/40 max-w-md text-sm sm:text-base">
            Select a house to continue to its dashboard.
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-white/50 text-sm">
            Loading houses...
          </div>
        ) : (
          <>
            {/* Empty State */}
            {houses.length === 0 ? (
              <div className="w-full max-w-xl">

                <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center backdrop-blur-sm">

                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
                    <Home
                      className="text-white/70"
                      size={30}
                    />
                  </div>

                  <h2 className="text-2xl font-semibold text-white mb-3">
                    No Houses Yet
                  </h2>

                  <p className="text-white/40 text-sm mb-8 max-w-sm mx-auto">
                    Create a new house or join an
                    existing one using an invite code.
                  </p>

                  <button
                    onClick={() =>
                      navigate("/welcome")
                    }
                    className="inline-flex items-center gap-2 border border-white/15 hover:bg-white/5 transition rounded-xl px-5 py-3 text-sm text-white/80"
                  >
                    <Plus size={16} />
                    Create or Join House
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Houses Grid */}
                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                  {houses.map((house) => (
                    <div
                      key={house._id}
                      onClick={() =>
                        navigate(
                          `/house/${house._id}/dashboard`
                        )
                      }
                      className="group cursor-pointer bg-white/5 border border-white/10 hover:border-white/20 rounded-3xl p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
                    >

                      {/* Icon
                      <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                        <Home
                          className="text-white/75"
                          size={26}
                        />
                      </div> */}

                      {/* House Name */}
                      <h2 className="text-2xl font-semibold text-white mb-2">
                        {house.name}
                      </h2>

                      {/* Members */}
                      <div className="flex items-center gap-2 text-white/40 text-sm mb-8">
                        <Users size={15} />

                        {house.members?.length || 0} Members
                      </div>

                      {/* Open */}
                      <div className="flex items-center justify-between">

                        <span className="text-white/60 text-sm">
                          Open Dashboard
                        </span>

                        <ArrowRight
                          size={18}
                          className="text-white/50 group-hover:translate-x-1 transition"
                        />
                      </div>
                    </div>
                  ))}

                  {/* Create House Card */}
                  <div
                    onClick={() =>
                      navigate("/welcome")
                    }
                    className="cursor-pointer border border-dashed border-white/15 hover:border-white/25 rounded-3xl flex flex-col items-center justify-center min-h-[260px] transition-all hover:bg-white/[0.03]"
                  >

                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
                      <Plus
                        className="text-white/70"
                        size={26}
                      />
                    </div>

                    <h2 className="text-xl font-semibold text-white mb-2">
                      Create New House
                    </h2>

                    {/* <p className="text-white/35 text-sm text-center max-w-[220px]">
                      Start another shared workspace
                      for your roommates.
                    </p> */}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}