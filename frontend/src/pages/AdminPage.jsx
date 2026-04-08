import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogOutIcon, UserIcon, SettingsIcon, BellIcon } from "lucide-react";

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
    { label: "Total Users", value: totalUsers, icon: "👥", bg: "linear-gradient(135deg,#5b67d8,#7f8cff)" },
    { label: "Active Users", value: activeUsers, icon: "✅", bg: "linear-gradient(135deg,#ff5ca8,#ff8cc4)" },
    { label: "Counselors", value: counselors, icon: "🏢", bg: "linear-gradient(135deg,#2fc8ff,#6adfff)" },
    { label: "Pending Requests", value: pendingUsers, icon: "⏳", bg: "linear-gradient(135deg,#ff8f70,#ffd85f)" },
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
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setShowAddUserModal(false);
          setNewUser({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            role: 'student',
            studentId: ''
          });
          setRefreshNonce(n => n + 1); // Refresh user list
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add user');
      }
    } catch (error) {
      console.error('Failed to add user:', error);
      alert('Network error while adding user');
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
      } else if (action === 'sendNotifications') {
        // Send notifications to all users
        await fetch(`${API_BASE_URL}/users/notify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            message: 'System maintenance scheduled for tonight',
            type: 'system'
          })
        });
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
        gap: "1rem",
        paddingBottom: "2rem",
        backgroundColor: "#f4f5f7",
        borderRadius: "0.9rem",
        padding: "1.25rem",
      }}
    >
      {/* Current User Profile Section */}
      {currentUser && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            ...cardStyle,
            padding: "2rem",
            background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
            border: "2px solid #3b82f6",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background decoration */}
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              opacity: 0.1,
            }}
          />
          
          <div style={{ display: "flex", alignItems: "center", gap: "2rem", position: "relative", zIndex: 1 }}>
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "white",
                boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
                border: "4px solid white",
              }}
            >
              {currentUser.firstName?.[0]?.toUpperCase() || currentUser.email?.[0]?.toUpperCase() || "A"}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: "1rem" }}>
                <h2 style={{ margin: 0, fontSize: "1.75rem", color: "#1e293b", marginBottom: "0.5rem" }}>
                  Admin: {currentUser.firstName} {currentUser.lastName}
                </h2>
                <p style={{ margin: 0, fontSize: "1rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  📧 {currentUser.email}
                </p>
              </div>
              
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                <span
                  style={{
                    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "2rem",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    textTransform: "capitalize",
                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                  }}
                >
                  👑 {currentUser.role}
                </span>
                
                {currentUser.studentId && (
                  <span
                    style={{
                      backgroundColor: "#f1f5f9",
                      color: "#475569",
                      padding: "0.5rem 1rem",
                      borderRadius: "2rem",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    🆔 {currentUser.studentId}
                  </span>
                )}
                
                <span
                  style={{
                    backgroundColor: "#eff6ff",
                    color: "#1d4ed8",
                    padding: "0.5rem 1rem",
                    borderRadius: "2rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    border: "1px solid #dbeafe",
                  }}
                >
                  🛡️ Admin Access
                </span>
                
                <span
                  style={{
                    backgroundColor: "#f0fdf4",
                    color: "#166534",
                    padding: "0.5rem 1rem",
                    borderRadius: "2rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    border: "1px solid #bbf7d0",
                  }}
                >
                  📅 Joined {formatDate(currentUser.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </motion.section>
      )}

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
          Dashboard Overview
        </h1>
        <p style={{ marginTop: "0.5rem", color: "#57534e" }}>
          Monitor users and review recent account activity.
        </p>
      </section>

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
                {card.icon}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "1.9rem", lineHeight: 1, fontWeight: 700, color: "#1f2937" }}>
                  {card.value}
                </p>
                <p style={{ margin: "0.35rem 0 0", color: "#6b7280", fontSize: "0.86rem" }}>{card.label}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0, fontSize: "1.05rem", color: "#292524" }}>
          Quick Actions
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem", marginTop: "0.9rem" }}>
          <button 
            onClick={() => setShowAddUserModal(true)}
            style={{
              border: "none",
              borderRadius: "0.625rem",
              padding: "0.75rem 1rem",
              backgroundColor: "#10b981",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#059669"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#10b981"}
          >
            ➕ Add User
          </button>
          <button onClick={() => handleQuickAction('exportUsers')} style={{ border: "1px solid #d6d3d1", borderRadius: "0.625rem", padding: "0.75rem 1rem", backgroundColor: "white", color: "#44403c", fontWeight: 600, cursor: "pointer" }}>
            📊 Export Users
          </button>
          <button onClick={() => handleQuickAction('sendNotifications')} style={{ border: "1px solid #d6d3d1", borderRadius: "0.625rem", padding: "0.75rem 1rem", backgroundColor: "white", color: "#44403c", fontWeight: 600, cursor: "pointer" }}>
            📢 Send Notifications
          </button>
          <button onClick={() => window.open('#', '_blank')} style={{ border: "1px solid #d6d3d1", borderRadius: "0.625rem", padding: "0.75rem 1rem", backgroundColor: "white", color: "#44403c", fontWeight: 600, cursor: "pointer" }}>
            ⚙️ Settings
          </button>
          <button onClick={() => window.open('/feedback', '_blank')} style={{ border: "1px solid #3b82f6", borderRadius: "0.625rem", padding: "0.75rem 1rem", backgroundColor: "white", color: "#3b82f6", fontWeight: 600, cursor: "pointer" }}>
            📊 Feedback & Reviews
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0, fontSize: "1.05rem", color: "#292524" }}>
          Recent Users ({displayedUsers.length})
        </h2>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.9rem" }}>
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              minWidth: "250px",
              padding: "0.55rem 0.8rem",
              border: "1px solid #d6d3d1",
              borderRadius: "0.625rem",
              fontSize: "0.875rem",
            }}
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: "0.55rem 0.7rem",
              border: "1px solid #d6d3d1",
              borderRadius: "0.625rem",
              fontSize: "0.875rem",
              backgroundColor: "white",
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
              padding: "0.55rem 0.7rem",
              border: "1px solid #d6d3d1",
              borderRadius: "0.625rem",
              fontSize: "0.875rem",
              backgroundColor: "white",
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
              borderRadius: "0.625rem",
              padding: "0.55rem 0.9rem",
              backgroundColor: "#111827",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Refresh
          </button>
        </div>

        {error && (
          <p style={{ marginTop: "0.75rem", color: "#b91c1c", fontSize: "0.88rem" }}>{error}</p>
        )}
        {loading && (
          <p style={{ marginTop: "0.75rem", color: "#57534e", fontSize: "0.88rem" }}>Loading users...</p>
        )}
        <div style={{ marginTop: "1rem", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "760px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e7e5e4" }}>
                <th style={{ textAlign: "left", padding: "0.65rem", color: "#78716c", fontSize: "0.82rem" }}>User</th>
                <th style={{ textAlign: "left", padding: "0.65rem", color: "#78716c", fontSize: "0.82rem" }}>Role</th>
                <th style={{ textAlign: "left", padding: "0.65rem", color: "#78716c", fontSize: "0.82rem" }}>Status</th>
                <th style={{ textAlign: "left", padding: "0.65rem", color: "#78716c", fontSize: "0.82rem" }}>Joined</th>
                <th style={{ textAlign: "right", padding: "0.65rem", color: "#78716c", fontSize: "0.82rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((user) => {
                const status = user.isActive ? (user.isEmailVerified ? "active" : "pending") : "suspended";
                return (
                <tr key={user._id} style={{ borderBottom: "1px solid #f5f5f4" }}>
                  <td style={{ padding: "0.8rem 0.65rem" }}>
                    <p style={{ margin: 0, color: "#1c1917", fontWeight: 600, fontSize: "0.88rem" }}>
                      {`${user.firstName || ""} ${user.lastName || ""}`.trim() || "-"}
                    </p>
                    <p style={{ margin: "0.2rem 0 0", color: "#78716c", fontSize: "0.8rem" }}>{user.email || "-"}</p>
                  </td>
                  <td style={{ padding: "0.8rem 0.65rem", color: "#44403c", fontSize: "0.86rem", textTransform: "capitalize" }}>
                    {user.role}
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
                          status === "active"
                            ? "#ecfdf5"
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
                  <td style={{ padding: "0.8rem 0.65rem", color: "#57534e", fontSize: "0.85rem" }}>
                    {formatDate(user.createdAt)}
                  </td>
                  <td style={{ padding: "0.8rem 0.65rem", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                      <button
                        onClick={() => handleViewProfile(user._id)}
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
                        onClick={() => handleViewProfile(user._id)}
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
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id, `${user.firstName} ${user.lastName}`)}
                        style={{
                          border: "1px solid #dc2626",
                          borderRadius: "0.5rem",
                          padding: "0.34rem 0.6rem",
                          backgroundColor: "#dc2626",
                          color: "white",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
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
                  <td colSpan={5} style={{ padding: "1rem", textAlign: "center", color: "#78716c" }}>
                    No users found.
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
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
          onClick={() => setShowProfileModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              borderRadius: "1rem",
              padding: "2rem",
              width: "90%",
              maxWidth: "500px",
              maxHeight: "80vh",
              overflowY: "auto"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#1c1917" }}>
                User Profile
              </h2>
              <button
                onClick={() => setShowProfileModal(false)}
                style={{
                  border: "none",
                  background: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#6b7280"
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c" }}>First Name</label>
                <input
                  type="text"
                  value={selectedUser.firstName || ""}
                  onChange={(e) => setSelectedUser({...selectedUser, firstName: e.target.value})}
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
                <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c" }}>Last Name</label>
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
                <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c" }}>Email</label>
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
                <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c" }}>Role</label>
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
                  <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c" }}>Student ID</label>
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
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
          onClick={() => setShowAddUserModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "1rem",
              padding: "2rem",
              width: "90%",
              maxWidth: "500px",
              maxHeight: "80vh",
              overflowY: "auto"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#1c1917" }}>
                Add New User
              </h2>
              <button
                onClick={() => setShowAddUserModal(false)}
                style={{
                  border: "none",
                  background: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#6b7280"
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", color: "#374151", fontWeight: 500 }}>
                  First Name
                </label>
                <input
                  type="text"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem"
                  }}
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", color: "#374151", fontWeight: 500 }}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem"
                  }}
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", color: "#374151", fontWeight: 500 }}>
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem"
                  }}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", color: "#374151", fontWeight: 500 }}>
                  Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem"
                  }}
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", color: "#374151", fontWeight: 500 }}>
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem"
                  }}
                >
                  <option value="student">Student</option>
                  <option value="counselor">Counselor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {(newUser.role === 'student') && (
                <div>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", color: "#374151", fontWeight: 500 }}>
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={newUser.studentId}
                    onChange={(e) => setNewUser({...newUser, studentId: e.target.value})}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem"
                    }}
                    placeholder="Enter student ID"
                  />
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowAddUserModal(false)}
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
                onClick={handleAddUser}
                style={{
                  border: "1px solid #10b981",
                  borderRadius: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#10b981",
                  color: "white",
                  fontSize: "0.875rem",
                  cursor: "pointer"
                }}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
