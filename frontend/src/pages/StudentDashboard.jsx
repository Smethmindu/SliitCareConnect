import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  MessageSquareIcon,
  UserIcon,
  ClockIcon,
  VideoIcon,
  MapPinIcon,
  PhoneIcon,
  SparklesIcon,
  MoreHorizontalIcon,
  BellIcon,
  Loader2Icon,
} from "lucide-react";

const API = "http://localhost:3000";
const STUDENT_ID = "demo-student-1";

function StatusBadge({ status }) {
  const styles = {
    pending:   { bg: "#fffbeb", text: "#b45309" },
    confirmed: { bg: "#dcfce7", text: "#166534" },
    declined:  { bg: "#fef2f2", text: "#991b1b" },
    cancelled: { bg: "#f5f5f4", text: "#57534e" },
  };
  const s = styles[status] || styles.pending;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "0.125rem 0.625rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, backgroundColor: s.bg, color: s.text, textTransform: "capitalize" }}>
      {status}
    </span>
  );
}

function SessionTypeIcon({ type }) {
  if (type === "in-person") return <MapPinIcon style={{ height: "1rem", width: "1rem", color: "#a8a29e" }} />;
  if (type === "phone") return <PhoneIcon style={{ height: "1rem", width: "1rem", color: "#a8a29e" }} />;
  return <VideoIcon style={{ height: "1rem", width: "1rem", color: "#a8a29e" }} />;
}

