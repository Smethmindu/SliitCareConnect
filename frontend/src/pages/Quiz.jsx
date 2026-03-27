import { useEffect, useState } from "react";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/quiz/questions");
      const data = await res.json();
      const questionList = data.questions || [];
      setQuestions(questionList);
      setAnswers(Array(questionList.length).fill(null));
    } catch (err) {
      console.error("Failed to fetch quiz questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const chooseAnswer = (value) => {
    setErrorMsg("");
    const updated = [...answers];
    updated[currentIndex] = Number(value);
    setAnswers(updated);
  };

  const nextQuestion = async () => {
    setErrorMsg("");
    if (answers[currentIndex] === null) {
      setErrorMsg("Please choose an answer before continuing.");
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ answers })
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Quiz submission failed:", err);
      setErrorMsg("Failed to submit quiz. Please try again.");
    }
  };

  const restartQuiz = () => {
    setAnswers(Array(questions.length).fill(null));
    setCurrentIndex(0);
    setResult(null);
  };

  const closeQuiz = () => {
    setStarted(false);
    restartQuiz();
  };

  if (loading) {
    return <p className="empty-text">Loading quiz assessment...</p>;
  }

  if (!started) {
    return (
      <div 
        className="quiz-start-banner" 
        style={{ 
          background: 'linear-gradient(135deg, var(--blue) 0%, #3b82f6 100%)', 
          color: 'white', 
          borderRadius: '24px', 
          padding: '48px 40px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '32px',
          boxShadow: '0 12px 32px rgba(30, 160, 230, 0.25)',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ flex: '1 1 400px' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '16px', color: 'white' }}>Self-Assessment Quiz</h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.95)', lineHeight: 1.6, margin: 0 }}>
            This short assessment contains {questions.length} questions. You cannot go back once you proceed to the next question. Please answer honestly to get a simple understanding of your current stress and anxiety levels, and to receive helpful recommendations.
          </p>
        </div>
        <button 
          onClick={() => setStarted(true)}
          style={{ 
            background: 'white', 
            color: 'var(--blue-dark)', 
            border: 'none', 
            borderRadius: '16px', 
            padding: '20px 36px', 
            fontSize: '18px', 
            fontWeight: 700, 
            cursor: 'pointer',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            whiteSpace: 'nowrap'
          }}
        >
          Start Assessment
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#f8fafc',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      overflowY: 'auto'
    }}>
      {result ? (
        <div className="quiz-result-card" style={{ width: '100%', maxWidth: '800px', background: 'white', borderRadius: '32px', textAlign: "center", padding: "56px", boxShadow: '0 24px 64px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: "32px", marginBottom: "16px", color: '#1e293b' }}>Assessment Complete</h2>
          
          <div style={{ 
            display: "inline-block", 
            padding: "20px 40px", 
            background: result.level === "High" ? "#fee2e2" : result.level === "Moderate" ? "#fef3c7" : "#d1fae5", 
            borderRadius: "20px", 
            marginBottom: "32px" 
          }}>
            <span style={{ display: "block", fontSize: "15px", color: result.level === "High" ? "var(--danger)" : result.level === "Moderate" ? "#d97706" : "#059669", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
              Stress & Anxiety Level
            </span>
            <span style={{ display: "block", fontSize: "40px", color: result.level === "High" ? "var(--danger)" : result.level === "Moderate" ? "#d97706" : "#059669", fontWeight: 800 }}>
              {result.level}
            </span>
          </div>

          <div style={{ background: "#f8fafc", borderRadius: "20px", padding: "32px", marginBottom: "40px", textAlign: "left" }}>
            <h3 style={{ fontSize: "20px", marginBottom: "12px", color: "#334155" }}>Analysis</h3>
            <p style={{ fontSize: "17px", color: "#475569", lineHeight: 1.6, margin: 0 }}>
              {result.message}
            </p>

            <h3 style={{ fontSize: "20px", marginBottom: "12px", color: "#334155", marginTop: "32px" }}>What you should do</h3>
            <p style={{ fontSize: "17px", color: "#475569", lineHeight: 1.6, margin: 0 }}>
              {result.recommendation}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button 
              className="primary-btn" 
              onClick={restartQuiz}
              style={{ padding: '16px 32px', borderRadius: '16px', fontSize: '18px' }}
            >
              Retake Quiz
            </button>
            <button 
              onClick={closeQuiz}
              style={{ background: 'transparent', border: '2px solid var(--border)', color: '#475569', padding: '16px 32px', borderRadius: '16px', fontSize: '18px', fontWeight: 600, cursor: 'pointer' }}
            >
              Close Assessment
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-card" style={{ width: '100%', maxWidth: '800px', background: 'white', borderRadius: '32px', padding: '56px', boxShadow: '0 24px 64px rgba(0,0,0,0.06)' }}>
          <div className="quiz-progress" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <span style={{ color: 'var(--muted)', fontSize: '16px', fontWeight: 600 }}>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <button onClick={closeQuiz} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '16px', fontWeight: 500 }}>
              Exit
            </button>
          </div>

          <h3 style={{ fontSize: '28px', lineHeight: 1.4, color: '#1e293b', marginBottom: '40px' }}>
            {questions[currentIndex]?.question}
          </h3>

          {errorMsg && (
            <div style={{ padding: '12px 20px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '12px', marginBottom: '24px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>⚠️</span> {errorMsg}
            </div>
          )}

          <div className="quiz-options" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {questions[currentIndex]?.options.map((option) => (
              <button
                key={option.value}
                className={`quiz-option-btn ${answers[currentIndex] === option.value ? "selected" : ""}`}
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  fontSize: '18px',
                  background: answers[currentIndex] === option.value ? '#e9f5fc' : '#f8fafc',
                  border: `2px solid ${answers[currentIndex] === option.value ? '#bde1f4' : 'transparent'}`,
                  color: answers[currentIndex] === option.value ? 'var(--blue-dark)' : '#334155',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: answers[currentIndex] === option.value ? 600 : 400
                }}
                onClick={() => chooseAnswer(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="quiz-actions" style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              className="primary-btn" 
              onClick={nextQuestion}
              style={{ padding: '16px 40px', borderRadius: '16px', fontSize: '18px' }}
            >
              {currentIndex === questions.length - 1 ? "Finish Assessment" : "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
