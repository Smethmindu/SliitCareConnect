/**
 * MEMBER 4: Resources, Quizzes & Feedback
 * SELF-ASSESSMENT QUIZ
 * This component provides an interactive assessment for students to measure stress/anxiety.
 * It includes real-time charting (Recharts) and PDF generation (jsPDF).
 */
import { useEffect, useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
export default function Quiz() {
  // --- STATE MANAGEMENT ---
  const [questions, setQuestions] = useState([]); // Questions fetched from backend
  const [answers, setAnswers] = useState([]); // User's selected answers
  const [started, setStarted] = useState(false); // Toggle between welcome screen and quiz
  const [currentIndex, setCurrentIndex] = useState(0); // Current question index
  const [result, setResult] = useState(null); // Assessment result from backend after submission
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const dashboardRef = useRef(null); // Ref used for PDF generation
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  /**
   * FETCH QUESTIONS
   * Loads the standardized mental health questions from the backend.
   */
  const fetchQuestions = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/quiz/questions");
      const data = await res.json();
      const questionList = data.questions || [];
      setQuestions(questionList);
      // Initialize answers array with nulls
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

  /**
   * SUBMIT QUIZ
   * Sends the answers array to the backend for scoring and categorization.
   */
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
      setResult(data); // Display the results dashboard
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

  /**
   * DOWNLOAD PDF REPORT
   * This function uses a "Screen-to-PDF" strategy:
   * 1. html2canvas: Captures the 'dashboardRef' DOM element as a high-resolution image.
   * 2. jsPDF: Embeds that image into an A4 document and triggers a browser download.
   * This allows students to save their results for future professional consultation.
   */
  const downloadPDF = async () => {
    if (!dashboardRef.current) return;
    setIsDownloading(true);
    try {
      const element = dashboardRef.current;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("SliitCareConnect_Quiz_Results.pdf");
    } catch (error) {
      console.error("Failed to generate PDF", error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper arrays for charts
  const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
  let chartData = [];
    // --- DATA PROCESSING FOR CHARTS ---
    // REVERSE SCORING LOGIC:
    // To ensure the charts represent mental health dimensions accurately, 
    // some questions (11, 12, 13, 14) are reverse-scored. 
    // Example: If a question is "I feel capable", a low score actually 
    // indicates high stress, so we flip the value (3 - val) to align 
    // it with other stress indicators.
    const reverseIndexes = [11, 12, 13, 14];
    const processed = answers.map((val, idx) => reverseIndexes.includes(idx) ? 3 - val : val);
    chartData = [
      { name: "Stress", value: processed[0] + processed[2] + processed[3] + processed[10] },
      { name: "Sleep", value: processed[1] },
      { name: "Anxiety", value: processed[5] },
      { name: "Mood", value: processed[4] + processed[6] + processed[8] + processed[9] + processed[14] },
      { name: "Focus", value: processed[7] },
      { name: "Coping & Support", value: processed[11] + processed[12] + processed[13] }
    ];

  if (loading) {
    return <p className="empty-text">Loading quiz assessment...</p>;
  }

  if (!started) {
    return (
      <div 
        className="quiz-start-banner" 
        style={{ 
          background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)', 
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
            color: '#0369a1', 
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
      padding: '40px 20px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {result ? (
        <div className="quiz-result-card" style={{ width: '100%', maxWidth: '900px', background: 'white', borderRadius: '32px', textAlign: "center", padding: "56px", boxShadow: '0 24px 64px rgba(0,0,0,0.06)', margin: 'auto' }}>
          <div ref={dashboardRef} style={{ backgroundColor: '#ffffff', padding: '10px' }}>
            <div style={{ padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', margin: '0 auto', boxSizing: 'border-box' }}>
              <h2 style={{ fontSize: "32px", marginBottom: "24px", color: '#1e293b', lineHeight: 1.2, textAlign: 'center' }}>Assessment Complete</h2>
              
              <div style={{ 
                margin: "0 auto 32px auto",
                maxWidth: "300px",
                padding: "24px", 
                backgroundColor: result.level === "High" ? "#fee2e2" : result.level === "Moderate" ? "#fef3c7" : "#d1fae5", 
                borderRadius: "20px",
                textAlign: "center",
                border: "1px solid rgba(0,0,0,0.05)"
              }}>
                <h3 style={{ fontSize: "16px", color: result.level === "High" ? "#dc2626" : result.level === "Moderate" ? "#d97706" : "#059669", fontWeight: "bold", margin: "0 0 8px 0" }}>
                  STRESS & ANXIETY LEVEL
                </h3>
                <p style={{ fontSize: "40px", color: result.level === "High" ? "#dc2626" : result.level === "Moderate" ? "#d97706" : "#059669", fontWeight: "bold", margin: 0 }}>
                  {result.level}
                </p>
              </div>

              <div style={{
                margin: "0 auto 40px auto",
                maxWidth: "600px",
                padding: "24px",
                background: result.level === "High" ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" : result.level === "Moderate" ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                borderRadius: "24px",
                color: "white",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                textAlign: "left"
              }}>
                <div style={{ 
                  backgroundColor: "white", 
                  borderRadius: "50%", 
                  width: "64px", 
                  height: "64px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "32px", 
                  flexShrink: 0,
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                }}>
                  {result.level === "High" ? "🌋" : result.level === "Moderate" ? "🐎" : "🧘"}
                </div>
                <div style={{ fontSize: "18px", fontWeight: "600", lineHeight: "1.5", textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                 {result.level === "High" ? "Whoa, calm down buddy! Deep breaths... The world isn't ending today, we promise." : 
                  result.level === "Moderate" ? "Hold your horses! Things are getting a bit spicy, but take it one step at a time." : 
                  "Zen Master! Everything is smooth sailing. Keep radiating those good vibes!"}
                </div>
              </div>

            <div style={{ backgroundColor: "#f8fafc", borderRadius: "20px", padding: "32px", marginBottom: "40px", textAlign: "left" }}>
              <h3 style={{ fontSize: "20px", marginBottom: "12px", color: "#334155", lineHeight: "1.3" }}>Analysis</h3>
              <p style={{ fontSize: "17px", color: "#475569", lineHeight: "1.6", margin: 0 }}>
                {result.message}
              </p>

              <h3 style={{ fontSize: "20px", marginBottom: "12px", color: "#334155", marginTop: "32px", lineHeight: "1.3" }}>What you should do</h3>
              <p style={{ fontSize: "17px", color: "#475569", lineHeight: "1.6", margin: 0 }}>
                {result.recommendation}
              </p>
            </div>

            <h3 style={{ fontSize: "24px", marginBottom: "24px", color: '#1e293b', textAlign: 'left', lineHeight: "1.3" }}>Analytical Dashboard</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '40px' }}>
              <div style={{ background: "#f8fafc", borderRadius: "20px", padding: "24px", height: '350px' }}>
                <h4 style={{ fontSize: "16px", marginBottom: "16px", color: "#475569" }}>Category Breakdown (Bar Chart)</h4>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} interval={0} angle={-45} textAnchor="end" />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <RechartsTooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} />
                    <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "#f8fafc", borderRadius: "20px", padding: "24px", height: '350px' }}>
                <h4 style={{ fontSize: "16px", marginBottom: "16px", color: "#475569" }}>Category Distribution (Pie Chart)</h4>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#64748b' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '24px' }}>
            <button 
              className="primary-btn" 
              onClick={downloadPDF}
              disabled={isDownloading}
              style={{ padding: '16px 32px', borderRadius: '16px', fontSize: '18px', background: isDownloading ? '#cbd5e1' : '#0ea5e9', border: 'none', color: 'white', cursor: isDownloading ? 'not-allowed' : 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {isDownloading ? 'Generating PDF...' : 'Download Results as PDF'}
            </button>
            <button 
              onClick={restartQuiz}
              style={{ background: 'white', border: '2px solid #e2e8f0', color: '#475569', padding: '16px 32px', borderRadius: '16px', fontSize: '18px', fontWeight: 600, cursor: 'pointer' }}
            >
              Retake Quiz
            </button>
            <button 
              onClick={closeQuiz}
              style={{ background: 'transparent', border: '2px solid #e2e8f0', color: '#475569', padding: '16px 32px', borderRadius: '16px', fontSize: '18px', fontWeight: 600, cursor: 'pointer' }}
            >
              Close Assessment
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-card" style={{ width: '100%', maxWidth: '800px', background: 'white', borderRadius: '32px', padding: '56px', boxShadow: '0 24px 64px rgba(0,0,0,0.06)', margin: 'auto' }}>
          <div className="quiz-progress" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <span style={{ color: '#64748b', fontSize: '16px', fontWeight: 600 }}>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <button onClick={closeQuiz} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '16px', fontWeight: 500 }}>
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
                  color: answers[currentIndex] === option.value ? '#0369a1' : '#334155',
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
