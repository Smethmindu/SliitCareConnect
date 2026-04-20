import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ClockIcon,
  CheckCircleIcon,
  Loader2Icon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const defaultSchedule = {
  monday: { enabled: true, start: "09:00", end: "17:00" },
  tuesday: { enabled: true, start: "09:00", end: "17:00" },
  wednesday: { enabled: true, start: "09:00", end: "17:00" },
  thursday: { enabled: true, start: "09:00", end: "17:00" },
  friday: { enabled: true, start: "09:00", end: "15:00" },
  saturday: { enabled: false, start: "10:00", end: "14:00" },
  sunday: { enabled: false, start: "09:00", end: "17:00" },
};

export function CounselorAvailability() {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [counselorId, setCounselorId] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null

  // Load counselor ID and existing availability on mount
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (!storedToken || !storedUser) {
          setLoadingData(false);
          return;
        }

        const user = JSON.parse(storedUser);

        // 1. Get counselor profile ID from user ID
        const profileRes = await fetch(`http://localhost:3000/api/counselors/user/${user.id}`);
        if (!profileRes.ok) {
          console.error("Counselor profile not found");
          setLoadingData(false);
          return;
        }
        const profileData = await profileRes.json();
        const cId = profileData.data?.counselor?._id;
        setCounselorId(cId);

        if (!cId) {
          setLoadingData(false);
          return;
        }

        // 2. Fetch existing availability
        const availRes = await fetch(`http://localhost:3000/api/counselors/${cId}/availability`);
        if (availRes.ok) {
          const availData = await availRes.json();
          const existingAvailability = availData.data?.availability;
          if (existingAvailability) {
            // Merge with defaults to ensure all days exist
            setSchedule((prev) => ({
              ...prev,
              ...Object.fromEntries(
                Object.entries(existingAvailability).map(([day, val]) => [
                  day,
                  { ...prev[day], ...val },
                ])
              ),
            }));
          }
        }
      } catch (error) {
        console.error("Error loading availability:", error);
      } finally {
        setLoadingData(false);
      }
    };

    loadAvailability();
  }, []);

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

  const handleSave = async () => {
    if (!counselorId) {
      setSaveStatus("error");
      return;
    }

    setSaving(true);
    setSaveStatus(null);

    try {
      const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/counselors/${counselorId}/availability`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({ availability: schedule }),
        }
      );

      if (response.ok) {
        setSaveStatus("success");
        setTimeout(() => navigate("/counselor-dashboard"), 1500);
      } else {
        const errData = await response.json();
        console.error("Failed to save availability:", errData.message);
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Error saving availability:", error);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
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

  if (loadingData) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px", color: "#78716c" }}>
        <Loader2Icon style={{ height: "2rem", width: "2rem", animation: "spin 1s linear infinite" }} />
        <span style={{ marginLeft: "0.75rem", fontSize: "1rem" }}>Loading availability...</span>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

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
            disabled={saving || !counselorId}
            style={{
              flex: 1,
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              backgroundColor: saving ? "#7dd3fc" : "#0ea5e9",
              color: "white",
              border: "none",
              cursor: saving || !counselorId ? "not-allowed" : "pointer",
              outline: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              opacity: !counselorId ? 0.5 : 1,
            }}
            onClick={handleSave}
          >
            {saving ? (
              <>
                <Loader2Icon style={{ height: "1rem", width: "1rem", animation: "spin 1s linear infinite" }} />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </motion.div>

      {/* Save status feedback */}
      {saveStatus === "success" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1rem",
            backgroundColor: "#dcfce7",
            border: "1px solid #bbf7d0",
            borderRadius: "0.75rem",
            color: "#166534",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          <CheckCircleIcon style={{ height: "1.25rem", width: "1.25rem" }} />
          Availability saved successfully! Redirecting...
        </motion.div>
      )}
      {saveStatus === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: "0.75rem 1rem",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "0.75rem",
            color: "#b91c1c",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          ⚠️ {counselorId ? "Failed to save availability. Please try again." : "Counselor profile not found. Please set up your profile first."}
        </motion.div>
      )}

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

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}
