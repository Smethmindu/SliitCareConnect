import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarIcon,
  ClockIcon,
  VideoIcon,
  MapPinIcon,
  PhoneIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { sendBookingEmail } from "../utils/emailService.js";

// ── Tiny inline calendar ─────────────────────────────────────────────────────
function InlineCalendar({ selectedDate, onChange }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const handleDayClick = (day) => {
    const clicked = new Date(viewYear, viewMonth, day);
    if (clicked < today) return;
    const yyyy = clicked.getFullYear();
    const mm = String(clicked.getMonth() + 1).padStart(2, "0");
    const dd = String(clicked.getDate()).padStart(2, "0");
    onChange(`${yyyy}-${mm}-${dd}`);
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    const [y, m, d] = selectedDate.split("-").map(Number);
    return y === viewYear && m - 1 === viewMonth && d === day;
  };

  const isPast = (day) => {
    const date = new Date(viewYear, viewMonth, day);
    return date < today;
  };

  const blanks = Array.from({ length: firstDayOfMonth });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div style={{ userSelect: "none" }}>
      {/* Month navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <button onClick={prevMonth} style={navBtnStyle}>
          <ChevronLeftIcon style={{ height: "1rem", width: "1rem" }} />
        </button>
        <span style={{ fontWeight: 600, color: "#1c1917", fontSize: "0.9rem" }}>
          {monthNames[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} style={navBtnStyle}>
          <ChevronRightIcon style={{ height: "1rem", width: "1rem" }} />
        </button>
      </div>
      {/* Day-of-week headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "4px" }}>
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: "0.7rem", fontWeight: 600, color: "#a8a29e", padding: "4px 0" }}>{d}</div>
        ))}
      </div>
      {/* Calendar grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
        {blanks.map((_, i) => <div key={`b-${i}`} />)}
        {days.map((day) => {
          const past = isPast(day);
          const sel = isSelected(day);
          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              disabled={past}
              style={{
                padding: "6px 0",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: sel ? 700 : 400,
                border: "none",
                cursor: past ? "default" : "pointer",
                backgroundColor: sel ? "#0ea5e9" : "transparent",
                color: past ? "#d6d3d1" : sel ? "white" : "#292524",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={(e) => { if (!past && !sel) e.currentTarget.style.backgroundColor = "#e0f2fe"; }}
              onMouseLeave={(e) => { if (!sel) e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const navBtnStyle = {
  background: "none",
  border: "1px solid #e7e5e4",
  borderRadius: "6px",
  padding: "4px 6px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  color: "#57534e",
};

// ── Format date for display ──────────────────────────────────────────────────
function formatDateDisplay(isoDate) {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

// ── Main component ───────────────────────────────────────────────────────────
export function BookAppointment() {
  const navigate = useNavigate();
  const location = useLocation();

  // Counselor info passed via Link state from CounselorProfile
  const counselorId = location.state?.counselorId || "demo-counselor-1";
  const counselorName = location.state?.counselorName || "Dr. Emily Chen";

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedType, setSelectedType] = useState("video");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const availableTimes = [
    "09:00 AM", "10:00 AM", "11:00 AM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
  ];

  const canProceedStep1 = selectedDate && selectedTime;

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          counselorId,
          counselorName,
          studentId: "demo-student-1",
          studentName: "Sarah Jenkins",
          date: formatDateDisplay(selectedDate),
          time: selectedTime,
          sessionType: selectedType,
          notes,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Booking failed.");
      
      // Send email notification to counselor
      try {
        await sendBookingEmail({
          counselorName,
          studentName: "Sarah Jenkins",
          date: formatDateDisplay(selectedDate),
          time: selectedTime,
          sessionType: selectedType,
          notes,
        });
        console.log("Email sent successfully!");
      } catch (emailError) {
        console.warn("Booking created but email failed to send:", emailError);
        // Continue with success even if email fails
      }
      
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 },
  };

  const sessionTypes = [
    { id: "video", label: "Video Call", desc: "Meet securely from anywhere via encrypted video link.", Icon: VideoIcon },
    { id: "in-person", label: "In-Person", desc: "Meet at the Campus Student Health Center, Room 402.", Icon: MapPinIcon },
    { id: "phone", label: "Phone Call", desc: "A simple voice call with your counselor.", Icon: PhoneIcon },
  ];

  return (
    <div style={{ maxWidth: "42rem", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem", paddingBottom: "3rem" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.875rem", fontFamily: "sans-serif", fontWeight: "bold", color: "#1c1917", marginBottom: "0.5rem", marginTop: 0 }}>
          Book an Appointment
        </h1>
        <p style={{ color: "#78716c", margin: 0 }}>Schedule a session with {counselorName}</p>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          {["Date & Time", "Session Type", "Details", "Confirm"].map((label, i) => (
            <span key={label} style={{ fontSize: "0.8rem", fontWeight: step > i ? 600 : 400, color: step > i ? "#0284c7" : "#a8a29e" }}>
              {label}
            </span>
          ))}
        </div>
        <div style={{ height: "0.5rem", width: "100%", backgroundColor: "#f5f5f4", borderRadius: "9999px", overflow: "hidden" }}>
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${((step - 1) / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
            style={{ height: "100%", backgroundColor: "#0ea5e9", borderRadius: "9999px" }}
          />
        </div>
      </div>

      {/* Card */}
      <div style={{ backgroundColor: "white", borderRadius: "1rem", padding: "2rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)", position: "relative", overflow: "hidden", minHeight: "400px" }}>
        <AnimatePresence mode="wait">

          {/* ── Step 1: Date & Time ── */}
          {step === 1 && (
            <motion.div key="step1" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1c1917", marginBottom: "1.5rem", marginTop: 0 }}>Select Date & Time</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem" }}>
                {/* Calendar */}
                <div>
                  <h3 style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", marginTop: 0 }}>
                    <CalendarIcon style={{ height: "1.25rem", width: "1.25rem", color: "#a8a29e" }} />
                    Select Date
                  </h3>
                  <div style={{ padding: "1rem", border: "1px solid #e7e5e4", borderRadius: "0.75rem", backgroundColor: "#fafaf9" }}>
                    <InlineCalendar selectedDate={selectedDate} onChange={setSelectedDate} />
                  </div>
                  {selectedDate && (
                    <p style={{ fontSize: "0.8rem", color: "#0284c7", marginTop: "0.5rem", fontWeight: 500 }}>
                      📅 {formatDateDisplay(selectedDate)}
                    </p>
                  )}
                </div>

                {/* Time slots */}
                <div>
                  <h3 style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", marginTop: 0 }}>
                    <ClockIcon style={{ height: "1.25rem", width: "1.25rem", color: "#a8a29e" }} />
                    Available Times
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.5rem" }}>
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        style={{
                          padding: "0.5rem",
                          borderRadius: "0.375rem",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          transition: "all 0.2s",
                          border: "1px solid",
                          cursor: "pointer",
                          outline: "none",
                          ...(selectedTime === time
                            ? { backgroundColor: "#f0f9ff", color: "#0369a1", borderColor: "#bae6fd" }
                            : { backgroundColor: "white", borderColor: "#e7e5e4", color: "#57534e" }),
                        }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Session Type ── */}
          {step === 2 && (
            <motion.div key="step2" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1c1917", marginBottom: "1.5rem", marginTop: 0 }}>How would you like to meet?</h2>
              <div style={{ display: "grid", gap: "1rem" }}>
                {sessionTypes.map(({ id, label, desc, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedType(id)}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1.25rem",
                      borderRadius: "0.75rem", border: "1px solid", textAlign: "left", transition: "all 0.2s",
                      width: "100%", cursor: "pointer", outline: "none",
                      ...(selectedType === id
                        ? { borderColor: "#0ea5e9", backgroundColor: "#f0f9ff", boxShadow: "0 0 0 1px #0ea5e9" }
                        : { borderColor: "#e7e5e4", backgroundColor: "white" }),
                    }}
                  >
                    <div style={{ padding: "0.6rem", borderRadius: "0.5rem", ...(selectedType === id ? { backgroundColor: "#e0f2fe", color: "#0284c7" } : { backgroundColor: "#f5f5f4", color: "#a8a29e" }) }}>
                      <Icon style={{ height: "1.5rem", width: "1.5rem" }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#1c1917", margin: "0 0 0.25rem 0" }}>{label}</h3>
                      <p style={{ fontSize: "0.875rem", color: "#78716c", margin: 0 }}>{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Notes ── */}
          {step === 3 && (
            <motion.div key="step3" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1c1917", marginBottom: "1.5rem", marginTop: 0 }}>Additional Details</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#44403c", marginBottom: "0.5rem" }}>
                    What would you like to discuss? (Optional)
                  </label>
                  <textarea
                    rows={5}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Briefly describe what's on your mind..."
                    style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.75rem", backgroundColor: "white", border: "1px solid #e7e5e4", color: "#292524", fontSize: "0.875rem", boxSizing: "border-box", outline: "none", resize: "vertical", fontFamily: "inherit" }}
                  />
                </div>
                <div style={{ padding: "1rem", backgroundColor: "#fffbeb", borderRadius: "0.75rem", border: "1px solid #fef3c7" }}>
                  <p style={{ fontSize: "0.875rem", color: "#92400e", margin: 0 }}>
                    <strong>Note:</strong> If you are experiencing a crisis or medical emergency, please call 911 or go to the nearest emergency room immediately.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 4: Confirm ── */}
          {step === 4 && (
            <motion.div key="step4" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} style={{ textAlign: "center", padding: "2rem 0" }}>
              {success ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <div style={{ width: "5rem", height: "5rem", backgroundColor: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem auto" }}>
                    <CheckCircleIcon style={{ height: "2.5rem", width: "2.5rem", color: "#16a34a" }} />
                  </div>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1c1917", marginBottom: "0.5rem", marginTop: 0 }}>Booking Confirmed! 🎉</h2>
                  <p style={{ color: "#78716c" }}>Redirecting to your dashboard…</p>
                </motion.div>
              ) : (
                <>
                  <div style={{ width: "4rem", height: "4rem", backgroundColor: "#e0f2fe", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem auto" }}>
                    <CalendarIcon style={{ height: "2rem", width: "2rem", color: "#0284c7" }} />
                  </div>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1c1917", marginBottom: "1rem", marginTop: 0 }}>Review Your Appointment</h2>

                  <div style={{ backgroundColor: "#fafaf9", borderRadius: "0.75rem", padding: "1.5rem", textAlign: "left", maxWidth: "26rem", margin: "0 auto 1.5rem auto", border: "1px solid #f5f5f4" }}>
                    {[
                      ["Counselor", counselorName],
                      ["Date", formatDateDisplay(selectedDate)],
                      ["Time", selectedTime],
                      ["Session Type", selectedType === "video" ? "Video Call" : selectedType === "in-person" ? "In-Person (Campus Center, Rm 402)" : "Phone Call"],
                      ...(notes ? [["Notes", notes]] : []),
                    ].map(([label, value], i, arr) => (
                      <div key={label}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                          <span style={{ color: "#78716c", fontSize: "0.875rem", flexShrink: 0 }}>{label}</span>
                          <span style={{ fontWeight: 500, color: "#1c1917", fontSize: "0.875rem", textAlign: "right" }}>{value}</span>
                        </div>
                        {i < arr.length - 1 && <div style={{ height: "1px", backgroundColor: "#e7e5e4", margin: "0.75rem 0" }} />}
                      </div>
                    ))}
                  </div>

                  {error && (
                    <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "0.5rem", padding: "0.75rem 1rem", color: "#b91c1c", fontSize: "0.875rem", marginBottom: "1rem", textAlign: "left" }}>
                      ⚠️ {error}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      {!success && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
          {step > 1 ? (
            <button onClick={handleBack} style={{ display: "flex", alignItems: "center", padding: "0.5rem 1rem", borderRadius: "0.375rem", fontSize: "0.875rem", fontWeight: 500, backgroundColor: "transparent", color: "#57534e", border: "1px solid #e7e5e4", cursor: "pointer", outline: "none" }}>
              <ArrowLeftIcon style={{ height: "1rem", width: "1rem", marginRight: "0.5rem" }} /> Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={step === 1 && !canProceedStep1}
              style={{ display: "flex", alignItems: "center", padding: "0.5rem 1.5rem", borderRadius: "0.375rem", fontSize: "0.875rem", fontWeight: 500, backgroundColor: "#0ea5e9", color: "white", border: "none", cursor: step === 1 && !canProceedStep1 ? "not-allowed" : "pointer", opacity: step === 1 && !canProceedStep1 ? 0.5 : 1, outline: "none" }}
            >
              Continue <ArrowRightIcon style={{ height: "1rem", width: "1rem", marginLeft: "0.5rem" }} />
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={loading}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.75rem", borderRadius: "0.375rem", fontSize: "0.875rem", fontWeight: 600, backgroundColor: "#16a34a", color: "white", border: "none", cursor: loading ? "wait" : "pointer", outline: "none", boxShadow: "0 2px 8px rgba(22,163,74,0.3)" }}
            >
              {loading ? <Loader2Icon style={{ height: "1rem", width: "1rem", animation: "spin 1s linear infinite" }} /> : <CheckCircleIcon style={{ height: "1rem", width: "1rem" }} />}
              {loading ? "Confirming…" : "Confirm Appointment"}
            </button>
          )}
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
