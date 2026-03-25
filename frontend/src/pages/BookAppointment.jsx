import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarIcon,
  ClockIcon,
  VideoIcon,
  MapPinIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

export function BookAppointment() {
  const [step, setStep] = useState(1);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedType, setSelectedType] = useState("video");

  const availableTimes = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 },
  };

  return (
    <div
      style={{
        maxWidth: "42rem",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        paddingBottom: "3rem",
      }}
    >
      {/* Header */}
      <div>
        <h1
          style={{
            fontSize: "1.875rem",
            fontFamily: "sans-serif",
            fontWeight: "bold",
            color: "#1c1917",
            marginBottom: "0.5rem",
            marginTop: 0,
          }}
        >
          Book an Appointment
        </h1>
        <p style={{ color: "#78716c", margin: 0 }}>
          Schedule a session with Dr. Emily Chen
        </p>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          {["Date & Time", "Session Type", "Details", "Confirm"].map(
            (label, i) => (
              <span
                key={label}
                style={{
                  fontSize: "0.875rem",
                  fontWeight: step > i ? 500 : 400,
                  color: step > i ? "#0284c7" : "#a8a29e",
                }}
              >
                {label}
              </span>
            ),
          )}
        </div>
        <div
          style={{
            height: "0.5rem",
            width: "100%",
            backgroundColor: "#f5f5f4",
            borderRadius: "9999px",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${((step - 1) / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
            style={{
              height: "100%",
              backgroundColor: "#0ea5e9",
              borderRadius: "9999px",
            }}
          />
        </div>
      </div>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "1rem",
          padding: "2rem",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          position: "relative",
          overflow: "hidden",
          minHeight: "400px",
        }}
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={{ duration: 0.3 }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "#1c1917",
                  marginBottom: "1.5rem",
                  marginTop: 0,
                }}
              >
                Select Date & Time
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "2rem",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "#44403c",
                      marginBottom: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginTop: 0,
                    }}
                  >
                    <CalendarIcon
                      style={{
                        height: "1.25rem",
                        width: "1.25rem",
                        color: "#a8a29e",
                      }}
                    />{" "}
                    Select Date
                  </h3>
                  <div
                    style={{
                      padding: "1.5rem",
                      border: "1px solid #e7e5e4",
                      borderRadius: "0.75rem",
                      textAlign: "center",
                      backgroundColor: "#fafaf9",
                      color: "#78716c",
                    }}
                  >
                    Calendar Component Placeholder
                  </div>
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "#44403c",
                      marginBottom: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginTop: 0,
                    }}
                  >
                    <ClockIcon
                      style={{
                        height: "1.25rem",
                        width: "1.25rem",
                        color: "#a8a29e",
                      }}
                    />{" "}
                    Available Times
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "0.5rem",
                    }}
                  >
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
                          outline: "none",
                          border: "1px solid",
                          cursor: "pointer",
                          ...(selectedTime === time
                            ? {
                                backgroundColor: "#f0f9ff",
                                color: "#0369a1",
                                borderColor: "#bae6fd",
                              }
                            : {
                                backgroundColor: "white",
                                borderColor: "#e7e5e4",
                                color: "#57534e",
                              }),
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

          {step === 2 && (
            <motion.div
              key="step2"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={{ duration: 0.3 }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "#1c1917",
                  marginBottom: "1.5rem",
                  marginTop: 0,
                }}
              >
                How would you like to meet?
              </h2>
              <div style={{ display: "grid", gap: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setSelectedType("video")}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    padding: "1.5rem",
                    borderRadius: "0.75rem",
                    border: "1px solid",
                    textAlign: "left",
                    transition: "all 0.2s",
                    width: "100%",
                    cursor: "pointer",
                    outline: "none",
                    ...(selectedType === "video"
                      ? {
                          borderColor: "#0ea5e9",
                          backgroundColor: "#f0f9ff",
                          boxShadow: "0 0 0 1px #0ea5e9",
                        }
                      : { borderColor: "#e7e5e4", backgroundColor: "white" }),
                  }}
                >
                  <div
                    style={{
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      ...(selectedType === "video"
                        ? { backgroundColor: "#e0f2fe", color: "#0284c7" }
                        : { backgroundColor: "#f5f5f4", color: "#a8a29e" }),
                    }}
                  >
                    <VideoIcon style={{ height: "1.5rem", width: "1.5rem" }} />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "#1c1917",
                        margin: "0 0 0.25rem 0",
                      }}
                    >
                      Video Call
                    </h3>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#78716c",
                        margin: 0,
                      }}
                    >
                      Meet securely from anywhere via encrypted video link.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedType("in-person")}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    padding: "1.5rem",
                    borderRadius: "0.75rem",
                    border: "1px solid",
                    textAlign: "left",
                    transition: "all 0.2s",
                    width: "100%",
                    cursor: "pointer",
                    outline: "none",
                    ...(selectedType === "in-person"
                      ? {
                          borderColor: "#0ea5e9",
                          backgroundColor: "#f0f9ff",
                          boxShadow: "0 0 0 1px #0ea5e9",
                        }
                      : { borderColor: "#e7e5e4", backgroundColor: "white" }),
                  }}
                >
                  <div
                    style={{
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      ...(selectedType === "in-person"
                        ? { backgroundColor: "#e0f2fe", color: "#0284c7" }
                        : { backgroundColor: "#f5f5f4", color: "#a8a29e" }),
                    }}
                  >
                    <MapPinIcon style={{ height: "1.5rem", width: "1.5rem" }} />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "#1c1917",
                        margin: "0 0 0.25rem 0",
                      }}
                    >
                      In-Person
                    </h3>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#78716c",
                        margin: 0,
                      }}
                    >
                      Meet at the Campus Student Health Center, Room 402.
                    </p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={{ duration: 0.3 }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "#1c1917",
                  marginBottom: "1.5rem",
                  marginTop: 0,
                }}
              >
                Additional Details
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
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
                    What would you like to discuss? (Optional)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Briefly describe what's on your mind..."
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.75rem",
                      backgroundColor: "white",
                      border: "1px solid #e7e5e4",
                      color: "#292524",
                      fontSize: "0.875rem",
                      boxSizing: "border-box",
                      outline: "none",
                      resize: "none",
                    }}
                  />
                </div>
                <div
                  style={{
                    padding: "1rem",
                    backgroundColor: "#fffbeb",
                    borderRadius: "0.75rem",
                    border: "1px solid #fef3c7",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#92400e",
                      margin: 0,
                    }}
                  >
                    <strong>Note:</strong> If you are experiencing a crisis or
                    medical emergency, please call 911 or go to the nearest
                    emergency room immediately. Do not wait for an appointment.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={{ duration: 0.3 }}
              style={{ textAlign: "center", padding: "2rem 0" }}
            >
              <div
                style={{
                  width: "4rem",
                  height: "4rem",
                  backgroundColor: "#dcfce7",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem auto",
                }}
              >
                <CheckCircleIcon
                  style={{ height: "2rem", width: "2rem", color: "#16a34a" }}
                />
              </div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#1c1917",
                  marginBottom: "1rem",
                  marginTop: 0,
                }}
              >
                Confirm your appointment
              </h2>
              <div
                style={{
                  backgroundColor: "#fafaf9",
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                  textAlign: "left",
                  maxWidth: "24rem",
                  margin: "0 auto 2rem auto",
                  border: "1px solid #f5f5f4",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: "#78716c", fontSize: "0.875rem" }}>
                      Counselor
                    </span>
                    <span
                      style={{
                        fontWeight: 500,
                        color: "#1c1917",
                        fontSize: "0.875rem",
                      }}
                    >
                      Dr. Emily Chen
                    </span>
                  </div>
                  <div
                    style={{ height: "1px", backgroundColor: "#e7e5e4" }}
                  ></div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: "#78716c", fontSize: "0.875rem" }}>
                      Date & Time
                    </span>
                    <span
                      style={{
                        fontWeight: 500,
                        color: "#1c1917",
                        fontSize: "0.875rem",
                      }}
                    >
                      {selectedTime
                        ? `Tomorrow, ${selectedTime}`
                        : "Select a time"}
                    </span>
                  </div>
                  <div
                    style={{ height: "1px", backgroundColor: "#e7e5e4" }}
                  ></div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: "#78716c", fontSize: "0.875rem" }}>
                      Location
                    </span>
                    <span
                      style={{
                        fontWeight: 500,
                        color: "#1c1917",
                        fontSize: "0.875rem",
                      }}
                    >
                      {selectedType === "video"
                        ? "Video Call"
                        : "Campus Center, Rm 402"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1rem",
        }}
      >
        {step > 1 ? (
          <button
            onClick={handleBack}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              backgroundColor: "transparent",
              color: "#57534e",
              border: "1px solid #e7e5e4",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <ArrowLeftIcon
              style={{ height: "1rem", width: "1rem", marginRight: "0.5rem" }}
            />{" "}
            Back
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            onClick={handleNext}
            disabled={step === 1 && !selectedTime}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.5rem 1.5rem",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              backgroundColor: "#0ea5e9",
              color: "white",
              border: "none",
              cursor: step === 1 && !selectedTime ? "not-allowed" : "pointer",
              opacity: step === 1 && !selectedTime ? 0.5 : 1,
              outline: "none",
            }}
          >
            Continue{" "}
            <ArrowRightIcon
              style={{ height: "1rem", width: "1rem", marginLeft: "0.5rem" }}
            />
          </button>
        ) : (
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "0.5rem 1.5rem",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                backgroundColor: "#16a34a",
                color: "white",
                border: "none",
                cursor: "pointer",
                outline: "none",
              }}
            >
              Confirm Appointment
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
