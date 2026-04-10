import express from "express";
import * as quizController from "../controllers/quiz.controller.js";

const router = express.Router();
router.get("/questions", quizController.getQuestions);
router.post("/submit", quizController.submitQuiz);

export default router;