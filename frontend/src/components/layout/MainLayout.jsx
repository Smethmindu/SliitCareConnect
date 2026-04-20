import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { LeafIcon, LogOutIcon } from "lucide-react";
import { NotificationBell } from "../NotificationBell";

export function MainLayout() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {
        console.log('Could not parse stored user data');
      }
    }
  }, []);

  let validName = currentUser?.firstName 
    ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() 
    : currentUser?.name;
  
  if (!validName || validName === "undefined undefined" || validName === "undefined") {
    validName = "Guest";
  }

  const userName = validName;
  const userInitials = userName !== "Guest" && userName.length > 0
    ? userName.split(" ").map(n => n.charAt(0)).join("").substring(0, 2).toUpperCase()
    : "G";
  const userRole = currentUser?.role
    ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)
    : '';

  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/');
  };

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  };

  const mainStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  };

  const footerStyle = {
    backgroundColor: "#ffffff",
    borderTop: "1px solid #f5f5f4",
    padding: "3rem 0",
    marginTop: "auto",
  };

  const footerInnerStyle = {
    maxWidth: "80rem",
    margin: "0 auto",
    padding: "0 1rem",
    textAlign: "center",
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

  const logoIconStyle = {
    backgroundColor: "#f0f9ff",
    padding: "0.5rem",
    borderRadius: "0.75rem",
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={navContainerStyle}>
          {/* Logo */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
              }}
            >
              <div style={logoIconStyle}>
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
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
              flexWrap: "wrap",
            }}
          >
            <Link
                to="/"
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#57534e",
                  textDecoration: "none",
                }}
              >
                Home
              </Link>
              <Link
                to="/counselors"
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#57534e",
                  textDecoration: "none",
                }}
              >
                Counselors
              </Link>
              <Link
                to="/resources"
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#57534e",
                  textDecoration: "none",
                }}
              >
                Resources
              </Link>
              {currentUser && (
                <Link
                  to="/appointments"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#57534e",
                    textDecoration: "none",
                  }}
                >
                  Appointments
                </Link>
              )}
              <Link
                to="/contact"
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#57534e",
                  textDecoration: "none",
                }}
              >
                Contact Us
              </Link>
            </nav>

            {/* Profile / Auth Section */}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "0.75rem",
              }}
            >
              {currentUser ? (
                <>
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
                        gap: "1.25rem",
                      }}
                    >
                      <Link
                        to="/profile"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          cursor: "pointer",
                          textDecoration: "none",
                          transition: "opacity 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.opacity = 0.8}
                        onMouseOut={(e) => e.currentTarget.style.opacity = 1}
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
                          {userRole}
                        </p>
                      </div>
                      <div
                        style={{
                          position: "relative",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "2.25rem",
                          width: "2.25rem",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
                          color: "white",
                          fontSize: "0.875rem",
                          fontWeight: "bold",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        }}
                      >
                        {userInitials}
                      </div>
                    </Link>
                      <button
                        onClick={handleLogout}
                        style={{
                          position: "absolute",
                          right: "1.5rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "2rem",
                          width: "2rem",
                          backgroundColor: "#fee2e2",
                          border: "none",
                          borderRadius: "50%",
                          cursor: "pointer",
                          color: "#ef4444",
                          transition: "background-color 0.2s",
                        }}
                        title="Log out"
                      >
                        <LogOutIcon style={{ height: "1rem", width: "1rem" }} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link to="/login" style={{ textDecoration: "none" }}>
                      <button
                        style={{
                          padding: "0.375rem 0.75rem",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "#57534e",
                          backgroundColor: "transparent",
                          border: "none",
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          outline: "none",
                          transition: "background-color 0.3s",
                        }}
                      >
                        Log in
                      </button>
                    </Link>
                    <Link to="/register" style={{ textDecoration: "none" }}>
                      <button
                        style={{
                          padding: "0.375rem 0.75rem",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "white",
                          backgroundColor: "#0ea5e9",
                          border: "none",
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          outline: "none",
                          transition: "background-color 0.3s",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        }}
                      >
                        Sign up
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
      </header>
      <main style={mainStyle}>
        <Outlet />
      </main>
      <footer style={footerStyle}>
        <div style={footerInnerStyle}>
          <p style={{ color: "#78716c", fontSize: "0.875rem", margin: 0 }}>
            © {new Date().getFullYear()} SliitCareConnect University Wellness. All
            rights reserved.
          </p>
          <p
            style={{
              color: "#a8a29e",
              fontSize: "0.75rem",
              marginTop: "0.5rem",
              marginBottom: 0,
            }}
          >
            If you are in immediate distress, please call campus emergency
            services at +94 11 754 4801.
          </p>
        </div>
      </footer>
    </div>
  );
}
