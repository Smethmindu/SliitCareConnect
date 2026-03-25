import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  FileTextIcon,
  MoreHorizontalIcon,
  VideoIcon,
  MapPinIcon,
  PhoneIcon,
  BellIcon,
  Loader2Icon,
} from "lucide-react";
import { Link } from "react-router-dom";

const API = "http://localhost:3000";
const COUNSELOR_ID = "demo-counselor-1";

export function CounselorDashboard() {
  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // bookingId being actioned

  useEffect(() => {
    fetch(`${API}/api/bookings/counselor/${COUNSELOR_ID}`)
      .then((r) => r.json())
      .then((d) => setBookings(d.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoadingBookings(false));

    fetch(`${API}/api/notifications/${COUNSELOR_ID}`)
      .then((r) => r.json())
      .then((d) => setNotifications(d.data || []))
      .catch(() => setNotifications([]));
  }, []);

  const pendingRequests = bookings.filter((b) => b.status === "pending");
  const todaySessions = bookings.filter((b) => b.status === "confirmed");
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleStatusUpdate = async (bookingId, status) => {
    setActionLoading(bookingId);
    try {
      const res = await fetch(`${API}/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? data.data : b))
        );
        // Refresh notifications
        fetch(`${API}/api/notifications/${COUNSELOR_ID}`)
          .then((r) => r.json())
          .then((d) => setNotifications(d.data || []));
      }
    } catch {
      // silent fail
    } finally {
      setActionLoading(null);
    }
  };

  const markAllRead = async () => {
    await fetch(`${API}/api/notifications/markAllRead/${COUNSELOR_ID}`, {
      method: "PATCH",
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const sessionTypeIcon = (type) => {
    if (type === "in-person") return <MapPinIcon style={{ height: "0.875rem", width: "0.875rem", marginRight: "0.25rem" }} />;
    if (type === "phone") return <PhoneIcon style={{ height: "0.875rem", width: "0.875rem", marginRight: "0.25rem" }} />;
    return <VideoIcon style={{ height: "0.875rem", width: "0.875rem", marginRight: "0.25rem" }} />;
  };

  const sessionTypeLabel = (type) =>
    type === "video" ? "Video Call" : type === "in-person" ? "In-Person" : "Phone Call";

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
      style={{ display: "flex", flexDirection: "column", gap: "2rem", paddingBottom: "3rem", maxWidth: "80rem", margin: "0 auto" }}
    >
      {/* Welcome Banner */}
      <motion.div variants={fadeIn}>
        <div style={{ background: "linear-gradient(to bottom right, #10b981, #059669)", color: "white", padding: "2rem", borderRadius: "1rem", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "16rem", height: "16rem", backgroundColor: "white", opacity: 0.1, borderRadius: "50%", transform: "translateY(-50%) translateX(33%)", filter: "blur(32px)" }} />
          <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "0.5rem", marginTop: 0 }}>Good morning, Dr. Chen 👨‍⚕️</h1>
              <p style={{ color: "#d1fae5", fontSize: "1.125rem", margin: 0 }}>
                {pendingRequests.length > 0
                  ? `You have ${pendingRequests.length} pending booking request${pendingRequests.length > 1 ? "s" : ""}.`
                  : todaySessions.length > 0
                  ? `You have ${todaySessions.length} confirmed session${todaySessions.length > 1 ? "s" : ""} today.`
                  : "No pending requests right now."}
              </p>
            </div>
            {/* Notification bell */}
            <div style={{ position: "relative", display: "inline-flex" }}>
              <div style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "0.75rem", padding: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "white", cursor: "pointer" }} onClick={markAllRead} title="Mark all as read">
                <BellIcon style={{ height: "1.5rem", width: "1.5rem" }} />
                <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Notifications</span>
              </div>
              {unreadCount > 0 && (
                <span style={{ position: "absolute", top: "-6px", right: "-6px", backgroundColor: "#ef4444", color: "white", borderRadius: "9999px", fontSize: "0.7rem", fontWeight: 700, padding: "0.15rem 0.45rem", minWidth: "1.2rem", textAlign: "center" }}>
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analytics Cards */}
      <motion.div variants={fadeIn} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        {[
          { icon: UsersIcon, label: "Total Bookings", value: bookings.length, color: "#0ea5e9", bg: "#e0f2fe" },
          { icon: CalendarIcon, label: "Confirmed Sessions", value: todaySessions.length, color: "#10b981", bg: "#d1fae5" },
          { icon: ClockIcon, label: "Pending Requests", value: pendingRequests.length, color: "#f59e0b", bg: "#fef3c7" },
        ].map((stat, i) => (
          <div key={i} style={{ backgroundColor: "white", borderRadius: "1rem", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "3rem", height: "3rem", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: stat.bg, color: stat.color, flexShrink: 0 }}>
                <stat.icon style={{ height: "1.5rem", width: "1.5rem" }} />
              </div>
              <div>
                <p style={{ color: "#78716c", fontSize: "0.875rem", margin: "0 0 0.25rem 0" }}>{stat.label}</p>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1c1917", margin: 0 }}>{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        {/* ── Main ── */}
        <motion.div variants={fadeIn} style={{ gridColumn: "span 2 / span 2", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Confirmed Sessions */}
          <div style={{ padding: "1.5rem", backgroundColor: "white", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1c1917", margin: 0 }}>Confirmed Sessions</h2>
              <Link to="/appointments" style={{ display: "inline-flex", alignItems: "center", fontSize: "0.875rem", fontWeight: 500, color: "#0ea5e9", textDecoration: "none" }}>
                View All <ArrowRightIcon style={{ height: "1rem", width: "1rem", marginLeft: "0.25rem" }} />
              </Link>
            </div>

            {loadingBookings ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", color: "#a8a29e", gap: "0.75rem" }}>
                <Loader2Icon style={{ height: "1.5rem", width: "1.5rem", animation: "spin 1s linear infinite" }} /> Loading…
              </div>
            ) : todaySessions.length === 0 ? (
              <p style={{ color: "#78716c", textAlign: "center", padding: "2rem", margin: 0 }}>No confirmed sessions yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {todaySessions.map((session, index) => (
                  <div key={session._id} style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    <div style={{ width: "4rem", textAlign: "right", paddingTop: "0.5rem" }}>
                      <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#57534e" }}>{session.time?.split(" - ")[0] || session.time}</span>
                    </div>
                    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ position: "absolute", top: "1.5rem", bottom: "-1.5rem", width: "2px", backgroundColor: index < todaySessions.length - 1 ? "#e7e5e4" : "transparent", zIndex: 0 }} />
                      <div style={{ width: "0.75rem", height: "0.75rem", borderRadius: "50%", backgroundColor: "#10b981", border: "4px solid white", position: "relative", zIndex: 10, marginTop: "0.625rem" }} />
                    </div>
                    <div style={{ flex: 1, backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "1rem", padding: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                        <div>
                          <h4 style={{ fontWeight: 600, color: "#166534", margin: "0 0 0.125rem 0" }}>{session.studentName}</h4>
                          <span style={{ display: "inline-flex", alignItems: "center", padding: "0.125rem 0.625rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 500, backgroundColor: "white", color: "#0284c7" }}>
                            {sessionTypeIcon(session.sessionType)} {sessionTypeLabel(session.sessionType)}
                          </span>
                        </div>
                        <button style={{ padding: "0.375rem", color: "#16a34a", background: "none", border: "none", cursor: "pointer", borderRadius: "0.375rem" }}>
                          <MoreHorizontalIcon style={{ height: "1.25rem", width: "1.25rem" }} />
                        </button>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button style={{ flex: 1, padding: "0.375rem 0.5rem", fontSize: "0.875rem", borderRadius: "0.375rem", fontWeight: 500, backgroundColor: "#10b981", color: "white", border: "none", cursor: "pointer", outline: "none" }}>
                          Join Call
                        </button>
                        <button style={{ flex: 1, padding: "0.375rem 0.5rem", fontSize: "0.875rem", borderRadius: "0.375rem", fontWeight: 500, backgroundColor: "white", color: "#166534", border: "1px solid #bbf7d0", cursor: "pointer", outline: "none" }}>
                          View Notes
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Requests */}
          <div style={{ padding: "1.5rem", backgroundColor: "white", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1c1917", margin: 0 }}>
                Pending Requests
                {pendingRequests.length > 0 && (
                  <span style={{ marginLeft: "0.5rem", backgroundColor: "#fbbf24", color: "#78350f", fontSize: "0.75rem", fontWeight: 700, borderRadius: "9999px", padding: "0.1rem 0.5rem" }}>
                    {pendingRequests.length}
                  </span>
                )}
              </h2>
            </div>

            {loadingBookings ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", color: "#a8a29e", gap: "0.75rem" }}>
                <Loader2Icon style={{ height: "1.5rem", width: "1.5rem", animation: "spin 1s linear infinite" }} /> Loading…
              </div>
            ) : pendingRequests.length === 0 ? (
              <p style={{ color: "#78716c", textAlign: "center", padding: "2rem", margin: 0 }}>No pending booking requests.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {pendingRequests.map((req) => (
                  <div key={req._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", border: "1px solid #f5f5f4", borderRadius: "0.75rem", gap: "1rem", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ height: "3rem", width: "3rem", borderRadius: "50%", backgroundColor: "#f0f9ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#0284c7", fontWeight: "bold", fontSize: "1.125rem", flexShrink: 0 }}>
                        {req.studentName?.[0] || "S"}
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 600, color: "#1c1917", margin: "0 0 0.25rem 0" }}>{req.studentName}</h4>
                        <div style={{ display: "flex", gap: "0.75rem", color: "#78716c", fontSize: "0.875rem", flexWrap: "wrap" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <CalendarIcon style={{ height: "0.875rem", width: "0.875rem" }} /> {req.date}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <ClockIcon style={{ height: "0.875rem", width: "0.875rem" }} /> {req.time}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            {sessionTypeIcon(req.sessionType)} {sessionTypeLabel(req.sessionType)}
                          </span>
                        </div>
                        {req.notes && (
                          <p style={{ fontSize: "0.8rem", color: "#57534e", margin: "0.25rem 0 0 0", fontStyle: "italic" }}>"{req.notes}"</p>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <button
                        onClick={() => handleStatusUpdate(req._id, "declined")}
                        disabled={actionLoading === req._id}
                        style={{ padding: "0.375rem 0.75rem", fontSize: "0.875rem", borderRadius: "0.375rem", fontWeight: 500, backgroundColor: "white", color: "#dc2626", border: "1px solid #fecaca", cursor: "pointer", outline: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}
                      >
                        {actionLoading === req._id ? <Loader2Icon style={{ height: "0.875rem", width: "0.875rem", animation: "spin 1s linear infinite" }} /> : <XCircleIcon style={{ height: "0.875rem", width: "0.875rem" }} />}
                        Decline
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(req._id, "confirmed")}
                        disabled={actionLoading === req._id}
                        style={{ padding: "0.375rem 0.75rem", fontSize: "0.875rem", borderRadius: "0.375rem", fontWeight: 500, backgroundColor: "#10b981", color: "white", border: "none", cursor: "pointer", outline: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}
                      >
                        {actionLoading === req._id ? <Loader2Icon style={{ height: "0.875rem", width: "0.875rem", animation: "spin 1s linear infinite" }} /> : <CheckCircleIcon style={{ height: "0.875rem", width: "0.875rem" }} />}
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Sidebar ── */}
        <motion.div variants={fadeIn} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Notifications panel */}
          <div style={{ padding: "1.5rem", backgroundColor: "white", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BellIcon style={{ height: "1.125rem", width: "1.125rem", color: "#78716c" }} />
                <h3 style={{ fontWeight: 600, color: "#1c1917", margin: 0 }}>Notifications</h3>
              </div>
              {unreadCount > 0 && (
                <button onClick={markAllRead} style={{ fontSize: "0.75rem", color: "#0ea5e9", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
                  Mark all read
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {notifications.length === 0 ? (
                <p style={{ fontSize: "0.875rem", color: "#78716c", margin: 0 }}>No notifications yet.</p>
              ) : (
                notifications.slice(0, 6).map((n) => (
                  <div key={n._id} style={{ display: "flex", gap: "0.75rem" }}>
                    <div style={{ width: "0.5rem", height: "0.5rem", marginTop: "0.375rem", borderRadius: "50%", backgroundColor: n.isRead ? "#d6d3d1" : "#10b981", flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: "0.8rem", color: "#292524", margin: "0 0 0.125rem 0", fontWeight: n.isRead ? 400 : 600 }}>{n.message}</p>
                      <p style={{ fontSize: "0.7rem", color: "#78716c", margin: 0 }}>
                        {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ padding: "1.5rem", backgroundColor: "white", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontWeight: 600, color: "#1c1917", marginBottom: "1rem", marginTop: 0 }}>Quick Actions</h3>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <button style={{ width: "100%", padding: "0.5rem 1rem", fontSize: "0.875rem", borderRadius: "0.375rem", fontWeight: 500, backgroundColor: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", outline: "none" }}>
                <FileTextIcon style={{ height: "1.25rem", width: "1.25rem" }} /> Review Waiting List
              </button>
              <button style={{ width: "100%", padding: "0.5rem 1rem", fontSize: "0.875rem", borderRadius: "0.375rem", fontWeight: 500, backgroundColor: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", outline: "none" }}>
                <CheckCircleIcon style={{ height: "1.25rem", width: "1.25rem" }} /> Complete Session Notes
              </button>
              <Link to="/counselor-availability" style={{ textDecoration: "none" }}>
                <button style={{ width: "100%", padding: "0.5rem 1rem", fontSize: "0.875rem", borderRadius: "0.375rem", fontWeight: 500, backgroundColor: "#f5f3ff", color: "#6d28d9", border: "1px solid #ddd6fe", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", outline: "none" }}>
                  <CalendarIcon style={{ height: "1.25rem", width: "1.25rem" }} /> Edit Availability
                </button>
              </Link>
            </div>
          </div>

          {/* Crisis Alerts */}
          <div style={{ padding: "1.5rem", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "1rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#991b1b", marginBottom: "0.5rem", marginTop: 0 }}>Crisis Alerts</h3>
            <p style={{ fontSize: "0.875rem", color: "#b91c1c", margin: 0 }}>No immediate crisis alerts assigned to you at this time.</p>
          </div>
        </motion.div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}
