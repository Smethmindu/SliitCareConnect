import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  CheckCircle,
  Video,
  Clock,
  Calendar,
} from "lucide-react";

export default function FeedbackPage() {
  const [searchParams] = useSearchParams();
  const counselorId = searchParams.get("counselorId");
  const editId = searchParams.get("editId");
  const bookingId = searchParams.get("bookingId");
  
  const [counselor, setCounselor] = useState(null);
  const [isLoadingCounselor, setIsLoadingCounselor] = useState(true);

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchCounselor = async () => {
      if (!counselorId) {
        setIsLoadingCounselor(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:3000/api/counselors/${counselorId}`);
        if (response.ok) {
          const data = await response.json();
          setCounselor(data.data?.counselor || data);
        }
      } catch (err) {
        console.error("Failed to fetch counselor details:", err);
      } finally {
        setIsLoadingCounselor(false);
      }
    };
    fetchCounselor();
  }, [counselorId]);

  const tags = [
    "Helpful",
    "Supportive",
    "Good Listener",
    "Practical Advice",
    "Made Me Feel Safe",
    "Great Techniques",
    "Easy to Talk To",
    "Professional",
  ];

  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  useEffect(() => {
    if (editId) {
      const existing = JSON.parse(localStorage.getItem("counselor_feedbacks") || "[]");
      const fb = existing.find(f => f.id === editId);
      if (fb) {
        setRating(fb.rating);
        setHoveredRating(fb.rating);
        setSelectedTags(fb.tags || []);
        setComment(fb.comment || "");
        setIsAnonymous(fb.isAnonymous || false);
      }
    }
  }, [editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating > 0) {
      try {
        const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!storedToken) {
          alert("Please log in to submit feedback.");
          return;
        }

        const payload = {
          counselorId,
          bookingId,
          rating,
          tags: selectedTags,
          comment,
          isAnonymous
        };

        const response = await fetch(`http://localhost:3000/api/feedback${editId ? `/${editId}` : ''}`, {
          method: editId ? 'PUT' : 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${storedToken}`
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          setIsSubmitted(true);
        } else {
          const data = await response.json();
          alert(data.message || "Failed to submit feedback. You might have already submitted feedback for this session or counselor.");
        }
      } catch (error) {
        console.error("Feedback submission error:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeIn}
        style={{ maxWidth: "36rem", margin: "0 auto", paddingTop: "3rem" }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "1rem",
            padding: "3rem",
            textAlign: "center",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
        >
          <div
            style={{
              width: "5rem",
              height: "5rem",
              backgroundColor: "#dcfce7",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem auto",
            }}
          >
            <CheckCircle
              style={{ height: "2.5rem", width: "2.5rem", color: "#16a34a" }}
            />
          </div>
          <h2
            style={{
              fontSize: "1.875rem",
              fontFamily: "sans-serif",
              fontWeight: "bold",
              color: "#1c1917",
              marginBottom: "1rem",
              marginTop: 0,
            }}
          >
            Thank You for Your Feedback!
          </h2>
          <p
            style={{
              color: "#57534e",
              marginBottom: "2rem",
              fontSize: "1.125rem",
            }}
          >
            Your input helps us provide better support for all students.
          </p>
          <Link to="/counselors" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                borderRadius: "0.5rem",
                fontWeight: 500,
                backgroundColor: "white",
                color: "#292524",
                border: "1px solid #e7e5e4",
                cursor: "pointer",
                outline: "none",
                transition: "background-color 0.3s",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              Back to Counselors
            </button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
      style={{
        maxWidth: "42rem",
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
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <h1
          style={{
            fontSize: "1.875rem",
            fontFamily: "sans-serif",
            fontWeight: "bold",
            color: "#1c1917",
            margin: 0,
          }}
        >
          Session Feedback
        </h1>
        <p style={{ color: "#78716c", margin: 0 }}>
          Your feedback helps us improve our services
        </p>
      </motion.div>

      {isLoadingCounselor ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>Loading counselor details...</div>
      ) : counselor ? (
        <motion.div variants={fadeIn}>
          <div
            style={{
              backgroundColor: "#fafaf9",
              borderRadius: "1rem",
              padding: "1.5rem",
              border: "none",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                ...(window.innerWidth >= 640
                  ? {
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }
                  : {}),
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "3rem",
                    width: "3rem",
                    borderRadius: "50%",
                    backgroundColor: "#e7e5e4",
                    color: "#57534e",
                    fontSize: "1.25rem",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={counselor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(counselor.name || "C")}&background=e0f2fe&color=0284c7`}
                    alt={(counselor.name || "C").charAt(0)}
                    style={{ height: "100%", width: "100%", objectFit: "cover" }}
                  />
                </div>
                <div>
                  <h3
                    style={{
                      fontWeight: 600,
                      color: "#1c1917",
                      margin: "0 0 0.125rem 0",
                    }}
                  >
                    {counselor.name}
                  </h3>
                  <p
                    style={{ fontSize: "0.875rem", color: "#78716c", margin: 0 }}
                  >
                    {counselor.speciality || "Wellness Counselor"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div style={{ textAlign: "center", padding: "2rem", color: "#ef4444" }}>Counselor not found.</div>
      )}


      <motion.form
        variants={fadeIn}
        onSubmit={handleSubmit}
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
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "#1c1917",
                marginBottom: "1.5rem",
                marginTop: 0,
              }}
            >
              How was your session?
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  style={{
                    padding: "0.25rem",
                    outline: "none",
                    transition: "transform 0.2s",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Star
                    style={{
                      height: "2.5rem",
                      width: "2.5rem",
                      transition: "colors 0.3s",
                      ...(star <= (hoveredRating || rating)
                        ? { color: "#fbbf24", fill: "#fbbf24" }
                        : { color: "#e7e5e4" }),
                    }}
                  />
                </button>
              ))}
            </div>
            <p
              style={{
                color: "#78716c",
                fontWeight: 500,
                height: "1.5rem",
                margin: 0,
              }}
            >
              {(hoveredRating || rating) > 0
                ? ratingLabels[hoveredRating || rating]
                : "Select a rating"}
            </p>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#44403c",
                marginBottom: "1rem",
                marginTop: 0,
              }}
            >
              What stood out?
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "9999px",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    transition: "colors 0.3s",
                    border: "1px solid",
                    cursor: "pointer",
                    ...(selectedTags.includes(tag)
                      ? {
                          backgroundColor: "#f0f9ff",
                          color: "#0369a1",
                          borderColor: "#bae6fd",
                        }
                      : {
                          backgroundColor: "#fafaf9",
                          color: "#57534e",
                          borderColor: "#e7e5e4",
                        }),
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label
              htmlFor="comment"
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#44403c",
                marginBottom: "0.5rem",
              }}
            >
              Additional comments (optional)
            </label>
            <textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              placeholder="Share any thoughts about your experience..."
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                backgroundColor: "white",
                border: "1px solid #e7e5e4",
                color: "#292524",
                fontSize: "0.875rem",
                transition: "colors 0.3s",
                outline: "none",
                resize: "none",
                boxSizing: "border-box",
              }}
            />

            <div
              style={{
                textAlign: "right",
                marginTop: "0.25rem",
                fontSize: "0.75rem",
                color: "#a8a29e",
              }}
            >
              {comment.length}/500
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem",
              backgroundColor: "#fafaf9",
              borderRadius: "0.75rem",
              marginBottom: "2rem",
            }}
          >
            <div>
              <p
                style={{
                  fontWeight: 500,
                  color: "#1c1917",
                  fontSize: "0.875rem",
                  margin: "0 0 0.125rem 0",
                }}
              >
                Submit anonymously
              </p>
              <p style={{ fontSize: "0.75rem", color: "#78716c", margin: 0 }}>
                Your counselor will not see your name
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
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
                ...(isAnonymous
                  ? { backgroundColor: "#0ea5e9" }
                  : { backgroundColor: "#d6d3d1" }),
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  height: "1rem",
                  width: "1rem",
                  transform: isAnonymous
                    ? "translateX(1.5rem)"
                    : "translateX(0.25rem)",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  transition: "transform 0.3s",
                }}
              />
            </button>
          </div>

          <button
            type="submit"
            disabled={rating === 0}
            style={{
              width: "100%",
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              borderRadius: "0.5rem",
              fontWeight: 500,
              color: "white",
              border: "none",
              cursor: rating === 0 ? "not-allowed" : "pointer",
              outline: "none",
              transition: "background-color 0.3s",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              ...(rating === 0
                ? { backgroundColor: "#cbd5e1" }
                : { backgroundColor: "#0ea5e9" }),
            }}
          >
            Submit Feedback
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
