import { useState, useEffect, useRef, useCallback } from "react";
import { BellIcon, CheckIcon, XIcon, MegaphoneIcon, CalendarIcon, MessageSquareIcon, UserPlusIcon, BookOpenIcon } from "lucide-react";

const API = "http://localhost:3000/api/notifications";

function getAuthHeaders() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function getCurrentUser() {
  const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getNotifIcon(type) {
  switch (type) {
    case "new_booking": return <CalendarIcon style={{ height: "1rem", width: "1rem", color: "#0ea5e9" }} />;
    case "booking_confirmed": return <CheckIcon style={{ height: "1rem", width: "1rem", color: "#16a34a" }} />;
    case "booking_declined": return <XIcon style={{ height: "1rem", width: "1rem", color: "#dc2626" }} />;
    case "booking_cancelled": return <XIcon style={{ height: "1rem", width: "1rem", color: "#f59e0b" }} />;
    case "booking_completed": return <CheckIcon style={{ height: "1rem", width: "1rem", color: "#10b981" }} />;
    case "new_message": return <MessageSquareIcon style={{ height: "1rem", width: "1rem", color: "#8b5cf6" }} />;
    case "new_signup": return <UserPlusIcon style={{ height: "1rem", width: "1rem", color: "#0ea5e9" }} />;
    case "admin_broadcast": return <MegaphoneIcon style={{ height: "1rem", width: "1rem", color: "#f97316" }} />;
    case "resource_pending": return <BookOpenIcon style={{ height: "1rem", width: "1rem", color: "#f59e0b" }} />;
    case "resource_approved": return <CheckIcon style={{ height: "1rem", width: "1rem", color: "#16a34a" }} />;
    case "resource_rejected": return <XIcon style={{ height: "1rem", width: "1rem", color: "#dc2626" }} />;
    default: return <BellIcon style={{ height: "1rem", width: "1rem", color: "#78716c" }} />;
  }
}

export function NotificationBell() {
  const user = getCurrentUser();
  const userId = user?.id;

  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API}/${userId}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }, [userId]);

  // Initial load
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Poll every 5 seconds
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        bellRef.current && !bellRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate dropdown position when opened
  useEffect(() => {
    if (isOpen && bellRef.current) {
      const rect = bellRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        right: Math.max(8, window.innerWidth - rect.right),
      });
    }
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkRead = async (id) => {
    try {
      await fetch(`${API}/${id}/read`, { method: "PATCH", headers: getAuthHeaders() });
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    if (!userId) return;
    try {
      await fetch(`${API}/markAllRead/${userId}`, { method: "PATCH", headers: getAuthHeaders() });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  return (
    <>
      {/* Bell Button */}
      <button
        ref={bellRef}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "0.5rem",
          color: isOpen ? "#0ea5e9" : "#a8a29e",
          background: isOpen ? "#f0f9ff" : "none",
          border: "none",
          position: "relative",
          cursor: "pointer",
          borderRadius: "0.5rem",
          transition: "all 0.2s",
        }}
      >
        <BellIcon style={{ height: "1.25rem", width: "1.25rem" }} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "0.125rem",
              right: "0.125rem",
              height: unreadCount > 9 ? "1.125rem" : "1rem",
              minWidth: unreadCount > 9 ? "1.125rem" : "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "9999px",
              fontSize: "0.6rem",
              fontWeight: "bold",
              backgroundColor: "#ef4444",
              color: "white",
              border: "2px solid white",
              padding: unreadCount > 9 ? "0 0.2rem" : "0",
              lineHeight: 1,
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel — fixed position, always above everything */}
      {isOpen && (
        <div
          ref={dropdownRef}
          style={{
            position: "fixed",
            top: dropdownPos.top,
            right: dropdownPos.right,
            width: "22rem",
            maxHeight: "28rem",
            backgroundColor: "white",
            borderRadius: "1rem",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)",
            border: "1px solid #e7e5e4",
            zIndex: 99999,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "1rem 1.25rem",
              borderBottom: "1px solid #f5f5f4",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
              background: "linear-gradient(135deg, #fafaf9, #ffffff)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#1c1917" }}>Notifications</h3>
              {unreadCount > 0 && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "1.375rem",
                    minWidth: "1.375rem",
                    borderRadius: "9999px",
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    backgroundColor: "#0ea5e9",
                    color: "white",
                    padding: "0 0.375rem",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  background: "none",
                  border: "none",
                  color: "#0ea5e9",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "0.375rem",
                  transition: "background-color 0.2s",
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div style={{ flex: 1, overflowY: "auto", maxHeight: "24rem" }}>
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: "3rem 1rem",
                  textAlign: "center",
                  color: "#a8a29e",
                }}
              >
                <BellIcon style={{ height: "2rem", width: "2rem", color: "#d6d3d1", margin: "0 auto 0.75rem" }} />
                <p style={{ margin: 0, fontSize: "0.875rem" }}>No notifications yet</p>
              </div>
            ) : (
              notifications.slice(0, 30).map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => !notif.isRead && handleMarkRead(notif._id)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    padding: "0.875rem 1.25rem",
                    borderBottom: "1px solid #fafaf9",
                    cursor: notif.isRead ? "default" : "pointer",
                    transition: "background-color 0.15s",
                    backgroundColor: notif.isRead ? "white" : "#f0f9ff",
                  }}
                  onMouseOver={(e) => { if (!notif.isRead) e.currentTarget.style.backgroundColor = "#e0f2fe"; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = notif.isRead ? "white" : "#f0f9ff"; }}
                >
                  <div
                    style={{
                      height: "2rem",
                      width: "2rem",
                      borderRadius: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      backgroundColor: notif.isRead ? "#f5f5f4" : "#e0f2fe",
                    }}
                  >
                    {getNotifIcon(notif.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.8125rem",
                        lineHeight: 1.4,
                        color: notif.isRead ? "#78716c" : "#1c1917",
                        fontWeight: notif.isRead ? 400 : 500,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {notif.message}
                    </p>
                    <p style={{ margin: "0.25rem 0 0", fontSize: "0.7rem", color: "#a8a29e" }}>
                      {timeAgo(notif.createdAt)}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <div
                      style={{
                        height: "0.5rem",
                        width: "0.5rem",
                        borderRadius: "50%",
                        backgroundColor: "#0ea5e9",
                        flexShrink: 0,
                        marginTop: "0.375rem",
                      }}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}