export function StudentDashboard() {
  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    // Fetch bookings
    fetch(`${API}/api/bookings/student/${STUDENT_ID}`)
      .then((r) => r.json())
      .then((data) => setBookings(data.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoadingBookings(false));

    // Fetch notifications
    fetch(`${API}/api/notifications/${STUDENT_ID}`)
      .then((r) => r.json())
      .then((data) => setNotifications(data.data || []))
      .catch(() => setNotifications([]));
  }, []);

  const upcoming = bookings.filter((b) => b.status === "pending" || b.status === "confirmed");
  const past = bookings.filter((b) => b.status === "declined" || b.status === "cancelled");
  const displayed = activeTab === "upcoming" ? upcoming : past;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const formatSessionLabel = (type) =>
    type === "video" ? "Video Call" : type === "in-person" ? "In-Person" : "Phone Call";

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
      style={{ display: "flex", flexDirection: "column", gap: "2rem", paddingBottom: "3rem", maxWidth: "72rem", margin: "0 auto" }}
    >
      {/* Welcome Banner */}
      <motion.div variants={fadeIn}>
        <div style={{ background: "linear-gradient(to bottom right, #0ea5e9, #0284c7)", color: "white", padding: "2rem", borderRadius: "1rem", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "16rem", height: "16rem", backgroundColor: "white", opacity: 0.05, borderRadius: "50%", transform: "translateY(-50%) translateX(33%)", filter: "blur(32px)" }} />
          <div style={{ position: "relative", zIndex: 10 }}>
            <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "0.5rem", marginTop: 0 }}>Welcome back, Sarah 👋</h1>
            <p style={{ color: "#e0f2fe", maxWidth: "36rem", fontSize: "1.125rem", margin: 0 }}>
              "Healing takes time, and asking for help is a courageous step."
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeIn} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
        <Link to="/book" style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem", backgroundColor: "white", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)", cursor: "pointer" }}>
            <div style={{ backgroundColor: "#f0f9ff", padding: "0.75rem", borderRadius: "0.75rem", color: "#0ea5e9" }}>
              <CalendarIcon style={{ height: "1.5rem", width: "1.5rem" }} />
            </div>
            <div>
              <h3 style={{ fontWeight: 600, color: "#1c1917", margin: "0 0 0.125rem 0" }}>Book Session</h3>
              <p style={{ fontSize: "0.875rem", color: "#78716c", margin: 0 }}>Schedule a new appointment</p>
            </div>
          </div>
        </Link>
        <Link to="/messages" style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem", backgroundColor: "white", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)", cursor: "pointer" }}>
            <div style={{ backgroundColor: "#f0fdf4", padding: "0.75rem", borderRadius: "0.75rem", color: "#16a34a" }}>
              <MessageSquareIcon style={{ height: "1.5rem", width: "1.5rem" }} />
            </div>
            <div>
              <h3 style={{ fontWeight: 600, color: "#1c1917", margin: "0 0 0.125rem 0" }}>Messages</h3>
              <p style={{ fontSize: "0.875rem", color: "#78716c", margin: 0 }}>View your messages</p>
            </div>
          </div>
        </Link>
        <Link to="/settings" style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem", backgroundColor: "white", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)", cursor: "pointer" }}>
            <div style={{ backgroundColor: "#f5f3ff", padding: "0.75rem", borderRadius: "0.75rem", color: "#8b5cf6" }}>
              <UserIcon style={{ height: "1.5rem", width: "1.5rem" }} />
            </div>
            <div>
              <h3 style={{ fontWeight: 600, color: "#1c1917", margin: "0 0 0.125rem 0" }}>My Profile</h3>
              <p style={{ fontSize: "0.875rem", color: "#78716c", margin: 0 }}>Update preferences</p>
            </div>
          </div>
        </Link>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        {/* ── Main: Appointments ── */}
        <motion.div variants={fadeIn} style={{ gridColumn: "span 2 / span 2", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ padding: "1.5rem", backgroundColor: "white", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1c1917", margin: 0 }}>Your Appointments</h2>
              <Link to="/book" style={{ textDecoration: "none" }}>
                <button style={{ padding: "0.375rem 0.75rem", fontSize: "0.875rem", borderRadius: "0.375rem", fontWeight: 500, backgroundColor: "transparent", color: "#57534e", border: "1px solid transparent", cursor: "pointer", outline: "none" }}>
                  Book New
                </button>
              </Link>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "2rem", borderBottom: "1px solid #e7e5e4", marginBottom: "1.5rem" }}>
              {[["upcoming", "Upcoming"], ["past", "Past Sessions"]].map(([tab, label]) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{ position: "relative", padding: "0.75rem 0.25rem", fontSize: "0.875rem", fontWeight: 500, whiteSpace: "nowrap", border: "none", background: "none", cursor: "pointer", outline: "none", color: activeTab === tab ? "#0ea5e9" : "#78716c" }}
                >
                  {label}
                  {activeTab === tab && <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: "2px", backgroundColor: "#0ea5e9", borderRadius: "9999px" }} />}
                </button>
              ))}
            </div>

            {/* Booking list */}
            {loadingBookings ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem", color: "#a8a29e", gap: "0.75rem" }}>
                <Loader2Icon style={{ height: "1.5rem", width: "1.5rem", animation: "spin 1s linear infinite" }} />
                <span>Loading appointments…</span>
              </div>
            ) : displayed.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#78716c" }}>
                <CalendarIcon style={{ height: "3rem", width: "3rem", margin: "0 auto 1rem auto", color: "#d6d3d1" }} />
                <p style={{ fontWeight: 500, marginBottom: "0.5rem", margin: "0 0 0.5rem 0" }}>No {activeTab === "upcoming" ? "upcoming" : "past"} appointments</p>
                {activeTab === "upcoming" && (
                  <Link to="/book" style={{ textDecoration: "none" }}>
                    <button style={{ marginTop: "1rem", padding: "0.5rem 1.5rem", backgroundColor: "#0ea5e9", color: "white", border: "none", borderRadius: "0.5rem", fontWeight: 500, cursor: "pointer", fontSize: "0.875rem" }}>
                      Book a Session
                    </button>
                  </Link>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {displayed.map((apt) => (
                  <div key={apt._id} style={{ border: "1px solid #f5f5f4", borderRadius: "1rem", padding: "1.25rem", backgroundColor: "rgba(250,250,249,0.3)" }}>
                    {/* Top row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ height: "3.5rem", width: "3.5rem", borderRadius: "50%", backgroundColor: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", color: "#0284c7", fontWeight: "bold", fontSize: "1.25rem", flexShrink: 0 }}>
                          {apt.counselorName?.[0] || "C"}
                        </div>
                        <div>
                          <h3 style={{ fontWeight: 600, color: "#1c1917", margin: "0 0 0.125rem 0" }}>{apt.counselorName}</h3>
                          <p style={{ fontSize: "0.875rem", color: "#78716c", margin: 0 }}>Counselor</p>
                        </div>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>

                    {/* Details grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem", backgroundColor: "white", padding: "0.75rem", borderRadius: "0.75rem", border: "1px solid #f5f5f4", marginBottom: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#57534e" }}>
                        <CalendarIcon style={{ height: "1rem", width: "1rem", color: "#a8a29e" }} /> {apt.date}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#57534e" }}>
                        <ClockIcon style={{ height: "1rem", width: "1rem", color: "#a8a29e" }} /> {apt.time}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#57534e" }}>
                        <SessionTypeIcon type={apt.sessionType} /> {formatSessionLabel(apt.sessionType)}
                      </div>
                    </div>

                    {/* Action buttons (only for upcoming confirmed) */}
                    {apt.status === "confirmed" && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                        <button style={{ flex: "1 1 auto", padding: "0.5rem 1rem", borderRadius: "0.375rem", fontSize: "0.875rem", fontWeight: 500, backgroundColor: "#0ea5e9", color: "white", border: "none", cursor: "pointer", outline: "none" }}>
                          Join Session
                        </button>
                        <button style={{ flex: "1 1 auto", padding: "0.5rem 1rem", borderRadius: "0.375rem", fontSize: "0.875rem", fontWeight: 500, backgroundColor: "white", color: "#57534e", border: "1px solid #e7e5e4", cursor: "pointer", outline: "none" }}>
                          Reschedule
                        </button>
                        <button style={{ padding: "0.625rem", color: "#a8a29e", background: "none", border: "none", borderRadius: "0.75rem", cursor: "pointer" }}>
                          <MoreHorizontalIcon style={{ height: "1.25rem", width: "1.25rem" }} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Sidebar ── */}
        <motion.div variants={fadeIn} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Wellness Tip */}
          <div style={{ padding: "1.5rem", backgroundColor: "#f0fdf4", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", color: "#15803d" }}>
              <SparklesIcon style={{ height: "1.25rem", width: "1.25rem" }} />
              <h3 style={{ fontWeight: 600, margin: 0 }}>Tip of the Day</h3>
            </div>
            <p style={{ color: "#44403c", fontSize: "0.875rem", lineHeight: 1.625, margin: 0 }}>
              Take 5 minutes today to practice box breathing: Inhale for 4 seconds, hold for 4, exhale for 4, hold for 4. Repeat.
            </p>
            <Link to="/blog" style={{ fontSize: "0.875rem", fontWeight: 500, color: "#15803d", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "1rem" }}>
              Read more tips →
            </Link>
          </div>

          {/* Notifications */}
          <div style={{ padding: "1.5rem", backgroundColor: "white", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BellIcon style={{ height: "1.125rem", width: "1.125rem", color: "#78716c" }} />
                <h3 style={{ fontWeight: 600, color: "#1c1917", margin: 0 }}>Recent Updates</h3>
              </div>
              {unreadCount > 0 && (
                <span style={{ backgroundColor: "#0ea5e9", color: "white", borderRadius: "9999px", fontSize: "0.7rem", fontWeight: 700, padding: "0.1rem 0.5rem" }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {notifications.length === 0 ? (
                <p style={{ fontSize: "0.875rem", color: "#78716c", margin: 0 }}>No notifications yet.</p>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <div key={n._id} style={{ display: "flex", gap: "0.75rem" }}>
                    <div style={{ width: "0.5rem", height: "0.5rem", marginTop: "0.375rem", borderRadius: "50%", backgroundColor: n.isRead ? "#d6d3d1" : "#0ea5e9", flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: "0.875rem", color: "#292524", margin: "0 0 0.125rem 0", fontWeight: n.isRead ? 400 : 500 }}>{n.message}</p>
                      <p style={{ fontSize: "0.75rem", color: "#78716c", margin: 0 }}>
                        {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}
