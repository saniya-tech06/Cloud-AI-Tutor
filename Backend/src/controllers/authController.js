const db = require("../config/db");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const sql =
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

        db.query(sql, [name, email, password], (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message,
                });
            }

            res.status(201).json({
                success: true,
                message: "User Registered Successfully",
            });
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};


// LOGIN API
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const sql = "SELECT * FROM users WHERE email = ?";

        db.query(sql, [email], (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message,
                });
            }

            // User not found
            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            const user = result[0];

            // Password check
            if (password !== user.password) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid password",
                });
            }

            const token = jwt.sign(
    {
        id: user.id,
        email: user.email,
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d",
    }
);

res.status(200).json({
    success: true,
    message: "Login Successful",
    token,
    user: {
        id: user.id,
        name: user.name,
        email: user.email,
    },
});
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};


module.exports = {
    register,
    login,
};