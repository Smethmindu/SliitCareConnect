import { motion } from "framer-motion";

export function AboutUs() {
  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "1rem",
    border: "1px solid #e7e5e4",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  };

  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Counseling Officer",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      description: "15+ years of experience in student counseling and mental health support."
    },
    {
      name: "Dr. Michael Chen",
      role: "Academic Support Director",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      description: "Specialized in academic performance and career guidance for students."
    },
    {
      name: "Emily Rodriguez",
      role: "Student Wellness Coordinator",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      description: "Dedicated to creating a supportive environment for student mental health."
    }
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f5f7",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              color: "#1c1917",
              marginBottom: "1rem",
            }}
          >
            About SliitCare Connect
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              color: "#6b7280",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            Your trusted partner in student wellness and academic success since 2020
          </p>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={cardStyle}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#1c1917",
              marginBottom: "1rem",
            }}
          >
            Our Mission
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#374151",
              lineHeight: "1.7",
              marginBottom: "1.5rem",
            }}
          >
            SliitCare Connect is dedicated to providing comprehensive mental health and academic support services to students. 
            We believe that every student deserves access to quality counseling and guidance to achieve their full potential.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "2rem",
              marginTop: "2rem",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: "#3b82f6",
                  marginBottom: "0.5rem",
                }}
              >
                5000+
              </div>
              <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Students Helped</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: "#10b981",
                  marginBottom: "0.5rem",
                }}
              >
                15+
              </div>
              <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Expert Counselors</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: "#f59e0b",
                  marginBottom: "0.5rem",
                }}
              >
                98%
              </div>
              <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Satisfaction Rate</div>
            </div>
          </div>
        </motion.section>

        {/* Services Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ marginTop: "2rem" }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#1c1917",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            Our Services
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {[
              {
                title: "Personal Counseling",
                description: "One-on-one sessions for personal issues, stress management, and emotional support.",
                icon: " mental_health",
                color: "#3b82f6"
              },
              {
                title: "Academic Support",
                description: "Guidance for academic challenges, study skills, and educational planning.",
                icon: " school",
                color: "#10b981"
              },
              {
                title: "Career Guidance",
                description: "Career planning, resume building, and professional development support.",
                icon: " work",
                color: "#f59e0b"
              },
              {
                title: "Group Workshops",
                description: "Interactive workshops on various topics like stress management and study skills.",
                icon: " groups",
                color: "#8b5cf6"
              },
              {
                title: "Emergency Support",
                description: "24/7 crisis intervention and emergency mental health support.",
                icon: " emergency",
                color: "#ef4444"
              },
              {
                title: "Online Resources",
                description: "Digital tools, self-help materials, and virtual counseling options.",
                icon: " computer",
                color: "#06b6d4"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                style={cardStyle}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: service.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                    fontSize: "1.5rem",
                  }}
                >
                  {service.icon === " mental_health" && "brain"}
                  {service.icon === " school" && "book"}
                  {service.icon === " work" && "briefcase"}
                  {service.icon === " groups" && "people"}
                  {service.icon === " emergency" && "health_and_safety"}
                  {service.icon === " computer" && "laptop"}
                </div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "#1c1917",
                    marginBottom: "0.75rem",
                  }}
                >
                  {service.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "#6b7280",
                    lineHeight: "1.6",
                  }}
                >
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ marginTop: "3rem" }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#1c1917",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            Meet Our Team
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                style={cardStyle}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    margin: "0 auto 1rem",
                    display: "block",
                  }}
                />
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "#1c1917",
                    marginBottom: "0.5rem",
                    textAlign: "center",
                  }}
                >
                  {member.name}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#3b82f6",
                    fontWeight: "500",
                    marginBottom: "0.75rem",
                    textAlign: "center",
                  }}
                >
                  {member.role}
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#6b7280",
                    lineHeight: "1.6",
                    textAlign: "center",
                  }}
                >
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ ...cardStyle, marginTop: "3rem", textAlign: "center" }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#1c1917",
              marginBottom: "1rem",
            }}
          >
            Get in Touch
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#6b7280",
              marginBottom: "2rem",
              lineHeight: "1.6",
            }}
          >
            Ready to start your wellness journey? Contact us today to learn more about our services.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => window.open('/contact', '_self')}
              style={{
                padding: "0.75rem 2rem",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#2563eb"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#3b82f6"}
            >
              Contact Us
            </button>
            <button
              onClick={() => window.open('/register', '_self')}
              style={{
                padding: "0.75rem 2rem",
                backgroundColor: "white",
                color: "#3b82f6",
                border: "2px solid #3b82f6",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#3b82f6";
                e.target.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "white";
                e.target.style.color = "#3b82f6";
              }}
            >
              Get Started
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
