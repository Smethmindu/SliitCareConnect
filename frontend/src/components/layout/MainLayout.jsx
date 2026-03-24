import { Outlet, Link } from "react-router-dom";
import { LeafIcon, UserIcon } from "lucide-react";

export function MainLayout() {
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
                <LeafIcon
                  style={{
                    height: "1.25rem",
                    width: "1.25rem",
                    color: "#0284c7",
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
          <nav style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <div
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
              <Link
                to="/appointments/upcoming"
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#57534e",
                  textDecoration: "none",
                }}
              >
                Appointments
              </Link>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginLeft: "1rem",
                }}
              >
                <Link to="/dashboard" style={{ textDecoration: "none" }}>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "2.25rem",
                      width: "2.25rem",
                      borderRadius: "50%",
                      backgroundColor: "#f0f9ff",
                      color: "#0369a1",
                      border: "1px solid #bae6fd",
                      cursor: "pointer",
                      outline: "none",
                      transition: "all 0.2s",
                    }}
                    title="Profile Dashboard"
                  >
                    <UserIcon style={{ height: "1.25rem", width: "1.25rem" }} />
                  </button>
                </Link>
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
              </div>
            </div>
          </nav>
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
            services at 911.
          </p>
        </div>
      </footer>
    </div>
  );
}
