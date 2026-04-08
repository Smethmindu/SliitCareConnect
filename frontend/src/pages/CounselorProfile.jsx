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
  useParams();
  const [currentUser, setCurrentUser] = useState(null);

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

  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  const counselor = {
    name: "Dr. Emily Chen",
    title: "Clinical Psychologist",
    rating: 4.9,
    reviews: 124,
    online: true,
    avatar: "https://i.pravatar.cc/150?u=emily",
    bio: "Hi, I'm Dr. Emily. I specialize in helping university students navigate the complex challenges of academic pressure, anxiety, and life transitions. My approach is rooted in Cognitive Behavioral Therapy (CBT) and mindfulness practices. I believe in creating a warm, non-judgmental space where we can collaboratively work towards your mental wellness goals.",
    specialties: [
      "Anxiety",
      "Depression",
      "Mindfulness",
      "Academic Stress",
      "Life Transitions",
    ],
    education: [
      "Ph.D. in Clinical Psychology, Stanford University",
      "M.A. in Psychology, University of Michigan",
      "Licensed Clinical Psychologist (CA #12345)",
    ],
    nextAvailable: "Tomorrow, 10:00 AM",
  };

  const reviews = [
    {
      id: 1,
      name: "Sarah J.",
      date: "October 12, 2023",
      rating: 5,
      comment:
        "Dr. Chen is incredibly empathetic and really helped me manage my test anxiety. Highly recommend!",
      avatar: "https://i.pravatar.cc/150?u=sarahj",
    },
    {
      id: 2,
      name: "Michael T.",
      date: "September 28, 2023",
      rating: 5,
      comment:
        "Very practical advice and a great listener. The mindfulness techniques we practiced have been a game changer.",
      avatar: "https://i.pravatar.cc/150?u=michaelt",
    },
    {
      id: 3,
      name: "Anonymous Student",
      date: "September 15, 2023",
      rating: 4,
      comment:
        "Felt very comfortable talking to her. The sessions are well structured.",
      avatar: "",
    },
  ];

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
                  src={counselor.avatar}
                  alt="EC"
                  style={{ height: "100%", width: "100%", objectFit: "cover" }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "0.5rem",
                  right: "0.5rem",
                  height: "1.5rem",
                  width: "1.5rem",
                  borderRadius: "50%",
                  border: "4px solid white",
                  backgroundColor: counselor.online ? "#22c55e" : "#d6d3d1",
                }}
              />
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
                  {counselor.name}
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
                    {counselor.rating}
                  </span>
                  <span
                    style={{
                      color: "rgba(180, 83, 9, 0.7)",
                      fontSize: "0.875rem",
                      marginLeft: "0.25rem",
                    }}
                  >
                    ({counselor.reviews} reviews)
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
                {counselor.title}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {counselor.specialties.slice(0, 3).map((specialty) => (
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
                {counselor.bio}
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
              {counselor.specialties.map((specialty) => (
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
                {counselor.education.map((item, index) => (
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
              {reviews.map((review) => (
                <div
                  key={review.id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "1rem",
                    padding: "1.5rem",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "2.5rem",
                          width: "2.5rem",
                          borderRadius: "50%",
                          backgroundColor: "#e7e5e4",
                          color: "#57534e",
                          fontSize: "0.875rem",
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                        {review.avatar ? (
                          <img
                            src={review.avatar}
                            alt={review.name.charAt(0)}
                            style={{
                              height: "100%",
                              width: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          review.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <h4
                          style={{
                            fontWeight: 600,
                            color: "#1c1917",
                            margin: "0 0 0.125rem 0",
                          }}
                        >
                          {review.name}
                        </h4>
                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: "#78716c",
                            margin: 0,
                          }}
                        >
                          {review.date}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.125rem",
                      }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          style={{
                            height: "1rem",
                            width: "1rem",
                            ...(i < review.rating
                              ? { color: "#fbbf24", fill: "#fbbf24" }
                              : { color: "#e7e5e4" }),
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <p
                    style={{ color: "#57534e", fontStyle: "italic", margin: 0 }}
                  >
                    "{review.comment}"
                  </p>
                </div>
              ))}
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
                  {counselor.nextAvailable}
                </p>
              </div>

              <Link to={currentUser ? "/book" : "/register"} style={{ textDecoration: "none" }}>
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
                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                  <div
                    key={i}
                    style={{ color: "#a8a29e", paddingBottom: "0.5rem" }}
                  >
                    {day}
                  </div>
                ))}
                {[true, true, true, false, true, false, false].map(
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
