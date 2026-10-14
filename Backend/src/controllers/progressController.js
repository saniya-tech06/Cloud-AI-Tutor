const db = require("../config/db");

exports.getProgress = async (req, res) => {
    try {
        const user_id = req.user.id;

        console.log("Current User:", req.user);

        const progressData = {};

        // Total Study Spaces
        const studySpacesQuery = `
            SELECT COUNT(*) AS totalStudySpaces
            FROM study_spaces
            WHERE user_id = ?
        `;

        db.query(studySpacesQuery, [user_id], (err, studySpaces) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            progressData.totalStudySpaces =
                studySpaces[0].totalStudySpaces;


            // Total Documents
            const documentsQuery = `
                SELECT COUNT(*) AS totalDocuments
                FROM documents
                WHERE user_id = ?
            `;

            db.query(documentsQuery, [user_id], (err, documents) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                progressData.totalDocuments =
                    documents[0].totalDocuments;


                // Favorite Study Spaces
                const favoritesQuery = `
                    SELECT COUNT(*) AS favoriteSpaces
                    FROM study_spaces
                    WHERE user_id = ?
                    AND favorite = 1
                `;


                db.query(favoritesQuery, [user_id], (err, favorites) => {

                    if (err) {
                        return res.status(500).json({
                            success:false,
                            message:err.message
                        });
                    }


                    progressData.favoriteSpaces =
                        favorites[0].favoriteSpaces;



                    // Recent Documents
                    const recentDocumentsQuery = `
                        SELECT original_name, upload_date
                        FROM documents
                        WHERE user_id = ?
                        ORDER BY upload_date DESC
                        LIMIT 5
                    `;


                    db.query(
                        recentDocumentsQuery,
                        [user_id],
                        (err, recentDocuments)=>{

                        if(err){
                            return res.status(500).json({
                                success:false,
                                message:err.message
                            });
                        }


                        progressData.recentDocuments =
                            recentDocuments;



                        // Recent Study Spaces
                        const recentSpacesQuery = `
                            SELECT title, created_at
                            FROM study_spaces
                            WHERE user_id = ?
                            ORDER BY created_at DESC
                            LIMIT 5
                        `;


                        db.query(
                            recentSpacesQuery,
                            [user_id],
                            (err, recentSpaces)=>{

                            if(err){
                                return res.status(500).json({
                                    success:false,
                                    message:err.message
                                });
                            }


                            progressData.recentSpaces =
    recentSpaces;


// Average Quiz Score
const quizAverageQuery = `
    SELECT
        COUNT(*) AS totalQuizAttempts,
        COALESCE(
            ROUND((SUM(score) * 100.0) / NULLIF(SUM(total_questions), 0), 0),
            0
        ) AS averageQuizScore
    FROM quiz_results
    WHERE user_id = ?
`;


db.query(
    quizAverageQuery,
    [user_id],
    (err, quizAverage) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        progressData.averageQuizScore = `${quizAverage[0].averageQuizScore}%`;
        progressData.totalQuizAttempts = quizAverage[0].totalQuizAttempts;


        res.status(200).json({
            success: true,
            progress: progressData
        });

    }
);

                        });

                    });


                });


            });


        });


    } catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
};
