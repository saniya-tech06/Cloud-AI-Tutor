const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getProgress } = require("../controllers/progressController");


router.get(
    "/",
    authMiddleware,
    getProgress
);


module.exports = router;