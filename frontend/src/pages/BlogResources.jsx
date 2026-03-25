import { useState } from "react";
import { motion } from "framer-motion";
import {
  SearchIcon,
  BookOpenIcon,
  VideoIcon,
  HeartIcon,
  ArrowRightIcon,
} from "lucide-react";

const categories = [
  "All",
  "Anxiety",
  "Depression",
  "Academic Stress",
  "Mindfulness",
  "Relationships",
];

const articles = [
  {
    id: 1,
    title: "Understanding and Managing Test Anxiety",
    category: "Academic Stress",
    readTime: "5 min read",
    type: "Article",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 2,
    title: "10-Minute Guided Meditation for Focus",
    category: "Mindfulness",
    readTime: "10 min watch",
    type: "Video",
    image:
      "https://images.unsplash.com/photo-1621243801046-243fb32a76f2?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 3,
    title: "Building Healthy Boundaries in College",
    category: "Relationships",
    readTime: "7 min read",
    type: "Article",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 4,
    title: "Recognizing Signs of Burnout",
    category: "Stress",
    readTime: "6 min read",
    type: "Article",
    image:
      "https://images.unsplash.com/photo-1494883759339-0b042055a4ee?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 5,
    title: "Sleep Hygiene for Students",
    category: "Wellness",
    readTime: "4 min read",
    type: "Article",
    image:
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 6,
    title: "Navigating Imposter Syndrome",
    category: "Academic Stress",
    readTime: "8 min read",
    type: "Article",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000",
  },
];

export function BlogResources() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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
            Wellness Resources
          </h1>
          <p style={{ color: "#78716c", fontSize: "1.125rem", margin: 0 }}>
            Articles, videos, and guides to support your mental health journey.
          </p>
        </div>

        <div style={{ position: "relative", width: "100%", maxWidth: "32rem" }}>
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
              style={{ height: "1.25rem", width: "1.25rem", color: "#a8a29e" }}
            />
          </div>
          <input
            type="text"
            placeholder="Search resources..."
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
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Categories */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginTop: "0.5rem",
          }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                fontSize: "0.875rem",
                fontWeight: 500,
                border: "1px solid",
                cursor: "pointer",
                outline: "none",
                transition: "colors 0.3s",
                ...(activeCategory === category
                  ? {
                      backgroundColor: "#0ea5e9",
                      color: "white",
                      borderColor: "#0ea5e9",
                    }
                  : {
                      backgroundColor: "white",
                      borderColor: "#e7e5e4",
                      color: "#57534e",
                    }),
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Featured Resource */}
      <motion.div variants={fadeIn}>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "1rem",
            overflow: "hidden",
            border: "1px solid #e7e5e4",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: window.innerWidth >= 768 ? "row" : "column",
            height: window.innerWidth >= 768 ? "24rem" : "auto",
          }}
        >
          <div
            style={{
              flex: "1 1 50%",
              height: window.innerWidth >= 768 ? "100%" : "16rem",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=1000"
              alt="Featured"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div
            style={{
              flex: "1 1 50%",
              padding: "3rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: 500,
                backgroundColor: "#f0f9ff",
                color: "#0369a1",
                marginBottom: "1rem",
                width: "fit-content",
              }}
            >
              Featured Guide
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
              The Student's Guide to Mental Wellness
            </h2>
            <p
              style={{
                color: "#57534e",
                fontSize: "1.125rem",
                marginBottom: "2rem",
                lineHeight: 1.625,
              }}
            >
              A comprehensive handbook covering everything from managing
              deadline stress to knowing when to seek professional help.
            </p>
            <button
              style={{
                alignSelf: "flex-start",
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                borderRadius: "0.5rem",
                fontWeight: 500,
                backgroundColor: "#0ea5e9",
                color: "white",
                border: "none",
                cursor: "pointer",
                outline: "none",
              }}
            >
              Read Full Guide
            </button>
          </div>
        </div>
      </motion.div>

      {/* Resource Grid */}
      <motion.div variants={fadeIn}>
        <h3
          style={{
            fontSize: "1.25rem",
            fontFamily: "sans-serif",
            fontWeight: "bold",
            color: "#1c1917",
            marginBottom: "1.5rem",
            marginTop: 0,
          }}
        >
          Latest Resources
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {articles.map((article) => (
            <div
              key={article.id}
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                borderRadius: "1rem",
                border: "1px solid #e7e5e4",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "pointer",
              }}
            >
              <div
                style={{ height: "12rem", width: "100%", position: "relative" }}
              >
                <img
                  src={article.image}
                  alt={article.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{ position: "absolute", top: "1rem", right: "1rem" }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "9999px",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      backgroundColor: "white",
                      color: "#44403c",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  >
                    {article.type === "Video" ? (
                      <VideoIcon
                        style={{
                          height: "0.75rem",
                          width: "0.75rem",
                          marginRight: "0.25rem",
                        }}
                      />
                    ) : (
                      <BookOpenIcon
                        style={{
                          height: "0.75rem",
                          width: "0.75rem",
                          marginRight: "0.25rem",
                        }}
                      />
                    )}
                    {article.type}
                  </span>
                </div>
              </div>
              <div
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color: "#0ea5e9",
                    }}
                  >
                    {article.category}
                  </span>
                  <span style={{ color: "#d6d3d1" }}>•</span>
                  <span style={{ fontSize: "0.75rem", color: "#78716c" }}>
                    {article.readTime}
                  </span>
                </div>
                <h4
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: "#1c1917",
                    marginBottom: "0.5rem",
                    marginTop: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {article.title}
                </h4>
                <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "#0ea5e9",
                    }}
                  >
                    Read more{" "}
                    <ArrowRightIcon
                      style={{
                        height: "1rem",
                        width: "1rem",
                        marginLeft: "0.25rem",
                      }}
                    />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Campus Support Widget */}
      <motion.div variants={fadeIn}>
        <div
          style={{
            backgroundColor: "#fdf4ff",
            border: "1px solid #fae8ff",
            borderRadius: "1rem",
            padding: "2rem",
            display: "flex",
            flexDirection: window.innerWidth >= 768 ? "row" : "column",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div
              style={{
                backgroundColor: "#f0abfc",
                padding: "1rem",
                borderRadius: "50%",
                color: "#86198f",
                flexShrink: 0,
              }}
            >
              <HeartIcon style={{ height: "2rem", width: "2rem" }} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "#4a044e",
                  marginBottom: "0.5rem",
                  marginTop: 0,
                }}
              >
                Need Immediate Support?
              </h3>
              <p style={{ color: "#701a75", margin: 0 }}>
                Our campus crisis line is available 24/7. You don't have to go
                through it alone.
              </p>
            </div>
          </div>
          <button
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              borderRadius: "0.5rem",
              fontWeight: 500,
              backgroundColor: "#c026d3",
              color: "white",
              border: "none",
              cursor: "pointer",
              outline: "none",
              whiteSpace: "nowrap",
              width: window.innerWidth < 768 ? "100%" : "auto",
            }}
          >
            Call Crisis Line
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
