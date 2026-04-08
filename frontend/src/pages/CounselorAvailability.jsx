import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClockIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CounselorAvailability() {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState({
    monday: { enabled: true, start: "09:00", end: "17:00" },
    tuesday: { enabled: true, start: "09:00", end: "17:00" },
    wednesday: { enabled: true, start: "09:00", end: "17:00" },
    thursday: { enabled: true, start: "09:00", end: "17:00" },
    friday: { enabled: true, start: "09:00", end: "15:00" },
    saturday: { enabled: false, start: "10:00", end: "14:00" },
    sunday: { enabled: false, start: "09:00", end: "17:00" },
  });

  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  const handleToggle = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }));
  };

  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={onChange}
      style={{
        position: "relative",
        display: "inline-flex",
        height: "1.5rem",
        width: "2.75rem",
        alignItems: "center",
        borderRadius: "9999px",
        transition: "background-color 0.3s",
        outline: "none",
        border: "none",
        cursor: "pointer",
        ...(checked
          ? { backgroundColor: "#0ea5e9" }
          : { backgroundColor: "#d6d3d1" }),
      }}
    >
      <span
        style={{
          display: "inline-block",
          height: "1rem",
          width: "1rem",
          transform: checked ? "translateX(1.5rem)" : "translateX(0.25rem)",
          borderRadius: "50%",
          backgroundColor: "white",
          transition: "transform 0.3s",
        }}
      />
    </button>
  );

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
      style={{
        maxWidth: "56rem",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        paddingBottom: "3rem",
      }}
    >
      <motion.div
        variants={fadeIn}
        style={{
          display: "flex",
          flexDirection: window.innerWidth < 640 ? "column" : "row",
          alignItems: window.innerWidth < 640 ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
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
            Availability Settings
          </h1>
          <p style={{ color: "#78716c", margin: 0 }}>
            Manage your working hours and blocked dates.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            width: window.innerWidth < 640 ? "100%" : "auto",
          }}
        >
          <button
            style={{
              flex: 1,
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
            onClick={() => navigate("/counselor-dashboard")}
          >
            Cancel
          </button>
          <button
            style={{
              flex: 1,
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              backgroundColor: "#0ea5e9",
              color: "white",
              border: "none",
              cursor: "pointer",
              outline: "none",
            }}
            onClick={() => navigate("/counselor-dashboard")}
          >
            Save Changes
          </button>
        </div>
      </motion.div>

      <motion.div
        variants={fadeIn}
        style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "1rem",
            padding: "2rem",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <ClockIcon
              style={{ height: "1.25rem", width: "1.25rem", color: "#0ea5e9" }}
            />
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "#1c1917",
                margin: 0,
              }}
            >
              Weekly Working Hours
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {Object.entries(schedule).map(([day, settings], index, arr) => (
              <div
                key={day}
                style={{
                  display: "flex",
                  flexDirection: window.innerWidth < 640 ? "column" : "row",
                  alignItems: window.innerWidth < 640 ? "flex-start" : "center",
                  padding: "1rem 0",
                  gap: "1rem",
                  ...(index !== arr.length - 1
                    ? { borderBottom: "1px solid #f5f5f4" }
                    : {}),
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "10rem",
                    gap: "1rem",
                  }}
                >
                  <ToggleSwitch
                    checked={settings.enabled}
                    onChange={() => handleToggle(day)}
                  />
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      textTransform: "capitalize",
                      color: settings.enabled ? "#1c1917" : "#a8a29e",
                    }}
                  >
                    {day}
                  </span>
                </div>

                {settings.enabled ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      width: window.innerWidth < 640 ? "100%" : "auto",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      <input
                        type="time"
                        value={settings.start}
                        onChange={(e) =>
                          setSchedule((prev) => ({
                            ...prev,
                            [day]: { ...prev[day], start: e.target.value },
                          }))
                        }
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          borderRadius: "0.375rem",
                          backgroundColor: "white",
                          border: "1px solid #e7e5e4",
                          color: "#292524",
                          fontSize: "0.875rem",
                          outline: "none",
                        }}
                      />
                    </div>
                    <span style={{ color: "#a8a29e" }}>to</span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      <input
                        type="time"
                        value={settings.end}
                        onChange={(e) =>
                          setSchedule((prev) => ({
                            ...prev,
                            [day]: { ...prev[day], end: e.target.value },
                          }))
                        }
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          borderRadius: "0.375rem",
                          backgroundColor: "white",
                          border: "1px solid #e7e5e4",
                          color: "#292524",
                          fontSize: "0.875rem",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#a8a29e",
                      fontStyle: "italic",
                    }}
                  >
                    Unavailable
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
