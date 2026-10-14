const db = require("../config/db");
const fs = require("fs");
const path = require("path");
const { extractTextFromPDF } = require("../services/pdfService");

exports.uploadDocument = async (req, res) => {
    try {
        const {
            originalname,
            filename,
            size,
            mimetype,
        } = req.file;

        const extractedText = await extractTextFromPDF(req.file.path);

        // Get study_space_id from Postman/React
        const { study_space_id } = req.body;

        // Temporary for testing
        const user_id = req.user.id;

        // ✅ Validation goes HERE
        if (!study_space_id) {
            return res.status(400).json({
                success: false,
                message: "study_space_id is required",
            });
        }

        const sql = `
    INSERT INTO documents
    (
        study_space_id,
        user_id,
        original_name,
        file_name,
        file_size,
        file_type,
        extracted_text
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
`;
        db.query(
            sql,
            [
    study_space_id,
    user_id,
    originalname,
    filename,
    size,
    mimetype,
    extractedText
],
            (err, result) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message,
                    });
                }

                res.status(201).json({
                    success: true,
                    message: "Document uploaded successfully",
                    documentId: result.insertId,
                });
            }
        );

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getDocumentsByStudySpace = (req, res) => {
    const { studySpaceId } = req.params;
    const user_id = req.user.id;

    const sql = `
        SELECT *
        FROM documents
        WHERE study_space_id = ?
        AND user_id = ?
        ORDER BY upload_date DESC
    `;

    db.query(sql, [studySpaceId, user_id], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }

        res.status(200).json({
            success: true,
            count: results.length,
            documents: results,
        });
    });
};

exports.deleteDocument = (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    // Find the document
    const findQuery =
        "SELECT * FROM documents WHERE id = ? AND user_id = ?";

    db.query(findQuery, [id, user_id], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Document not found",
            });
        }

        const document = results[0];

        const filePath = path.join(
            __dirname,
            "../uploads",
            document.file_name
        );

        // Delete PDF from uploads folder
        fs.unlink(filePath, (fileErr) => {
            if (fileErr) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete PDF file",
                });
            }

            // Delete database record
            const deleteQuery =
                "DELETE FROM documents WHERE id = ?";

            db.query(deleteQuery, [id], (deleteErr) => {
                if (deleteErr) {
                    return res.status(500).json({
                        success: false,
                        message: deleteErr.message,
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "Document deleted successfully",
                });
            });
        });
    });
};

exports.renameDocument = (req, res) => {
    console.log(req.user);
    const { id } = req.params;
    const { original_name } = req.body;
    const user_id = req.user.id;

    if (!original_name) {
        return res.status(400).json({
            success: false,
            message: "Document name is required",
        });
    }

    const sql = `
        UPDATE documents
        SET original_name = ?
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(
        sql,
        [original_name, id, user_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message,
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Document not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Document renamed successfully",
            });
        }
    );
};

exports.viewDocument = (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    const sql = `
        SELECT *
        FROM documents
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(sql, [id, user_id], (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Document not found",
            });
        }

        const document = results[0];

        const filePath = path.join(
            __dirname,
            "../uploads",
            document.file_name
        );

        res.sendFile(filePath);
    });
};