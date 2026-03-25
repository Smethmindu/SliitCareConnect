const router = require("express").Router();
const quizController = require("../controllers/quiz.controller");

router.get("/questions", quizController.getQuestions);
router.post("/submit", quizController.submitQuiz);

module.exports = router;