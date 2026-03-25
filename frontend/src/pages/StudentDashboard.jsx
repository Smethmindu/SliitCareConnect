import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  MessageSquareIcon,
  UserIcon,
  ClockIcon,
  VideoIcon,
  SparklesIcon,
  MoreHorizontalIcon,
} from "lucide-react";

export function StudentDashboard() {
  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  const upcomingAppointments = [
    {
      id: "1",
      counselor: "Dr. Emily Chen",
      role: "Clinical Psychologist",
      date: "Tomorrow, Oct 24",
      time: "10:00 AM - 10:50 AM",
      type: "Video Call",
      status: "confirmed",
      avatar: "https://i.pravatar.cc/150?u=emily",
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
        maxWidth: "72rem",
        margin: "0 auto",
      }}
    >
      {/* Welcome Banner */}
      <motion.div variants={fadeIn}>
        <div
          style={{
            background: "linear-gradient(to bottom right, #0ea5e9, #0284c7)",
            color: "white",
            padding: "2rem",
            borderRadius: "1rem",
            display: "flex",
            flexDirection: "column",
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
              backgroundColor: "white",
              opacity: 0.05,
              borderRadius: "50%",
              transform: "translateY(-50%) translateX(33%)",
              filter: "blur(32px)",
            }}
          ></div>
          <div style={{ position: "relative", zIndex: 10 }}>
            <h1
              style={{
                fontSize: "1.875rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
                marginTop: 0,
              }}
            >
              Welcome back, Sarah 👋
            </h1>
            <p
              style={{
                color: "#e0f2fe",
                maxWidth: "36rem",
                fontSize: "1.125rem",
                margin: 0,
              }}
            >
              "Healing takes time, and asking for help is a courageous step."
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={fadeIn}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        <Link to="/book" style={{ textDecoration: "none", color: "inherit" }}>
          <div
            style={{
              padding: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              backgroundColor: "white",
              transition: "background-color 0.3s",
              borderRadius: "1rem",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                backgroundColor: "#f0f9ff",
                padding: "0.75rem",
                borderRadius: "0.75rem",
                color: "#0ea5e9",
              }}
            >
              <CalendarIcon style={{ height: "1.5rem", width: "1.5rem" }} />
            </div>
            <div>
              <h3
                style={{
                  fontWeight: 600,
                  color: "#1c1917",
                  margin: "0 0 0.125rem 0",
                }}
              >
                Book Session
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#78716c", margin: 0 }}>
                Schedule a new appointment
              </p>
            </div>
          </div>
        </Link>
        <Link
          to="/messages"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div
            style={{
              padding: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              backgroundColor: "white",
              transition: "background-color 0.3s",
              borderRadius: "1rem",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                backgroundColor: "#f0fdf4",
                padding: "0.75rem",
                borderRadius: "0.75rem",
                color: "#16a34a",
              }}
            >
              <MessageSquareIcon
                style={{ height: "1.5rem", width: "1.5rem" }}
              />
            </div>
            <div>
              <h3
                style={{
                  fontWeight: 600,
                  color: "#1c1917",
                  margin: "0 0 0.125rem 0",
                }}
              >
                Messages
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#78716c", margin: 0 }}>
                2 unread messages
              </p>
            </div>
          </div>
        </Link>
        <Link
          to="/settings"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div
            style={{
              padding: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              backgroundColor: "white",
              transition: "background-color 0.3s",
              borderRadius: "1rem",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                backgroundColor: "#f5f3ff",
                padding: "0.75rem",
                borderRadius: "0.75rem",
                color: "#8b5cf6",
              }}
            >
              <UserIcon style={{ height: "1.5rem", width: "1.5rem" }} />
            </div>
            <div>
              <h3
                style={{
                  fontWeight: 600,
                  color: "#1c1917",
                  margin: "0 0 0.125rem 0",
                }}
              >
                My Profile
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#78716c", margin: 0 }}>
                Update preferences
              </p>
            </div>
          </div>
        </Link>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        {/* Main Content Area */}
        <motion.div
          variants={fadeIn}
          style={{
            gridColumn: "span 2 / span 2",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              padding: "1.5rem",
              backgroundColor: "white",
              borderRadius: "1rem",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "#1c1917",
                  margin: 0,
                }}
              >
                Your Appointments
              </h2>
              <Link to="/book" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    padding: "0.375rem 0.75rem",
                    fontSize: "0.875rem",
                    borderRadius: "0.375rem",
                    fontWeight: 500,
                    backgroundColor: "transparent",
                    color: "#57534e",
                    border: "1px solid transparent",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  Book New
                </button>
              </Link>
            </div>

            <div
              style={{
                display: "flex",
                gap: "2rem",
                borderBottom: "1px solid #e7e5e4",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <button
                style={{
                  position: "relative",
                  padding: "0.75rem 0.25rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  transition: "color 0.2s",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  outline: "none",
                  color: "#0ea5e9",
                }}
              >
                Upcoming
                <div
                  style={{
                    position: "absolute",
                    bottom: -1,
                    left: 0,
                    right: 0,
                    height: "2px",
                    backgroundColor: "#0ea5e9",
                    borderRadius: "9999px",
                  }}
                />
              </button>
              <button
                style={{
                  position: "relative",
                  padding: "0.75rem 0.25rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  transition: "color 0.2s",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  outline: "none",
                  color: "#78716c",
                }}
              >
                Past Sessions
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginTop: "1.5rem",
              }}
            >
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  style={{
                    border: "1px solid #f5f5f4",
                    borderRadius: "1rem",
                    padding: "1.25rem",
                    backgroundColor: "rgba(250, 250, 249, 0.3)",
                    transition: "border-color 0.3s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                      marginBottom: "1rem",
                      ...(window.innerWidth >= 640
                        ? {
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }
                        : {}),
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "3.5rem",
                          width: "3.5rem",
                          borderRadius: "50%",
                          backgroundColor: "#e7e5e4",
                          color: "#57534e",
                          fontSize: "1.25rem",
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={apt.avatar}
                          alt="Avatar"
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div>
                        <h3
                          style={{
                            fontWeight: 600,
                            color: "#1c1917",
                            margin: "0 0 0.125rem 0",
                          }}
                        >
                          {apt.counselor}
                        </h3>
                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: "#78716c",
                            margin: 0,
                          }}
                        >
                          {apt.role}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "0.125rem 0.625rem",
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          backgroundColor: "#dcfce7",
                          color: "#166534",
                        }}
                      >
                        Confirmed
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: "0.75rem",
                      marginBottom: "1.25rem",
                      backgroundColor: "white",
                      padding: "0.75rem",
                      borderRadius: "0.75rem",
                      border: "1px solid #f5f5f4",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.875rem",
                        color: "#57534e",
                      }}
                    >
                      <CalendarIcon
                        style={{
                          height: "1rem",
                          width: "1rem",
                          color: "#a8a29e",
                        }}
                      />{" "}
                      {apt.date}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.875rem",
                        color: "#57534e",
                      }}
                    >
                      <ClockIcon
                        style={{
                          height: "1rem",
                          width: "1rem",
                          color: "#a8a29e",
                        }}
                      />{" "}
                      {apt.time}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.875rem",
                        color: "#57534e",
                        gridColumn: "span 2 / span 2",
                      }}
                    >
                      <VideoIcon
                        style={{
                          height: "1rem",
                          width: "1rem",
                          color: "#a8a29e",
                        }}
                      />{" "}
                      {apt.type}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      style={{
                        flex: "1 1 auto",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.375rem",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        backgroundColor: "#0ea5e9",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        outline: "none",
                      }}
                    >
                      Join Session
                    </button>
                    <button
                      style={{
                        flex: "1 1 auto",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.375rem",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        backgroundColor: "white",
                        color: "#57534e",
                        border: "1px solid #e7e5e4",
                        cursor: "pointer",
                        outline: "none",
                      }}
                    >
                      Reschedule
                    </button>
                    <button
                      style={{
                        padding: "0.625rem",
                        color: "#a8a29e",
                        background: "none",
                        border: "none",
                        borderRadius: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      <MoreHorizontalIcon
                        style={{ height: "1.25rem", width: "1.25rem" }}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sidebar Widgets */}
        <motion.div
          variants={fadeIn}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Wellness Tip */}
          <div
            style={{
              padding: "1.5rem",
              backgroundColor: "#f0fdf4",
              border: "none",
              borderRadius: "1rem",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
                color: "#15803d",
              }}
            >
              <SparklesIcon style={{ height: "1.25rem", width: "1.25rem" }} />
              <h3 style={{ fontWeight: 600, margin: 0 }}>Tip of the Day</h3>
            </div>
            <p
              style={{
                color: "#44403c",
                fontSize: "0.875rem",
                lineHeight: 1.625,
                marginBottom: "1rem",
                margin: 0,
              }}
            >
              Take 5 minutes today to practice box breathing: Inhale for 4
              seconds, hold for 4, exhale for 4, hold for 4. Repeat.
            </p>
            <Link
              to="/blog"
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#15803d",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                marginTop: "1rem",
              }}
            >
              Read more tips &rarr;
            </Link>
          </div>

          {/* Notifications */}
          <div
            style={{
              padding: "1.5rem",
              backgroundColor: "white",
              borderRadius: "1rem",
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
              Recent Updates
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div
                  style={{
                    width: "0.5rem",
                    height: "0.5rem",
                    marginTop: "0.375rem",
                    borderRadius: "50%",
                    backgroundColor: "#0ea5e9",
                    flexShrink: 0,
                  }}
                ></div>
                <div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#292524",
                      margin: "0 0 0.125rem 0",
                    }}
                  >
                    Appointment confirmed with Dr. Chen
                  </p>
                  <p
                    style={{ fontSize: "0.75rem", color: "#78716c", margin: 0 }}
                  >
                    2 hours ago
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div
                  style={{
                    width: "0.5rem",
                    height: "0.5rem",
                    marginTop: "0.375rem",
                    borderRadius: "50%",
                    backgroundColor: "#d6d3d1",
                    flexShrink: 0,
                  }}
                ></div>
                <div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#292524",
                      margin: "0 0 0.125rem 0",
                    }}
                  >
                    New resource added: Managing Exam Stress
                  </p>
                  <p
                    style={{ fontSize: "0.75rem", color: "#78716c", margin: 0 }}
                  >
                    Yesterday
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
