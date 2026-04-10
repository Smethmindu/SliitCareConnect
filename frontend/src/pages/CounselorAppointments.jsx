import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  BellIcon,
  LogOutIcon,
  VideoIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export function CounselorAppointments() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate('/login');
  };

  let validName = currentUser?.firstName 
    ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() 
    : currentUser?.name;
  
  if (!validName || validName === "undefined undefined" || validName === "undefined") {
    validName = "Counselor";
  }

  const userName = validName;
  const userInitials = userName !== "Counselor" && userName.length > 0
    ? userName.split(" ").map(n => n.charAt(0)).join("").substring(0, 2).toUpperCase()
    : "C";
  const userRoleStr = currentUser?.role 
    ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) 
    : "Counselor";

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (!storedToken || !storedUser) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);
        
        // 1. Fetch Counselor ID using User ID
        const profileRes = await fetch(`http://localhost:3000/api/counselors/user/${user.id}`);
        if (!profileRes.ok) throw new Error("Counselor profile not found");
        const profileData = await profileRes.json();
        const counselorId = profileData.data?.counselor?._id;

        if (counselorId) {
          // 2. Fetch Bookings for this counselor
          const bookingsRes = await fetch(`http://localhost:3000/api/bookings/counselor/${counselorId}`, {
            headers: {
              "Authorization": `Bearer ${storedToken}`
            }
          });
          
          if (bookingsRes.ok) {
            const bookingsData = await bookingsRes.json();
            
            let fetchedBookings = [];
            if (Array.isArray(bookingsData.data)) fetchedBookings = bookingsData.data;
            else if (Array.isArray(bookingsData.data?.bookings)) fetchedBookings = bookingsData.data.bookings;
            else if (Array.isArray(bookingsData.bookings)) fetchedBookings = bookingsData.bookings;
            
            // Show all non-cancelled appointments
            const activeBookings = fetchedBookings
              .filter(b => b.status !== "cancelled")
              .map(b => {
                 let typeDisplay = "Video Call";
                 if (b.sessionType === "in-person") typeDisplay = "In-Person";
                 if (b.sessionType === "phone") typeDisplay = "Phone Call";

                 return {
                    id: b._id,
                    date: b.date, 
                    type: typeDisplay,
                    patient: b.studentName || "Student",
                    time: b.time,
                    status: b.status || "pending",
                    notes: b.notes || "No additional notes.",
                    avatar: "https://i.pravatar.cc/150?u=" + b.studentId,
                 };
              });
              
            setAppointments(activeBookings);
          }
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleMarkCompleted = async (appId) => {
    try {
      const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/bookings/${appId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        },
        body: JSON.stringify({ status: 'completed' })
      });
      if (response.ok) {
        setAppointments(prev => prev.filter(app => app.id !== appId));
        alert('Session marked as completed.');
      } else {
        alert('Failed to mark session as completed.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    }
  };

  const navItems = [
    { icon: LayoutDashboardIcon, label: "Dashboard", path: "/counselor-dashboard" },
    { icon: CalendarIcon, label: "Appointments", path: "/counselor-appointments" },
    { icon: MessageSquareIcon, label: "Messages", path: "/counselor-messages" },
  ];

  return (
    <div style={{ height: "100vh", backgroundColor: "#fdfbf7", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <header style={{ flexShrink: 0, width: "100%", backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #f5f5f4" }}>
        <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "0 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", height: "4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
              <div style={{ backgroundColor: "#f0f9ff", padding: "0.5rem", borderRadius: "0.75rem" }}>
                <img src="/logo.png" alt="Logo" style={{ height: "2.5rem", width: "auto", objectFit: "contain" }} />
              </div>
              <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "#292524", letterSpacing: "-0.025em" }}>
                SliitCare<span style={{ color: "#0ea5e9" }}>Connect</span>
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
             <button style={{ padding: "0.5rem", color: "#a8a29e", background: "none", border: "none", position: "relative", cursor: "pointer" }}>
              <BellIcon style={{ height: "1.25rem", width: "1.25rem" }} />
              <span style={{ position: "absolute", top: "0.375rem", right: "0.375rem", height: "0.5rem", width: "0.5rem", backgroundColor: "#f87171", borderRadius: "50%", border: "2px solid white" }}></span>
            </button>
            <div style={{ height: "2rem", width: "1px", backgroundColor: "#e7e5e4", margin: "0 0.25rem" }}></div>
            <Link to="/settings" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c", margin: 0 }}>{userName}</p>
                <p style={{ fontSize: "0.75rem", color: "#78716c", margin: 0 }}>{userRoleStr}</p>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: "2rem", width: "2rem", borderRadius: "50%", backgroundColor: "#e7e5e4", color: "#57534e", fontSize: "0.875rem", fontWeight: "bold" }}>{userInitials}</div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Layout Area Wrapper */}
      <div style={{ display: "flex", flex: 1, maxWidth: "1600px", width: "100%", margin: "0 auto", overflow: "hidden" }}>
        
        {/* Sidebar */}
        <aside style={{ width: "16rem", backgroundColor: "white", borderRight: "1px solid #f5f5f4", flexShrink: 0, display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <div style={{ padding: "1.5rem", flex: 1 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#a8a29e", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>Menu</div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
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
                      transition: "all 0.3s",
                      ...(isActive ? { backgroundColor: "#f0f9ff", color: "#0369a1" } : { color: "#57534e" }),
                    }}
                  >
                    <item.icon style={{ height: "1.25rem", width: "1.25rem", ...(isActive ? { color: "#0284c7" } : { color: "#a8a29e" }) }} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div style={{ padding: "1.5rem", borderTop: "1px solid #f5f5f4" }}>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <Link to="/" onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.625rem 0.75rem", borderRadius: "0.75rem", fontSize: "0.875rem", fontWeight: 500, color: "#dc2626", textDecoration: "none" }}>
                <LogOutIcon style={{ height: "1.25rem", width: "1.25rem", color: "#f87171" }} />
                Log out
              </Link>
            </nav>
          </div>
        </aside>

        {/* Dynamic Inner Content */}
        <main style={{ flex: 1, padding: "2rem", overflowY: "auto", overflowX: "hidden", minWidth: 0 }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            paddingBottom: "3rem",
            maxWidth: "64rem",
            margin: "0 auto",
          }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#1c1917", margin: 0 }}>
              Approved Appointments
            </h1>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {loading ? (
                 <div style={{ textAlign: "center", padding: "4rem", backgroundColor: "#fafaf9", borderRadius: "1rem" }}>
                    <p style={{ color: "#78716c", fontSize: "1rem" }}>Loading appointments...</p>
                 </div>
              ) : appointments.length > 0 ? (
                appointments.map((app) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1.5rem",
                      backgroundColor: "white",
                      border: "1px solid #e7e5e4",
                      borderRadius: "1rem",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                      gap: "1rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flex: 1, minWidth: "250px" }}>
                       <div style={{ width: "4rem", height: "4rem", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                          <img src={app.avatar} alt="Patient Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                       </div>
                       <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                          <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#1c1917", margin: 0 }}>{app.patient}</h3>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#78716c", fontSize: "0.875rem" }}>
                             <CalendarIcon style={{ width: "1rem", height: "1rem" }} />
                             {app.date}
                             <span style={{ color: "#d6d3d1" }}>•</span>
                             <ClockIcon style={{ width: "1rem", height: "1rem" }} />
                             {app.time}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#57534e", fontSize: "0.875rem", marginTop: "0.25rem", fontWeight: 500 }}>
                            {app.type === "Video Call" && <VideoIcon style={{width: "1rem", height: "1rem"}}/>}
                            {app.type === "In-Person" && <MapPinIcon style={{width: "1rem", height: "1rem"}}/>}
                            {app.type === "Phone Call" && <PhoneIcon style={{width: "1rem", height: "1rem"}}/>}
                            {app.type}
                          </div>
                       </div>
                    </div>

                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      <span style={{ padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, backgroundColor: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }}>
                          Approved
                      </span>
                      <button 
                              onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                              style={{
                                padding: "0.5rem 1.25rem",
                                fontSize: "0.875rem",
                                borderRadius: "0.5rem",
                                fontWeight: 500,
                                backgroundColor: "white",
                                color: "#0369a1",
                                border: "1px solid #bae6fd",
                                cursor: "pointer",
                                transition: "all 0.2s"
                              }}
                       >
                         {expandedId === app.id ? 'Hide Details' : 'View Details'}
                      </button>
                      <button 
                              onClick={() => handleMarkCompleted(app.id)}
                              style={{
                                padding: "0.5rem 1.25rem",
                                fontSize: "0.875rem",
                                borderRadius: "0.5rem",
                                fontWeight: 500,
                                backgroundColor: "#10b981",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                                transition: "all 0.2s"
                              }}
                       >
                         Mark as Completed
                      </button>
                    </div>

                    {expandedId === app.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        style={{ width: "100%", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #f5f5f4" }}
                      >
                        <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", fontWeight: 600, color: "#44403c" }}>Additional Session Notes</h4>
                        <p style={{ margin: 0, fontSize: "0.875rem", color: "#57534e", lineHeight: "1.5" }}>
                           {app.notes ? app.notes : "No additional session notes provided by the student."}
                        </p>
                      </motion.div>
                    )}

                  </motion.div>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "4rem", backgroundColor: "#fafaf9", borderRadius: "1rem", border: "1px dashed #d6d3d1" }}>
                  <p style={{ color: "#78716c", fontSize: "1rem" }}>No approved appointments found.</p>
                </div>
              )}
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}
