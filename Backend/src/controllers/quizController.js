const db = require("../config/db");

const saveQuizResult = async (req, res) => {
  try {
    const userId = req.user.id;

    const { studySpaceId, score, totalQuestions } = req.body;

    await db.query(
      `INSERT INTO quiz_results
      (user_id, study_space_id, score, total_questions)
      VALUES (?, ?, ?, ?)`,
      [userId, studySpaceId, score, totalQuestions]
    );

    res.status(201).json({
      message: "Quiz result saved successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to save quiz result",
    });
  }
};

module.exports = { saveQuizResult };