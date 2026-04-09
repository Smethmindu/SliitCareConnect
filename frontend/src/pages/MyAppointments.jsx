import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, VideoIcon, MapPinIcon } from "lucide-react";

const mockAppointments = [
  {
    id: 1,
    date: "16th September",
    fullDate: "2026-09-16",
    type: "Video Call",
    counselor: "Dr. Emily Chen",
    time: "10:00 AM - 11:00 AM",
    status: "Upcoming",
    notes: "I want to discuss my recent anxiety related to final exams.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 2,
    date: "13th September",
    fullDate: "2026-09-13",
    type: "In-Person",
    counselor: "Dr. Marcus Rivera",
    time: "02:00 PM - 03:00 PM",
    status: "Completed",
    notes: "General stress management.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 3,
    date: "10th September",
    fullDate: "2026-09-10",
    type: "Phone Call",
    counselor: "Sarah Kim",
    time: "11:00 AM - 11:30 AM",
    status: "Canceled",
    notes: "Career guidance.",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80"
  }
];

export function MyAppointments() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredAppointments = mockAppointments.filter((app) => 
    activeTab === "All" || app.status === activeTab
  );

  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentDate.getMonth(), 1).getDay();

  const blanks = Array.from({ length: firstDay });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentDate.getMonth() + 1, 1));
  };
  
  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentYear;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", paddingBottom: "3rem" }}>
      
      <div style={{ display: "flex", flexWrap: "wrap", gap: "3rem" }}>
        
        {/* Left Column (Main Content) */}
        <div style={{ flex: "1 1 60%", minWidth: "300px" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h1 style={{ fontSize: "2rem", fontFamily: "sans-serif", fontWeight: "bold", color: "#1c1917", margin: 0 }}>
              My Appointments
            </h1>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
            {["All", "Upcoming", "Completed", "Canceled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  border: "1px solid",
                  whiteSpace: "nowrap",
                  ...(activeTab === tab 
                    ? { backgroundColor: "#f0f9ff", color: "#0ea5e9", borderColor: "#bae6fd" } 
                    : { backgroundColor: "white", color: "#57534e", borderColor: "#e7e5e4" }
                  )
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Appointment Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((app) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: "white",
                    borderRadius: "1rem",
                    overflow: "hidden",
                    border: app.status === "Upcoming" ? "2px solid #0ea5e9" : "1px solid #e7e5e4",
                    boxShadow: app.status === "Upcoming" ? "0 4px 12px rgba(14, 165, 233, 0.1)" : "0 2px 4px rgba(0,0,0,0.02)",
                    flexWrap: "wrap"
                  }}
                >
                  {/* Left Side Graphic */}
                  <div style={{ width: "200px", minHeight: "140px", flexShrink: 0, position: "relative" }}>
                    <img src={app.image} alt="Session illustration" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: app.status === "Upcoming" ? "linear-gradient(to right, rgba(14,165,233,0.3), transparent)" : "linear-gradient(to right, rgba(0,0,0,0.1), transparent)" }}></div>
                  </div>

                  {/* Right Side Content */}
                  <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.875rem", color: "#78716c", fontWeight: 500 }}>{app.date}</span>
                      <span style={{ color: "#d6d3d1" }}>•</span>
                      <span style={{ fontSize: "0.875rem", color: "#78716c", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        {app.type === "Video Call" && <VideoIcon style={{width: "1rem", height: "1rem"}}/>}
                        {app.type === "In-Person" && <MapPinIcon style={{width: "1rem", height: "1rem"}}/>}
                        {app.type}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1c1917", margin: "0 0 0.5rem 0" }}>
                      {app.counselor}
                    </h3>
                    
                    <p style={{ fontSize: "0.875rem", color: "#57534e", margin: "0 0 1rem 0", fontWeight: 500 }}>
                      Time: {app.time}
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center", marginTop: "auto" }}>
                      {app.status === "Upcoming" && (
                        <>
                          <button style={{ padding: "0.375rem 1rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, backgroundColor: "white", color: "#ef4444", border: "1px solid #fca5a5", cursor: "pointer", outline: "none" }}>
                            Cancel Appointment
                          </button>
                          <button style={{ padding: "0.375rem 1rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, backgroundColor: "white", color: "#10b981", border: "1px solid #6ee7b7", cursor: "pointer", outline: "none" }}>
                            Reschedule
                          </button>
                        </>
                      )}

                      {(app.status === "Completed" || app.status === "Canceled") && (
                        <span style={{ padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, backgroundColor: "#f5f5f4", color: "#78716c", border: "1px solid #e7e5e4" }}>
                          {app.status}
                        </span>
                      )}

                      <div style={{ marginLeft: "auto", position: "relative", group: "true" }}>
                        <button style={{ color: "#0ea5e9", backgroundColor: "transparent", border: "none", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }} title={app.notes}>
                          Pre-session notes
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "4rem", backgroundColor: "#fafaf9", borderRadius: "1rem", border: "1px dashed #d6d3d1" }}>
                <p style={{ color: "#78716c", fontSize: "1rem" }}>No appointments found in this category.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Sidebar Calendar) */}
        <div style={{ flex: "1 1 30%", minWidth: "250px", maxWidth: "350px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1c1917", margin: 0 }}>Calendar</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button onClick={prevMonth} style={{ background: "none", border: "1px solid #e7e5e4", borderRadius: "0.5rem", padding: "0.25rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ChevronLeftIcon style={{ width: "1.25rem", height: "1.25rem", color: "#57534e" }} />
              </button>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e7e5e4", padding: "0.375rem 0.75rem", borderRadius: "0.5rem", backgroundColor: "white", minWidth: "100px" }}>
                <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c" }}>{currentMonth} {currentYear}</span>
              </div>
              <button onClick={nextMonth} style={{ background: "none", border: "1px solid #e7e5e4", borderRadius: "0.5rem", padding: "0.25rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ChevronRightIcon style={{ width: "1.25rem", height: "1.25rem", color: "#57534e" }} />
              </button>
            </div>
          </div>

          <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #f5f5f4", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
            {/* Days of Week */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.25rem", marginBottom: "1rem" }}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} style={{ textAlign: "center", fontSize: "0.75rem", fontWeight: 600, color: "#a8a29e" }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.25rem" }}>
              {blanks.map((_, i) => <div key={`blank-${i}`} />)}
              {days.map(day => {
                const isSelected = isCurrentMonth && day === today.getDate();
                return (
                  <div 
                    key={day} 
                    style={{ 
                      aspectRatio: "1", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      fontSize: "0.875rem",
                      fontWeight: isSelected ? "bold" : 500,
                      color: isSelected ? "white" : "#44403c",
                      backgroundColor: isSelected ? "#1c1917" : "transparent",
                      borderRadius: "0.375rem",
                      cursor: "default"
                    }}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
