import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function FeedbackReviews() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("month");

  // Dummy data for demonstration
  const dummyReviews = [
    { id: 1, student: "Alice Johnson", counselor: "Dr. Sarah Smith", rating: 5, date: "2024-03-15", category: "Academic Support", comment: "Excellent counseling session, very helpful!" },
    { id: 2, student: "Bob Williams", counselor: "Dr. John Davis", rating: 4, date: "2024-03-14", category: "Personal Issues", comment: "Good session, but could be more focused." },
    { id: 3, student: "Carol Brown", counselor: "Dr. Emily Wilson", rating: 5, date: "2024-03-13", category: "Career Guidance", comment: "Very professional and insightful." },
    { id: 4, student: "David Miller", counselor: "Dr. Michael Taylor", rating: 3, date: "2024-03-12", category: "Academic Support", comment: "Average session, needs improvement." },
    { id: 5, student: "Eva Davis", counselor: "Dr. Sarah Smith", rating: 5, date: "2024-03-11", category: "Personal Issues", comment: "Outstanding support and guidance." },
    { id: 6, student: "Frank Wilson", counselor: "Dr. John Davis", rating: 4, date: "2024-03-10", category: "Career Guidance", comment: "Helpful career advice." },
    { id: 7, student: "Grace Johnson", counselor: "Dr. Emily Wilson", rating: 5, date: "2024-03-09", category: "Academic Support", comment: "Amazing counselor, very understanding." },
    { id: 8, student: "Henry Brown", counselor: "Dr. Michael Taylor", rating: 4, date: "2024-03-08", category: "Personal Issues", comment: "Good experience overall." }
  ];

  // Calculate statistics from dummy data
  const calculateStats = () => {
    const totalReviews = dummyReviews.length;
    const avgRating = (dummyReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1);
    const ratingDistribution = [1, 2, 3, 4, 5].map(rating => 
      dummyReviews.filter(review => review.rating === rating).length
    );
    const categoryStats = dummyReviews.reduce((acc, review) => {
      acc[review.category] = (acc[review.category] || 0) + 1;
      return acc;
    }, {});
    const counselorStats = dummyReviews.reduce((acc, review) => {
      acc[review.counselor] = (acc[review.counselor] || 0) + 1;
      return acc;
    }, {});

    return {
      totalReviews,
      avgRating,
      ratingDistribution,
      categoryStats,
      counselorStats,
      monthlyTrend: [
        { month: 'Jan', reviews: 45, avgRating: 4.2 },
        { month: 'Feb', reviews: 52, avgRating: 4.5 },
        { month: 'Mar', reviews: 48, avgRating: 4.3 },
        { month: 'Apr', reviews: 61, avgRating: 4.6 },
        { month: 'May', reviews: 58, avgRating: 4.4 },
        { month: 'Jun', reviews: 67, avgRating: 4.7 }
      ]
    };
  };

  const stats = calculateStats();

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "1rem",
    border: "1px solid #e7e5e4",
    padding: "1.25rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  };

  // Simple Bar Chart Component
  const BarChart = ({ data, title, color = "#3b82f6" }) => (
    <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem", backgroundColor: "#f9fafb" }}>
      <h4 style={{ margin: "0 0 1rem 0", fontSize: "0.875rem", color: "#374151", fontWeight: 600 }}>{title}</h4>
      <div style={{ display: "flex", alignItems: "flex-end", height: "200px", gap: "0.5rem" }}>
        {data.map((item, index) => (
          <div key={index} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div 
              style={{ 
                width: "100%", 
                height: `${(item.value / Math.max(...data.map(d => d.value))) * 180}px`,
                backgroundColor: color,
                borderRadius: "0.25rem 0.25rem 0 0",
                marginTop: "auto"
              }}
            />
            <span style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.5rem" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Simple Line Chart Component
  const LineChart = ({ data, title }) => (
    <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem", backgroundColor: "#f9fafb" }}>
      <h4 style={{ margin: "0 0 1rem 0", fontSize: "0.875rem", color: "#374151", fontWeight: 600 }}>{title}</h4>
      <div style={{ height: "200px", position: "relative" }}>
        <svg width="100%" height="100%" viewBox="0 0 400 200">
          {/* Grid lines */}
          {[0, 50, 100, 150, 200].map(y => (
            <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#e5e7eb" strokeWidth="1" />
          ))}
          
          {/* Data line */}
          <polyline
            points={data.map((item, index) => `${index * 66.6 + 33.3},${200 - (item.avgRating - 4) * 100}`).join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          
          {/* Data points */}
          {data.map((item, index) => (
            <circle
              key={index}
              cx={index * 66.6 + 33.3}
              cy={200 - (item.avgRating - 4) * 100}
              r="4"
              fill="#3b82f6"
              stroke="white"
              strokeWidth="2"
            />
          ))}
        </svg>
        
        {/* Labels */}
        <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6b7280" }}>
          {data.map((item, index) => (
            <span key={index}>{item.month}</span>
          ))}
        </div>
      </div>
    </div>
  );

  // Simple Pie Chart Component
  const PieChart = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
    
    return (
      <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem", backgroundColor: "#f9fafb" }}>
        <h4 style={{ margin: "0 0 1rem 0", fontSize: "0.875rem", color: "#374151", fontWeight: 600 }}>{title}</h4>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <div style={{ width: "200px", height: "200px", position: "relative" }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const angle = (percentage / 100) * 360;
                const largeArcFlag = angle > 180 ? 1 : 0;
                const startAngle = data.slice(0, index).reduce((sum, prevItem) => sum + (prevItem.value / total) * 360, 0);
                const endAngle = startAngle + angle;
                
                const x1 = 100 + 90 * Math.cos((startAngle - 90) * Math.PI / 180);
                const y1 = 100 + 90 * Math.sin((startAngle - 90) * Math.PI / 180);
                const x2 = 100 + 90 * Math.cos((endAngle - 90) * Math.PI / 180);
                const y2 = 100 + 90 * Math.sin((endAngle - 90) * Math.PI / 180);
                
                return (
                  <path
                    key={index}
                    d={`M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArcFlag} ${x2} ${y2} Z`}
                    fill={colors[index % colors.length]}
                    stroke="white"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {data.map((item, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ 
                  width: "12px", 
                  height: "12px", 
                  backgroundColor: colors[index % colors.length], 
                  borderRadius: "2px" 
                }} />
                <span style={{ fontSize: "0.875rem", color: "#374151" }}>
                  {item.label}: {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        paddingBottom: "2rem",
        backgroundColor: "#f4f5f7",
        borderRadius: "0.9rem",
        padding: "1.25rem",
      }}
    >
      {/* Header */}
      <section
        style={{
          ...cardStyle,
          padding: "1.25rem 1.4rem",
          backgroundColor: "#f7f7f8",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "1.75rem",
            color: "#1c1917",
            letterSpacing: "-0.02em",
          }}
        >
          📊 Feedback & Reviews Management
        </h1>
        <p style={{ marginTop: "0.5rem", color: "#57534e" }}>
          Analyze counseling feedback and review performance metrics.
        </p>
      </section>

      {/* Key Metrics */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: "1rem",
        }}
      >
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ fontSize: "2rem", color: "#3b82f6" }}>⭐</div>
            <div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: 500 }}>Average Rating</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1f2937" }}>{stats.avgRating}</div>
            </div>
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ fontSize: "2rem", color: "#10b981" }}>📝</div>
            <div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: 500 }}>Total Reviews</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1f2937" }}>{stats.totalReviews}</div>
            </div>
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ fontSize: "2rem", color: "#f59e0b" }}>👥</div>
            <div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: 500 }}>Active Counselors</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1f2937" }}>{Object.keys(stats.counselorStats).length}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section style={cardStyle}>
        <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem", color: "#1c1917" }}>
          Rating Analysis & Charts
        </h2>
        
        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid #e5e7eb", marginBottom: "1.5rem" }}>
          {[
            { id: "overview", label: "Overview" },
            { id: "ratings", label: "Rating Distribution" },
            { id: "trends", label: "Monthly Trends" },
            { id: "categories", label: "Categories" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "0.75rem 1rem",
                border: "none",
                background: "none",
                borderBottom: activeTab === tab.id ? "2px solid #3b82f6" : "2px solid transparent",
                color: activeTab === tab.id ? "#3b82f6" : "#6b7280",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chart Content */}
        <div style={{ minHeight: "400px" }}>
          {activeTab === "overview" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              <BarChart 
                data={stats.ratingDistribution.map((count, index) => ({ label: `${index + 1}★`, value: count }))}
                title="Rating Distribution" 
                color="#3b82f6"
              />
              <PieChart 
                data={Object.entries(stats.categoryStats).map(([label, value]) => ({ label, value }))}
                title="Reviews by Category"
              />
            </div>
          )}
          
          {activeTab === "ratings" && (
            <BarChart 
              data={stats.ratingDistribution.map((count, index) => ({ label: `${index + 1} Star`, value: count }))}
              title="Detailed Rating Breakdown" 
              color="#10b981"
            />
          )}
          
          {activeTab === "trends" && (
            <LineChart 
              data={stats.monthlyTrend}
              title="Monthly Review Trends"
            />
          )}
          
          {activeTab === "categories" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              <PieChart 
                data={Object.entries(stats.categoryStats).map(([label, value]) => ({ label, value }))}
                title="Service Categories"
              />
              <BarChart 
                data={Object.entries(stats.counselorStats).slice(0, 5).map(([label, value]) => ({ 
                  label: label.split(' ')[1], 
                  value 
                }))}
                title="Top Counselors by Reviews" 
                color="#f59e0b"
              />
            </div>
          )}
        </div>
      </section>

      {/* Recent Reviews Table */}
      <section style={cardStyle}>
        <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem", color: "#1c1917" }}>
          Recent Reviews
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: 600, color: "#374151" }}>Student</th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: 600, color: "#374151" }}>Counselor</th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: 600, color: "#374151" }}>Rating</th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: 600, color: "#374151" }}>Category</th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: 600, color: "#374151" }}>Date</th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: 600, color: "#374151" }}>Comment</th>
              </tr>
            </thead>
            <tbody>
              {dummyReviews.slice(0, 5).map((review) => (
                <tr key={review.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "0.75rem", color: "#1f2937" }}>{review.student}</td>
                  <td style={{ padding: "0.75rem", color: "#1f2937" }}>{review.counselor}</td>
                  <td style={{ padding: "0.75rem", color: "#1f2937" }}>
                    <span style={{ 
                      backgroundColor: review.rating >= 4 ? "#dcfce7" : review.rating >= 3 ? "#fef3c7" : "#fee2e2",
                      color: review.rating >= 4 ? "#166534" : review.rating >= 3 ? "#92400e" : "#991b1b",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.25rem",
                      fontSize: "0.75rem",
                      fontWeight: 600
                    }}>
                      {"⭐".repeat(review.rating)}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem", color: "#1f2937" }}>{review.category}</td>
                  <td style={{ padding: "0.75rem", color: "#1f2937" }}>{review.date}</td>
                  <td style={{ padding: "0.75rem", color: "#1f2937", maxWidth: "200px" }}>{review.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
