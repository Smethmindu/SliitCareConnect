import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRightIcon, ShieldCheckIcon, VideoIcon, HeartIcon } from "lucide-react";
import heroImg from "../assets/counselors.png";

export function LandingPage() {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "calc(100vh - 4rem)",
    fontFamily: "system-ui, -apple-system, sans-serif",
  };

  const heroStyle = {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#fdfbf7",
    padding: "6rem 2rem 4rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "80vh",
  };

  const gradientBlob = {
    position: "absolute",
    width: "800px",
    height: "800px",
    background: "radial-gradient(circle, rgba(14,165,233,0.1) 0%, rgba(253,251,247,0) 70%)",
    top: "-200px",
    right: "-200px",
    borderRadius: "50%",
    zIndex: 0,
  };

  const aboutSectionStyle = {
    padding: "6rem 2rem",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    borderTop: "1px solid #f5f5f4",
    borderBottom: "1px solid #f5f5f4",
  };

  return (
    <div style={containerStyle}>
      {/* Hero Section */}
      <section style={heroStyle}>
        <div style={gradientBlob} />
        
        <div style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1200px",
          width: "100%",
          gap: "4rem",
          zIndex: 1,
        }}>
          {/* Hero Text */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{ flex: "1 1 500px", maxWidth: "600px" }}
          >
            <span style={{ 
              color: "#0369a1", 
              fontWeight: 600, 
              letterSpacing: "0.05em", 
              textTransform: "uppercase", 
              fontSize: "0.875rem",
              backgroundColor: "#e0f2fe",
              padding: "0.5rem 1rem",
              borderRadius: "9999px",
              marginBottom: "1.5rem",
              display: "inline-block"
            }}>
              University Wellness Platform
            </span>
            <h1 style={{ 
              fontSize: "4rem", 
              lineHeight: 1.1, 
              fontWeight: 800, 
              color: "#1c1917", 
              marginBottom: "1.5rem",
              letterSpacing: "-0.02em"
            }}>
              Your Mental Wellness <br/>
              <span style={{ color: "#0ea5e9" }}>Starts Here</span>
            </h1>
            <p style={{ 
              fontSize: "1.25rem", 
              color: "#57534e", 
              marginBottom: "2.5rem", 
              lineHeight: 1.6,
            }}>
              Connect with certified counselors, schedule sessions, and access resources tailored for university students' unique challenges.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Link to="/counselors" style={{ textDecoration: "none" }}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    backgroundColor: "#0ea5e9",
                    color: "white",
                    padding: "1rem 2rem",
                    borderRadius: "0.75rem",
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    boxShadow: "0 10px 15px -3px rgba(14, 165, 233, 0.3)"
                  }}
                >
                  Find a Counselor <ArrowRightIcon style={{ width: "1.25rem", height: "1.25rem" }} />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              flex: "1 1 400px",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              position: "relative",
            }}
          >
            <img 
              src={heroImg} 
              alt="Our professional counseling team" 
              style={{
                width: "100%",
                maxWidth: "600px",
                height: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 20px 25px rgba(0,0,0,0.1))"
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* About Us Preview Section */}
      <section style={aboutSectionStyle}>
        <div style={{ maxWidth: "800px" }}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ fontSize: "2.5rem", lineHeight: 1.2, fontWeight: 800, color: "#1c1917", marginBottom: "1.5rem", marginTop: 0 }}
          >
            Dedicated to <span style={{ color: "#0ea5e9" }}>Student Wellbeing</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontSize: "1.125rem", color: "#57534e", lineHeight: 1.6, marginBottom: "2.5rem" }}
          >
            SliitCareConnect is built on the belief that university life shouldn't be a journey you face alone. 
            We bridge the gap between students needing help and available counseling resources, ensuring 
            professional support is always just a few clicks away.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to="/about" style={{ textDecoration: "none" }}>
              <button style={{
                backgroundColor: "white",
                color: "#0369a1",
                padding: "0.75rem 2rem",
                borderRadius: "9999px",
                fontSize: "1rem",
                fontWeight: 600,
                border: "2px solid #bae6fd",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f0f9ff' }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white' }}
              >
                See More About Us
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "6rem 2rem", backgroundColor: "#fdfbf7", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2.5rem" }}>
            
            <motion.div 
              whileHover={{ y: -5 }}
              style={{ padding: "2.5rem", backgroundColor: "white", borderRadius: "1.5rem", border: "1px solid #f5f5f4", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}
            >
              <div style={{ backgroundColor: "#dbeafe", width: "4rem", height: "4rem", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                <VideoIcon style={{ color: "#2563eb", width: "2rem", height: "2rem" }} />
              </div>
              <h3 style={{ fontSize: "1.5rem", color: "#0f172a", marginBottom: "1rem", fontWeight: 600, marginTop: 0 }}>Virtual & In-Person</h3>
              <p style={{ color: "#64748b", lineHeight: 1.6, margin: 0 }}>Choose between flexible online video sessions or traditional in-person counseling on campus.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              style={{ padding: "2.5rem", backgroundColor: "white", borderRadius: "1.5rem", border: "1px solid #f5f5f4", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}
            >
              <div style={{ backgroundColor: "#dcfce7", width: "4rem", height: "4rem", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                <ShieldCheckIcon style={{ color: "#16a34a", width: "2rem", height: "2rem" }} />
              </div>
              <h3 style={{ fontSize: "1.5rem", color: "#0f172a", marginBottom: "1rem", fontWeight: 600, marginTop: 0 }}>Safe & Confidential</h3>
              <p style={{ color: "#64748b", lineHeight: 1.6, margin: 0 }}>Your privacy is our priority. All communications and session notes are strictly confidential and secure.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              style={{ padding: "2.5rem", backgroundColor: "white", borderRadius: "1.5rem", border: "1px solid #f5f5f4", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}
            >
              <div style={{ backgroundColor: "#fce7f3", width: "4rem", height: "4rem", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                <HeartIcon style={{ color: "#db2777", width: "2rem", height: "2rem" }} />
              </div>
              <h3 style={{ fontSize: "1.5rem", color: "#0f172a", marginBottom: "1rem", fontWeight: 600, marginTop: 0 }}>Tailored Support</h3>
              <p style={{ color: "#64748b", lineHeight: 1.6, margin: 0 }}>Match with counselors specializing in your specific needs, from academic stress to personal growth.</p>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}