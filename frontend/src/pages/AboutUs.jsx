import { motion } from "framer-motion";

export function AboutUs() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const stagger = {
    animate: { transition: { staggerChildren: 0.2 } },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", backgroundColor: "white", paddingBottom: "6rem" }}>
      {/* Top Header */}
      <section style={{ paddingTop: "4rem", paddingBottom: "2rem", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontFamily: "sans-serif",
            fontWeight: "300",
            color: "#4b5563",
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          ABOUT <span style={{ fontWeight: "700", color: "#1f2937" }}>US</span>
        </h1>
      </section>

      {/* Main Content Area */}
      <section style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 2rem", width: "100%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "4rem",
            alignItems: "flex-start",
          }}
        >
          {/* Left Column - Image */}
          <motion.div initial="initial" animate="animate" variants={fadeIn}>
            <img
              src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&q=80&w=800&h=800"
              alt="Medical Professionals"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                backgroundColor: "#f3f4f6", // Fallback color
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              }}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1576091160399-11cb953bff14?auto=format&fit=crop&q=80&w=800&h=800";
              }}
            />
          </motion.div>

          {/* Right Column - Text */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            style={{ paddingTop: "1rem" }}
          >
            <motion.p
              variants={fadeIn}
              style={{
                fontSize: "1rem",
                color: "#4b5563",
                lineHeight: 1.75,
                margin: "0 0 1.5rem 0",
              }}
            >
              Welcome to SliitCareConnect, your trusted partner in managing your healthcare needs conveniently and efficiently. At SliitCareConnect, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
            </motion.p>

            <motion.p
              variants={fadeIn}
              style={{
                fontSize: "1rem",
                color: "#4b5563",
                lineHeight: 1.75,
                margin: "0 0 2.5rem 0",
              }}
            >
              SliitCareConnect is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, SliitCareConnect is here to support you every step of the way.
            </motion.p>

            <motion.h3
              variants={fadeIn}
              style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                color: "#1f2937",
                margin: "0 0 1.5rem 0",
              }}
            >
              Our Vision
            </motion.h3>

            <motion.p
              variants={fadeIn}
              style={{
                fontSize: "1rem",
                color: "#4b5563",
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              Our vision at SliitCareConnect is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section style={{ maxWidth: "80rem", margin: "4rem auto 0 auto", padding: "0 2rem", width: "100%" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontFamily: "sans-serif",
            fontWeight: "600",
            color: "#1f2937",
            marginTop: "2rem",
            marginBottom: "2rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          WHY CHOOSE US
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "0",
            border: "1px solid #e5e7eb",
          }}
        >
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              padding: "3rem 2.5rem",
              borderRight: "1px solid #e5e7eb",
              backgroundColor: "white",
            }}
          >
            <h4
              style={{
                fontSize: "1.125rem",
                fontWeight: "700",
                color: "#374151",
                marginBottom: "1rem",
                marginTop: 0,
                textTransform: "uppercase",
              }}
            >
              EFFICIENCY:
            </h4>
            <p style={{ color: "#6b7280", lineHeight: 1.625, margin: 0, fontSize: "1rem" }}>
              Streamlined appointment scheduling that fits into your busy lifestyle.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{
              padding: "3rem 2.5rem",
              borderRight: "1px solid #e5e7eb",
              backgroundColor: "white",
            }}
          >
            <h4
              style={{
                fontSize: "1.125rem",
                fontWeight: "700",
                color: "#374151",
                marginBottom: "1rem",
                marginTop: 0,
                textTransform: "uppercase",
              }}
            >
              CONVENIENCE:
            </h4>
            <p style={{ color: "#6b7280", lineHeight: 1.625, margin: 0, fontSize: "1rem" }}>
              Access to a network of trusted healthcare professionals in your area.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            style={{
              padding: "3rem 2.5rem",
              backgroundColor: "white",
            }}
          >
            <h4
              style={{
                fontSize: "1.125rem",
                fontWeight: "700",
                color: "#374151",
                marginBottom: "1rem",
                marginTop: 0,
                textTransform: "uppercase",
              }}
            >
              PERSONALIZATION:
            </h4>
            <p style={{ color: "#6b7280", lineHeight: 1.625, margin: 0, fontSize: "1rem" }}>
              Tailored recommendations and reminders to help you stay on top of your health.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
