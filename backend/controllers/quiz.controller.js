export const getQuestions = async (_req, res) => {
  try {
    const questions = [
      {
        id: 1,
        question: "How often do you feel stressed during the week?",
      },
      {
        id: 2,
        question: "How often do you have trouble sleeping?",
      },
      {
        id: 3,
        question: "How often do you feel overwhelmed by studies or personal issues?",
      },
      {
        id: 4,
        question: "How often do you find it hard to relax?",
      },
      {
        id: 5,
        question: "How often do you feel emotionally exhausted?",
      },
      {
        id: 6,
        question: "How often do you feel anxious without a clear reason?",
      },
      {
        id: 7,
        question: "How often do you experience mood swings?",
      },
      {
        id: 8,
        question: "How often do you struggle to concentrate?",
      },
      {
        id: 9,
        question: "How often do you feel unmotivated to do daily tasks?",
      },
      {
        id: 10,
        question: "How often do you feel isolated or lonely?",
      },
      {
        id: 11,
        question: "How often do you feel pressure from academic work?",
      },
      {
        id: 12,
        question: "How often do you feel confident in handling your problems?",
      },
      {
        id: 13,
        question: "How often do you feel supported by others?",
      },
      {
        id: 14,
        question: "How often do you feel in control of your emotions?",
      },
      {
        id: 15,
        question: "How often do you feel hopeful about your future?",
      },
    ];

    const options = [
      { label: "Never", value: 0 },
      { label: "Rarely", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
    ];

    const formattedQuestions = questions.map((question) => ({
      ...question,
      options,
    }));

    return res.status(200).json({
      totalQuestions: formattedQuestions.length,
      questions: formattedQuestions,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length !== 15) {
      return res.status(400).json({
        message: "Please provide answers for all 15 questions",
      });
    }

    // Reverse-score positive questions:
    // Q12, Q13, Q14, Q15
    // Array index positions: 11, 12, 13, 14
    const reverseIndexes = [11, 12, 13, 14];

    const processedAnswers = answers.map((value, index) => {
      const numericValue = Number(value);

      if (Number.isNaN(numericValue) || numericValue < 0 || numericValue > 3) {
        throw new Error("Each answer must be a number between 0 and 3");
      }

      if (reverseIndexes.includes(index)) {
        return 3 - numericValue;
      }

      return numericValue;
    });

    const score = processedAnswers.reduce((sum, value) => sum + value, 0);

    let level = "";
    let message = "";
    let recommendation = "";

    if (score <= 15) {
      level = "Low";
      message = "You seem to be managing your stress well.";
      recommendation =
        "Maintain healthy habits and continue using wellness resources.";
    } else if (score <= 30) {
      level = "Moderate";
      message = "You may be experiencing a moderate level of stress.";
      recommendation =
        "Consider using relaxation resources such as breathing audio, meditation videos, or stress management guides.";
    } else {
      level = "High";
      message = "You may be experiencing a high level of stress.";
      recommendation =
        "Consider seeking counseling support and using guided mental health resources.";
    }

    return res.status(200).json({
      score,
      level,
      message,
      recommendation,
    });
  } catch (err) {
    console.error(err);

    if (err.message === "Each answer must be a number between 0 and 3") {
      return res.status(400).json({
        message: err.message,
      });
    }

    return res.status(500).json({ message: "Server error" });
  }
};