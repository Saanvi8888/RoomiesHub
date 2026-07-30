const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { createNote, getNotes, updateNote, deleteNote } = require("../controllers/notesController");

router.post("/:houseId",protect,createNote)
router.get("/:houseId",protect,getNotes)
router.put("/:noteId",protect,updateNote)
router.delete("/:noteId",protect,deleteNote)
module.exports= router;
