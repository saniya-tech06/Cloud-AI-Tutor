const db = require("../config/db");
const { generateAIResponse } = require("../services/aiService");

const getDocumentText = (documentId, userId) => new Promise((resolve, reject) => {
    db.query(
        "SELECT extracted_text FROM documents WHERE id = ? AND user_id = ?",
        [documentId, userId],
        (error, results) => {
            if (error) return reject(error);
            if (results.length === 0) {
                const notFound = new Error("Document not found");
                notFound.status = 404;
                return reject(notFound);
            }

            const text = results[0].extracted_text?.trim();
            if (!text) {
                const emptyDocument = new Error("This document has no extractable text.");
                emptyDocument.status = 422;
                return reject(emptyDocument);
            }

            resolve(text);
        }
    );
});

const query = (sql, values) => new Promise((resolve, reject) => {
    db.query(sql, values, (error, results) => {
        if (error) return reject(error);
        resolve(results);
    });
});

exports.getChatHistory = async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const userId = req.user.id;
        const ownedDocuments = await query(
            "SELECT id FROM documents WHERE id = ? AND user_id = ?",
            [documentId, userId]
        );
        if (ownedDocuments.length === 0) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }

        const messages = await query(
            "SELECT id, role, content, created_at FROM chat_messages WHERE document_id = ? AND user_id = ? ORDER BY id ASC",
            [documentId, userId]
        );
        res.json({ success: true, messages });
    } catch (error) {
        sendError(res, error);
    }
};

const parseJsonResponse = (response) => {
    const content = response.trim().replace(/^```(?:json)?\s*|\s*```$/gi, "");
    return JSON.parse(content);
};

const sendError = (res, error) => {
    console.error("AI request failed:", error.message);
    res.status(error.status || 502).json({
        success: false,
        message: error.status ? error.message : "The AI service could not complete this request. Please try again.",
    });
};

exports.generateSummary = async (req, res) => {
    try {
        const text = (await getDocumentText(req.params.documentId, req.user.id)).slice(0, 8000);
        const summary = await generateAIResponse(`Summarize the following study document in simple language. Use short headings and clear paragraphs.\n\n${text}`);
        res.json({ success: true, summary });
    } catch (error) {
        sendError(res, error);
    }
};

exports.generateChatResponse = async (req, res) => {
    const question = req.body.question?.trim();
    if (!question) {
        return res.status(400).json({ success: false, message: "Question is required." });
    }

    try {
        const text = (await getDocumentText(req.params.documentId, req.user.id)).slice(0, 8000);
        await query(
            "INSERT INTO chat_messages (user_id, document_id, role, content) VALUES (?, ?, 'user', ?)",
            [req.user.id, req.params.documentId, question]
        );
        const answer = await generateAIResponse(`You are an intelligent AI tutor. Use the uploaded document as the primary source. If the question is unrelated to it, politely say it is outside the document's scope.\n\nDocument:\n${text}\n\nStudent question:\n${question}`);
        await query(
            "INSERT INTO chat_messages (user_id, document_id, role, content) VALUES (?, ?, 'assistant', ?)",
            [req.user.id, req.params.documentId, answer]
        );
        res.json({ success: true, answer });
    } catch (error) {
        sendError(res, error);
    }
};

exports.generateQuiz = async (req, res) => {
    try {
        const text = (await getDocumentText(req.params.documentId, req.user.id)).slice(0, 8000);
        const response = await generateAIResponse(`Create exactly 10 multiple-choice questions from this document. Return only a JSON array. Each item must have question (string), options (array of exactly four strings), and correctAnswer (one of the options). Do not include markdown.\n\nDocument:\n${text}`);
        const quiz = parseJsonResponse(response);
        if (!Array.isArray(quiz) || quiz.length === 0 || quiz.some((item) => !item.question || !Array.isArray(item.options) || !item.correctAnswer)) {
            throw new Error("The AI returned an invalid quiz format.");
        }
        res.json({ success: true, quiz });
    } catch (error) {
        sendError(res, error);
    }
};

exports.generateKeyPoints = async (req, res) => {
    try {
        const text = (await getDocumentText(req.params.documentId, req.user.id)).slice(0, 8000);
        const response = await generateAIResponse(`Extract 10 concise, useful revision points from this document. Return only a JSON array of strings with no markdown.\n\nDocument:\n${text}`);
        const keyPoints = parseJsonResponse(response);
        if (!Array.isArray(keyPoints) || !keyPoints.every((point) => typeof point === "string")) {
            throw new Error("The AI returned an invalid key-points format.");
        }
        res.json({ success: true, keyPoints });
    } catch (error) {
        sendError(res, error);
    }
};

exports.generateImportantQuestions = async (req, res) => {
    try {
        const text = (await getDocumentText(req.params.documentId, req.user.id)).slice(0, 12000);
        const response = await generateAIResponse(`Write exactly 10 conceptual and exam-style descriptive questions based on this document. Return only a JSON array of strings with no markdown.\n\nDocument:\n${text}`);
        const importantQuestions = parseJsonResponse(response);
        if (!Array.isArray(importantQuestions) || !importantQuestions.every((question) => typeof question === "string")) {
            throw new Error("The AI returned an invalid questions format.");
        }
        res.json({ success: true, importantQuestions });
    } catch (error) {
        sendError(res, error);
    }
};
