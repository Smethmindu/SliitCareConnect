import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SearchIcon, StarIcon, MapPinIcon, VideoIcon } from "lucide-react";



const filters = [
  "All",
  "Anxiety",
  "Depression",
  "Stress",
  "Academic",
  "Relationships",
];

export function CounselorListing() {
  const [counselors, setCounselors] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Highest Rated");
  const [isLoading, setIsLoading] = useState(true);
  const [ratings, setRatings] = useState({});

  // Fetch real data from backend
  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/counselors");
        if (response.ok) {
          const data = await response.json();
          // Backend returns { status, data: { counselors: [...] } }
          const fetchedData = data.data?.counselors || data.data || data;
          setCounselors(Array.isArray(fetchedData) ? fetchedData : []);
        } else {
          console.error("Failed to fetch counselors");
        }
      } catch (error) {
        console.error("Error fetching counselors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCounselors();
  }, []);

  useEffect(() => {
    if (counselors.length > 0) {
      const fetchRatings = async () => {
        const ratingsMap = { ...ratings };
        let hasNew = false;
        await Promise.all(
          counselors.map(async (c) => {
            const cid = c._id || c.id;
            if (cid && ratingsMap[cid] === undefined) {
              try {
                const res = await fetch(`http://localhost:3000/api/feedback/counselor/${cid}/average`);
                if (res.ok) {
                  const data = await res.json();
                  ratingsMap[cid] = data.averageRating ? data.averageRating.toFixed(1) : 0;
                  hasNew = true;
                }
              } catch (err) {
                console.error("Failed to load rating for", cid, err);
              }
            }
          })
        );
        if (hasNew) {
          setRatings(ratingsMap);
        }
      };
      fetchRatings();
    }
  }, [counselors]);

  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  const filteredCounselors = counselors
    .filter((counselor) => {
      const specialtiesList = Array.isArray(counselor.specialities) ? counselor.specialities : [];

      const matchesSearch =
        (counselor.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        specialtiesList.some((s) =>
          (s || "").toLowerCase().includes(searchQuery.toLowerCase())
        );

      let matchesFilter = true;
      if (activeFilter !== "All") {
        matchesFilter = specialtiesList.some((s) =>
          (s || "").toLowerCase().includes(activeFilter.toLowerCase())
        );
      }

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "Name (A-Z)") {
        return (a.name || "").localeCompare(b.name || "");
      }
      // Highest Rated
      const ratingA = parseFloat(ratings[a._id || a.id]) || parseFloat(a.rating) || 0;
      const ratingB = parseFloat(ratings[b._id || b.id]) || parseFloat(b.rating) || 0;
      return ratingB - ratingA;
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
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
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
              <option value="Highest Rated">Highest Rated</option>
              <option value="Name (A-Z)">Name (A-Z)</option>
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
        {isLoading ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", color: "#78716c", fontStyle: "italic" }}>
            Loading counselors...
          </div>
        ) : filteredCounselors.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", color: "#78716c" }}>
            No counselors found.
          </div>
        ) : (
          filteredCounselors.map((counselor) => {
            const specialtyLabel = counselor.speciality || "Wellness Counselor";
            const specialtiesArr = Array.isArray(counselor.specialities) ? counselor.specialities : [];
            const avatarUrl = counselor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(counselor.name || 'C')}&background=e0f2fe&color=0284c7`;
            
            return (
          <div
            key={counselor._id || counselor.id}
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
                      src={avatarUrl}
                      alt={counselor.name}
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
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
                    {ratings[counselor._id || counselor.id] ?? (counselor.rating || 0)}
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
                  {specialtyLabel}
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
                {specialtiesArr.slice(0, 3).map((specialty) => (
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
                  Next available: {counselor.nextAvailable || "Checking..."}
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
                to={`/counselors/${counselor._id || counselor.id}`}
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
          );
        })
        )}
      </motion.div>
    </motion.div>
  );
}
