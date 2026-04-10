import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  FileTextIcon,
  MoreHorizontalIcon,
  VideoIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  LeafIcon,
  BellIcon,
  LogOutIcon,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function CounselorDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

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


  const [todaySessions, setTodaySessions] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
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
            
            let bookings = [];
            if (Array.isArray(bookingsData.data)) bookings = bookingsData.data;
            else if (Array.isArray(bookingsData.data?.bookings)) bookings = bookingsData.data.bookings;
            else if (Array.isArray(bookingsData.bookings)) bookings = bookingsData.bookings;
            
            // Store all bookings for stat calculations
            setAllBookings(bookings);
            
            // Filter TODAY's confirmed sessions only for "Today's Schedule"
            const todayStr = new Date().toISOString().split("T")[0];
            const todayConfirmed = bookings
              .filter(b => {
                if (b.status === "cancelled" || b.status === "completed") return false;
                // Only show bookings whose date matches today
                const bookingDate = b.date ? new Date(b.date).toISOString().split("T")[0] : "";
                return bookingDate === todayStr;
              })
              .map(b => ({
                id: b._id,
                patient: b.studentName || "Student",
                type: b.sessionType === "video" ? "Video Call" : b.sessionType === "phone" ? "Phone Call" : "In-Person",
                time: b.time,
                status: b.status || "upcoming",
                avatar: "https://i.pravatar.cc/150?u=" + b.studentId,
              }));
              
            setTodaySessions(todayConfirmed);
            
            const pending = bookings
              .filter(b => b.status === "pending")
              .map(b => ({
                id: b._id,
                patient: b.studentName || "Student",
                type: b.sessionType === "video" ? "Video Call" : b.sessionType === "phone" ? "Phone Call" : "In-Person",
                requestedDate: b.date,
                requestedTime: b.time,
                avatar: "https://i.pravatar.cc/150?u=" + b.studentId,
              }));
              
            setPendingRequests(pending);
          }
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${storedToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        // Reload to update UI with latest statuses correctly
        window.location.reload(); 
      } else {
        const errorData = await res.json();
        alert(errorData.message || `Failed to ${newStatus === 'confirmed' ? 'approve' : 'decline'} request.`);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
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
            {/* Welcome Banner */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div
                style={{
                  background: "linear-gradient(to bottom right, #10b981, #059669)",
                  color: "white",
                  padding: "2rem",
                  borderRadius: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "16rem",
                    height: "16rem",
                    backgroundColor: "white",
                    opacity: 0.1,
                    borderRadius: "50%",
                    transform: "translateY(-50%) translateX(33%)",
                    filter: "blur(32px)",
                  }}
                ></div>
                <div
                  style={{
                    position: "relative",
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1.5rem",
                  }}
                >
                  <div>
                    <h1
                      style={{
                        fontSize: "1.875rem",
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                        marginTop: 0,
                        color: "white"
                      }}
                    >
                      Good morning, {currentUser?.firstName ? currentUser.firstName : "Counselor"}
                    </h1>
                    <p style={{ color: "#d1fae5", fontSize: "1.125rem", margin: 0 }}>
                      You have {todaySessions.length} session{todaySessions.length !== 1 ? 's' : ''} scheduled today.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <Link to="/counselor-availability" style={{ textDecoration: "none" }}>
                      <button
                        style={{
                          padding: "0.5rem 1rem",
                          borderRadius: "0.375rem",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          backgroundColor: "rgba(255,255,255,0.2)",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          outline: "none",
                        }}
                      >
                        Update Availability
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Analytics Cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1rem",
              }}
            >
              {(() => {
                // Compute real stats from booking data
                const uniquePatients = new Set(allBookings.filter(b => b.status !== "cancelled").map(b => b.studentId)).size;
                
                const now = new Date();
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                startOfWeek.setHours(0, 0, 0, 0);
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 7);
                const sessionsThisWeek = allBookings.filter(b => {
                  if (b.status === "cancelled") return false;
                  const bookingDate = new Date(b.date);
                  return bookingDate >= startOfWeek && bookingDate < endOfWeek;
                }).length;
                
                const completedSessions = allBookings.filter(b => b.status === "completed").length;
                
                return [
                  {
                    icon: UsersIcon,
                    label: "Total Patients",
                    value: String(uniquePatients),
                    color: "#0ea5e9",
                    bg: "#e0f2fe",
                  },
                  {
                    icon: CalendarIcon,
                    label: "Sessions This Week",
                    value: String(sessionsThisWeek),
                    color: "#10b981",
                    bg: "#d1fae5",
                  },
                  {
                    icon: ClockIcon,
                    label: "Hours Completed",
                    value: String(completedSessions),
                    color: "#8b5cf6",
                    bg: "#ede9fe",
                  },
                ];
              })().map((stat, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "1rem",
                    padding: "1.5rem",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div
                      style={{
                        width: "3rem",
                        height: "3rem",
                        borderRadius: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: stat.bg,
                        color: stat.color,
                        flexShrink: 0,
                      }}
                    >
                      <stat.icon style={{ height: "1.5rem", width: "1.5rem" }} />
                    </div>
                    <div>
                      <p
                        style={{
                          color: "#78716c",
                          fontSize: "0.875rem",
                          margin: "0 0 0.25rem 0",
                        }}
                      >
                        {stat.label}
                      </p>
                      <h3
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          color: "#1c1917",
                          margin: 0,
                        }}
                      >
                        {stat.value}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2rem",
              }}
            >
              {/* Left Column (Main Widgets: Today's Schedule + Pending Requests) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
                style={{
                  gridColumn: "span 2 / span 2",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                  minWidth: 0,
                }}
              >
                {/* Today's Schedule */}
                <div
                  style={{
                    padding: "1.5rem",
                    backgroundColor: "white",
                    borderRadius: "1rem",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        color: "#1c1917",
                        margin: 0,
                      }}
                    >
                      Today's Schedule
                    </h2>
                    <Link
                      to="/counselor-appointments"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "#0ea5e9",
                        textDecoration: "none",
                      }}
                    >
                      View Full Calendar{" "}
                      <ArrowRightIcon
                        style={{
                          height: "1rem",
                          width: "1rem",
                          marginLeft: "0.25rem",
                        }}
                      />
                    </Link>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {loading ? (
                      <p style={{ color: "#78716c", fontSize: "0.875rem", textAlign: "center", padding: "2rem" }}>Loading schedule...</p>
                    ) : todaySessions.length > 0 ? (
                      todaySessions.map((session, index) => (
                        <div
                          key={session.id}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "1rem",
                          }}
                        >
                          <div
                            style={{
                              width: "4rem",
                              textAlign: "right",
                              paddingTop: "0.5rem",
                              flexShrink: 0
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.875rem",
                                fontWeight: 500,
                                color: "#57534e",
                              }}
                            >
                              {session.time.split(" - ")[0]}
                          </span>
                        </div>
                        <div
                          style={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "1.5rem",
                              bottom: "-1.5rem",
                              width: "2px",
                              backgroundColor:
                                index !== todaySessions.length - 1
                                  ? "#e7e5e4"
                                  : "transparent",
                              zIndex: 0,
                            }}
                          ></div>
                          <div
                            style={{
                              width: "0.75rem",
                              height: "0.75rem",
                              borderRadius: "50%",
                              backgroundColor: "#0ea5e9",
                              border: "4px solid white",
                              position: "relative",
                              zIndex: 10,
                              marginTop: "0.625rem",
                            }}
                          ></div>
                        </div>
                        <div
                          style={{
                            flex: 1,
                            backgroundColor: "#f0f9ff",
                            border: "1px solid #bae6fd",
                            borderRadius: "1rem",
                            padding: "1rem",
                            transition: "box-shadow 0.2s",
                            cursor: "pointer",
                            minWidth: 0,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: "0.75rem",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                minWidth: 0,
                              }}
                            >
                              <div
                                style={{
                                  position: "relative",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  height: "2.5rem",
                                  width: "2.5rem",
                                  borderRadius: "50%",
                                  backgroundColor: "#e7e5e4",
                                  color: "#57534e",
                                  fontSize: "0.875rem",
                                  overflow: "hidden",
                                  flexShrink: 0,
                                }}
                              >
                                <img
                                  src={session.avatar}
                                  alt="Avatar"
                                  style={{
                                    height: "100%",
                                    width: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                              <div style={{ minWidth: 0, overflow: "hidden" }}>
                                <h4
                                  style={{
                                    fontWeight: 600,
                                    color: "#0369a1",
                                    margin: "0 0 0.125rem 0",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                  }}
                                >
                                  {session.patient}
                                </h4>
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    padding: "0.125rem 0.625rem",
                                    borderRadius: "9999px",
                                    fontSize: "0.75rem",
                                    fontWeight: 500,
                                    backgroundColor: "white",
                                    color: "#0284c7",
                                  }}
                                >
                                  <VideoIcon
                                    style={{
                                      height: "0.75rem",
                                      width: "0.75rem",
                                      marginRight: "0.25rem",
                                    }}
                                  />{" "}
                                  {session.type}
                                </span>
                              </div>
                            </div>
                            <button
                              style={{
                                padding: "0.375rem",
                                color: "#0284c7",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                borderRadius: "0.375rem",
                                flexShrink: 0
                              }}
                            >
                              <MoreHorizontalIcon
                                style={{ height: "1.25rem", width: "1.25rem" }}
                              />
                            </button>
                          </div>
                          <div style={{ display: "flex", gap: "0.5rem" }}>

                            <button
                              style={{
                                flex: 1,
                                padding: "0.375rem 0.5rem",
                                fontSize: "0.875rem",
                                borderRadius: "0.375rem",
                                fontWeight: 500,
                                backgroundColor: "white",
                                color: "#0369a1",
                                border: "1px solid #bae6fd",
                                cursor: "pointer",
                                outline: "none",
                              }}
                            >
                              View Notes
                            </button>
                          </div>
                        </div>
                      </div>
                      ))
                    ) : (
                      <p style={{ color: "#78716c", fontSize: "0.875rem", textAlign: "center", padding: "2rem", fontStyle: "italic", border: "1px dashed #e7e5e4", borderRadius: "1rem" }}>No upcoming sessions scheduled.</p>
                    )}
                  </div>
                </div>

                {/* Pending Requests */}
                <div
                  style={{
                    padding: "1.5rem",
                    backgroundColor: "white",
                    borderRadius: "1rem",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      color: "#1c1917",
                      marginBottom: "1.5rem",
                      marginTop: 0,
                    }}
                  >
                    Pending Requests
                  </h2>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                  >
                    {loading ? (
                      <p style={{ color: "#78716c", fontSize: "0.875rem", textAlign: "center", padding: "2rem" }}>Loading requests...</p>
                    ) : pendingRequests.length > 0 ? (
                      pendingRequests.map((req) => (
                      <div
                        key={req.id}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "wrap",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "1rem",
                          border: "1px solid #f5f5f4",
                          borderRadius: "0.75rem",
                          gap: "1rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            minWidth: 0,
                            flex: "1 1 auto"
                          }}
                        >
                          <div
                            style={{
                              position: "relative",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "3.5rem",
                              width: "3.5rem",
                              borderRadius: "50%",
                              backgroundColor: "#e7e5e4",
                              color: "#57534e",
                              fontSize: "1.25rem",
                              overflow: "hidden",
                              flexShrink: 0,
                            }}
                          >
                            <img
                              src={req.avatar}
                              alt="Avatar"
                              style={{
                                height: "100%",
                                width: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <h4
                              style={{
                                fontWeight: 600,
                                fontSize: "1.125rem",
                                color: "#1c1917",
                                margin: "0 0 0.5rem 0",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                              }}
                            >
                              {req.patient}
                            </h4>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "1rem",
                                color: "#78716c",
                                fontSize: "0.875rem",
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                  whiteSpace: "nowrap"
                                }}
                              >
                                <CalendarIcon
                                  style={{ height: "1rem", width: "1rem" }}
                                />{" "}
                                {req.requestedDate}
                              </span>
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                  whiteSpace: "nowrap"
                                }}
                              >
                                <ClockIcon
                                  style={{ height: "1rem", width: "1rem" }}
                                />{" "}
                                {req.requestedTime}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.75rem",
                            flexShrink: 0,
                            marginTop: "0.5rem",
                          }}
                        >
                          <button
                            onClick={() => handleUpdateStatus(req.id, 'declined')}
                            style={{
                              padding: "0.5rem 1.25rem",
                              fontSize: "0.875rem",
                              borderRadius: "0.5rem",
                              fontWeight: 500,
                              backgroundColor: "white",
                              color: "#dc2626",
                              border: "1px solid #fecaca",
                              cursor: "pointer",
                              outline: "none",
                              transition: "all 0.2s"
                            }}
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(req.id, 'confirmed')}
                            style={{
                              padding: "0.5rem 1.25rem",
                              fontSize: "0.875rem",
                              borderRadius: "0.5rem",
                              fontWeight: 500,
                              backgroundColor: "#10b981",
                              color: "white",
                              border: "none",
                              cursor: "pointer",
                              outline: "none",
                              transition: "all 0.2s"
                            }}
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                      ))
                    ) : (
                      <p style={{ color: "#78716c", fontSize: "0.875rem", textAlign: "center", padding: "2rem", fontStyle: "italic", border: "1px dashed #e7e5e4", borderRadius: "1rem" }}>No pending requests at this time.</p>
                    )}
                  </div>
                </div>

              </motion.div>

              {/* Analytics Chart */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
                style={{ display: "flex", flexDirection: "column", gap: "1.5rem", minWidth: 0 }}
              >
                <div
                  style={{
                    padding: "1.5rem",
                    backgroundColor: "white",
                    borderRadius: "1rem",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <h3
                    style={{
                      fontWeight: 600,
                      color: "#1c1917",
                      marginBottom: "1rem",
                      marginTop: 0,
                    }}
                  >
                    Sessions Trend
                  </h3>
                  <div style={{ flex: 1, minHeight: "250px", width: "100%" }}>
                    {(() => {
                      const counts = {};
                      allBookings.forEach(b => {
                        if (b.status === "cancelled") return;
                        const d = b.date;
                        if (d) counts[d] = (counts[d] || 0) + 1;
                      });
                      
                      const sorted = Object.entries(counts)
                        .sort(([a], [b]) => new Date(a) - new Date(b))
                        .slice(-7)
                        .map(([date, count]) => ({
                          name: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                          sessions: count
                        }));
                        
                      const chartData = sorted.length > 0 ? sorted : [
                        { name: "Mon", sessions: 0 },
                        { name: "Tue", sessions: 0 },
                        { name: "Wed", sessions: 0 },
                        { name: "Thu", sessions: 0 },
                        { name: "Fri", sessions: 0 },
                      ];

                      return (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                            <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#a8a29e', fontSize: 12 }} 
                              dy={10} 
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#a8a29e', fontSize: 12 }} 
                              allowDecimals={false}
                            />
                            <Tooltip 
                              contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                              cursor={{ stroke: '#f5f5f4', strokeWidth: 2 }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="sessions" 
                              stroke="#0ea5e9" 
                              strokeWidth={3}
                              dot={{ r: 4, strokeWidth: 2, fill: "white", stroke: "#0ea5e9" }}
                              activeDot={{ r: 6, stroke: "#0ea5e9", strokeWidth: 2, fill: "white" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      );
                    })()}
                  </div>
                </div>

              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
