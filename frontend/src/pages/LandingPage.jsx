/**
 * MEMBER 2: Counselor & Public Pages
 * LANDING PAGE
 * This is the main entry page of the site. It features the Hero section,
 * service highlights, and the entry point to the AI Chatbot.
 */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheckIcon,
  CalendarIcon,
  MessageSquareIcon,
  ArrowRightIcon,
} from "lucide-react";
import heroImg from "../assets/counselors.png";
import { Chatbot } from "../components/Chatbot";

export function LandingPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const stagger = {
    animate: { transition: { staggerChildren: 0.2 } },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* 
        HERO SECTION 
        The first thing users see. Contains:
        1. Emotional Title: "Book Appointment With Trusted Counselors"
        2. Social Proof: Avatars of community members.
        3. Primary CTA: Direct link to counselor discovery.
      */}
      <section
        style={{
          backgroundColor: "#5a6af0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "0 1rem",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
              alignItems: "center",
            }}
          >
            <motion.div
              initial="initial"
              animate="animate"
              variants={stagger}
              style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
            >
              <motion.h1
                variants={fadeIn}
                style={{
                  fontSize: "3.5rem",
                  fontFamily: "sans-serif",
                  fontWeight: "bold",
                  color: "white",
                  lineHeight: 1.2,
                  marginBottom: "1.5rem",
                  marginTop: 0,
                }}
              >
                Book Appointment <br /> With Trusted Counselors
              </motion.h1>

              <motion.div
                variants={fadeIn}
                style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}
              >
                <div style={{ display: "flex" }}>
                  <img src="https://i.pravatar.cc/100?img=33" alt="User" style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", border: "2px solid white", marginLeft: "0" }} />
                  <img src="https://i.pravatar.cc/100?img=47" alt="User" style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", border: "2px solid white", marginLeft: "-0.75rem" }} />
                  <img src="https://i.pravatar.cc/100?img=12" alt="User" style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", border: "2px solid white", marginLeft: "-0.75rem" }} />
                </div>
                <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "0.875rem", margin: 0, maxWidth: "20rem", lineHeight: 1.5 }}>
                  Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
                </p>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Link to="/counselors" style={{ textDecoration: "none" }}>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0.75rem 1.5rem",
                      fontSize: "1rem",
                      borderRadius: "9999px",
                      fontWeight: 500,
                      backgroundColor: "white",
                      color: "#4b5563",
                      border: "none",
                      cursor: "pointer",
                      outline: "none",
                      transition: "transform 0.2s",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                  >
                    Book appointment{" "}
                    <ArrowRightIcon
                      style={{
                        marginLeft: "0.5rem",
                        height: "1rem",
                        width: "1rem",
                      }}
                    />
                  </button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                height: "100%",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingTop: "2rem"
              }}
            >
              <img
                src={heroImg}
                alt="Our Professional Counselors"
                style={{
                  maxWidth: "130%",
                  width: "130%",
                  height: "auto",
                  objectFit: "contain",
                  marginBottom: "-4px",
                  marginLeft: "10%"
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 
        ABOUT US PREVIEW 
        A short snippet about the platform's mission with a link to the full About page.
      */}
      <section style={{ padding: "4rem 0", backgroundColor: "#f9fafb" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1rem", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontFamily: "sans-serif", fontWeight: "bold", color: "#1c1917", marginBottom: "1rem", marginTop: 0 }}>
            Who We Are
          </h2>
          <p style={{ fontSize: "1.125rem", color: "#57534e", maxWidth: "48rem", lineHeight: 1.625, marginBottom: "2rem" }}>
            Welcome to SliitCareConnect, your trusted partner in managing your healthcare needs conveniently and efficiently. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service.
          </p>
          <Link to="/about" style={{ textDecoration: "none" }}>
            <button style={{ padding: "0.75rem 1.5rem", fontSize: "1rem", borderRadius: "9999px", fontWeight: 500, backgroundColor: "white", color: "#0ea5e9", border: "1px solid #0ea5e9", cursor: "pointer", transition: "all 0.3s" }}>
              More about us
            </button>
          </Link>
        </div>
      </section>

      {/* 
        FEATURES SECTION 
        Highlighting the key benefits of using SliitCareConnect (Security, Ease of Use, Messaging).
      */}
      <section style={{ padding: "6rem 0", backgroundColor: "white" }}>
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "0 1rem",
            width: "100%",
          }}
        >
          <div
            style={{
              textAlign: "center",
              maxWidth: "36rem",
              margin: "0 auto 4rem auto",
            }}
          >
            <h2
              style={{
                fontSize: "2.25rem",
                fontFamily: "sans-serif",
                fontWeight: "bold",
                color: "#1c1917",
                marginBottom: "1rem",
                marginTop: 0,
              }}
            >
              Support tailored for you
            </h2>
            <p style={{ fontSize: "1.125rem", color: "#78716c" }}>
              We understand the unique challenges of student life. Our platform
              makes it easy to get the right support at the right time.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              {
                icon: ShieldCheckIcon,
                title: "Safe & Confidential",
                desc: "Your privacy is our top priority. All communications and records are strictly confidential.",
                bg: "#f0fdf4",
                color: "#16a34a",
              },
              {
                icon: CalendarIcon,
                title: "Easy Scheduling",
                desc: "Book in-person or virtual sessions that fit around your class schedule.",
                bg: "#f0f9ff",
                color: "#0ea5e9",
              },
              {
                icon: MessageSquareIcon,
                title: "Direct Messaging",
                desc: "Securely message your counselor between sessions for ongoing support.",
                bg: "#fef2f2",
                color: "#dc2626",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "1.5rem",
                    padding: "2rem",
                    border: "1px solid #f5f5f4",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                    transition: "box-shadow 0.3s",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      borderRadius: "1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.5rem",
                      backgroundColor: feature.bg,
                      color: feature.color,
                    }}
                  >
                    <feature.icon
                      style={{ height: "1.75rem", width: "1.75rem" }}
                    />
                  </div>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      color: "#1c1917",
                      marginBottom: "0.75rem",
                      marginTop: 0,
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p style={{ color: "#57534e", lineHeight: 1.625 }}>
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "6rem 0", backgroundColor: "#fdfbf7" }}>
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "0 1rem",
            width: "100%",
          }}
        >
          <div
            style={{
              backgroundColor: "#0284c7",
              borderRadius: "2rem",
              padding: "4rem 2rem",
              textAlign: "center",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.1,
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              }}
            ></div>
            <div
              style={{
                position: "relative",
                zIndex: 10,
                maxWidth: "36rem",
                margin: "0 auto",
              }}
            >
              <h2
                style={{
                  fontSize: "2.25rem",
                  fontFamily: "sans-serif",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  marginTop: 0,
                }}
              >
                Ready to talk?
              </h2>
              <p
                style={{
                  fontSize: "1.125rem",
                  color: "#e0f2fe",
                  marginBottom: "2.5rem",
                }}
              >
                Browse our trusted counselors and book a session that fits your
                schedule — in just a few clicks.
              </p>
              <Link to="/counselors" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    padding: "1rem 2rem",
                    fontSize: "1.125rem",
                    borderRadius: "0.75rem",
                    fontWeight: 600,
                    backgroundColor: "white",
                    color: "#0369a1",
                    border: "none",
                    cursor: "pointer",
                    outline: "none",
                    transition: "background-color 0.3s",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                >
                  Book a Session
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      </section>
      {/* 
        AI CHATBOT (MEMBER 1)
        This floating component allows students to ask questions to the AI assistant.
      */}
      <Chatbot />
    </div>
  );
}