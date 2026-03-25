import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LeafIcon } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 4rem)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -10,
          background:
            "radial-gradient(ellipse at top, rgba(220, 236, 227, 0.4), #fffbeb, #fffbeb)",
        }}
      ></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", maxWidth: "28rem" }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              backgroundColor: "white",
              padding: "0.75rem",
              borderRadius: "1rem",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              marginBottom: "1rem",
            }}
          >
            <LeafIcon
              style={{ height: "2rem", width: "2rem", color: "#6fa687" }}
            />
          </div>
          <h2
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              color: "#1c1917",
              letterSpacing: "-0.025em",
              margin: 0,
            }}
          >
            Welcome back
          </h2>
          <p style={{ marginTop: "0.5rem", color: "#78716c" }}>
            Please enter your details to sign in.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "1rem",
            padding: "2rem",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
        >
          <form
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
            onSubmit={handleLogin}
          >
            {/* Inline Input for Email */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#44403c",
                  marginBottom: "0.5rem",
                }}
              >
                University Email
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  placeholder="s.jenkins@university.edu"
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    backgroundColor: "white",
                    border: "1px solid #e7e5e4",
                    color: "#292524",
                    fontSize: "0.875rem",
                    transition: "border-color 0.3s",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Inline Input for Password */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#44403c",
                  marginBottom: "0.5rem",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    backgroundColor: "white",
                    border: "1px solid #e7e5e4",
                    color: "#292524",
                    fontSize: "0.875rem",
                    transition: "border-color 0.3s",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "0.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  style={{
                    height: "1rem",
                    width: "1rem",
                    accentColor: "#0ea5e9",
                    borderRadius: "0.25rem",
                    border: "1px solid #d6d3d1",
                  }}
                />
                <label
                  htmlFor="remember-me"
                  style={{
                    marginLeft: "0.5rem",
                    display: "block",
                    fontSize: "0.875rem",
                    color: "#57534e",
                  }}
                >
                  Remember me
                </label>
              </div>
              <div style={{ fontSize: "0.875rem" }}>
                <Link
                  to="#"
                  style={{
                    fontWeight: 500,
                    color: "#0ea5e9",
                    textDecoration: "none",
                  }}
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                borderRadius: "0.5rem",
                fontWeight: 500,
                backgroundColor: "#0ea5e9",
                color: "white",
                border: "none",
                cursor: "pointer",
                outline: "none",
                transition: "background-color 0.3s",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                marginTop: "0.5rem",
              }}
            >
              Sign in
            </button>
          </form>

          <div
            style={{
              marginTop: "2rem",
              textAlign: "center",
              borderTop: "1px solid #f5f5f4",
              paddingTop: "1.5rem",
            }}
          >
            <p style={{ fontSize: "0.875rem", color: "#57534e", margin: 0 }}>
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  fontWeight: 500,
                  color: "#0ea5e9",
                  textDecoration: "none",
                }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
