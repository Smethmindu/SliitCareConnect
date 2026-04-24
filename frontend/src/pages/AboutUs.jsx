// MEMBER 2: Counselor and Public Pages
// This component renders the 'About Us' page, showcasing the mission and values of the site.
import { motion } from "framer-motion";
import { UsersIcon, TargetIcon, SparklesIcon } from "lucide-react";

export function AboutUs() {
  // --- STYLING DEFINITIONS ---
  // Main container style with background and font settings
  const containerStyle = {
    minHeight: "calc(100vh - 4rem)",
    backgroundColor: "#fdfbf7",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: "4rem 2rem",
  };

  // Header section style for the title and subtitle
  const headerStyle = {
    textAlign: "center",
    maxWidth: "800px",
    margin: "0 auto 4rem",
  };

  // Grid layout for the value cards
  const valuesGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  // Individual card style with shadow and border
  const cardStyle = {
    backgroundColor: "white",
    padding: "2.5rem",
    borderRadius: "1.5rem",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
    border: "1px solid #f5f5f4",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div style={containerStyle}>
      {/* --- PAGE HEADER --- */}
      {/* 
        ENTRANCE ANIMATIONS:
        We use 'framer-motion' to create a subtle upward fade effect. 
        This makes the "Mission Statement" feel more impactful as it appears on screen.
      */}
      <div style={headerStyle}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: "3.5rem", lineHeight: 1.2, fontWeight: 800, color: "#1c1917", marginBottom: "1.5rem", marginTop: 0 }}
        >
          Dedicated to Student <span style={{ color: "#0ea5e9" }}>Wellbeing</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontSize: "1.25rem", color: "#57534e", lineHeight: 1.6, margin: 0 }}
        >
          SliitCareConnect was founded with a singular mission: to make mental health support accessible, stigma-free, and effective for every university student. We believe that your mental wellness is just as important as your academic success.
        </motion.p>
      </div>

      {/* --- CORE VALUES GRID --- */}
      <div style={valuesGridStyle}>
        {/* Card 1: Community */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={cardStyle}
        >
          <div style={{ backgroundColor: "#e0f2fe", width: "4rem", height: "4rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
            <UsersIcon style={{ color: "#0284c7", width: "2rem", height: "2rem" }} />
          </div>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1c1917", marginBottom: "1rem", marginTop: 0 }}>Our Community</h3>
          <p style={{ color: "#57534e", lineHeight: 1.6, margin: 0 }}>
            We foster a supportive environment where students can openly discuss their challenges and find the right professional help without judgment or delay.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={cardStyle}
        >
          <div style={{ backgroundColor: "#fef3c7", width: "4rem", height: "4rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
            <TargetIcon style={{ color: "#d97706", width: "2rem", height: "2rem" }} />
          </div>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1c1917", marginBottom: "1rem", marginTop: 0 }}>Our Mission</h3>
          <p style={{ color: "#57534e", lineHeight: 1.6, margin: 0 }}>
            To bridge the gap between students needing help and available counseling resources, ensuring no one has to face their mental health journey alone.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={cardStyle}
        >
          <div style={{ backgroundColor: "#dcfce7", width: "4rem", height: "4rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
            <SparklesIcon style={{ color: "#16a34a", width: "2rem", height: "2rem" }} />
          </div>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1c1917", marginBottom: "1rem", marginTop: 0 }}>Our Approach</h3>
          <p style={{ color: "#57534e", lineHeight: 1.6, margin: 0 }}>
            Combining technology with empathy, we provide a seamless experience for booking appointments, finding specialties, and engaging in secure online sessions.
          </p>
        </motion.div>
      </div>
    </div>
  );
}