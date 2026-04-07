import { motion } from "framer-motion";
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";

export function ContactPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        paddingBottom: "6rem",
      }}
    >
      <section
        style={{
          paddingTop: "4rem",
          paddingBottom: "2rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontFamily: "sans-serif",
            fontWeight: 300,
            color: "#4b5563",
            margin: 0,
            letterSpacing: "0.05em",
          }}
        >
          CONTACT <span style={{ fontWeight: 700, color: "#1f2937" }}>US</span>
        </h1>
        <p style={{ color: "#78716c", marginTop: "1rem", maxWidth: "36rem", marginInline: "auto" }}>
          Reach out to the SliitCareConnect wellness team—we are here to help.
        </p>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "0 2rem",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          <div
            style={{
              borderRadius: "1rem",
              overflow: "hidden",
              border: "1px solid #e7e5e4",
              backgroundColor: "#fafaf9",
            }}
          >
            <iframe
              title="SLIIT Main Campus, Malabe, Sri Lanka"
              src="https://www.google.com/maps?q=SLIIT%20Main%20Campus,%20Malabe,%20Sri%20Lanka&output=embed"
              width="100%"
              height="480"
              style={{ border: 0, display: "block" }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
                padding: "1.25rem",
                borderRadius: "1rem",
                border: "1px solid #e7e5e4",
                backgroundColor: "#fafaf9",
              }}
            >
              <MailIcon
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  color: "#0ea5e9",
                  flexShrink: 0,
                }}
              />
              <div>
                <p style={{ fontWeight: 600, color: "#1c1917", margin: "0 0 0.25rem 0" }}>
                  Email
                </p>
                <a
                  href="mailto:wellness@sliit.lk"
                  style={{ color: "#0369a1", textDecoration: "none" }}
                >
                  wellness@sliit.lk
                </a>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
                padding: "1.25rem",
                borderRadius: "1rem",
                border: "1px solid #e7e5e4",
                backgroundColor: "#fafaf9",
              }}
            >
              <PhoneIcon
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  color: "#0ea5e9",
                  flexShrink: 0,
                }}
              />
              <div>
                <p style={{ fontWeight: 600, color: "#1c1917", margin: "0 0 0.25rem 0" }}>
                  Phone
                </p>
                <p style={{ margin: 0, color: "#57534e" }}>+94 11 234 5678</p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
                padding: "1.25rem",
                borderRadius: "1rem",
                border: "1px solid #e7e5e4",
                backgroundColor: "#fafaf9",
              }}
            >
              <MapPinIcon
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  color: "#0ea5e9",
                  flexShrink: 0,
                }}
              />
              <div>
                <p style={{ fontWeight: 600, color: "#1c1917", margin: "0 0 0.25rem 0" }}>
                  Campus
                </p>
                <p style={{ margin: 0, color: "#57534e", lineHeight: 1.6 }}>
                  SLIIT Main Campus, Malabe, Sri Lanka
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
