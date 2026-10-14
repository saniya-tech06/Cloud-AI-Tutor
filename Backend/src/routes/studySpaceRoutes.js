const express = require("express");
const router = express.Router();

const {
    createStudySpace,
    getAllStudySpaces,
    getStudySpaceById,
    updateStudySpace,
    deleteStudySpace,
    toggleFavorite,
} = require("../controllers/studySpaceController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createStudySpace);

router.get("/", authMiddleware, getAllStudySpaces);

router.get("/:id", authMiddleware, getStudySpaceById);

router.put("/:id", authMiddleware, updateStudySpace);

router.put("/:id/favorite", authMiddleware, toggleFavorite);

router.delete("/:id", authMiddleware, deleteStudySpace);

module.exports = router;

const db = require("../config/db");

exports.toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;

    await db.query(
      "UPDATE study_spaces SET favorite = ? WHERE id = ? AND user_id = ?",
      [favorite, id, req.user.id]
    );

    res.json({
      success: true,
      favorite,
      message: "Favorite updated successfully"
    });
  } catch (error) {
    console.error("Toggle favorite error:", error);
    res.status(500).json({ message: "Server error" });
  }
};