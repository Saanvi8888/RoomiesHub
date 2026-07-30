import { Bell, X } from "lucide-react";

export default function ReminderModal({
  showModal,
  setShowModal,
  title,
  setTitle,
  description,
  setDescription,
  time,
  setTime,
  handleCreateReminder,
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#1a1c1c] border border-white/15 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-[#7F77DD]" />
            <h2 className="text-xl font-mono font-bold text-white">
              Create Reminder
            </h2>
          </div>

          <button
            onClick={() => setShowModal(false)}
            className="text-white/50 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleCreateReminder} className="space-y-4">
          <div>
            <label className="text-sm font-mono text-white/60 block mb-2">
              TITLE
            </label>

            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Reminder title..."
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#7F77DD] transition"
            />
          </div>

          <div>
            <label className="text-sm font-mono text-white/60 block mb-2">
              DESCRIPTION
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Reminder description..."
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#7F77DD] transition resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-mono text-white/60 block mb-2">
              TIME
            </label>

            <input
              required
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#7F77DD] transition"
            />
          </div>

          <button
            type="submit"
            className="w-full font-mono bg-[#4034c6] hover:bg-[#240d8b] transition-all duration-300 py-3 rounded-xl font-medium shadow-lg mt-4"
          >
            Create Reminder
          </button>
        </form>
      </div>
    </div>
  );
}