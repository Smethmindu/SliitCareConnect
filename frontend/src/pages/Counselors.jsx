import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, GraduationCap, Calendar, Video, Phone, Pencil, Trash2, AlertTriangle } from "lucide-react";

export default function Counselors() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

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
    const updated = feedbacks.filter(f => f.id !== id);
    setFeedbacks(updated);
    localStorage.setItem("counselor_feedbacks", JSON.stringify(updated));
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
              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "2rem", ...(window.innerWidth >= 768 ? { flexDirection: "row", alignItems: "center", justifyContent: "space-between" } : {}) }}>
                
                <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
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

                <div style={{ display: "flex", gap: "1rem" }}>
                  <Link to={`/counselor/${counselor.id}`} style={{ textDecoration: "none" }}>
                    <button style={{ padding: "0.75rem 1.5rem", fontSize: "1rem", fontWeight: 500, color: "white", backgroundColor: "#0ea5e9", border: "none", borderRadius: "0.5rem", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                      View Profile
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {deleteConfirmId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '24px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <AlertTriangle size={24} color="#dc2626" />
            </div>
            <h3 style={{ margin: '0 0 12px', fontSize: '20px', fontWeight: 700, color: '#111827' }}>Delete Feedback</h3>
            <p style={{ margin: '0 0 24px', color: '#4b5563', lineHeight: 1.5 }}>Are you sure you want to delete this feedback? This action cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', gap: '12px' }}>
              <button onClick={() => setDeleteConfirmId(null)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #d1d5db', backgroundColor: 'white', color: '#374151', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>Cancel</button>
              <button onClick={() => { handleDelete(deleteConfirmId); setDeleteConfirmId(null); }} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#ef4444', color: 'white', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
