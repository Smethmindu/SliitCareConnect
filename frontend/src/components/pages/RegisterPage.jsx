import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LeafIcon } from "lucide-react";

const API_BASE_URL = "/api";

export function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: role,
          studentId: formData.studentId
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        
        // Store token and user data
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Navigate to login page after successful registration
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
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

        {/* Success Message */}
        {success && (
          <div
            style={{
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "0.5rem",
              padding: "1rem",
              marginBottom: "1rem",
              textAlign: "center",
              color: "#166534"
            }}
          >
            Registration successful! Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "0.5rem",
              padding: "1rem",
              marginBottom: "1rem",
              textAlign: "center",
              color: "#dc2626"
            }}
          >
            {error}
          </div>
        )}

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
              flexDirection: "column",
              marginBottom: "2rem",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#44403c",
                marginBottom: "0.5rem",
              }}
            >
              I am a
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
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
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1
              }}
            >
              <option value="student">Student</option>
              <option value="counselor">Counselor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <form
            action="#"
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
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Sarah"
                  required
                  disabled={loading}
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
                    opacity: loading ? 0.7 : 1
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
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Jenkins"
                  required
                  disabled={loading}
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
                    opacity: loading ? 0.7 : 1
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
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="s.jenkins@university.edu"
                required
                disabled={loading}
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
                  opacity: loading ? 0.7 : 1
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
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  placeholder="e.g. 10023456"
                  required
                  disabled={loading}
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
                    opacity: loading ? 0.7 : 1
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
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  disabled={loading}
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
                    opacity: loading ? 0.7 : 1
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
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  disabled={loading}
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
                    opacity: loading ? 0.7 : 1
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
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                borderRadius: "0.5rem",
                fontWeight: 500,
                backgroundColor: loading ? "#94a3b8" : "#0ea5e9",
                color: "white",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                outline: "none",
                transition: "background-color 0.3s",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                marginTop: "1rem",
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
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
