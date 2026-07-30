const Note = require("../models/note");
const House = require("../models/house");
const logActivity = require("../utils/logActivity");
const createNotification = require("../utils/createNotification");
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { houseId } = req.params;
    const userId = req.user._id;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const house = await House.findOne({
      _id: houseId,
      members: userId,
    });

    if (!house) {
      return res.status(403).json({ message: "Access denied" });
    }

    const note = await Note.create({
      house: houseId,
      title,
      content,
      createdBy: userId,
      lastEditedBy: userId, 
    });

    await note.populate("createdBy lastEditedBy", "name");
    await logActivity({
      house: houseId,
      user: userId,
      type: "NOTE_CREATED",
      message: `${req.user.name} created note "${title}"`,
      meta: {
        noteId: note._id,
        title,
      },
    });
    await createNotification({
      house: houseId,
      user: userId,
      type: "NOTE_CREATED",
      message: `${req.user.name} added the note "${title}"`,
      req,
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const { houseId } = req.params;
    const userId = req.user._id;

    const house = await House.findOne({
      _id: houseId,
      members: userId,
    });

    if (!house) {
      return res.status(403).json({ message: "Access denied" });
    }

    const notes = await Note.find({ house: houseId })
      .populate("createdBy lastEditedBy", "name")
      .sort({ isPinned: -1, createdAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, content, isPinned } = req.body;
    const userId = req.user._id;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    const house = await House.findOne({ _id: note.house, members: userId });
    if (!house) {
      return res.status(403).json({ message: "Not authorized" });
    }

    let isModified = false;

    if (title !== undefined && title.trim() !== "") {
      note.title = title.trim();
      isModified = true;
    }
    if (content !== undefined) {
      note.content = content;
      isModified = true;
    }
    if (isPinned !== undefined) {
      note.isPinned = isPinned;
      isModified = true;
    }

    if (!isModified) {
      return res.status(200).json(note);
    }

    note.lastEditedBy = userId;
    await note.save();
    await note.populate("createdBy lastEditedBy", "name");

    await logActivity({
      house: note.house,
      user: userId,
      type: "NOTE_UPDATED",
      message: `${req.user.name || req.user.email} updated note "${note.title}"`,
      meta: {
        noteId: note._id,
        title: note.title,
        isPinned: note.isPinned,
      },
    });
    await createNotification({
      house: note.house,
      user: userId,
      type: "NOTE_UPDATED",
      message: `${req.user.name} updated note "${note.title}"`,
      req,
    });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user._id;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const house = await House.findOne({
      _id: note.house,
      members: userId,
    });

    if (!house) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await logActivity({
      house: note.house,
      user: userId,
      type: "NOTE_DELETED",
      message: `${req.user.name} deleted note "${note.title}"`,
      meta: {
        noteId: note._id,
        title: note.title,
      },
    });
    await note.deleteOne();

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};