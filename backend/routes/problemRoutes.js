import express from "express";
import Problem from "../models/Problem.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { analyzeLifeProblem } from "../services/aiService.js";

const router = express.Router();

router.post("/add", authMiddleware, async (req, res) => {
  const { problem, category } = req.body;
  const username = req.username || "User";

  if (!problem) {
    return res.status(400).json({ message: "Problem text is required" });
  }

  try {
    const aiResponse = await analyzeLifeProblem(problem, category, username);

    const savedProblem = await Problem.create({
      userId: req.userId,
      problem,
      category: category || "general",
      aiResponse
    });

    return res.status(201).json({
      message: "Problem analyzed successfully",
      problem: {
        id: savedProblem._id,
        userId: savedProblem.userId,
        problem: savedProblem.problem,
        category: savedProblem.category,
        aiResponse: savedProblem.aiResponse,
        createdAt: savedProblem.createdAt
      }
    });
  } catch (error) {
    console.error("Problem add error:", error);
    return res.status(500).json({ message: "Failed to analyze problem" });
  }
});

router.get("/history", authMiddleware, async (req, res) => {
  try {
    const problems = await Problem.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = problems.map((p) => ({
      id: p._id,
      userId: p.userId,
      problem: p.problem,
      category: p.category,
      aiResponse: p.aiResponse,
      createdAt: p.createdAt
    }));

    return res.status(200).json({ problems: formatted });
  } catch (error) {
    console.error("Fetch history error:", error);
    return res.status(500).json({ message: "Failed to load history" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findOneAndDelete({ _id: id, userId: req.userId });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    return res.status(200).json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.error("Delete problem error:", error);
    return res.status(500).json({ message: "Failed to delete problem" });
  }
});

export default router;

