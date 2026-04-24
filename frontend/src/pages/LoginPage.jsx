/**
 * MEMBER 1: Auth & User Management
 * LOGIN PAGE COMPONENT
 * This page handles user authentication, JWT storage, and role-based redirection.
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LeafIcon } from "lucide-react";

const API_BASE_URL = "/api";

export function LoginPage() {
  const navigate = useNavigate();
  
  // State for form fields
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // State for UI feedback (loading spinner, error messages)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State for persistent login preference
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * HANDLE LOGIN SUBMISSION
   * Sends credentials to the backend and handles the response.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // POST request to the auth/login endpoint
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        // If backend returns non-JSON (or crashes), show the raw response.
        const text = await response.text().catch(() => '');
        setError(text || `Login failed (HTTP ${response.status})`);
        return;
      }

      if (response.ok && data.success) {
        console.log('✅ Login successful!');
        const token = data?.data?.token;
        const user = data?.data?.user;

        if (!token || !user) {
          setError("Login response missing token/user. Please check backend response.");
          return;
        }

        // --- CREDENTIAL STORAGE ---
        // We clear existing storage to prevent mixing old session data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');

        // --- PERSISTENT LOGIN LOGIC ---
        // We decide where to store the token based on the 'Remember Me' checkbox:
        // 1. localStorage: Remains after browser restart (persistent).
        // 2. sessionStorage: Deleted when tab/browser is closed (volatile).
        if (rememberMe) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('user', JSON.stringify(user));
        }

        const storedToken =
          localStorage.getItem("token") ?? sessionStorage.getItem("token") ?? null;
        if (!storedToken) {
          setError("Token was not saved in browser storage. Please allow site storage/cookies.");
          return;
        }
        
        // --- ROLE-BASED REDIRECTION ---
        // Redirect user to their specific dashboard based on their role
        const userRole = data.data.user.role;
        
        if (userRole === 'admin') {
          navigate('/admin');
        } else if (userRole === 'counselor') {
          navigate('/counselor-dashboard');
        } else if (userRole === 'student') {
          navigate('/');
        } else {
          navigate('/messages');
        }
      } else {
        setError(data?.message || `Login failed (HTTP ${response.status})`);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", // Light blue gradient background
        padding: "1rem",
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
            <img 
              src="/logo.png" 
              alt="SliitCareConnect Logo" 
              style={{
                height: "4rem",
                width: "auto",
                objectFit: "contain"
              }}
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
                    transition: "border-color 0.3s",
                    outline: "none",
                    boxSizing: "border-box",
                    opacity: loading ? 0.7 : 1
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
                    transition: "border-color 0.3s",
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
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
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
                marginTop: "0.5rem",
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
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
