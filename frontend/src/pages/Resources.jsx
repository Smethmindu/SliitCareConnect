import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightIcon, BookOpenIcon, HeadphonesIcon, ImageIcon, PlayCircleIcon, SearchIcon, PhoneIcon } from "lucide-react";
import Quiz from "./Quiz";

import VideoImg from "../assets/images/VIDEO.png";
import AudioImg from "../assets/images/AUDIO.png";
import BookImg from "../assets/images/BOOK.jpg";
import ImageFallBackImg from "../assets/images/IMAGE.jpg";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Library");

  const topics = ["All", "Anxiety", "Depression", "Academic Stress", "Mindfulness", "Relationships"];
  const categories = ["VIDEO", "AUDIO", "BOOK", "IMAGE"];

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchResources(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchResources = async (query = "") => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/api/resources?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResources(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch resources:", err);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const getFullFileUrl = (fileUrl) => `http://localhost:3000${fileUrl}`;

  const getFallbackImage = (type) => {
    if (type === "VIDEO") return VideoImg;
    if (type === "AUDIO") return AudioImg;
    if (type === "BOOK") return BookImg;
    return ImageFallBackImg;
  };

  const openResource = (resource) => {
    const url = getFullFileUrl(resource.fileUrl);
    window.open(url, "_blank");
  };

  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      let matchesTopic = true;
      if (activeTopic !== "All") {
        const title = r.title?.toLowerCase() || "";
        const description = r.description?.toLowerCase() || "";
        const t = activeTopic.toLowerCase();
        matchesTopic = title.includes(t) || description.includes(t) || (r.topic && r.topic.toLowerCase() === t);
      }
      return matchesTopic;
    });
  }, [resources, activeTopic]);

  const featuredResource =
    filteredResources.find((r) => r.type === "BOOK") ||
    filteredResources.find((r) => r.type === "VIDEO") ||
    filteredResources[0];

  const getTypeLabel = (type) => {
    if (type === "VIDEO") return "Video";
    if (type === "AUDIO") return "Audio";
    if (type === "BOOK") return "Guide";
    return "Image";
  };

  const getTypeIcon = (type, size = 20) => {
    if (type === "VIDEO") return <PlayCircleIcon style={{ width: size, height: size }} />;
    if (type === "AUDIO") return <HeadphonesIcon style={{ width: size, height: size }} />;
    if (type === "BOOK") return <BookOpenIcon style={{ width: size, height: size }} />;
    return <ImageIcon style={{ width: size, height: size }} />;
  };

  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2.5rem",
        paddingBottom: "3rem",
      }}
    >
      {/* Top Level Tabs */}
      <div style={{ display: "flex", gap: "2rem", borderBottom: "1px solid #e7e5e4", paddingBottom: "0.5rem" }}>
        {["Library", "Self-Assessment Quiz"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: "none",
              border: "none",
              padding: "0.5rem 0",
              fontSize: "1.125rem",
              fontWeight: 600,
              color: activeTab === tab ? "#0ea5e9" : "#78716c",
              borderBottom: activeTab === tab ? "2px solid #0ea5e9" : "2px solid transparent",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Library" && (
        <>
          {/* Header & Search */}
          <motion.div variants={fadeIn} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h1 style={{ fontSize: "1.875rem", fontFamily: "sans-serif", fontWeight: "bold", color: "#1c1917", marginBottom: "0.5rem", marginTop: 0 }}>
                Wellness Resources
              </h1>
              <p style={{ color: "#78716c", fontSize: "1.125rem", margin: 0 }}>
                Articles, videos, and guides to support your mental health journey.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "1rem", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ position: "relative", width: "100%", maxWidth: "24rem" }}>
            <div style={{ position: "absolute", inset: "0 0 0 1rem", display: "flex", alignItems: "center", pointerEvents: "none" }}>
              <SearchIcon style={{ height: "1.25rem", width: "1.25rem", color: "#a8a29e" }} />
            </div>
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.75rem", borderRadius: "0.75rem", backgroundColor: "white", border: "1px solid #e7e5e4", color: "#292524", fontSize: "0.875rem", boxSizing: "border-box", outline: "none", transition: "border-color 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
              onBlur={(e) => e.target.style.borderColor = '#e7e5e4'}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => setActiveTopic(topic)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                fontSize: "0.875rem",
                fontWeight: 500,
                transition: "all 0.3s",
                cursor: "pointer",
                border: "1px solid",
                ...(activeTopic === topic
                  ? { backgroundColor: "#0ea5e9", color: "white", borderColor: "#0ea5e9", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }
                  : { backgroundColor: "white", borderColor: "#e7e5e4", color: "#57534e" }),
              }}
            >
              {topic}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Featured Resource */}
      {featuredResource && !loading && (
        <motion.section variants={fadeIn} style={{ display: "flex", flexDirection: "column", backgroundColor: "white", borderRadius: "1.5rem", overflow: "hidden", border: "1px solid #f5f5f4", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
            <div style={{ flex: "1 1 50%", position: "relative", minHeight: "20rem" }}>
              <img src={featuredResource.type === "IMAGE" ? getFullFileUrl(featuredResource.fileUrl) : getFallbackImage(featuredResource.type)} alt="Featured" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: "1 1 50%", padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "center", backgroundColor: "white" }}>
              <span style={{ display: "inline-flex", alignSelf: "flex-start", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", backgroundColor: "#e0f2fe", color: "#0284c7", marginBottom: "1rem" }}>
                 Featured {getTypeLabel(featuredResource.type)}
              </span>
              <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "#1c1917", marginBottom: "1rem", marginTop: 0 }}>{featuredResource.title}</h2>
              <p style={{ fontSize: "1.125rem", color: "#57534e", lineHeight: 1.6, marginBottom: "2rem" }}>
                {featuredResource.description || "A comprehensive resource to help you manage emotional well-being and daily mental health challenges."}
              </p>
              <button onClick={() => openResource(featuredResource)} style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "0.75rem", fontSize: "1rem", fontWeight: 500, backgroundColor: "#0ea5e9", color: "white", border: "none", cursor: "pointer", outline: "none", boxShadow: "0 4px 6px -1px rgba(14, 165, 233, 0.2)", transition: "background-color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0284c7'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0ea5e9'}>
                {featuredResource.type === "VIDEO" ? "Watch Video" : featuredResource.type === "AUDIO" ? "Listen to Audio" : featuredResource.type === "BOOK" ? "Read Full Guide" : "View Resource"}
                <ArrowRightIcon style={{ height: "1.25rem", width: "1.25rem" }} />
              </button>
            </div>
          </div>
        </motion.section>
      )}

      {/* Categories */}
      <motion.section variants={fadeIn} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {loading ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "#78716c", fontStyle: "italic" }}>Loading resources...</div>
        ) : filteredResources.length === 0 && searchQuery.trim() !== "" ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", backgroundColor: "white", borderRadius: "1.5rem", border: "1px solid #f5f5f4", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1c1917", marginBottom: "0.5rem" }}>No results found for "{searchQuery}"</h3>
            <p style={{ color: "#78716c", margin: 0 }}>Try adjusting your search or selecting a different topic.</p>
          </div>
        ) : (
          categories.map((type) => {
            const blockResources = filteredResources.filter((r) => r.type === type);

            return (
              <div key={type} style={{ backgroundColor: "white", borderRadius: "1.5rem", padding: "2rem", border: "1px solid #f5f5f4", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ height: "3rem", width: "3rem", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f0f9ff", color: "#0ea5e9" }}>
                      {getTypeIcon(type, 24)}
                    </div>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1c1917", margin: 0 }}>
                      {type === "VIDEO" ? "Videos" : type === "AUDIO" ? "Audio Guides" : type === "BOOK" ? "Articles & Guides" : "Images"}
                    </h2>
                  </div>
                  <span style={{ padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.875rem", fontWeight: 500, backgroundColor: "#f5f5f4", color: "#57534e" }}>
                    {blockResources.length} {blockResources.length === 1 ? 'Resource' : 'Resources'}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
                  {blockResources.length === 0 ? (
                    <div style={{ gridColumn: "1 / -1", padding: "2rem", backgroundColor: "#fafaf9", borderRadius: "1rem", textAlign: "center", color: "#78716c", fontSize: "0.875rem" }}>
                      No resources published yet.
                    </div>
                  ) : (
                    blockResources.map((resource) => (
                      <div key={resource._id} style={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: "white", borderRadius: "1rem", border: "1px solid #e7e5e4", overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s" }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }} onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
                        <div style={{ position: "relative", height: "12rem", overflow: "hidden", backgroundColor: "#f5f5f4" }}>
                          <img src={resource.type === "IMAGE" ? getFullFileUrl(resource.fileUrl) : getFallbackImage(resource.type)} alt={resource.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.25rem 0.5rem", borderRadius: "0.375rem", backgroundColor: "rgba(0,0,0,0.6)", color: "white", fontSize: "0.75rem", fontWeight: 500, backdropFilter: "blur(4px)" }}>
                            {getTypeIcon(resource.type, 14)} {getTypeLabel(resource.type)}
                          </div>
                        </div>
                        <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1 }}>
                          <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1c1917", margin: "0 0 0.5rem 0" }}>{resource.title}</h3>
                          <p style={{ fontSize: "0.875rem", color: "#57534e", margin: "0 0 1.5rem 0", flex: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{resource.description || "Helpful mental wellness content."}</p>
                          <button onClick={() => openResource(resource)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", borderRadius: "0.5rem", fontSize: "0.875rem", fontWeight: 500, backgroundColor: "#fdfbf7", color: "#0ea5e9", border: "1px solid #bae6fd", cursor: "pointer", transition: "background-color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fdfbf7'}>
                            {type === "VIDEO" ? "Watch Video" : type === "AUDIO" ? "Listen Audio" : type === "BOOK" ? "Read Article" : "View Image"}
                            <ArrowRightIcon style={{ height: "1rem", width: "1rem" }} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })
        )}
      </motion.section>
      </>
      )}

      {activeTab === "Self-Assessment Quiz" && (
        <motion.section variants={fadeIn}>
          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "1.875rem", fontFamily: "sans-serif", fontWeight: "bold", color: "#1c1917", marginBottom: "0.5rem", marginTop: 0 }}>
              Self-Assessment Quiz
            </h1>
            <p style={{ color: "#78716c", fontSize: "1.125rem", margin: 0 }}>
              Take a short quiz to evaluate your current stress levels and get personalized recommendations.
            </p>
          </div>
          <Quiz />
        </motion.section>
      )}

      {/* Support Banner */}
      <motion.section variants={fadeIn} style={{ backgroundColor: "#1e1b4b", borderRadius: "1.5rem", padding: "3rem", color: "white", display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "2rem", position: "relative", overflow: "hidden", boxShadow: "0 10px 15px -3px rgba(30, 27, 75, 0.4)" }}>
        <div style={{ position: "absolute", top: 0, right: 0, opacity: 0.1, pointerEvents: "none" }}>
           <img src={VideoImg} alt="bg" style={{ width: "300px", filter: "grayscale(100%)", transform: "translate(30%, -30%) rotate(15deg)" }} />
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h3 style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "0.5rem", marginTop: 0 }}>Need Immediate Support?</h3>
          <p style={{ color: "#c7d2fe", fontSize: "1.125rem", margin: 0, maxWidth: "40rem" }}>
            Our campus crisis line is available 24/7. You do not have to go through it alone.
          </p>
        </div>
        <button style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem 2rem", borderRadius: "0.75rem", fontSize: "1rem", fontWeight: 600, backgroundColor: "white", color: "#1e1b4b", border: "none", cursor: "pointer", whiteSpace: "nowrap", transition: "transform 0.2s" }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <PhoneIcon style={{ height: "1.25rem", width: "1.25rem" }} /> Call Crisis Line
        </button>
      </motion.section>

    </motion.div>
  );
}
