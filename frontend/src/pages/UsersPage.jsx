/**
 * MEMBER 1: Auth & User Management
 * ADMIN USERS MANAGEMENT PAGE
 * This page provides administrators with a birds-eye view of all registered 
 * users, including registration trends, role distribution, and directory management.
 */
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

export function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshNonce, setRefreshNonce] = useState(0);
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
        // Get current user info from stored data first (from login)
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setCurrentUser(parsedUser);
            console.log('✅ Loaded current user from storage:', parsedUser);
          } catch (e) {
            console.log("Could not parse stored user data");
          }
        }

        // Get all users
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

        const usersList = Array.isArray(data?.data?.users) ? data.data.users : [];
        setUsers(usersList);
        console.log(`✅ Loaded ${usersList.length} users`);

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

  // Calculate chart data
  const roleData = [
    { name: 'Students', value: users.filter(u => u.role === 'student').length, color: '#3b82f6' },
    { name: 'Counselors', value: users.filter(u => u.role === 'counselor').length, color: '#10b981' },
    { name: 'Admins', value: users.filter(u => u.role === 'admin').length, color: '#f59e0b' },
  ];

  const statusData = [
    { name: 'Active', value: users.filter(u => u.isActive).length, color: '#10b981' },
    { name: 'Suspended', value: users.filter(u => !u.isActive).length, color: '#ef4444' },
    { name: 'Pending', value: users.filter(u => !u.isEmailVerified).length, color: '#f59e0b' },
  ];

  /**
   * COMPUTE REGISTRATION TRENDS
   * This logic parses the 'createdAt' timestamps of all users to build a 
   * 6-month historical view of registration activity for the dashboard chart.
   * It ensures that even months with 0 registrations are represented.
   */
  const monthlyData = (() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const months = [];

    // Build last 6 months (including current)
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: monthNames[d.getMonth()],
        year: d.getFullYear(),
        monthIndex: d.getMonth(),
      });
    }

    return months.map(({ month, year, monthIndex }) => {
      const count = users.filter((u) => {
        if (!u.createdAt) return false;
        const created = new Date(u.createdAt);
        return created.getMonth() === monthIndex && created.getFullYear() === year;
      }).length;
      return { month, users: count };
    });
  })();

  /**
   * PDF REPORT GENERATION
   * Dynamically constructs an HTML document containing current user statistics 
   * and a full directory listing, then triggers a browser download.
   * This workflow utilizes high-fidelity HTML templates with custom CSS to
   * ensure the output is print-friendly and professional for management reporting.
   */
  const generatePDFReport = () => {
    // Generate HTML content for the report
    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>User Management Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
          h2 { color: #374151; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
          th { background-color: #f3f4f6; font-weight: bold; }
          .stat-row { display: flex; justify-content: space-between; margin: 5px 0; }
          .section { margin: 20px 0; }
          @media print { body { margin: 10px; } }
        </style>
      </head>
      <body>
        <h1>User Management Report</h1>
        <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
        
        <div class="section">
          <h2>User Statistics</h2>
          <div class="stat-row"><span>Total Users:</span> <strong>${totalUsers}</strong></div>
          <div class="stat-row"><span>Active Users:</span> <strong>${activeUsers}</strong></div>
          <div class="stat-row"><span>Counselors:</span> <strong>${counselors}</strong></div>
          <div class="stat-row"><span>Pending Requests:</span> <strong>${pendingUsers}</strong></div>
        </div>
        
        <div class="section">
          <h2>Role Distribution</h2>
          ${roleData.map(item => `
            <div class="stat-row"><span>${item.name}:</span> <strong>${item.value} users</strong></div>
          `).join('')}
        </div>
        
        <div class="section">
          <h2>User Status</h2>
          ${statusData.map(item => `
            <div class="stat-row"><span>${item.name}:</span> <strong>${item.value} users</strong></div>
          `).join('')}
        </div>
        
        <div class="section">
          <h2>Monthly Registrations</h2>
          ${monthlyData.map(item => `
            <div class="stat-row"><span>${item.month}:</span> <strong>${item.users} users</strong></div>
          `).join('')}
        </div>
        
        <div class="section">
          <h2>User Directory</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Student ID</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              ${displayedUsers.slice(0, 50).map(user => {
                const userName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "-";
                const status = user.isActive ? (user.isEmailVerified ? "active" : "pending") : "suspended";
                return `
                  <tr>
                    <td>${userName}</td>
                    <td>${user.email || "-"}</td>
                    <td>${user.role || "-"}</td>
                    <td>${status}</td>
                    <td>${user.studentId || "-"}</td>
                    <td>${formatDate(user.createdAt)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          ${displayedUsers.length > 50 ? `<p><em>Note: Showing first 50 of ${displayedUsers.length} users</em></p>` : ''}
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
          <h3>Instructions to Save as PDF:</h3>
          <ol>
            <li>Press Ctrl+P (Windows) or Cmd+P (Mac) to open print dialog</li>
            <li>Select "Save as PDF" from the destination dropdown</li>
            <li>Click "Save" to download the PDF file</li>
          </ol>
        </div>
      </body>
      </html>
    `;
    
    // Create blob and download HTML file
    const blob = new Blob([reportHTML], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `user-management-report-${new Date().toISOString().split('T')[0]}.html`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* Role Distribution Chart */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            ...cardStyle,
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#1c1917", marginBottom: "0.5rem" }}>
            User Roles Distribution
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", height: "200px" }}>
            {roleData.map((item, index) => (
              <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: item.color,
                  flexShrink: 0
                }} />
                <span style={{ fontSize: "0.875rem", color: "#44403c" }}>{item.name}</span>
                <div style={{ flex: 1, height: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    backgroundColor: item.color,
                    borderRadius: "4px",
                    width: `${(item.value / Math.max(...roleData.map(r => r.value))) * 100}%`,
                    transition: "width 0.3s ease"
                  }} />
                </div>
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1c1917", minWidth: "30px" }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.article>

        {/* User Status Chart */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            ...cardStyle,
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#1c1917", marginBottom: "0.5rem" }}>
            User Status Overview
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", height: "200px" }}>
            {statusData.map((item, index) => (
              <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: item.color,
                  flexShrink: 0
                }} />
                <span style={{ fontSize: "0.875rem", color: "#44403c" }}>{item.name}</span>
                <div style={{ flex: 1, height: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    backgroundColor: item.color,
                    borderRadius: "4px",
                    width: `${(item.value / Math.max(...statusData.map(s => s.value))) * 100}%`,
                    transition: "width 0.3s ease"
                  }} />
                </div>
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1c1917", minWidth: "30px" }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.article>
      </section>

      {/* Monthly Registration Chart */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={cardStyle}
      >
        <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#1c1917", marginBottom: "1rem" }}>
          Monthly User Registrations
        </h3>
        <div style={{ height: "250px", position: "relative" }}>
          {/* Simple Bar Chart */}
          <div style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-around",
            height: "100%",
            padding: "0 1rem"
          }}>
            {monthlyData.map((item, index) => (
              <div key={item.month} style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                flex: 1
              }}>
                <div style={{
                  width: "100%",
                  height: `${(item.users / Math.max(1, ...monthlyData.map(m => m.users))) * 200}px`,
                  backgroundColor: "#3b82f6",
                  borderRadius: "4px 4px 0 0",
                  transition: "height 0.3s ease",
                  position: "relative"
                }}>
                  <div style={{
                    position: "absolute",
                    top: "-25px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#1f2937",
                    color: "white",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "0.25rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    whiteSpace: "nowrap"
                  }}>
                    {item.users}
                  </div>
                </div>
                <span style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: 500 }}>
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0, fontSize: "1.05rem", color: "#292524" }}>
          User Directory ({displayedUsers.length})
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
          <button
            type="button"
            onClick={generatePDFReport}
            style={{
              border: "none",
              borderRadius: "0.625rem",
              padding: "0.55rem 0.9rem",
              backgroundColor: "#dc2626",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            📄 Generate PDF Report
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
                <th style={{ textAlign: "left", padding: "0.65rem", color: "#78716c", fontSize: "0.82rem" }}>Student ID</th>
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
                  <td style={{ padding: "0.8rem 0.65rem", color: "#57534e", fontSize: "0.85rem" }}>
                    {user.studentId || "-"}
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
    </div>
  );
}
