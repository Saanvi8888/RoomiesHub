import { ArrowRight } from "lucide-react";

export default function SettlementList({
  settlements,
  user,
  getInitials,
}) {
  return (
    <div>
      <div className="flex items-center justify-between px-3 pt-4 pb-2">
        <h3 className="text-md font-semibold text-white mb-3">
          Settlements
        </h3>
      </div>

      {settlements.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center text-white/40">
          No settlements pending.
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {settlements.map((settlement, index) => {
              const fromUser = settlement.from;
              const toUser = settlement.to;

              const currentUserId = user?.id;
              const fromId = fromUser?.id;
              const toId = toUser?.id;

              const youPay = fromId === currentUserId;
              const theyPayYou = toId === currentUserId;

              return (
                <div
                  key={`${fromId}-${toId}-${index}`}
                  className="flex items-start gap-3 px-5 py-4 hover:bg-white/[0.03] transition"
                >
                  <div className="w-10 h-10 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center text-xs font-semibold shrink-0">
                    {getInitials(fromUser?.name)}
                  </div>

                  <ArrowRight
                    size={16}
                    className="text-white/30 shrink-0 mt-3"
                  />

                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-semibold shrink-0">
                    {getInitials(toUser?.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-white/90">
                          {youPay ? (
                            <>
                              You pay{" "}
                              <span className="font-semibold text-white">
                                {toUser?.name}
                              </span>
                            </>
                          ) : theyPayYou ? (
                            <>
                              <span className="font-semibold text-white">
                                {fromUser?.name}
                              </span>{" "}
                              pays you
                            </>
                          ) : (
                            <>
                              <span className="font-semibold text-white">
                                {fromUser?.name}
                              </span>{" "}
                              pays{" "}
                              <span className="font-semibold text-white">
                                {toUser?.name}
                              </span>
                            </>
                          )}
                        </p>

                        <p className="text-white/30 text-xs mt-0.5">
                          settlement balance
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-white">
                          ₹{settlement.amount.toFixed(2)}
                        </p>

                        <p className="text-xs mt-0.5 text-[#dbd8ff]">
                          {youPay
                            ? "you pay"
                            : theyPayYou
                            ? "you receive"
                            : "transfer"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}