const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const studySpaceRoutes = require("./src/routes/studySpaceRoutes");
const documentRoutes = require("./src/routes/documentRoutes");
const aiRoutes = require("./src/routes/aiRoutes");
const progressRoutes = require("./src/routes/progressRoutes");
const quizRoutes = require("./src/routes/quizRoutes");

const db = require("./src/config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/study-spaces", studySpaceRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/quiz", quizRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Cloud AI Tutor Backend is Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});