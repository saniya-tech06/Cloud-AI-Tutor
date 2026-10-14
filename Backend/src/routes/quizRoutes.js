const express = require("express");
const router = express.Router();
const db = require("../config/db");
const promiseDb = db.promise();
const authMiddleware = require("../middleware/authMiddleware");

// SAVE QUIZ RESULT
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const { document_id, score, total_questions } = req.body;

    if (!Number.isInteger(Number(document_id)) || !Number.isFinite(Number(score)) || !Number.isFinite(Number(total_questions)) || Number(total_questions) <= 0 || Number(score) < 0 || Number(score) > Number(total_questions)) {
      return res.status(400).json({ success: false, message: "A valid document, score, and question count are required." });
    }

    // Find study space from document
    const [documentRows] = await promiseDb.query(
      "SELECT study_space_id FROM documents WHERE id = ? AND user_id = ?",
      [document_id, req.user.id]
    );

    if (documentRows.length === 0) {
      return res.status(404).json({
        message: "Document not found"
      });
    }

    const study_space_id = documentRows[0].study_space_id;

    await promiseDb.query(
      `INSERT INTO quiz_results
      (user_id, study_space_id, score, total_questions)
      VALUES (?, ?, ?, ?)`,
      [req.user.id, study_space_id, score, total_questions]
    );

    res.json({
      success: true,
      message: "Quiz result saved successfully"
    });
  } catch (error) {
    console.error("Save Quiz Error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
});

// GET USER QUIZ STATS
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const [rows] = await promiseDb.query(
      `SELECT
          COUNT(*) AS totalQuizzes,
          COALESCE(
            ROUND((SUM(score) * 100.0) / NULLIF(SUM(total_questions), 0), 0),
            0
          ) AS averageScore
       FROM quiz_results
       WHERE user_id = ?`,
      [req.user.id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;
