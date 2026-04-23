import { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LeafIcon,
  SettingsIcon,
  LogOutIcon,
  LayoutDashboardIcon,
  UsersIcon,
  BookOpenIcon,
  MessageSquareIcon,
} from "lucide-react";
import { NotificationBell } from "../NotificationBell";

function getToken() {
  return localStorage.getItem("token") ?? sessionStorage.getItem("token") ?? null;
}

export function ADashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Small delay avoids edge cases where we navigate immediately
    // after saving token in storage on the previous page.
    const t = setTimeout(() => {
      const token = getToken();
      if (!token) {
        navigate("/login", { replace: true, state: { from: location.pathname } });
      } else {
        const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (userStr) {
          try {
            setCurrentUser(JSON.parse(userStr));
          } catch(e) {
            console.error(e);
          }
        }
      }
    }, 0);

    return () => clearTimeout(t);
  }, [location.pathname, navigate]);

  let validName = currentUser?.firstName 
    ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() 
    : currentUser?.name;
  
  if (!validName || validName === "undefined undefined" || validName === "undefined") {
    validName = "Admin";
  }

  const userName = validName;
  const userInitials = userName !== "Admin" && userName.length > 0
    ? userName.split(" ").map(n => n.charAt(0)).join("").substring(0, 2).toUpperCase()
    : "A";
  const userRoleStr = currentUser?.role 
    ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) 
    : "Admin";

  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#fdfbf7", // approx cream-50
    display: "flex",
    flexDirection: "column",
  };

  const wrapperStyle = {
    display: "flex",
    flex: 1,
    maxWidth: "1600px",
    width: "100%",
    margin: "0 auto",
  };

  const mainStyle = {
    flex: 1,
    padding: "2rem",
    overflowY: "auto",
  };

  const innerMainStyle = {
    maxWidth: "64rem",
    margin: "0 auto",
  };

  const headerStyle = {
    position: "sticky",
    top: 0,
    zIndex: 40,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid #f5f5f4",
  };

  const navContainerStyle = {
    maxWidth: "80rem",
    margin: "0 auto",
    padding: "0 1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "4rem",
  };

  const navItems = [
    { icon: LayoutDashboardIcon, label: "Admin Dashboard", path: "/admin" },
    { icon: UsersIcon, label: "Users", path: "/users" },
    { icon: BookOpenIcon, label: "Resources", path: "/admin/resources" },
    { icon: MessageSquareIcon, label: "Feedback", path: "/admin/feedback" },
  ];

  return (
    <div style={containerStyle}>
      {/* Inline Navbar for Dashboard */}
      <header style={headerStyle}>
        <div style={navContainerStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  backgroundColor: "#f0f9ff",
                  padding: "0.5rem",
                  borderRadius: "0.75rem",
                }}
              >
                <img 
                  src="/logo.png" 
                  alt="SliitCareConnect Logo" 
                  style={{
                    height: "2.5rem",
                    width: "auto",
                    objectFit: "contain"
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: "sans-serif",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  color: "#292524",
                  letterSpacing: "-0.025em",
                }}
              >
                SliitCare<span style={{ color: "#0ea5e9" }}>Connect</span>
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <NotificationBell />
            <div
              style={{
                height: "2rem",
                width: "1px",
                backgroundColor: "#e7e5e4",
                margin: "0 0.25rem",
              }}
            ></div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                cursor: "default",
              }}
            >
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#44403c",
                    margin: 0,
                  }}
                >
                  {userName}
                </p>
                <p style={{ fontSize: "0.75rem", color: "#78716c", margin: 0 }}>
                  {userRoleStr}
                </p>
              </div>
              <div
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "2rem",
                  width: "2rem",
                  borderRadius: "50%",
                  backgroundColor: "#e7e5e4",
                  color: "#57534e",
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                }}
              >
                {userInitials}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div style={wrapperStyle}>
        {/* Inline Sidebar */}
        <aside
          style={{
            width: "16rem",
            backgroundColor: "white",
            borderRight: "1px solid #f5f5f4",
            height: "calc(100vh - 4rem)",
            position: "sticky",
            top: "4rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "1.5rem", flex: 1 }}>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#a8a29e",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "1rem",
              }}
            >
              Menu
            </div>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.375rem",
              }}
            >
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(
                  item.path.split("/")[1]
                    ? `/${item.path.split("/")[1]}`
                    : item.path,
                );
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.625rem 0.75rem",
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      textDecoration: "none",
                      transition: "colors 0.3s",
                      ...(isActive
                        ? { backgroundColor: "#f0f9ff", color: "#0369a1" }
                        : { color: "#57534e" }),
                    }}
                  >
                    <item.icon
                      style={{
                        height: "1.25rem",
                        width: "1.25rem",
                        ...(isActive
                          ? { color: "#0284c7" }
                          : { color: "#a8a29e" }),
                      }}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div style={{ padding: "1.5rem", borderTop: "1px solid #f5f5f4" }}>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.375rem",
              }}
            >
              <Link
                to="/asettings"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.625rem 0.75rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#57534e",
                  textDecoration: "none",
                }}
              >
                <SettingsIcon
                  style={{
                    height: "1.25rem",
                    width: "1.25rem",
                    color: "#a8a29e",
                  }}
                />
                Settings
              </Link>
              <Link
                to="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.625rem 0.75rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#dc2626",
                  textDecoration: "none",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  sessionStorage.removeItem("token");
                  sessionStorage.removeItem("user");
                  navigate("/login");
                }}
              >
                <LogOutIcon
                  style={{
                    height: "1.25rem",
                    width: "1.25rem",
                    color: "#f87171",
                  }}
                />
                Log out
              </Link>
            </nav>
          </div>
        </aside>

        <main style={mainStyle}>
          <div style={innerMainStyle}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
