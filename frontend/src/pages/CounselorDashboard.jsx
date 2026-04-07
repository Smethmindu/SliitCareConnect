import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const API_BASE_URL = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("token") ?? sessionStorage.getItem("token") ?? null;
}

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toISOString().split("T")[0];
}

export function CounselorDashboard() {
  const [students, setStudents] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "1rem",
    border: "1px solid #e7e5e4",
    padding: "1.25rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  };

  useEffect(() => {
    const loadCounselorData = async () => {
      const token = getToken();
      if (!token) {
        setError("You must be logged in to view dashboard.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        // Get current user info from stored data (from login)
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            console.log('Counselor Dashboard - Loaded current user from storage:', parsedUser);
          } catch (e) {
            console.log("Could not parse stored user data");
          }
        }

        // Get counselor appointments
        const response = await fetch(`${API_BASE_URL}/appointments/counselor`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data?.success) {
          setError(data?.message || `Failed to load appointments (HTTP ${response.status})`);
          setAppointments([]);
          return;
        }

        const appointmentsList = Array.isArray(data?.data?.appointments) ? data.data.appointments : [];
        setAppointments(appointmentsList);
        console.log(`Loaded ${appointmentsList.length} appointments`);

      } catch (err) {
        setError("Network error while loading dashboard.");
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    loadCounselorData();
  }, []);

  const statCards = [
    { 
      label: "Upcoming Sessions", 
      value: appointments.filter(apt => new Date(apt.date) > new Date()).length, 
      icon: "calendar_today", 
      bg: "linear-gradient(135deg,#10b981 0%, #059669 100%)" 
    },
    { 
      label: "Total Students", 
      value: students.length, 
      icon: "people", 
      bg: "linear-gradient(135deg,#3b82f6 0%, #1d4ed8 100%)" 
    },
    { 
      label: "Completed Today", 
      value: appointments.filter(apt => apt.status === 'completed' && new Date(apt.date).toDateString() === new Date().toDateString()).length, 
      icon: "check_circle", 
      bg: "linear-gradient(135deg,#f59e0b 0%, #d97706 100%)" 
    },
    { 
      label: "Pending Reviews", 
      value: appointments.filter(apt => apt.status === 'completed' && !apt.reviewed).length, 
      icon: "rate_review", 
      bg: "linear-gradient(135deg,#8b5cf6 0%, #6366f1 100%)" 
    },
  ];

  const upcomingAppointments = appointments.filter(apt => new Date(apt.date) > new Date()).slice(0, 5);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        paddingBottom: "2rem",
        backgroundColor: "#f4f5f7",
        borderRadius: "0.9rem",
        padding: "1.25rem",
      }}
    >
      {/* Header */}
      <section
        style={{
          ...cardStyle,
          padding: "1.25rem 1.4rem",
          backgroundColor: "#f7f7f8",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "1.75rem",
            color: "#1c1917",
            letterSpacing: "-0.02em",
          }}
        >
          Counseling Dashboard
        </h1>
        <p style={{ marginTop: "0.5rem", color: "#57534e" }}>
          Manage your counseling sessions and student appointments.
        </p>
      </section>

      {/* Statistics Cards */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
          gap: "0.9rem",
        }}
      >
        {statCards.map((card) => (
          <article key={card.label} style={{ ...cardStyle, padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <div
                style={{
                  height: "46px",
                  width: "46px",
                  borderRadius: "0.65rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                  background: card.bg,
                  color: "white",
                }}
              >
                {card.icon === "calendar_today" && "date_range"}
                {card.icon === "people" && "groups"}
                {card.icon === "check_circle" && "task_alt"}
                {card.icon === "rate_review" && "star"}
              </div>
              <div>
                <div style={{ fontSize: "1.9rem", lineHeight: 1, fontWeight: 700, color: "#1f2937" }}>
                  {card.value}
                </div>
                <div style={{ margin: "0.35rem 0 0", color: "#6b7280", fontSize: "0.86rem" }}>{card.label}</div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Recent Appointments */}
      <section style={cardStyle}>
        <h2 style={{ margin: 0, fontSize: "1.05rem", color: "#292524" }}>
          Recent Appointments ({appointments.length})
        </h2>
        
        <div style={{ marginTop: "1rem", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "760px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e7e5e4" }}>
                <th style={{ textAlign: "left", padding: "0.65rem", color: "#78716c", fontSize: "0.82rem" }}>Student</th>
                <th style={{ textAlign: "left", padding: "0.65rem", color: "#78716c", fontSize: "0.82rem" }}>Date</th>
                <th style={{ textAlign: "left", padding: "0.65rem", color: "#78716c", fontSize: "0.82rem" }}>Type</th>
                <th style={{ textAlign: "left", padding: "0.65rem", color: "#78716c", fontSize: "0.82rem" }}>Status</th>
                <th style={{ textAlign: "right", padding: "0.65rem", color: "#78716c", fontSize: "0.82rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.slice(0, 5).map((appointment) => (
                <tr key={appointment._id} style={{ borderBottom: "1px solid #f5f5f4" }}>
                  <td style={{ padding: "0.8rem 0.65rem" }}>
                    <p style={{ margin: 0, color: "#1c1917", fontWeight: 600, fontSize: "0.88rem" }}>
                      {appointment.studentName || "Unknown"}
                    </p>
                  </td>
                  <td style={{ padding: "0.8rem 0.65rem", color: "#57534e", fontSize: "0.85rem" }}>
                    {formatDate(appointment.date)}
                  </td>
                  <td style={{ padding: "0.8rem 0.65rem", color: "#44403c", fontSize: "0.86rem" }}>
                    {appointment.type || "Counseling"}
                  </td>
                  <td style={{ padding: "0.8rem 0.65rem" }}>
                    <span
                      style={{
                        borderRadius: "999px",
                        padding: "0.2rem 0.55rem",
                        fontSize: "0.74rem",
                        fontWeight: 700,
                        textTransform: "capitalize",
                        backgroundColor:
                          appointment.status === "completed"
                            ? "#dcfce7"
                            : appointment.status === "cancelled"
                              ? "#fef2f2"
                              : "#fffbeb",
                        color:
                          appointment.status === "completed"
                            ? "#166534"
                            : appointment.status === "cancelled"
                              ? "#991b1b"
                              : "#92400e",
                      }}
                    >
                      {appointment.status || "scheduled"}
                    </span>
                  </td>
                  <td style={{ padding: "0.8rem 0.65rem", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                      <button
                        style={{
                          border: "1px solid #3b82f6",
                          borderRadius: "0.5rem",
                          padding: "0.34rem 0.6rem",
                          backgroundColor: "#3b82f6",
                          color: "white",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        View
                      </button>
                      <button
                        style={{
                          border: "1px solid #10b981",
                          borderRadius: "0.5rem",
                          padding: "0.34rem 0.6rem",
                          backgroundColor: "#10b981",
                          color: "white",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Actions */}
      <section style={cardStyle}>
        <h2 style={{ margin: 0, fontSize: "1.05rem", color: "#292524" }}>
          Quick Actions
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem", marginTop: "0.9rem" }}>
          <button style={{
            border: "none",
            borderRadius: "0.625rem",
            padding: "0.75rem 1rem",
            backgroundColor: "#10b981",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}>
            Schedule Session
          </button>
          <button style={{ border: "1px solid #d6d3d1", borderRadius: "0.625rem", padding: "0.75rem 1rem", backgroundColor: "white", color: "#44403c", fontWeight: 600, cursor: "pointer" }}>
            View Calendar
          </button>
          <button style={{ border: "1px solid #d6d3d1", borderRadius: "0.625rem", padding: "0.75rem 1rem", backgroundColor: "white", color: "#44403c", fontWeight: 600, cursor: "pointer" }}>
            Student Reports
          </button>
          <button style={{ border: "1px solid #d6d3d1", borderRadius: "0.625rem", padding: "0.75rem 1rem", backgroundColor: "white", color: "#44403c", fontWeight: 600, cursor: "pointer" }}>
            Availability
          </button>
        </div>
      </section>
    </div>
  );
}
