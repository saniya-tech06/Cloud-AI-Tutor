const express = require("express");
const router = express.Router();
console.log("✅ AI Routes Loaded");
const {
    generateSummary,
    getChatHistory,
    generateChatResponse,
    generateQuiz,
    generateKeyPoints,
     generateImportantQuestions,
} = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
    "/summary/:documentId",
    authMiddleware,
    generateSummary
);

router.get(
    "/chat/:documentId/history",
    authMiddleware,
    getChatHistory
);

router.post(
    "/chat/:documentId",
    authMiddleware,
    generateChatResponse
);

router.post(
    "/quiz/:documentId",
    authMiddleware,
    generateQuiz
);

router.post(
    "/key-points/:documentId",
    authMiddleware,
    generateKeyPoints
);

router.post(
    "/important-questions/:documentId",
    authMiddleware,
    generateImportantQuestions
);

module.exports = router;
