import { motion } from "framer-motion";
import {
  CalendarIcon,
  ClockIcon,
  VideoIcon,
  FileTextIcon,
  MessageSquareIcon,
  ArrowLeftIcon,
  AlertCircleIcon,
  CalendarClockIcon,
  MapPinIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

export function AppointmentDetails() {
  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  const appointment = {
    id: "APT-8923",
    patientName: "Sarah Jenkins",
    patientId: "STU-2024-0847",
    counselor: "Dr. Emily Chen",
    date: "Oct 24, 2024",
    time: "10:00 AM - 10:50 AM",
    type: "Video Call",
    status: "Upcoming",
    notes:
      "Patient requested to discuss ongoing academic stress and test anxiety.",
    historyCount: 4,
    avatar: "https://i.pravatar.cc/150?u=sarahj",
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
      style={{
        maxWidth: "64rem",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        paddingBottom: "3rem",
      }}
    >
      <motion.div variants={fadeIn}>
        <div style={{ marginBottom: "1.5rem" }}>
          <Link
            to="/appointments"
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
            <ArrowLeftIcon
              style={{ height: "1rem", width: "1rem", marginRight: "0.25rem" }}
            />{" "}
            Back to Schedule
          </Link>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: window.innerWidth < 640 ? "column" : "row",
            alignItems: window.innerWidth < 640 ? "flex-start" : "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "1.875rem",
                fontFamily: "sans-serif",
                fontWeight: "bold",
                color: "#1c1917",
                marginBottom: "0.25rem",
                marginTop: 0,
              }}
            >
              Appointment Details
            </h1>
            <p style={{ color: "#78716c", margin: 0 }}>ID: {appointment.id}</p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
                fontSize: "0.875rem",
                fontWeight: 500,
                backgroundColor: "#dcfce7",
                color: "#166534",
              }}
            >
              {appointment.status}
            </span>
          </div>
        </div>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <motion.div
          variants={fadeIn}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "1rem",
              padding: "2rem",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "#1c1917",
                marginBottom: "1.5rem",
                marginTop: 0,
              }}
            >
              Session Information
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div style={{ display: "flex", gap: "1rem" }}>
                <div
                  style={{
                    padding: "0.5rem",
                    backgroundColor: "#f0f9ff",
                    color: "#0ea5e9",
                    borderRadius: "0.5rem",
                  }}
                >
                  <CalendarIcon
                    style={{ height: "1.25rem", width: "1.25rem" }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#78716c",
                      margin: "0 0 0.125rem 0",
                    }}
                  >
                    Date
                  </p>
                  <p style={{ fontWeight: 500, color: "#1c1917", margin: 0 }}>
                    {appointment.date}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div
                  style={{
                    padding: "0.5rem",
                    backgroundColor: "#f0fdf4",
                    color: "#10b981",
                    borderRadius: "0.5rem",
                  }}
                >
                  <ClockIcon style={{ height: "1.25rem", width: "1.25rem" }} />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#78716c",
                      margin: "0 0 0.125rem 0",
                    }}
                  >
                    Time
                  </p>
                  <p style={{ fontWeight: 500, color: "#1c1917", margin: 0 }}>
                    {appointment.time} (50 min)
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div
                  style={{
                    padding: "0.5rem",
                    backgroundColor: "#fff7ed",
                    color: "#f59e0b",
                    borderRadius: "0.5rem",
                  }}
                >
                  {appointment.type.includes("Video") ? (
                    <VideoIcon
                      style={{ height: "1.25rem", width: "1.25rem" }}
                    />
                  ) : (
                    <MapPinIcon
                      style={{ height: "1.25rem", width: "1.25rem" }}
                    />
                  )}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#78716c",
                      margin: "0 0 0.125rem 0",
                    }}
                  >
                    Type / Location
                  </p>
                  <p style={{ fontWeight: 500, color: "#1c1917", margin: 0 }}>
                    {appointment.type}
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid #f5f5f4",
                marginTop: "1.5rem",
                paddingTop: "1.5rem",
              }}
            >
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <VideoIcon style={{ height: "1.25rem", width: "1.25rem" }} />{" "}
                Join Video Call
              </button>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "white",
              borderRadius: "1rem",
              padding: "2rem",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "#1c1917",
                marginBottom: "1.5rem",
                marginTop: 0,
              }}
            >
              Actions
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  width: "100%",
                  textAlign: "left",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  backgroundColor: "transparent",
                  color: "#57534e",
                  border: "1px solid #e7e5e4",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <CalendarClockIcon
                  style={{ height: "1.25rem", width: "1.25rem" }}
                />{" "}
                Reschedule
              </button>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  width: "100%",
                  textAlign: "left",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  backgroundColor: "transparent",
                  color: "#dc2626",
                  border: "1px solid #fecaca",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <AlertCircleIcon
                  style={{ height: "1.25rem", width: "1.25rem" }}
                />{" "}
                Cancel Appointment
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeIn}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "1rem",
              padding: "2rem",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "#1c1917",
                marginBottom: "1.5rem",
                marginTop: 0,
              }}
            >
              Patient Information
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
                padding: "1rem",
                backgroundColor: "#fafaf9",
                borderRadius: "0.75rem",
                border: "1px solid #f5f5f4",
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
                  src={appointment.avatar}
                  alt="Avatar"
                  style={{ height: "100%", width: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    fontWeight: 600,
                    color: "#1c1917",
                    margin: "0 0 0.125rem 0",
                  }}
                >
                  {appointment.patientName}
                </h4>
                <p
                  style={{ fontSize: "0.875rem", color: "#78716c", margin: 0 }}
                >
                  ID: {appointment.patientId}
                </p>
              </div>
              <Link to="/messages" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    padding: "0.5rem",
                    color: "#0ea5e9",
                    background: "none",
                    border: "1px solid #bae6fd",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  <MessageSquareIcon
                    style={{ height: "1.25rem", width: "1.25rem" }}
                  />
                </button>
              </Link>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h5
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#44403c",
                  marginBottom: "0.5rem",
                  marginTop: 0,
                }}
              >
                Pre-session Notes
              </h5>
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: "#fdfbf7",
                  border: "1px solid #f5f5f4",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  color: "#57534e",
                  fontStyle: "italic",
                }}
              >
                "{appointment.notes}"
              </div>
            </div>

            <button
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: "#fafaf9",
                border: "1px solid #e7e5e4",
                borderRadius: "0.5rem",
                cursor: "pointer",
                color: "#44403c",
                fontWeight: 500,
                outline: "none",
              }}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <FileTextIcon
                  style={{
                    height: "1.25rem",
                    width: "1.25rem",
                    color: "#a8a29e",
                  }}
                />{" "}
                Session History
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.125rem 0.625rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  backgroundColor: "#e7e5e4",
                  color: "#57534e",
                }}
              >
                {appointment.historyCount} past
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
