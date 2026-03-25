import { motion } from "framer-motion";
import {
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  FileTextIcon,
  MoreHorizontalIcon,
  VideoIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

export function CounselorDashboard() {
  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  const todaySessions = [
    {
      id: "1",
      patient: "Sarah Jenkins",
      type: "Video Call",
      time: "10:00 AM - 10:50 AM",
      status: "upcoming",
      avatar: "https://i.pravatar.cc/150?u=sarahj",
    },
    {
      id: "2",
      patient: "Michael Thomas",
      type: "In-Person",
      time: "01:00 PM - 01:50 PM",
      status: "upcoming",
      avatar: "https://i.pravatar.cc/150?u=michaelt",
    },
    {
      id: "3",
      patient: "Emma Wilson",
      type: "Video Call",
      time: "03:00 PM - 03:50 PM",
      status: "upcoming",
      avatar: "https://i.pravatar.cc/150?u=emmaw",
    },
  ];

  const pendingRequests = [
    {
      id: "101",
      patient: "James Carter",
      type: "Video Call",
      requestedDate: "Oct 25, 2024",
      requestedTime: "02:00 PM",
      avatar: "https://i.pravatar.cc/150?u=jamesc",
    },
    {
      id: "102",
      patient: "Olivia Reed",
      type: "In-Person",
      requestedDate: "Oct 26, 2024",
      requestedTime: "11:00 AM",
      avatar: "https://i.pravatar.cc/150?u=oliviar",
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
        maxWidth: "80rem",
        margin: "0 auto",
      }}
    >
      {/* Welcome Banner */}
      <motion.div variants={fadeIn}>
        <div
          style={{
            background: "linear-gradient(to bottom right, #10b981, #059669)",
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
              opacity: 0.1,
              borderRadius: "50%",
              transform: "translateY(-50%) translateX(33%)",
              filter: "blur(32px)",
            }}
          ></div>
          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              flexDirection: window.innerWidth < 640 ? "column" : "row",
              alignItems: window.innerWidth < 640 ? "flex-start" : "center",
              justifyContent: "space-between",
              gap: "1.5rem",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "1.875rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                  marginTop: 0,
                }}
              >
                Good morning, Dr. Chen
              </h1>
              <p style={{ color: "#d1fae5", fontSize: "1.125rem", margin: 0 }}>
                You have 3 sessions scheduled today.
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                Update Availability
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analytics Cards */}
      <motion.div
        variants={fadeIn}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
        }}
      >
        {[
          {
            icon: UsersIcon,
            label: "Active Patients",
            value: "42",
            color: "#0ea5e9",
            bg: "#e0f2fe",
          },
          {
            icon: CalendarIcon,
            label: "Sessions This Week",
            value: "18",
            color: "#10b981",
            bg: "#d1fae5",
          },
          {
            icon: ClockIcon,
            label: "Hours Completed",
            value: "124",
            color: "#8b5cf6",
            bg: "#ede9fe",
          },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "white",
              borderRadius: "1rem",
              padding: "1.5rem",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: stat.bg,
                  color: stat.color,
                  flexShrink: 0,
                }}
              >
                <stat.icon style={{ height: "1.5rem", width: "1.5rem" }} />
              </div>
              <div>
                <p
                  style={{
                    color: "#78716c",
                    fontSize: "0.875rem",
                    margin: "0 0 0.25rem 0",
                  }}
                >
                  {stat.label}
                </p>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#1c1917",
                    margin: 0,
                  }}
                >
                  {stat.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        {/* Today's Schedule */}
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
                Today's Schedule
              </h2>
              <Link
                to="/appointments"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#0ea5e9",
                  textDecoration: "none",
                }}
              >
                View Full Calendar{" "}
                <ArrowRightIcon
                  style={{
                    height: "1rem",
                    width: "1rem",
                    marginLeft: "0.25rem",
                  }}
                />
              </Link>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {todaySessions.map((session, index) => (
                <div
                  key={session.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "4rem",
                      textAlign: "right",
                      paddingTop: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "#57534e",
                      }}
                    >
                      {session.time.split(" - ")[0]}
                    </span>
                  </div>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "1.5rem",
                        bottom: "-1.5rem",
                        width: "2px",
                        backgroundColor:
                          index !== todaySessions.length - 1
                            ? "#e7e5e4"
                            : "transparent",
                        zIndex: 0,
                      }}
                    ></div>
                    <div
                      style={{
                        width: "0.75rem",
                        height: "0.75rem",
                        borderRadius: "50%",
                        backgroundColor: "#0ea5e9",
                        border: "4px solid white",
                        position: "relative",
                        zIndex: 10,
                        marginTop: "0.625rem",
                      }}
                    ></div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      backgroundColor: "#f0f9ff",
                      border: "1px solid #bae6fd",
                      borderRadius: "1rem",
                      padding: "1rem",
                      transition: "box-shadow 0.2s",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "0.75rem",
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
                          <img
                            src={session.avatar}
                            alt="Avatar"
                            style={{
                              height: "100%",
                              width: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                        <div>
                          <h4
                            style={{
                              fontWeight: 600,
                              color: "#0369a1",
                              margin: "0 0 0.125rem 0",
                            }}
                          >
                            {session.patient}
                          </h4>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "0.125rem 0.625rem",
                              borderRadius: "9999px",
                              fontSize: "0.75rem",
                              fontWeight: 500,
                              backgroundColor: "white",
                              color: "#0284c7",
                            }}
                          >
                            <VideoIcon
                              style={{
                                height: "0.75rem",
                                width: "0.75rem",
                                marginRight: "0.25rem",
                              }}
                            />{" "}
                            {session.type}
                          </span>
                        </div>
                      </div>
                      <button
                        style={{
                          padding: "0.375rem",
                          color: "#0284c7",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          borderRadius: "0.375rem",
                        }}
                      >
                        <MoreHorizontalIcon
                          style={{ height: "1.25rem", width: "1.25rem" }}
                        />
                      </button>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        style={{
                          flex: 1,
                          padding: "0.375rem 0.5rem",
                          fontSize: "0.875rem",
                          borderRadius: "0.375rem",
                          fontWeight: 500,
                          backgroundColor: "#0ea5e9",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          outline: "none",
                        }}
                      >
                        Join Call
                      </button>
                      <button
                        style={{
                          flex: 1,
                          padding: "0.375rem 0.5rem",
                          fontSize: "0.875rem",
                          borderRadius: "0.375rem",
                          fontWeight: 500,
                          backgroundColor: "white",
                          color: "#0369a1",
                          border: "1px solid #bae6fd",
                          cursor: "pointer",
                          outline: "none",
                        }}
                      >
                        View Notes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: "1.5rem",
              backgroundColor: "white",
              borderRadius: "1rem",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "#1c1917",
                marginBottom: "1.5rem",
                marginTop: 0,
              }}
            >
              Pending Requests
            </h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  style={{
                    display: "flex",
                    flexDirection: window.innerWidth < 640 ? "column" : "row",
                    alignItems:
                      window.innerWidth < 640 ? "flex-start" : "center",
                    justifyContent: "space-between",
                    padding: "1rem",
                    border: "1px solid #f5f5f4",
                    borderRadius: "0.75rem",
                    gap: "1rem",
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
                        height: "3rem",
                        width: "3rem",
                        borderRadius: "50%",
                        backgroundColor: "#e7e5e4",
                        color: "#57534e",
                        fontSize: "1.25rem",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={req.avatar}
                        alt="Avatar"
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div>
                      <h4
                        style={{
                          fontWeight: 600,
                          color: "#1c1917",
                          margin: "0 0 0.125rem 0",
                        }}
                      >
                        {req.patient}
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.75rem",
                          color: "#78716c",
                          fontSize: "0.875rem",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <CalendarIcon
                            style={{ height: "1rem", width: "1rem" }}
                          />{" "}
                          {req.requestedDate}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <ClockIcon
                            style={{ height: "1rem", width: "1rem" }}
                          />{" "}
                          {req.requestedTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      width: window.innerWidth < 640 ? "100%" : "auto",
                    }}
                  >
                    <button
                      style={{
                        flex: 1,
                        padding: "0.375rem 0.75rem",
                        fontSize: "0.875rem",
                        borderRadius: "0.375rem",
                        fontWeight: 500,
                        backgroundColor: "white",
                        color: "#dc2626",
                        border: "1px solid #fecaca",
                        cursor: "pointer",
                        outline: "none",
                      }}
                    >
                      Decline
                    </button>
                    <button
                      style={{
                        flex: 1,
                        padding: "0.375rem 0.75rem",
                        fontSize: "0.875rem",
                        borderRadius: "0.375rem",
                        fontWeight: 500,
                        backgroundColor: "#10b981",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        outline: "none",
                      }}
                    >
                      Approve
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
              Quick Actions
            </h3>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <button
                style={{
                  width: "100%",
                  padding: "0.5rem 1rem",
                  fontSize: "0.875rem",
                  borderRadius: "0.375rem",
                  fontWeight: 500,
                  backgroundColor: "#f0f9ff",
                  color: "#0369a1",
                  border: "1px solid #bae6fd",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  outline: "none",
                }}
              >
                <FileTextIcon style={{ height: "1.25rem", width: "1.25rem" }} />{" "}
                Review Waiting List
              </button>
              <button
                style={{
                  width: "100%",
                  padding: "0.5rem 1rem",
                  fontSize: "0.875rem",
                  borderRadius: "0.375rem",
                  fontWeight: 500,
                  backgroundColor: "#f0fdf4",
                  color: "#15803d",
                  border: "1px solid #bbf7d0",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  outline: "none",
                }}
              >
                <CheckCircleIcon
                  style={{ height: "1.25rem", width: "1.25rem" }}
                />{" "}
                Complete Session Notes
              </button>
              <Link to="/availability" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    width: "100%",
                    padding: "0.5rem 1rem",
                    fontSize: "0.875rem",
                    borderRadius: "0.375rem",
                    fontWeight: 500,
                    backgroundColor: "#f5f3ff",
                    color: "#6d28d9",
                    border: "1px solid #ddd6fe",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    outline: "none",
                  }}
                >
                  <CalendarIcon
                    style={{ height: "1.25rem", width: "1.25rem" }}
                  />{" "}
                  Edit Availability
                </button>
              </Link>
            </div>
          </div>

          <div
            style={{
              padding: "1.5rem",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "1rem",
            }}
          >
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "#991b1b",
                marginBottom: "0.5rem",
                marginTop: 0,
              }}
            >
              Crisis Alerts
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#b91c1c",
                marginBottom: "1rem",
                margin: 0,
              }}
            >
              No immediate crisis alerts assigned to you at this time.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
