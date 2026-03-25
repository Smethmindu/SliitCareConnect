import { useState } from "react";
import { motion } from "framer-motion";
import {
  UsersIcon,
  CalendarIcon,
  FileTextIcon,
  ShieldAlertIcon,
  TrendingUpIcon,
  SearchIcon,
  FilterIcon,
  MoreVerticalIcon,
} from "lucide-react";

export function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  const users = [
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "Student",
      email: "s.jenkins@university.edu",
      status: "Active",
      joined: "Oct 15, 2024",
    },
    {
      id: 2,
      name: "Dr. Emily Chen",
      role: "Counselor",
      email: "echen@university.edu",
      status: "Active",
      joined: "Aug 22, 2023",
    },
    {
      id: 3,
      name: "Michael Thomas",
      role: "Student",
      email: "m.thomas@university.edu",
      status: "Flagged",
      joined: "Sep 05, 2024",
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
      <motion.div
        variants={fadeIn}
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
              marginBottom: "0.5rem",
              marginTop: 0,
            }}
          >
            Admin Dashboard
          </h1>
          <p style={{ color: "#78716c", margin: 0 }}>
            System overview and user management.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            style={{
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
            Download Report
          </button>
          <button
            style={{
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
            Add User
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={fadeIn}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {[
          {
            icon: UsersIcon,
            label: "Total Users",
            value: "2,451",
            trend: "+12%",
            color: "#0ea5e9",
            bg: "#e0f2fe",
          },
          {
            icon: CalendarIcon,
            label: "Sessions This Week",
            value: "384",
            trend: "+5%",
            color: "#10b981",
            bg: "#d1fae5",
          },
          {
            icon: ShieldAlertIcon,
            label: "Crisis Alerts",
            value: "3",
            trend: "-2",
            color: "#ef4444",
            bg: "#fee2e2",
          },
          {
            icon: FileTextIcon,
            label: "Resources Accessed",
            value: "12.5k",
            trend: "+18%",
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
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
                }}
              >
                <stat.icon style={{ height: "1.5rem", width: "1.5rem" }} />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  color: stat.trend.startsWith("+") ? "#10b981" : "#ef4444",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  backgroundColor: stat.trend.startsWith("+")
                    ? "#dcfce7"
                    : "#fee2e2",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "9999px",
                }}
              >
                <TrendingUpIcon
                  style={{
                    height: "1rem",
                    width: "1rem",
                    ...(stat.trend.startsWith("-")
                      ? { transform: "scaleY(-1)" }
                      : {}),
                  }}
                />
                {stat.trend}
              </div>
            </div>
            <h3
              style={{
                fontSize: "1.875rem",
                fontWeight: "bold",
                color: "#1c1917",
                margin: "0 0 0.25rem 0",
              }}
            >
              {stat.value}
            </h3>
            <p style={{ color: "#78716c", fontSize: "0.875rem", margin: 0 }}>
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={fadeIn}>
        {/* TabGroup Inline */}
        <div
          style={{
            display: "flex",
            gap: "2rem",
            borderBottom: "1px solid #e7e5e4",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            marginBottom: "1.5rem",
          }}
        >
          {[
            { id: "overview", label: "System Overview" },
            { id: "users", label: "User Management" },
            { id: "analytics", label: "Analytics" },
            { id: "settings", label: "Platform Settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
                ...(activeTab === tab.id
                  ? { color: "#0ea5e9" }
                  : { color: "#78716c" }),
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
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
              )}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={fadeIn}
        style={{
          backgroundColor: "white",
          borderRadius: "1rem",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid #f5f5f4",
            display: "flex",
            flexDirection: window.innerWidth < 640 ? "column" : "row",
            alignItems: window.innerWidth < 640 ? "stretch" : "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div
            style={{ position: "relative", width: "100%", maxWidth: "24rem" }}
          >
            <div
              style={{
                position: "absolute",
                inset: "0 0 0 0.75rem",
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              <SearchIcon
                style={{
                  height: "1.25rem",
                  width: "1.25rem",
                  color: "#a8a29e",
                }}
              />
            </div>
            <input
              type="text"
              placeholder="Search users by name, email, or ID..."
              style={{
                width: "100%",
                padding: "0.5rem 1rem 0.5rem 2.5rem",
                borderRadius: "0.5rem",
                backgroundColor: "white",
                border: "1px solid #e7e5e4",
                fontSize: "0.875rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
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
            <FilterIcon style={{ height: "1rem", width: "1rem" }} /> Filter
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              minWidth: "800px",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead
              style={{
                backgroundColor: "#fafaf9",
                borderBottom: "1px solid #e7e5e4",
              }}
            >
              <tr>
                <th
                  style={{
                    padding: "0.75rem 1.5rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#57534e",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    padding: "0.75rem 1.5rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#57534e",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Role
                </th>
                <th
                  style={{
                    padding: "0.75rem 1.5rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#57534e",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "0.75rem 1.5rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#57534e",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Joined
                </th>
                <th
                  style={{
                    padding: "0.75rem 1.5rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#57534e",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    textAlign: "right",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: "white", fontSize: "0.875rem" }}>
              {users.map((user) => (
                <tr
                  key={user.id}
                  style={{
                    borderBottom: "1px solid #f5f5f4",
                    transition: "background-color 0.2s",
                  }}
                >
                  <td
                    style={{
                      padding: "1rem 1.5rem",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span style={{ fontWeight: 500, color: "#1c1917" }}>
                      {user.name}
                    </span>
                    <span style={{ color: "#78716c", fontSize: "0.75rem" }}>
                      {user.email}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", color: "#57534e" }}>
                    {user.role}
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "0.125rem 0.625rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        ...(user.status === "Active"
                          ? { backgroundColor: "#dcfce7", color: "#166534" }
                          : { backgroundColor: "#fee2e2", color: "#b91c1c" }),
                      }}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", color: "#57534e" }}>
                    {user.joined}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                    <button
                      style={{
                        padding: "0.5rem",
                        color: "#a8a29e",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "0.375rem",
                      }}
                    >
                      <MoreVerticalIcon
                        style={{ height: "1.25rem", width: "1.25rem" }}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid #e7e5e4",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#fafaf9",
          }}
        >
          <span style={{ fontSize: "0.875rem", color: "#78716c" }}>
            Showing 1 to 3 of 2,451 results
          </span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              style={{
                padding: "0.375rem 0.75rem",
                fontSize: "0.875rem",
                borderRadius: "0.375rem",
                fontWeight: 500,
                backgroundColor: "white",
                color: "#57534e",
                border: "1px solid #e7e5e4",
                cursor: "not-allowed",
                opacity: 0.5,
                outline: "none",
              }}
            >
              Previous
            </button>
            <button
              style={{
                padding: "0.375rem 0.75rem",
                fontSize: "0.875rem",
                borderRadius: "0.375rem",
                fontWeight: 500,
                backgroundColor: "white",
                color: "#57534e",
                border: "1px solid #e7e5e4",
                cursor: "pointer",
                outline: "none",
              }}
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
