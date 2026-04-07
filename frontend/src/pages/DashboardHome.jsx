import { Link } from "react-router-dom";

function getStoredUser() {
  const raw =
    localStorage.getItem("user") ?? sessionStorage.getItem("user") ?? null;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function DashboardHome() {
  const user = getStoredUser();

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "1rem",
        border: "1px solid #e7e5e4",
        padding: "2rem",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#1c1917" }}>
        Dashboard
      </h1>
      <p style={{ marginTop: "0.5rem", color: "#78716c" }}>
        {user?.firstName
          ? `Welcome back, ${user.firstName}.`
          : "Welcome back."}
      </p>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link to="/messages" style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: "0.625rem 0.875rem",
              borderRadius: "0.75rem",
              backgroundColor: "#0ea5e9",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Go to Messages
          </button>
        </Link>
        <Link to="/settings" style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: "0.625rem 0.875rem",
              borderRadius: "0.75rem",
              backgroundColor: "#f0f9ff",
              color: "#0369a1",
              border: "1px solid #bae6fd",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Profile Settings
          </button>
        </Link>
      </div>
    </div>
  );
}

