import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  StarIcon,
  GraduationCapIcon,
  VideoIcon,
  BuildingIcon,
  PhoneIcon,
  CalendarIcon,
  ChevronLeftIcon,
} from "lucide-react";

export function CounselorProfile() {
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [counselor, setCounselor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {
        console.log('Could not parse stored user data');
      }
    }
  }, []);

  // Fetch counselor data from backend
  useEffect(() => {
    const fetchCounselor = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/api/counselors/${id}`);
        if (response.ok) {
          const data = await response.json();
          const fetched = data.data?.counselor || data;
          setCounselor(fetched);
        } else {
          setError("Counselor not found.");
        }
      } catch (err) {
        console.error("Error fetching counselor:", err);
        setError("Failed to load counselor profile.");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchCounselor();
  }, [id]);

  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}>
        <p style={{ color: "#78716c", fontSize: "1.125rem", fontStyle: "italic" }}>Loading counselor profile...</p>
      </div>
    );
  }

  // Error state
  if (error || !counselor) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "40vh", gap: "1rem" }}>
        <p style={{ color: "#ef4444", fontSize: "1.125rem" }}>{error || "Counselor not found."}</p>
        <Link to="/counselors" style={{ color: "#0ea5e9", textDecoration: "none", fontWeight: 500 }}>← Back to Counselors</Link>
      </div>
    );
  }

  // Derived fields from backend model
  const counselorName = counselor.name || "Counselor";
  const counselorTitle = counselor.speciality || "Wellness Counselor";
  const counselorRating = counselor.rating || 0;
  const counselorBio = counselor.bio || "This counselor has not added a bio yet.";
  const counselorAvatar = counselor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(counselorName)}&background=e0f2fe&color=0284c7&size=150`;
  const specialtiesList = Array.isArray(counselor.specialities) && counselor.specialities.length > 0
    ? counselor.specialities
    : [counselorTitle];
  const educationList = counselor.education
    ? counselor.education.split("\n").filter(e => e.trim())
    : [];
  const credentialsList = counselor.credentials
    ? counselor.credentials.split("\n").filter(c => c.trim())
    : [];
  const allEducation = [...educationList, ...credentialsList];
  const nextAvailable = counselor.nextAvailable || "Check availability";

  // Availability from backend model
  const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
  const availabilityDots = dayKeys.map(day => {
    if (counselor.availability && counselor.availability[day]) {
      return counselor.availability[day].enabled;
    }
    return false;
  });

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        paddingBottom: "3rem",
      }}
    >
      {/* Back Link */}
      <motion.div variants={fadeIn}>
        <Link
          to="/counselors"
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#78716c",
            textDecoration: "none",
            transition: "colors 0.3s",
          }}
        >
          <ChevronLeftIcon
            style={{ height: "1rem", width: "1rem", marginRight: "0.25rem" }}
          />{" "}
          Back to Counselors
        </Link>
      </motion.div>

      {/* Hero Section */}
      <motion.div variants={fadeIn}>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "1rem",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            padding: "2.5rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "16rem",
              height: "16rem",
              backgroundColor: "#f0f9ff",
              borderRadius: "50%",
              transform: "translateY(-50%) translateX(33%)",
              filter: "blur(40px)",
            }}
          ></div>
          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              gap: "2rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "8rem",
                  width: "8rem",
                  borderRadius: "50%",
                  backgroundColor: "#e7e5e4",
                  color: "#57534e",
                  fontSize: "2.25rem",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <img
                  src={counselorAvatar}
                  alt={counselorName}
                  style={{ height: "100%", width: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "1.5rem",
                  marginBottom: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                <h1
                  style={{
                    fontSize: "2.25rem",
                    fontFamily: "sans-serif",
                    fontWeight: "bold",
                    color: "#1c1917",
                    margin: 0,
                  }}
                >
                  {counselorName}
                </h1>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    backgroundColor: "#fffbeb",
                    padding: "0.375rem 0.75rem",
                    borderRadius: "0.75rem",
                  }}
                >
                  <StarIcon
                    style={{
                      height: "1.25rem",
                      width: "1.25rem",
                      color: "#fbbf24",
                      fill: "#fbbf24",
                    }}
                  />
                  <span style={{ fontWeight: "bold", color: "#b45309" }}>
                    {counselorRating}
                  </span>
                </div>
              </div>
              <p
                style={{
                  fontSize: "1.25rem",
                  color: "#78716c",
                  marginBottom: "1.5rem",
                  marginTop: 0,
                }}
              >
                {counselorTitle}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {specialtiesList.slice(0, 3).map((specialty) => (
                  <span
                    key={specialty}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "9999px",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      backgroundColor: "#e0f2fe",
                      color: "#0284c7",
                    }}
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        {/* Main Content */}
        <motion.div
          variants={fadeIn}
          style={{
            gridColumn: "span 2 / span 2",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          <section>
            <h2
              style={{
                fontSize: "1.25rem",
                fontFamily: "sans-serif",
                fontWeight: "bold",
                color: "#1c1917",
                marginBottom: "1rem",
                marginTop: 0,
              }}
            >
              About Me
            </h2>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                padding: "2rem",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <p
                style={{
                  color: "#57534e",
                  lineHeight: 1.625,
                  fontSize: "1.125rem",
                  margin: 0,
                }}
              >
                {counselorBio}
              </p>
            </div>
          </section>

          <section>
            <h2
              style={{
                fontSize: "1.25rem",
                fontFamily: "sans-serif",
                fontWeight: "bold",
                color: "#1c1917",
                marginBottom: "1rem",
                marginTop: 0,
              }}
            >
              All Specialties
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {specialtiesList.map((specialty) => (
                <span
                  key={specialty}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0.5rem 1rem",
                    borderRadius: "9999px",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    backgroundColor: "white",
                    border: "1px solid #e7e5e4",
                    color: "#57534e",
                  }}
                >
                  {specialty}
                </span>
              ))}
            </div>
          </section>

          {allEducation.length > 0 && (
          <section>
            <h2
              style={{
                fontSize: "1.25rem",
                fontFamily: "sans-serif",
                fontWeight: "bold",
                color: "#1c1917",
                marginBottom: "1rem",
                marginTop: 0,
              }}
            >
              Education & Credentials
            </h2>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                padding: "2rem",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <ul
                style={{
                  listStyleType: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {allEducation.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                      color: "#57534e",
                    }}
                  >
                    <GraduationCapIcon
                      style={{
                        height: "1.5rem",
                        width: "1.5rem",
                        color: "#38bdf8",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: "1.125rem" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          )}

          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontFamily: "sans-serif",
                  fontWeight: "bold",
                  color: "#1c1917",
                  margin: 0,
                }}
              >
                Student Reviews
              </h2>
              <Link to="/feedback" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    fontSize: "0.875rem",
                    borderRadius: "0.5rem",
                    fontWeight: 500,
                    backgroundColor: "white",
                    color: "#0ea5e9",
                    border: "1px solid #e0f2fe",
                    cursor: "pointer",
                    outline: "none",
                    transition: "all 0.2s",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#f0f9ff"; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "white"; }}
                >
                  Leave Feedback
                </button>
              </Link>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "1rem",
                  padding: "2rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  textAlign: "center",
                  color: "#78716c",
                  fontStyle: "italic",
                }}
              >
                No reviews yet. Be the first to leave feedback!
              </div>
            </div>
          </section>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          variants={fadeIn}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div
            style={{
              position: "sticky",
              top: "6rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                padding: "1.5rem",
                border: "2px solid #e0f2fe",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontFamily: "sans-serif",
                  fontWeight: "bold",
                  color: "#1c1917",
                  marginBottom: "0.5rem",
                  marginTop: 0,
                }}
              >
                Book a Session
              </h3>
              <p
                style={{
                  color: "#78716c",
                  fontSize: "0.875rem",
                  marginBottom: "1.5rem",
                  marginTop: 0,
                }}
              >
                Take the first step towards feeling better.
              </p>

              <div
                style={{
                  backgroundColor: "#f0fdf4",
                  borderRadius: "0.75rem",
                  padding: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#15803d",
                    fontWeight: 500,
                    marginBottom: "0.25rem",
                  }}
                >
                  <CalendarIcon
                    style={{ height: "1.25rem", width: "1.25rem" }}
                  />{" "}
                  Next Available
                </div>
                <p
                  style={{
                    color: "#166534",
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  {nextAvailable}
                </p>
              </div>

              <Link to={currentUser ? "/book" : "/register"} state={{ counselorId: id, counselorName }} style={{ textDecoration: "none" }}>
                <button
                  style={{
                    width: "100%",
                    padding: "0.75rem 1.5rem",
                    fontSize: "1rem",
                    borderRadius: "0.5rem",
                    fontWeight: 500,
                    backgroundColor: "#0ea5e9",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    outline: "none",
                    transition: "background-color 0.3s",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  }}
                >
                  Book Now
                </button>
              </Link>
            </div>

            <div
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                padding: "1.5rem",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <h3
                style={{
                  fontWeight: 600,
                  color: "#1c1917",
                  marginBottom: "1rem",
                  marginTop: 0,
                }}
              >
                Session Types Offered
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    color: "#57534e",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#f0f9ff",
                      padding: "0.5rem",
                      borderRadius: "0.5rem",
                      color: "#0ea5e9",
                    }}
                  >
                    <VideoIcon
                      style={{ height: "1.25rem", width: "1.25rem" }}
                    />
                  </div>
                  <span>Video Call</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    color: "#57534e",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#f0f9ff",
                      padding: "0.5rem",
                      borderRadius: "0.5rem",
                      color: "#0ea5e9",
                    }}
                  >
                    <BuildingIcon
                      style={{ height: "1.25rem", width: "1.25rem" }}
                    />
                  </div>
                  <span>In-Person (Campus Center)</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    color: "#57534e",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#f0f9ff",
                      padding: "0.5rem",
                      borderRadius: "0.5rem",
                      color: "#0ea5e9",
                    }}
                  >
                    <PhoneIcon
                      style={{ height: "1.25rem", width: "1.25rem" }}
                    />
                  </div>
                  <span>Phone Call</span>
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                padding: "1.5rem",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <h3
                style={{
                  fontWeight: 600,
                  color: "#1c1917",
                  marginBottom: "1rem",
                  marginTop: 0,
                }}
              >
                Typical Availability
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                  gap: "0.25rem",
                  textAlign: "center",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                }}
              >
                {dayLabels.map((day, i) => (
                  <div
                    key={i}
                    style={{ color: "#a8a29e", paddingBottom: "0.5rem" }}
                  >
                    {day}
                  </div>
                ))}
                {availabilityDots.map(
                  (isAvailable, i) => (
                    <div
                      key={i}
                      style={{
                        height: "2rem",
                        borderRadius: "0.375rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        ...(isAvailable
                          ? { backgroundColor: "#dcfce7", color: "#16a34a" }
                          : { backgroundColor: "#fafaf9", color: "#d6d3d1" }),
                      }}
                    >
                      {isAvailable && (
                        <div
                          style={{
                            width: "0.375rem",
                            height: "0.375rem",
                            borderRadius: "50%",
                            backgroundColor: "#22c55e",
                          }}
                        />
                      )}
                    </div>
                  ),
                )}
              </div>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#78716c",
                  marginTop: "1rem",
                  textAlign: "center",
                  marginBottom: 0,
                }}
              >
                Green dots indicate typical working days.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
