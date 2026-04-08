import { useState, useEffect } from "react";

export function StudentDashboard() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user info from stored data (from login)
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        console.log('✅ Student Dashboard - Loaded current user from storage:', parsedUser);
      } catch (e) {
        console.log("Could not parse stored user data");
      }
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f5f7",
        padding: "2rem",
      }}
    >
      {currentUser ? (
        <div style={{ textAlign: "center", maxWidth: "600px" }}>
          <h1 style={{ 
            fontSize: "2.5rem", 
            color: "#1c1917", 
            marginBottom: "1rem",
            fontWeight: "bold" 
          }}>
            Welcome to Student Dashboard
          </h1>
          <p style={{ 
            fontSize: "1.25rem", 
            color: "#6b7280", 
            marginBottom: "0.5rem",
            lineHeight: "1.5" 
          }}>
            Hello, {currentUser.firstName} {currentUser.lastName}!
          </p>
          <p style={{ 
            fontSize: "1rem", 
            color: "#78716c", 
            marginBottom: "1rem",
            lineHeight: "1.5" 
          }}>
            You are logged in as a student.
          </p>
          <p style={{ 
            fontSize: "1rem", 
            color: "#78716c", 
            marginBottom: "1rem",
            lineHeight: "1.5" 
          }}>
            Your student ID: {currentUser.studentId || "Not assigned"}
          </p>
          <p style={{ 
            fontSize: "1rem", 
            color: "#78716c", 
            marginBottom: "1rem",
            lineHeight: "1.5" 
          }}>
            Email: {currentUser.email}
          </p>
          <p style={{ 
            fontSize: "1rem", 
            color: "#78716c", 
            lineHeight: "1.5" 
          }}>
            Member since: {new Date(currentUser.createdAt).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h1 style={{ 
            fontSize: "2rem", 
            color: "#6b7280", 
            marginBottom: "1rem" 
          }}>
            Loading Student Dashboard...
          </h1>
          <p style={{ 
            fontSize: "1rem", 
            color: "#9ca3af", 
            lineHeight: "1.5" 
          }}>
            Please wait while we load your information.
          </p>
        </div>
      )}
    </div>
  );
}
