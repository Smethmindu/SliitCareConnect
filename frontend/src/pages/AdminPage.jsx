import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LogOutIcon, UserIcon, SettingsIcon, BellIcon, Users, UserCheck, Briefcase, Clock } from "lucide-react";

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

export function AdminPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'student',
    studentId: ''
  });
  const [currentUser, setCurrentUser] = useState(null);

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "1rem",
    border: "1px solid #e7e5e4",
    padding: "1.25rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  };

  useEffect(() => {
    const controller = new AbortController();

    const loadUsers = async () => {
      const token = getToken();
      if (!token) {
        setError("You must be logged in to view users.");
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
            setCurrentUser(parsedUser);
            console.log('✅ Admin dashboard - Loaded current user from storage:', parsedUser);
          } catch (e) {
            console.log("Could not parse stored user data");
          }
        }

        const params = new URLSearchParams();
        params.set("page", "1");
        params.set("limit", "100");
        if (search.trim()) params.set("search", search.trim());
        if (roleFilter !== "all") params.set("role", roleFilter);

        const response = await fetch(`${API_BASE_URL}/users?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data?.success) {
          setError(data?.message || `Failed to load users (HTTP ${response.status})`);
          setUsers([]);
          return;
        }

        setUsers(Array.isArray(data?.data?.users) ? data.data.users : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Network error while loading users.");
          setUsers([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
    return () => controller.abort();
  }, [search, roleFilter, refreshNonce]);

  const displayedUsers = users.filter((user) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return user.isActive === true;
    if (statusFilter === "suspended") return user.isActive === false;
    if (statusFilter === "pending") return user.isEmailVerified === false;
    return true;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const counselors = users.filter((u) => u.role === "counselor").length;
  const pendingUsers = users.filter((u) => u.isEmailVerified === false).length;

  const statCards = [
    { label: "Total Users", value: totalUsers, icon: <Users size={20} />, bg: "linear-gradient(135deg,#5b67d8,#7f8cff)" },
    { label: "Active Users", value: activeUsers, icon: <UserCheck size={20} />, bg: "linear-gradient(135deg,#ff5ca8,#ff8cc4)" },
    { label: "Counselors", value: counselors, icon: <Briefcase size={20} />, bg: "linear-gradient(135deg,#2fc8ff,#6adfff)" },
    { label: "Pending Requests", value: pendingUsers, icon: <Clock size={20} />, bg: "linear-gradient(135deg,#ff8f70,#ffd85f)" },
  ];

  const handleViewProfile = async (userId) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSelectedUser(data.data.user);
          setShowProfileModal(true);
        }
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSelectedUser(data.data.user);
          setShowProfileModal(false);
          setRefreshNonce(n => n + 1); // Refresh user list
        }
      }
    } catch (error) {
      console.error('Failed to update user profile:', error);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    const token = getToken();
    if (!token) return;

    // Confirm deletion
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${userName}? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRefreshNonce(n => n + 1); // Refresh user list
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Network error while deleting user');
    }
  };

  const handleAddUser = async () => {
    const token = getToken();
    if (!token) {
      alert('No token found. Please log in as admin first.');
      return;
    }

    console.log('📤 Sending create user request:', newUser);
    console.log('🔑 Token:', token.substring(0, 20) + '...');

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });

      console.log('📥 Response status:', response.status);
      const data = await response.json();
      console.log('📥 Response data:', data);

      if (response.ok && data.success) {
        alert(`✅ User "${newUser.firstName} ${newUser.lastName}" created successfully as ${newUser.role}!`);
        setShowAddUserModal(false);
        setNewUser({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          role: 'student',
          studentId: ''
        });
        setRefreshNonce(n => n + 1);
      } else {
        alert(`❌ Failed: ${data.message || 'Unknown error'}\n${data.errors ? data.errors.join(', ') : ''}`);
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      alert(`Network error: ${error.message}`);
    }
  };

  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState("all");
  const [broadcastSending, setBroadcastSending] = useState(false);

  const handleSendBroadcast = async () => {
    if (!broadcastMsg.trim()) return;
    setBroadcastSending(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/notifications/broadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: broadcastMsg.trim(), target: broadcastTarget }),
      });
      if (res.ok) {
        const data = await res.json();
        alert(`✅ ${data.message}`);
        setShowBroadcastModal(false);
        setBroadcastMsg("");
        setBroadcastTarget("all");
      } else {
        const err = await res.json();
        alert(`❌ Failed: ${err.message || "Unknown error"}`);
      }
    } catch (err) {
      alert(`Network error: ${err.message}`);
    } finally {
      setBroadcastSending(false);
    }
  };

  const handleQuickAction = async (action) => {
    const token = getToken();
    if (!token) return;

    try {
      if (action === 'exportUsers') {
        const response = await fetch(`${API_BASE_URL}/users/export`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'users.csv';
          a.click();
        }
      }
    } catch (error) {
      console.error('Quick action failed:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        paddingBottom: "2rem",
      }}
    >
      {/* Admin Profile Card */}
      {currentUser && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: "white",
            borderRadius: "1.25rem",
            border: "1px solid #f5f5f4",
            padding: "2rem 2.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Accent bar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, #0ea5e9, #38bdf8, #7dd3fc)" }} />

          <div style={{ display: "flex", alignItems: "center", gap: "1.75rem", flexWrap: "wrap" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "1rem",
                background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                fontWeight: "bold",
                color: "white",
                boxShadow: "0 8px 24px rgba(14, 165, 233, 0.25)",
                flexShrink: 0,
              }}
            >
              {currentUser.firstName?.[0]?.toUpperCase() || currentUser.email?.[0]?.toUpperCase() || "A"}
            </div>
            
            <div style={{ flex: 1, minWidth: "200px" }}>
              <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#1c1917", fontWeight: 700, letterSpacing: "-0.02em" }}>
                {currentUser.firstName} {currentUser.lastName}
              </h2>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem", color: "#78716c" }}>
                {currentUser.email}
              </p>
              
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap", marginTop: "0.75rem" }}>
                <span style={{ backgroundColor: "#0ea5e9", color: "white", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, textTransform: "capitalize" }}>
                  {currentUser.role}
                </span>
                {currentUser.studentId && (
                  <span style={{ backgroundColor: "#f5f5f4", color: "#57534e", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 500 }}>
                    ID: {currentUser.studentId}
                  </span>
                )}
                <span style={{ backgroundColor: "#f0fdf4", color: "#166534", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 500 }}>
                  Joined {formatDate(currentUser.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Stats Grid */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {statCards.map((card, index) => (
          <motion.article
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            style={{
              backgroundColor: "white",
              borderRadius: "1rem",
              border: "1px solid #f5f5f4",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "default",
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)"; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  height: "48px",
                  width: "48px",
                  borderRadius: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                  background: card.bg,
                  color: "white",
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "2rem", lineHeight: 1, fontWeight: 700, color: "#1c1917" }}>
                  {card.value}
                </p>
                <p style={{ margin: "0.25rem 0 0", color: "#78716c", fontSize: "0.8rem", fontWeight: 500 }}>{card.label}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </section>

      <section style={{
        backgroundColor: "white",
        borderRadius: "1.25rem",
        border: "1px solid #f5f5f4",
        padding: "1.5rem 2rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.05rem", color: "#1c1917", fontWeight: 600 }}>
          Quick Actions
        </h2>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button 
            onClick={() => setShowAddUserModal(true)}
            style={{
              border: "none",
              borderRadius: "0.75rem",
              padding: "0.625rem 1.25rem",
              backgroundColor: "#0ea5e9",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "0.875rem",
              boxShadow: "0 2px 8px rgba(14, 165, 233, 0.25)",
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#0284c7"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#0ea5e9"}
          >
            ➕ Add User
          </button>
          <button onClick={() => handleQuickAction('exportUsers')} style={{ border: "1px solid #e7e5e4", borderRadius: "0.75rem", padding: "0.625rem 1.25rem", backgroundColor: "white", color: "#44403c", fontWeight: 500, cursor: "pointer", fontSize: "0.875rem", transition: "all 0.2s" }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#fafaf9"; e.currentTarget.style.borderColor = "#d6d3d1"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.borderColor = "#e7e5e4"; }}
          >
            📊 Export Users
          </button>
          <button onClick={() => setShowBroadcastModal(true)} style={{ border: "1px solid #e7e5e4", borderRadius: "0.75rem", padding: "0.625rem 1.25rem", backgroundColor: "white", color: "#44403c", fontWeight: 500, cursor: "pointer", fontSize: "0.875rem", transition: "all 0.2s" }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#fafaf9"; e.currentTarget.style.borderColor = "#d6d3d1"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.borderColor = "#e7e5e4"; }}
          >
            📢 Send Notifications
          </button>
          <button onClick={() => navigate('/asettings')} style={{ border: "1px solid #e7e5e4", borderRadius: "0.75rem", padding: "0.625rem 1.25rem", backgroundColor: "white", color: "#44403c", fontWeight: 500, cursor: "pointer", fontSize: "0.875rem", transition: "all 0.2s" }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#fafaf9"; e.currentTarget.style.borderColor = "#d6d3d1"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.borderColor = "#e7e5e4"; }}
          >
            ⚙️ Settings
          </button>
          <button onClick={() => navigate('/admin/feedback')} style={{ border: "1px solid #bae6fd", borderRadius: "0.75rem", padding: "0.625rem 1.25rem", backgroundColor: "#f0f9ff", color: "#0369a1", fontWeight: 500, cursor: "pointer", fontSize: "0.875rem", transition: "all 0.2s" }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#e0f2fe"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#f0f9ff"; }}
          >
            📊 Feedback & Reviews
          </button>
        </div>
      </section>

      <section style={{
        backgroundColor: "white",
        borderRadius: "1.25rem",
        border: "1px solid #f5f5f4",
        padding: "1.5rem 2rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        <h2 style={{ margin: "0 0 1.25rem 0", fontSize: "1.05rem", color: "#1c1917", fontWeight: 600 }}>
          User Management
          <span style={{ marginLeft: "0.5rem", fontSize: "0.8rem", fontWeight: 500, color: "#78716c" }}>
            ({displayedUsers.length} users)
          </span>
        </h2>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: "1 1 250px",
              maxWidth: "350px",
              padding: "0.625rem 1rem",
              border: "1px solid #e7e5e4",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              color: "#1c1917",
              outline: "none",
              transition: "border-color 0.2s",
              boxSizing: "border-box",
            }}
            onFocus={(e) => e.target.style.borderColor = "#0ea5e9"}
            onBlur={(e) => e.target.style.borderColor = "#e7e5e4"}
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: "0.625rem 0.75rem",
              border: "1px solid #e7e5e4",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              backgroundColor: "white",
              color: "#44403c",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="counselor">Counselor</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "0.625rem 0.75rem",
              border: "1px solid #e7e5e4",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              backgroundColor: "white",
              color: "#44403c",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
          <button
            type="button"
            onClick={() => setRefreshNonce((n) => n + 1)}
            style={{
              border: "none",
              borderRadius: "0.75rem",
              padding: "0.625rem 1.25rem",
              backgroundColor: "#1c1917",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.875rem",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#292524"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#1c1917"}
          >
            Refresh
          </button>
        </div>

        {error && (
          <div style={{ padding: "0.75rem 1rem", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "0.75rem", color: "#dc2626", fontSize: "0.875rem", marginBottom: "1rem" }}>
            {error}
          </div>
        )}
        {loading && (
          <div style={{ padding: "0.75rem 1rem", backgroundColor: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "0.75rem", color: "#0369a1", fontSize: "0.875rem", marginBottom: "1rem" }}>
            Loading users...
          </div>
        )}

        <div style={{ overflowX: "auto", borderRadius: "0.75rem", border: "1px solid #f5f5f4" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "760px" }}>
            <thead>
              <tr style={{ backgroundColor: "#fafaf9" }}>
                <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#78716c", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f5f5f4" }}>User</th>
                <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#78716c", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f5f5f4" }}>Role</th>
                <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#78716c", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f5f5f4" }}>Status</th>
                <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#78716c", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f5f5f4" }}>Joined</th>
                <th style={{ textAlign: "right", padding: "0.75rem 1rem", color: "#78716c", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f5f5f4" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((user) => {
                const status = user.isActive ? (user.isEmailVerified ? "active" : "pending") : "suspended";
                const userName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "-";
                const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "?";
                return (
                <tr
                  key={user._id}
                  style={{ borderBottom: "1px solid #f5f5f4", transition: "background-color 0.15s" }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fafaf9"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "0.5rem",
                        backgroundColor: user.role === "admin" ? "#0ea5e9" : user.role === "counselor" ? "#10b981" : "#8b5cf6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}>
                        {initials}
                      </div>
                      <div>
                        <p style={{ margin: 0, color: "#1c1917", fontWeight: 600, fontSize: "0.875rem" }}>
                          {userName}
                        </p>
                        <p style={{ margin: "0.125rem 0 0", color: "#a8a29e", fontSize: "0.8rem" }}>{user.email || "-"}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <span style={{
                      padding: "0.2rem 0.6rem",
                      borderRadius: "9999px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      textTransform: "capitalize",
                      backgroundColor: user.role === "admin" ? "#f0f9ff" : user.role === "counselor" ? "#f0fdf4" : "#faf5ff",
                      color: user.role === "admin" ? "#0369a1" : user.role === "counselor" ? "#166534" : "#7c3aed",
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <span
                      style={{
                        borderRadius: "9999px",
                        padding: "0.2rem 0.6rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textTransform: "capitalize",
                        backgroundColor:
                          status === "active"
                            ? "#f0fdf4"
                            : status === "pending"
                              ? "#fffbeb"
                              : "#fef2f2",
                        color:
                          status === "active"
                            ? "#166534"
                            : status === "pending"
                              ? "#92400e"
                              : "#b91c1c",
                      }}
                    >
                      {status}
                    </span>
                  </td>
                  <td style={{ padding: "0.875rem 1rem", color: "#78716c", fontSize: "0.85rem" }}>
                    {formatDate(user.createdAt)}
                  </td>
                  <td style={{ padding: "0.875rem 1rem", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "0.375rem" }}>
                      <button
                        onClick={() => handleViewProfile(user._id)}
                        style={{
                          border: "1px solid #bae6fd",
                          borderRadius: "0.5rem",
                          padding: "0.3rem 0.65rem",
                          backgroundColor: "#f0f9ff",
                          color: "#0369a1",
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#e0f2fe"; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#f0f9ff"; }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleViewProfile(user._id)}
                        style={{
                          border: "1px solid #bae6fd",
                          borderRadius: "0.5rem",
                          padding: "0.3rem 0.65rem",
                          backgroundColor: "#f0f9ff",
                          color: "#0369a1",
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#e0f2fe"; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#f0f9ff"; }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id, `${user.firstName} ${user.lastName}`)}
                        style={{
                          border: "1px solid #fecaca",
                          borderRadius: "0.5rem",
                          padding: "0.3rem 0.65rem",
                          backgroundColor: "#fef2f2",
                          color: "#dc2626",
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#fee2e2"; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#fef2f2"; }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
              {!loading && displayedUsers.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "3rem 1rem", textAlign: "center", color: "#a8a29e", fontSize: "0.875rem" }}>
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* User Profile Modal */}
      {showProfileModal && selectedUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
          onClick={() => setShowProfileModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              borderRadius: "1.25rem",
              padding: "2rem",
              width: "90%",
              maxWidth: "500px",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 24px 48px rgba(0,0,0,0.12)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#1c1917", fontWeight: 700 }}>
                Edit User Profile
              </h2>
              <button
                onClick={() => setShowProfileModal(false)}
                style={{ border: "none", background: "#f5f5f4", width: "32px", height: "32px", borderRadius: "0.5rem", fontSize: "1.25rem", cursor: "pointer", color: "#78716c", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.15s" }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e7e5e4"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#f5f5f4"}
              >
                ×
              </button>
            </div>

            <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#57534e", textTransform: "uppercase", letterSpacing: "0.05em" }}>First Name</label>
                <input
                  type="text"
                  value={selectedUser.firstName || ""}
                  onChange={(e) => setSelectedUser({...selectedUser, firstName: e.target.value})}
                  style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1px solid #e7e5e4", borderRadius: "0.75rem", fontSize: "0.875rem", color: "#1c1917", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                  onFocus={(e) => e.target.style.borderColor = "#0ea5e9"}
                  onBlur={(e) => e.target.style.borderColor = "#e7e5e4"}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#57534e", textTransform: "uppercase", letterSpacing: "0.05em" }}>Last Name</label>
                <input
                  type="text"
                  value={selectedUser.lastName || ""}
                  onChange={(e) => setSelectedUser({...selectedUser, lastName: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d6d3d1",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem"
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#57534e", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</label>
                <input
                  type="email"
                  value={selectedUser.email || ""}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d6d3d1",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem"
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#57534e", textTransform: "uppercase", letterSpacing: "0.05em" }}>Role</label>
                <select
                  value={selectedUser.role || ""}
                  onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d6d3d1",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    backgroundColor: "white"
                  }}
                >
                  <option value="student">Student</option>
                  <option value="counselor">Counselor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {selectedUser.role === 'student' && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#57534e", textTransform: "uppercase", letterSpacing: "0.05em" }}>Student ID</label>
                  <input
                    type="text"
                    value={selectedUser.studentId || ""}
                    onChange={(e) => setSelectedUser({...selectedUser, studentId: e.target.value})}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #d6d3d1",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem"
                    }}
                  />
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowProfileModal(false)}
                style={{
                  border: "1px solid #d6d3d1",
                  borderRadius: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "white",
                  color: "#44403c",
                  fontSize: "0.875rem",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateProfile({
                  firstName: selectedUser.firstName,
                  lastName: selectedUser.lastName,
                  email: selectedUser.email,
                  role: selectedUser.role,
                  studentId: selectedUser.studentId
                })}
                style={{
                  border: "1px solid #0ea5e9",
                  borderRadius: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#0ea5e9",
                  color: "white",
                  fontSize: "0.875rem",
                  cursor: "pointer"
                }}
              >
                Update Profile
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
          onClick={() => setShowAddUserModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: "white",
              borderRadius: "1.25rem",
              padding: "2rem",
              width: "90%",
              maxWidth: "500px",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 24px 48px rgba(0,0,0,0.12)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#1c1917", fontWeight: 700 }}>
                Add New User
              </h2>
              <button
                onClick={() => setShowAddUserModal(false)}
                style={{ border: "none", background: "#f5f5f4", width: "32px", height: "32px", borderRadius: "0.5rem", fontSize: "1.25rem", cursor: "pointer", color: "#78716c", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.15s" }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e7e5e4"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#f5f5f4"}
              >
                ×
              </button>
            </div>

            <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.375rem", fontSize: "0.8rem", color: "#57534e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  First Name
                </label>
                <input
                  type="text"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                  style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1px solid #e7e5e4", borderRadius: "0.75rem", fontSize: "0.875rem", color: "#1c1917", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                  onFocus={(e) => e.target.style.borderColor = "#0ea5e9"}
                  onBlur={(e) => e.target.style.borderColor = "#e7e5e4"}
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.375rem", fontSize: "0.8rem", color: "#57534e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                  style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1px solid #e7e5e4", borderRadius: "0.75rem", fontSize: "0.875rem", color: "#1c1917", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                  onFocus={(e) => e.target.style.borderColor = "#0ea5e9"}
                  onBlur={(e) => e.target.style.borderColor = "#e7e5e4"}
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.375rem", fontSize: "0.8rem", color: "#57534e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1px solid #e7e5e4", borderRadius: "0.75rem", fontSize: "0.875rem", color: "#1c1917", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                  onFocus={(e) => e.target.style.borderColor = "#0ea5e9"}
                  onBlur={(e) => e.target.style.borderColor = "#e7e5e4"}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.375rem", fontSize: "0.8rem", color: "#57534e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1px solid #e7e5e4", borderRadius: "0.75rem", fontSize: "0.875rem", color: "#1c1917", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                  onFocus={(e) => e.target.style.borderColor = "#0ea5e9"}
                  onBlur={(e) => e.target.style.borderColor = "#e7e5e4"}
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.375rem", fontSize: "0.8rem", color: "#57534e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1px solid #e7e5e4", borderRadius: "0.75rem", fontSize: "0.875rem", backgroundColor: "white", color: "#1c1917", cursor: "pointer", outline: "none" }}
                >
                  <option value="student">Student</option>
                  <option value="counselor">Counselor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {(newUser.role === 'student') && (
                <div>
                  <label style={{ display: "block", marginBottom: "0.375rem", fontSize: "0.8rem", color: "#57534e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={newUser.studentId}
                    onChange={(e) => setNewUser({...newUser, studentId: e.target.value})}
                    style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1px solid #e7e5e4", borderRadius: "0.75rem", fontSize: "0.875rem", color: "#1c1917", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                    onFocus={(e) => e.target.style.borderColor = "#0ea5e9"}
                    onBlur={(e) => e.target.style.borderColor = "#e7e5e4"}
                    placeholder="Enter student ID"
                  />
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowAddUserModal(false)}
                style={{ border: "1px solid #e7e5e4", borderRadius: "0.75rem", padding: "0.625rem 1.25rem", backgroundColor: "white", color: "#57534e", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fafaf9"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "white"}
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                style={{ border: "none", borderRadius: "0.75rem", padding: "0.625rem 1.25rem", backgroundColor: "#10b981", color: "white", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s", boxShadow: "0 2px 8px rgba(16, 185, 129, 0.25)" }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#059669"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#10b981"}
              >
                Add User
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Broadcast Notification Modal */}
      {showBroadcastModal && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
          }}
          onClick={() => setShowBroadcastModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white", borderRadius: "1.25rem", padding: "2rem",
              width: "90%", maxWidth: "480px", boxShadow: "0 24px 48px rgba(0,0,0,0.12)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#1c1917", fontWeight: 700 }}>
                📢 Send Notification
              </h2>
              <button
                onClick={() => setShowBroadcastModal(false)}
                style={{ border: "none", background: "#f5f5f4", width: "32px", height: "32px", borderRadius: "0.5rem", fontSize: "1.25rem", cursor: "pointer", color: "#78716c", display: "flex", alignItems: "center", justifyContent: "center" }}
              >×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c", display: "block", marginBottom: "0.5rem" }}>Target Audience</label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #e7e5e4", borderRadius: "0.75rem", fontSize: "0.875rem", backgroundColor: "white", color: "#1c1917", outline: "none", cursor: "pointer" }}
                >
                  <option value="all">All Users (Students & Counselors)</option>
                  <option value="students">Students Only</option>
                  <option value="counselors">Counselors Only</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c", display: "block", marginBottom: "0.5rem" }}>Notification Message</label>
                <textarea
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  placeholder="Type your notification message here..."
                  rows={4}
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #e7e5e4", borderRadius: "0.75rem", fontSize: "0.875rem", backgroundColor: "#fafaf9", color: "#1c1917", outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  onClick={() => setShowBroadcastModal(false)}
                  style={{ padding: "0.75rem 1.5rem", backgroundColor: "white", color: "#57534e", borderRadius: "0.75rem", fontWeight: 500, fontSize: "0.875rem", border: "1px solid #e7e5e4", cursor: "pointer" }}
                >Cancel</button>
                <button
                  onClick={handleSendBroadcast}
                  disabled={!broadcastMsg.trim() || broadcastSending}
                  style={{
                    padding: "0.75rem 1.5rem", borderRadius: "0.75rem", fontWeight: 600, fontSize: "0.875rem", border: "none", cursor: broadcastMsg.trim() && !broadcastSending ? "pointer" : "not-allowed",
                    backgroundColor: broadcastMsg.trim() && !broadcastSending ? "#0ea5e9" : "#d6d3d1", color: "white",
                    boxShadow: broadcastMsg.trim() ? "0 2px 8px rgba(14, 165, 233, 0.25)" : "none",
                    transition: "all 0.2s",
                  }}
                >{broadcastSending ? "Sending..." : "Send Notification"}</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
