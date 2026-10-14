const db = require("../config/db");

// Create Study Space
const createStudySpace = (req, res) => {
    try {
        const { title, description } = req.body;

        // Logged-in user's ID from JWT
        const user_id = req.user.id;

        const sql = `
            INSERT INTO study_spaces (user_id, title, description)
            VALUES (?, ?, ?)
        `;

        db.query(sql, [user_id, title, description], (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error",
                    error: err,
                });
            }

            return res.status(201).json({
                success: true,
                message: "Study Space created successfully",
                studySpaceId: result.insertId,
            });
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get All Study Spaces
const getAllStudySpaces = (req, res) => {
    try {
        const user_id = req.user.id;
        console.log("Logged in User ID:", user_id);

        const sql = `
            SELECT
                study_spaces.*,
                (
                    SELECT COUNT(*)
                    FROM documents
                    WHERE documents.study_space_id = study_spaces.id
                ) AS document_count
            FROM study_spaces
            WHERE user_id = ?
            ORDER BY created_at DESC
        `;

        db.query(sql, [user_id], (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error",
                    error: err,
                });
            }

            return res.status(200).json({
                success: true,
                count: result.length,
                studySpaces: result,
            });
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Single Study Space
const getStudySpaceById = (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const sql = `
            SELECT *
            FROM study_spaces
            WHERE id = ? AND user_id = ?
        `;

        db.query(sql, [id, user_id], (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error",
                    error: err,
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Study Space not found",
                });
            }

            return res.status(200).json({
                success: true,
                studySpace: result[0],
            });
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update Study Space
const updateStudySpace = (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, favorite } = req.body;
        const user_id = req.user.id;

        const sql = `
            UPDATE study_spaces
            SET title = ?, description = ?, favorite = ?
            WHERE id = ? AND user_id = ?
        `;

        db.query(
            sql,
            [title, description, favorite, id, user_id],
            (err, result) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Database Error",
                        error: err,
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "Study Space not found",
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: "Study Space updated successfully",
                });
            }
        );
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete Study Space
const deleteStudySpace = (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const sql = `
            DELETE FROM study_spaces
            WHERE id = ? AND user_id = ?
        `;

        db.query(sql, [id, user_id], (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error",
                    error: err,
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Study Space not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Study Space deleted successfully",
            });
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


module.exports = {
    createStudySpace,
    getAllStudySpaces,
    getStudySpaceById,
    updateStudySpace,
    deleteStudySpace,
};

// Toggle Favorite Study Space

// Toggle Favorite Study Space

const toggleFavorite = async (req, res) => {

    try {

        const user_id = req.user.id;
        const { id } = req.params;


        const query = `
            UPDATE study_spaces
            SET favorite = NOT favorite
            WHERE id = ?
            AND user_id = ?
        `;


        db.query(
            query,
            [id, user_id],
            (err, result)=>{

                if(err){

                    return res.status(500).json({
                        success:false,
                        message:err.message
                    });

                }


                res.status(200).json({
                    success:true,
                    message:"Favorite updated"
                });


            }
        );


    }
    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};



module.exports = {

    createStudySpace,
    getAllStudySpaces,
    getStudySpaceById,
    updateStudySpace,
    deleteStudySpace,
    toggleFavorite,

};
