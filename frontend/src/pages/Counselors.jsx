import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, GraduationCap, Calendar, Video, Phone } from "lucide-react";

export default function Counselors() {
  const [feedbacks, setFeedbacks] = useState([]);

  // Mock initial counselors data
  const counselors = [
    {
      id: "emily_chen",
      name: "Dr. Emily Chen",
      role: "Clinical Psychologist",
      avatar: "https://i.pravatar.cc/150?u=emily",
      specialties: ["Anxiety", "Depression", "Mindfulness", "Academic Stress", "Life Transitions"],
      credentials: [
        "Ph.D. in Clinical Psychology, Stanford University",
        "M.A. in Psychology, University of Michigan",
        "Licensed Clinical Psychologist (CA #12345)"
      ],
      sessionTypes: ["Video Call", "In-Person", "Phone Call"],
      initialReviews: []
    },
    {
      id: "michael_smith",
      name: "Dr. Michael Smith",
      role: "Counseling Psychologist",
      avatar: "https://i.pravatar.cc/150?u=michael",
      specialties: ["Career Counseling", "Relationships", "Stress Management", "Grief"],
      credentials: [
        "Psy.D., Rutgers University",
        "Licensed Professional Counselor"
      ],
      sessionTypes: ["Video Call", "Phone Call"],
      initialReviews: []
    }
  ];

  // Load feedbacks from localStorage on mount
  useEffect(() => {
    let storedFeedbacks = localStorage.getItem("counselor_feedbacks");
    if (!storedFeedbacks) {
      const initial = [
        {
          id: "seed_1",
          counselorId: "emily_chen",
          studentId: "curr_student",
          name: "Sarah J.",
          date: "October 12, 2023",
          rating: 5,
          comment: "Dr. Chen is incredibly empathetic and really helped me manage my test anxiety. Highly recommend!",
          avatar: "https://i.pravatar.cc/150?u=sarah",
          tags: ["Helpful", "Good Listener"]
        }
      ];
      localStorage.setItem("counselor_feedbacks", JSON.stringify(initial));
      setFeedbacks(initial);
    } else {
      let parsed = JSON.parse(storedFeedbacks);
      let needsUpdate = false;
      parsed = parsed.map(f => {
        if (!f.studentId) {
          needsUpdate = true;
          return { ...f, studentId: "curr_student" };
        }
        return f;
      });
      if (needsUpdate) {
        localStorage.setItem("counselor_feedbacks", JSON.stringify(parsed));
      }
      setFeedbacks(parsed);
    }
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      const updated = feedbacks.filter(f => f.id !== id);
      setFeedbacks(updated);
      localStorage.setItem("counselor_feedbacks", JSON.stringify(updated));
    }
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} 
        style={{ color: i < rating ? "#fbbf24" : "#d1d5db", fill: i < rating ? "#fbbf24" : "none" }}
      />
    ));
  };

  return (
    <div style={{ maxWidth: "64rem", margin: "0 auto", padding: "2rem 1rem", fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827", margin: "0 0 0.5rem 0" }}>Counselors</h1>
        <p style={{ color: "#4b5563", margin: 0 }}>Find and connect with mental health professionals.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {counselors.map(counselor => {
          // Combine initial reviews with newly submitted feedbacks for this counselor
          const counselorFeedbacks = feedbacks.filter(f => f.counselorId === counselor.id);
          const allReviews = [...counselor.initialReviews, ...counselorFeedbacks];
          const averageRating = allReviews.length > 0 
            ? (allReviews.reduce((sum, rev) => sum + rev.rating, 0) / allReviews.length).toFixed(1)
            : 0;
          
          return (
            <div key={counselor.id} style={{ backgroundColor: "white", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", border: "1px solid #e5e7eb" }}>
              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "2rem", ...(window.innerWidth >= 768 ? { flexDirection: "row" } : {}) }}>
                
                {/* Left Column: Counselor Info */}
                <div style={{ flex: 2 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.5rem" }}>
                    <img src={counselor.avatar} alt={counselor.name} style={{ width: "5rem", height: "5rem", borderRadius: "50%", objectFit: "cover" }} />
                    <div>
                      <h2 style={{ margin: "0 0 0.25rem 0", fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}>{counselor.name}</h2>
                      <p style={{ margin: "0 0 0.5rem 0", color: "#6b7280" }}>{counselor.role}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Star size={16} fill="#fbbf24" color="#fbbf24" />
                        <span style={{ fontWeight: 600, color: "#374151" }}>{averageRating}</span>
                        <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>({allReviews.length} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <h3 style={{ margin: "0 0 0.75rem 0", fontSize: "1.125rem", fontWeight: 600, color: "#111827" }}>All Specialties</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {counselor.specialties.map(spec => (
                        <span key={spec} style={{ padding: "0.375rem 0.75rem", borderRadius: "9999px", fontSize: "0.875rem", backgroundColor: "#f3f4f6", color: "#374151", border: "1px solid #e5e7eb" }}>
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 style={{ margin: "0 0 0.75rem 0", fontSize: "1.125rem", fontWeight: 600, color: "#111827" }}>Education & Credentials</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {counselor.credentials.map((cred, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", color: "#4b5563" }}>
                          <GraduationCap size={20} style={{ color: "#0ea5e9", flexShrink: 0, marginTop: "0.125rem" }} />
                          <span>{cred}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Session Types & Availability */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div style={{ backgroundColor: "#fafaf9", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid #e5e7eb" }}>
                    <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.125rem", fontWeight: 600, color: "#111827" }}>Session Types Offered</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {counselor.sessionTypes.includes("Video Call") && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#4b5563" }}>
                          <div style={{ padding: "0.5rem", backgroundColor: "#e0f2fe", borderRadius: "0.375rem" }}>
                            <Video size={18} style={{ color: "#0284c7" }} />
                          </div>
                          <span>Video Call</span>
                        </div>
                      )}
                      {counselor.sessionTypes.includes("In-Person") && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#4b5563" }}>
                          <div style={{ padding: "0.5rem", backgroundColor: "#e0f2fe", borderRadius: "0.375rem" }}>
                            <GraduationCap size={18} style={{ color: "#0284c7" }} />
                          </div>
                          <span>In-Person (Campus Center)</span>
                        </div>
                      )}
                      {counselor.sessionTypes.includes("Phone Call") && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#4b5563" }}>
                          <div style={{ padding: "0.5rem", backgroundColor: "#e0f2fe", borderRadius: "0.375rem" }}>
                            <Phone size={18} style={{ color: "#0284c7" }} />
                          </div>
                          <span>Phone Call</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
              
              {/* Reviews Section */}
              <div style={{ borderTop: "1px solid #e5e7eb", padding: "1.5rem", backgroundColor: "#f9fafb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600, color: "#111827" }}>Student Reviews</h3>
                  <Link to={`/feedback?counselorId=${counselor.id}`} style={{ textDecoration: "none" }}>
                    <button style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", fontWeight: 500, color: "#0ea5e9", backgroundColor: "white", border: "1px solid #e0f2fe", borderRadius: "0.375rem", cursor: "pointer", transition: "all 0.2s" }}>
                      Leave Feedback
                    </button>
                  </Link>
                </div>

                {allReviews.length === 0 ? (
                  <p style={{ color: "#6b7280", fontStyle: "italic", margin: 0 }}>No reviews yet. Be the first to leave feedback!</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {allReviews.map((review, idx) => (
                      <div key={idx} style={{ padding: "1.25rem", backgroundColor: "white", borderRadius: "0.75rem", border: "1px solid #e5e7eb" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <img src={review.avatar || "https://i.pravatar.cc/150?u=anonymous"} alt="User" style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%" }} />
                            <div>
                              <p style={{ margin: "0 0 0.125rem 0", fontWeight: 600, color: "#374151" }}>{review.name || "Anonymous Student"}</p>
                              <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280" }}>{review.date}</p>
                            </div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                            <div style={{ display: "flex", gap: "0.125rem" }}>
                              {renderStars(review.rating)}
                            </div>
                            {review.studentId === "curr_student" && (
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <Link to={`/feedback?counselorId=${counselor.id}&editId=${review.id}`} style={{ fontSize: "0.75rem", color: "#0ea5e9", textDecoration: "none", cursor: "pointer" }}>Edit</Link>
                                <span onClick={() => handleDelete(review.id)} style={{ fontSize: "0.75rem", color: "#ef4444", cursor: "pointer" }}>Delete</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <p style={{ margin: 0, color: "#4b5563", fontStyle: "italic" }}>"{review.comment}"</p>
                        {review.tags && review.tags.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
                            {review.tags.map(tag => (
                              <span key={tag} style={{ fontSize: "0.75rem", padding: "0.125rem 0.5rem", backgroundColor: "#f3f4f6", borderRadius: "9999px", color: "#4b5563" }}>{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
