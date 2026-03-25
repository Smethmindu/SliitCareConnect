import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LeafIcon } from "lucide-react";

export function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");

  const handleRegister = (e) => {
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
        style={{ width: "100%", maxWidth: "36rem" }}
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
            Create your account
          </h2>
          <p style={{ marginTop: "0.5rem", color: "#78716c" }}>
            Join our supportive campus community.
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
          {/* Role Selector */}
          <div
            style={{
              display: "flex",
              padding: "0.25rem",
              backgroundColor: "#f5f5f4",
              borderRadius: "0.75rem",
              marginBottom: "2rem",
            }}
          >
            <button
              type="button"
              onClick={() => setRole("student")}
              style={{
                flex: 1,
                padding: "0.5rem 0",
                fontSize: "0.875rem",
                fontWeight: 500,
                borderRadius: "0.5rem",
                transition: "all 0.3s",
                border: "none",
                cursor: "pointer",
                outline: "none",
                ...(role === "student"
                  ? {
                      backgroundColor: "white",
                      color: "#1c1917",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    }
                  : { backgroundColor: "transparent", color: "#78716c" }),
              }}
            >
              I'm a Student
            </button>
            <button
              type="button"
              onClick={() => setRole("counselor")}
              style={{
                flex: 1,
                padding: "0.5rem 0",
                fontSize: "0.875rem",
                fontWeight: 500,
                borderRadius: "0.5rem",
                transition: "all 0.3s",
                border: "none",
                cursor: "pointer",
                outline: "none",
                ...(role === "counselor"
                  ? {
                      backgroundColor: "white",
                      color: "#1c1917",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    }
                  : { backgroundColor: "transparent", color: "#78716c" }),
              }}
            >
              I'm a Counselor
            </button>
          </div>

          <form
            onSubmit={handleRegister}
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.25rem",
              }}
            >
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
                  First Name
                </label>
                <input
                  placeholder="Sarah"
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    backgroundColor: "white",
                    border: "1px solid #e7e5e4",
                    color: "#292524",
                    fontSize: "0.875rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
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
                  Last Name
                </label>
                <input
                  placeholder="Jenkins"
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    backgroundColor: "white",
                    border: "1px solid #e7e5e4",
                    color: "#292524",
                    fontSize: "0.875rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

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
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <p
                style={{
                  marginTop: "0.25rem",
                  fontSize: "0.75rem",
                  color: "#78716c",
                  marginBottom: 0,
                }}
              >
                Please use your official .edu email address
              </p>
            </div>

            {role === "student" && (
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
                  Student ID
                </label>
                <input
                  placeholder="e.g. 10023456"
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    backgroundColor: "white",
                    border: "1px solid #e7e5e4",
                    color: "#292524",
                    fontSize: "0.875rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            )}

            {role === "counselor" && (
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
                  Staff ID / License Number
                </label>
                <input
                  placeholder="e.g. C-98765"
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    backgroundColor: "white",
                    border: "1px solid #e7e5e4",
                    color: "#292524",
                    fontSize: "0.875rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.25rem",
              }}
            >
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
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
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
                  Confirm Password
                </label>
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
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                marginTop: "1rem",
                alignItems: "flex-start",
              }}
            >
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                style={{
                  marginTop: "0.25rem",
                  height: "1rem",
                  width: "1rem",
                  accentColor: "#0ea5e9",
                }}
              />
              <label
                htmlFor="terms"
                style={{
                  fontSize: "0.875rem",
                  color: "#57534e",
                  lineHeight: 1.5,
                }}
              >
                I agree to the{" "}
                <Link
                  to="#"
                  style={{ color: "#0ea5e9", textDecoration: "none" }}
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="#"
                  style={{ color: "#0ea5e9", textDecoration: "none" }}
                >
                  Privacy Policy
                </Link>
                .
              </label>
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
                marginTop: "1rem",
              }}
            >
              Create Account
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
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  fontWeight: 500,
                  color: "#0ea5e9",
                  textDecoration: "none",
                }}
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
