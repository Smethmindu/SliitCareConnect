import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { LeafIcon, BellIcon, LogOutIcon } from "lucide-react";

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

  const userName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : 'Guest';
  const userRole = currentUser?.role
    ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)
    : '';
  const userInitials = currentUser
    ? `${currentUser.firstName?.[0] || ''}${currentUser.lastName?.[0] || ''}`
    : 'G';

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
                to="/blog"
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
                  <button
                    style={{
                      padding: "0.5rem",
                      color: "#a8a29e",
                      background: "none",
                      border: "none",
                      position: "relative",
                      cursor: "pointer",
                    }}
                    title="Notifications"
                    >
                      <BellIcon style={{ height: "1.25rem", width: "1.25rem" }} />
                      <span
                        style={{
                          position: "absolute",
                          top: "0.375rem",
                          right: "0.375rem",
                          height: "0.5rem",
                          width: "0.5rem",
                          backgroundColor: "#f87171",
                          borderRadius: "50%",
                          border: "2px solid white",
                        }}
                      ></span>
                    </button>
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
                          {userRole}
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
