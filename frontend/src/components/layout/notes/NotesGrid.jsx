import {
  Pin,
  Pencil,
  Trash2,
  Save,
  X,
  Sparkles,
} from "lucide-react";

const noteThemes = [
  { card: "bg-amber-50/80 border-amber-200/40", tape: "bg-amber-300/60" },
  { card: "bg-rose-50/80 border-rose-200/40", tape: "bg-rose-300/60" },
  { card: "bg-sky-50/80 border-sky-200/40", tape: "bg-sky-300/60" },
  { card: "bg-emerald-50/80 border-emerald-200/40", tape: "bg-emerald-300/60" },
  { card: "bg-orange-50/80 border-orange-200/40", tape: "bg-orange-300/60" },
  { card: "bg-purple-50/80 border-purple-200/40", tape: "bg-purple-300/60" },
];

const rotations = [
  "rotate-[-1deg]",
  "rotate-[1deg]",
  "rotate-0",
  "rotate-[2deg]",
];

export default function NotesGrid({
  loading,
  notes,
  pinnedNotes,
  otherNotes,
  editingId,
  editData,
  setEditData,
  setEditingId,
  onEdit,
  onSave,
  onDelete,
  onPin,
}) {
  const renderNotes = (notesArray) =>
    notesArray.map((note, index) => {
      const theme = noteThemes[index % noteThemes.length];
      const rotation = rotations[index % rotations.length];

      return (
        <div
          key={note._id}
          className={`group relative border ${theme.card} ${rotation} overflow-hidden rounded-2xl shadow-md backdrop-blur-sm transition-all duration-200 hover:z-10 hover:rotate-0 hover:scale-[1.01] hover:shadow-xl`}
        >
          <div
            className={`absolute left-1/2 top-[-10px] h-6 w-20 -translate-x-1/2 rounded-sm ${theme.tape} opacity-70 shadow-sm`}
          />

          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-[length:20px_20px] pointer-events-none" />

          <div className="relative flex h-full min-h-[220px] flex-col p-4">
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <button
                onClick={() => onPin(note)}
                className={`rounded-full border border-black/10 p-1.5 transition-all hover:scale-110 ${
                  note.isPinned
                    ? "bg-black text-amber-400"
                    : "bg-white/80 text-gray-600"
                }`}
              >
                <Pin size={14} />
              </button>

              <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                {editingId === note._id ? (
                  <>
                    <button
                      onClick={() => onSave(note._id)}
                      className="rounded-full bg-emerald-600 p-1.5 text-white hover:scale-110"
                    >
                      <Save size={12} />
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-full bg-gray-500 p-1.5 text-white hover:scale-110"
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onEdit(note)}
                      className="rounded-full bg-white/90 p-1.5 text-gray-700 hover:scale-110"
                    >
                      <Pencil size={12} />
                    </button>

                    <button
                      onClick={() => onDelete(note._id)}
                      className="rounded-full bg-red-500 p-1.5 text-white hover:scale-110"
                    >
                      <Trash2 size={12} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1">
              {editingId === note._id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        title: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white/90 p-2 text-base font-bold text-gray-900 outline-none focus:ring-2 focus:ring-amber-400"
                  />

                  <textarea
                    rows={4}
                    value={editData.content}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        content: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white/90 p-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              ) : (
                <>
                  <h3 className="mb-1 line-clamp-2 break-words text-lg font-black tracking-tight text-gray-800">
                    {note.title}
                  </h3>

                  <p className="whitespace-pre-wrap break-words text-xs leading-5 text-gray-700 line-clamp-4">
                    {note.content || "No content"}
                  </p>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="mt-2 flex items-center justify-between border-t border-black/10 pt-2 text-[10px] text-gray-600">
              <div>
                <p className="font-medium text-gray-800">
                  {note.createdBy?.name || "Unknown"}
                </p>

                <p>
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </div>

              {note.isPinned && (
                <div className="flex items-center gap-1 rounded-full bg-black/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-400">
                  <Sparkles size={8} />
                  pinned
                </div>
              )}
            </div>
          </div>
        </div>
      );
    });

  return (
    <>
      {pinnedNotes.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Pin size={16} className="text-amber-400" />
            <h2 className="text-sm uppercase tracking-wider text-white/40 font-semibold">
              Pinned Notes
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {renderNotes(pinnedNotes)}
          </div>
        </div>
      )}

      <div>
        <div className="mb-4">
          <h2 className="text-sm uppercase tracking-wider text-white/40 font-semibold">
            All Notes
          </h2>
        </div>

        {loading ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center text-white/40">
            Loading notes...
          </div>
        ) : notes.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center text-white/40">
            No notes yet — tap the + button to create one
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {renderNotes(otherNotes)}
          </div>
        )}
      </div>
    </>
  );
}