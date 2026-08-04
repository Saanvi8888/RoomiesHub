import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Pin, ListChecks } from "lucide-react";
import { useNotes } from "../../../context/NoteContext";
import { useParams } from "react-router-dom";

import NotesGrid from "./NotesGrid";
import NoteModal from "./NoteModal";

const Notes = () => {
  const { notes, loading, createNote, getNotes, updateNote, deleteNote } =useNotes();
  const { houseId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    content: "",
  });

  const notesHeaderRef = useRef(null);

  useEffect(() => {
    if (houseId) getNotes(houseId);
  }, [houseId]);

  const pinnedNotes = useMemo(() => notes.filter((n) => n.isPinned)
  ,[notes]);

  const otherNotes = useMemo(() => notes.filter((n) => !n.isPinned),
    [notes]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsCreating(true);
    await createNote(houseId, {
      title: newTitle,
      content: newContent,
    });
    setNewTitle("");
    setNewContent("");
    setIsModalOpen(false);
    setIsCreating(false);
  };

  const handleEdit = (note) => {
    setEditingId(note._id);
    setEditData({
      title: note.title,
      content: note.content,
    });
  };

  const handleSave = async (id) => {
    await updateNote(id, editData);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
  };

  const handlePin = async (note) => {
    await updateNote(note._id, {
      isPinned: !note.isPinned,
    });
  };

  const scrollToNotes = () => {
    notesHeaderRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="space-y-8 relative pb-28">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Shared Notes
          </h1>

          <p className="text-white/40 mt-1 text-sm">
            Pin ideas & reminders for everyone
          </p>
        </div>

        <div className="rounded-full bg-white/5 px-3 py-1 text-sm text-white/60">
          {notes.length} note{notes.length !== 1 && "s"}
        </div>
      </div>

      <NotesGrid
        loading={loading}
        notes={notes}
        pinnedNotes={pinnedNotes}
        otherNotes={otherNotes}
        editingId={editingId}
        editData={editData}
        setEditData={setEditData}
        setEditingId={setEditingId}
        onEdit={handleEdit}
        onSave={handleSave}
        onDelete={handleDelete}
        onPin={handlePin}
      />

      <div className="fixed bottom-28 right-6 z-50 flex flex-col gap-3">
        <button
          onClick={scrollToNotes}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg transition-all hover:scale-105 hover:bg-white/20 active:scale-95"
        >
          <ListChecks size={20} />
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-black shadow-lg transition-all hover:scale-105 hover:bg-amber-300 active:scale-95"
        >
          <Plus size={24} />
        </button>
      </div>

      <NoteModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newContent={newContent}
        setNewContent={setNewContent}
        isCreating={isCreating}
        handleCreate={handleCreate}
      />
    </div>
  );
};

export default Notes;