import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Headphones, Image as ImageIcon, PlayCircle, Search } from "lucide-react";
import Quiz from "./Quiz";

import VideoImg from "../assets/images/VIDEO.png";
import AudioImg from "../assets/images/AUDIO.png";
import BookImg from "../assets/images/BOOK.jpg";
import ImageImg from "../assets/images/IMAGE.jpg";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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
    return ImageImg;
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
    resources.find((r) => r.type === "BOOK") ||
    resources.find((r) => r.type === "VIDEO") ||
    resources[0];

  const getTypeLabel = (type) => {
    if (type === "VIDEO") return "Video";
    if (type === "AUDIO") return "Audio";
    if (type === "BOOK") return "Guide";
    return "Image";
  };

  const getTypeIcon = (type) => {
    if (type === "VIDEO") return <PlayCircle size={20} />;
    if (type === "AUDIO") return <Headphones size={20} />;
    if (type === "BOOK") return <BookOpen size={20} />;
    return <ImageIcon size={20} />;
  };

  return (
    <motion.div
      className="resources-page"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="resources-intro">
        <h1 className="resources-title">Wellness Resources</h1>
        <p className="resources-subtitle">
          Articles, videos, and guides to support your mental health journey.
        </p>
      </div>

      <div className="resources-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="chip-row">
          {topics.map((topic) => (
            <button
              key={topic}
              className={`chip ${activeTopic === topic ? "chip-active" : ""}`}
              onClick={() => setActiveTopic(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {featuredResource && (
        <section className="featured-card">
          <div className="featured-image-wrap">
            <img
              src="/images/resource-hero.jpg"
              alt="Mental wellness"
              className="featured-image"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop";
              }}
            />
          </div>

          <div className="featured-content">
            <span className="featured-badge">
              {featuredResource.type === "BOOK" ? "Featured Guide" : "Featured Resource"}
            </span>

            <h2>{featuredResource.title}</h2>
            <p>
              {featuredResource.description ||
                "A comprehensive resource to help students better manage emotional well-being, academic stress, and daily mental health challenges."}
            </p>

            <button className="primary-btn" onClick={() => openResource(featuredResource)}>
              Read Full Guide
            </button>
          </div>
        </section>
      )}

      <section className="category-blocks-container" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {loading ? (
          <p className="empty-text">Loading resources...</p>
        ) : filteredResources.length === 0 && searchQuery.trim() !== "" ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '24px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>No results found for "{searchQuery}"</h3>
            <p className="empty-text">Try adjusting your search or try searching for another topic.</p>
          </div>
        ) : (
          categories.map((type) => {
            const blockResources = filteredResources.filter((r) => r.type === type);

            return (
              <div
                key={type}
                className="category-content-block"
                style={{
                  background: 'white',
                  borderRadius: '24px',
                  border: '1px solid var(--border)',
                  padding: '32px',
                  boxShadow: '0 8px 22px rgba(0, 0, 0, 0.03)'
                }}
              >
                <div className="block-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: 'var(--soft-blue)', color: 'var(--blue)', width: '54px', height: '54px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {getTypeIcon(type)}
                    </div>
                    <div>
                      <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
                        {type === "VIDEO" ? "Videos" : type === "AUDIO" ? "Audios" : type === "BOOK" ? "Articles" : "Images"}
                      </h2>
                    </div>
                  </div>
                  <span style={{ background: '#f0f0f0', color: '#5b5650', padding: '8px 16px', borderRadius: '99px', fontSize: '14px', fontWeight: 600 }}>
                    {blockResources.length} {blockResources.length === 1 ? 'Resource' : 'Resources'}
                  </span>
                </div>

                <div className="resource-grid">
                  {blockResources.length === 0 ? (
                    <p className="empty-text" style={{ gridColumn: '1 / -1', padding: '24px', background: '#fbfaf8', borderRadius: '16px', textAlign: 'center' }}>No resources published yet.</p>
                  ) : (
                    blockResources.map((resource) => (
                      <div className="resource-item-card" key={resource._id}>
                        <div className="resource-thumb-wrap">
                          <img
                            src={resource.type === "IMAGE" ? getFullFileUrl(resource.fileUrl) : getFallbackImage(resource.type)}
                            alt={resource.title}
                            className="resource-thumb"
                          />

                          <span className="resource-card-badge">
                            {getTypeIcon(resource.type)}
                            {getTypeLabel(resource.type)}
                          </span>
                        </div>

                        <div className="resource-item-body">
                          <div className="resource-meta">
                            <span className="resource-category-name">
                              {type === "VIDEO" ? "Video" : type === "AUDIO" ? "Audio" : type === "BOOK" ? "Article" : "Image"}
                            </span>
                            <span>•</span>
                            <span>
                              {type === "VIDEO" ? "Watch now" : type === "AUDIO" ? "Listen now" : type === "BOOK" ? "Read now" : "View now"}
                            </span>
                          </div>

                          <h3>{resource.title}</h3>
                          <p>{resource.description || "Helpful mental wellness content."}</p>

                          <button className="resource-open-btn" onClick={() => openResource(resource)}>
                            {type === "VIDEO" ? "Watch Video" : type === "AUDIO" ? "Listen Audio" : type === "BOOK" ? "Read Article" : "View Image"}
                            <ArrowRight size={16} />
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
      </section>

      <section className="quiz-section">
        <Quiz />
      </section>

      <section className="support-banner">
        <div className="support-text">
          <h3>Need Immediate Support?</h3>
          <p>
            Our campus crisis line is available 24/7. You do not have to go through it alone.
          </p>
        </div>
        <button className="support-btn">Call Crisis Line</button>
      </section>
    </motion.div>
  );
}

