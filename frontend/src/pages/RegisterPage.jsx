import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LeafIcon, EyeIcon, EyeOffIcon } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    // Validate student ID
    if (role === "student") {
      const studentIdRegex = /^IT\d{8}$/i;
      if (!studentIdRegex.test(formData.studentId)) {
        setError("Student ID must start with 'IT' followed by 8 digits (e.g., IT23147164).");
        setLoading(false);
        return;
      }
    }

    // Validate password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("Password must be at least 8 characters long, and include an uppercase letter, a lowercase letter, and a special character.");
      setLoading(false);
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
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
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", // Light blue gradient background
        padding: "1rem",
      }}
    >
      <style>
        {`
          input::placeholder {
            color: #d6d3d1 !important;
          }
        `}
      </style>
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
          {/* Role Selector has been removed. Public registration is for students only. */}

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
                  placeholder="e.g. IT23147164"
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
                <p style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: "#a8a29e", marginBottom: 0 }}>
                  Must start with 'IT' followed by 8 digits
                </p>
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
                <div style={{ position: "relative" }}>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "0.75rem 2.5rem 0.75rem 1rem",
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
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#a8a29e",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0
                    }}
                  >
                    {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
                <p style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: "#a8a29e", marginBottom: 0, lineHeight: 1.4 }}>
                  Min 8 chars, 1 uppercase, 1 lowercase, 1 special character
                </p>
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
                <div style={{ position: "relative" }}>
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "0.75rem 2.5rem 0.75rem 1rem",
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
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#a8a29e",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0
                    }}
                  >
                    {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
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
