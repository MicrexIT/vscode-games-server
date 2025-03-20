const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Score Schema
const scoreSchema = new mongoose.Schema({
  game: { type: String, required: true },
  score: { type: Number, required: true },
  username: { type: String, required: true },
  token: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Score = mongoose.model("Score", scoreSchema);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Game Score API is running" });
});

// Get top scores for a game
app.get("/scores/:game", async (req, res) => {
  try {
    const scores = await Score.find({ game: req.params.game })
      .sort({ score: -1 })
      .limit(parseInt(req.query.limit) || 10);

    // Don't expose user tokens in public API
    const sanitizedScores = scores.map((score) => {
      const scoreObj = score.toObject();
      delete scoreObj.token;
      return scoreObj;
    });

    res.json(sanitizedScores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get best score for a user in a game by username
app.get("/scores/:game/:username", async (req, res) => {
  try {
    const score = await Score.findOne({
      game: req.params.game,
      username: req.params.username,
    }).sort({ score: -1 });

    if (!score) {
      return res
        .status(404)
        .json({ message: "No scores found for this user and game" });
    }

    // Don't expose user token
    const scoreObj = score.toObject();
    delete scoreObj.token;

    res.json(scoreObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get best score for a user in a game by token
app.get("/scores/:game/token/:token", async (req, res) => {
  try {
    const score = await Score.findOne({
      game: req.params.game,
      token: req.params.token,
    }).sort({ score: -1 });

    if (!score) {
      return res
        .status(404)
        .json({ message: "No scores found for this user and game" });
    }

    // Don't expose user token in response
    const scoreObj = score.toObject();
    delete scoreObj.token;

    res.json(scoreObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save a new score
app.post("/scores", async (req, res) => {
  try {
    const { game, score, username, token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const newScore = new Score({ game, score, username, token });
    await newScore.save();

    // Don't expose user token in response
    const scoreObj = newScore.toObject();
    delete scoreObj.token;

    res.status(201).json(scoreObj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
