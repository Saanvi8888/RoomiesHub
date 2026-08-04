import { StickyNote, Send, X } from "lucide-react";

export default function NoteModal({isModalOpen,setIsModalOpen,newTitle,setNewTitle,newContent,setNewContent,isCreating,handleCreate}) {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#1a1c1c] border border-white/15 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <StickyNote size={20} className="text-[#7F77DD]" />

            <h2 className="text-xl font-mono font-bold text-white">
              Create New Note
            </h2>
          </div>

          <button
            onClick={() => setIsModalOpen(false)}
            disabled={isCreating}
            className="text-white/50 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-sm font-mono text-white/60 block mb-2">
              TITLE
            </label>

            <input
              type="text"
              placeholder="Note title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
              disabled={isCreating}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#7F77DD] transition"
            />
          </div>

          <div>
            <label className="text-sm font-mono text-white/60 block mb-2">
              MESSAGE
            </label>

            <textarea
              rows={5}
              placeholder="Write notes to inform your roomies..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              disabled={isCreating}
              className="w-full resize-none bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#7F77DD] transition"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isCreating}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isCreating || !newTitle.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#4034c6] hover:bg-[#240d8b] transition font-medium flex items-center gap-2"
            >
              {isCreating ? (
                "Creating..."
              ) : (
                <>
                  <Send size={16} />
                  Create Note
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}