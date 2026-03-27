import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SearchIcon, StarIcon, MapPinIcon, VideoIcon } from "lucide-react";

const counselors = [
  {
    id: "1",
    name: "Dr. Emily Chen",
    title: "Clinical Psychologist",
    rating: 4.9,
    specialties: ["Anxiety", "Depression", "Mindfulness"],
    online: true,
    nextAvailable: "Tomorrow, 10 AM",
    avatar: "https://i.pravatar.cc/150?u=emily",
  },
  {
    id: "2",
    name: "Dr. Marcus Rivera",
    title: "Licensed Counselor",
    rating: 4.8,
    specialties: ["Stress Management", "Academic Pressure"],
    online: true,
    nextAvailable: "Today, 3 PM",
    avatar: "https://i.pravatar.cc/150?u=marcus",
  },
  {
    id: "3",
    name: "Dr. Aisha Patel",
    title: "Therapist",
    rating: 4.9,
    specialties: ["Relationship Issues", "Self-Esteem"],
    online: false,
    nextAvailable: "Wed, 9 AM",
    avatar: "https://i.pravatar.cc/150?u=aisha",
  },
  {
    id: "4",
    name: "Sarah Kim",
    title: "Wellness Coach",
    rating: 4.7,
    specialties: ["Mindfulness", "Stress", "Career Guidance"],
    online: true,
    nextAvailable: "Tomorrow, 1 PM",
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    id: "5",
    name: "Dr. James Okafor",
    title: "Psychiatrist",
    rating: 4.8,
    specialties: ["ADHD", "Anxiety", "Depression"],
    online: false,
    nextAvailable: "Thu, 11 AM",
    avatar: "https://i.pravatar.cc/150?u=james",
  },
  {
    id: "6",
    name: "Dr. Lisa Nakamura",
    title: "Art Therapist",
    rating: 4.6,
    specialties: ["Grief & Loss", "Self-Esteem", "Creativity"],
    online: true,
    nextAvailable: "Fri, 2 PM",
    avatar: "https://i.pravatar.cc/150?u=lisa",
  },
];

const filters = [
  "All",
  "Anxiety",
  "Depression",
  "Stress",
  "Academic",
  "Relationships",
];

export function CounselorListing() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  const filteredCounselors = counselors.filter((counselor) => {
    const matchesSearch =
      counselor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      counselor.specialties.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

    let matchesFilter = true;
    if (activeFilter !== "All") {
      
      matchesFilter = counselor.specialties.some((s) =>
        s.toLowerCase().includes(activeFilter.toLowerCase())
      );
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        paddingBottom: "3rem",
      }}
    >
      {/* Header & Search */}
      <motion.div
        variants={fadeIn}
        style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
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
            Our Counselors
          </h1>
          <p style={{ color: "#78716c", fontSize: "1.125rem", margin: 0 }}>
            Find the right support for your mental wellness journey.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{ position: "relative", width: "100%", maxWidth: "24rem" }}
          >
            <div
              style={{
                position: "absolute",
                inset: "0 0 0 1rem",
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              <SearchIcon
                style={{
                  height: "1.25rem",
                  width: "1.25rem",
                  color: "#a8a29e",
                }}
              />
            </div>
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.75rem 2.75rem",
                borderRadius: "0.75rem",
                backgroundColor: "white",
                border: "1px solid #e7e5e4",
                color: "#292524",
                fontSize: "0.875rem",
                transition: "colors 0.3s",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              width: "100%",
              maxWidth: "max-content",
            }}
          >
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#78716c",
                whiteSpace: "nowrap",
              }}
            >
              Sort by:
            </span>
            <select
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                backgroundColor: "white",
                border: "1px solid #e7e5e4",
                color: "#292524",
                fontSize: "0.875rem",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option>Highest Rated</option>
              <option>Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                fontSize: "0.875rem",
                fontWeight: 500,
                transition: "colors 0.3s",
                cursor: "pointer",
                border: "1px solid",
                ...(activeFilter === filter
                  ? {
                      backgroundColor: "#0ea5e9",
                      color: "white",
                      borderColor: "#0ea5e9",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    }
                  : {
                      backgroundColor: "white",
                      borderColor: "#e7e5e4",
                      color: "#57534e",
                    }),
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div variants={fadeIn}>
        <p
          style={{
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#78716c",
            margin: 0,
          }}
        >
          Showing {filteredCounselors.length} counselors
        </p>
      </motion.div>

      {/* Counselor Grid */}
      <motion.div
        variants={fadeIn}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {filteredCounselors.map((counselor) => (
          <div
            key={counselor.id}
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              backgroundColor: "white",
              borderRadius: "1rem",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            <div
              style={{
                padding: "1.5rem",
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ position: "relative" }}>
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
                      src={counselor.avatar}
                      alt={counselor.name}
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      height: "1rem",
                      width: "1rem",
                      borderRadius: "50%",
                      border: "2px solid white",
                      backgroundColor: counselor.online ? "#22c55e" : "#d6d3d1",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    backgroundColor: "#fffbeb",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "0.5rem",
                  }}
                >
                  <StarIcon
                    style={{
                      height: "1rem",
                      width: "1rem",
                      color: "#fbbf24",
                      fill: "#fbbf24",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      color: "#b45309",
                    }}
                  >
                    {counselor.rating}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontFamily: "sans-serif",
                    fontWeight: "bold",
                    color: "#1c1917",
                    margin: "0 0 0.25rem 0",
                  }}
                >
                  {counselor.name}
                </h3>
                <p
                  style={{ color: "#78716c", fontSize: "0.875rem", margin: 0 }}
                >
                  {counselor.title}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                {counselor.specialties.slice(0, 3).map((specialty) => (
                  <span
                    key={specialty}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "0.125rem 0.625rem",
                      borderRadius: "9999px",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      backgroundColor: "#e0f2fe",
                      color: "#0284c7",
                    }}
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              <div
                style={{
                  marginTop: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.875rem",
                    color: "#16a34a",
                    fontWeight: 500,
                    backgroundColor: "#dcfce7",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      position: "relative",
                      display: "flex",
                      height: "0.5rem",
                      width: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        display: "inline-flex",
                        height: "100%",
                        width: "100%",
                        borderRadius: "50%",
                        backgroundColor: "#4ade80",
                        opacity: 0.75,
                      }}
                    ></span>
                    <span
                      style={{
                        position: "relative",
                        display: "inline-flex",
                        borderRadius: "50%",
                        height: "0.5rem",
                        width: "0.5rem",
                        backgroundColor: "#22c55e",
                      }}
                    ></span>
                  </span>
                  Next available: {counselor.nextAvailable}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.875rem",
                    color: "#78716c",
                    padding: "0 0.25rem",
                  }}
                >
                  {counselor.online ? (
                    <>
                      <VideoIcon style={{ height: "1rem", width: "1rem" }} />{" "}
                      Video & Phone
                    </>
                  ) : (
                    <>
                      <MapPinIcon style={{ height: "1rem", width: "1rem" }} />{" "}
                      In-Person Only
                    </>
                  )}
                </div>
              </div>
            </div>
            <div
              style={{
                padding: "1rem",
                borderTop: "1px solid #f5f5f4",
                backgroundColor: "#fafaf9",
                borderBottomLeftRadius: "1rem",
                borderBottomRightRadius: "1rem",
              }}
            >
              <Link
                to={`/counselors/${counselor.id}`}
                style={{ textDecoration: "none" }}
              >
                <button
                  style={{
                    width: "100%",
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
                  View Profile
                </button>
              </Link>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
