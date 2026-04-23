import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboardIcon, CalendarIcon, MessageSquareIcon, LogOutIcon,
  BookOpenIcon, UploadCloudIcon, PlayCircleIcon, HeadphonesIcon,
  ImageIcon, CheckCircleIcon, XCircleIcon, ClockIcon, TrashIcon,
  FileTextIcon,
} from "lucide-react";
import { NotificationBell } from "../components/NotificationBell";

const API = "http://localhost:3000/api/resources";

function getAuth() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
  let user = null;
  try { user = raw ? JSON.parse(raw) : null; } catch { }
  return { token, user };
}

export function CounselorResources() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, user } = getAuth();

  const [activeTab, setActiveTab] = useState("upload");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("VIDEO");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [myResources, setMyResources] = useState([]);
  const [loadingRes, setLoadingRes] = useState(true);

  const navItems = [
    { icon: LayoutDashboardIcon, label: "Dashboard", path: "/counselor-dashboard" },
    { icon: CalendarIcon, label: "Appointments", path: "/counselor-appointments" },
    { icon: MessageSquareIcon, label: "Messages", path: "/counselor-messages" },
    { icon: BookOpenIcon, label: "Resources", path: "/counselor-resources" },
  ];

  useEffect(() => { fetchMyResources(); }, []);

  const fetchMyResources = async () => {
    try {
      setLoadingRes(true);
      const res = await fetch(`${API}/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMyResources(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch resources:", err);
    } finally {
      setLoadingRes(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setSuccessMsg(""); setErrorMsg("");
    if (!title || !description || !type || !file) {
      setErrorMsg("Please fill all fields and choose a file.");
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("type", type);
      formData.append("file", file);

      const res = await fetch(API, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || "Resource submitted for approval!");
        setTitle(""); setDescription(""); setType("VIDEO"); setFile(null);
        fetchMyResources();
        setTimeout(() => setSuccessMsg(""), 5000);
      } else {
        setErrorMsg(data.message || "Upload failed.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchMyResources();
      else alert("Failed to delete.");
    } catch { alert("Network error."); }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token"); localStorage.removeItem("user");
    sessionStorage.removeItem("token"); sessionStorage.removeItem("user");
    navigate("/login");
  };

  const getTypeIcon = (t, size = 20) => {
    if (t === "VIDEO") return <PlayCircleIcon style={{ width: size, height: size }} />;
    if (t === "AUDIO") return <HeadphonesIcon style={{ width: size, height: size }} />;
    if (t === "BOOK") return <BookOpenIcon style={{ width: size, height: size }} />;
    return <ImageIcon style={{ width: size, height: size }} />;
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: { bg: "#fef3c7", color: "#92400e", icon: <ClockIcon style={{ width: 14, height: 14 }} />, label: "Pending" },
      approved: { bg: "#d1fae5", color: "#065f46", icon: <CheckCircleIcon style={{ width: 14, height: 14 }} />, label: "Approved" },
      rejected: { bg: "#fee2e2", color: "#991b1b", icon: <XCircleIcon style={{ width: 14, height: 14 }} />, label: "Rejected" },
    };
    const s = map[status] || map.pending;
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "0.25rem 0.75rem", borderRadius: 9999, fontSize: "0.75rem", fontWeight: 600, backgroundColor: s.bg, color: s.color }}>
        {s.icon} {s.label}
      </span>
    );
  };

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Counselor";
  const userInitials = userName !== "Counselor" ? userName.split(" ").map(n => n.charAt(0)).join("").substring(0, 2).toUpperCase() : "C";

  return (
    <div style={{ height: "100vh", backgroundColor: "#fdfbf7", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <header style={{ flexShrink: 0, width: "100%", backgroundColor: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #f5f5f4", position: "relative", zIndex: 50 }}>
        <div style={{ maxWidth: 1600, margin: "0 auto", padding: "0 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", height: "4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ backgroundColor: "#f0f9ff", padding: "0.5rem", borderRadius: "0.75rem" }}>
              <img src="/logo.png" alt="Logo" style={{ height: "2.5rem", width: "auto", objectFit: "contain" }} />
            </div>
            <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "#292524", letterSpacing: "-0.025em" }}>
              SliitCare<span style={{ color: "#0ea5e9" }}>Connect</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <NotificationBell />
            <div style={{ height: "2rem", width: 1, backgroundColor: "#e7e5e4", margin: "0 0.25rem" }} />
            <Link to="/settings" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c", margin: 0 }}>{userName}</p>
                <p style={{ fontSize: "0.75rem", color: "#78716c", margin: 0 }}>Counselor</p>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: "2rem", width: "2rem", borderRadius: "50%", backgroundColor: "#e7e5e4", color: "#57534e", fontSize: "0.875rem", fontWeight: "bold" }}>{userInitials}</div>
            </Link>
          </div>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, maxWidth: 1600, width: "100%", margin: "0 auto", overflow: "hidden" }}>
        {/* Sidebar */}
        <aside style={{ width: "16rem", backgroundColor: "white", borderRight: "1px solid #f5f5f4", flexShrink: 0, display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <div style={{ padding: "1.5rem", flex: 1 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#a8a29e", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>Menu</div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link key={item.path} to={item.path} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.625rem 0.75rem", borderRadius: "0.75rem", fontSize: "0.875rem", fontWeight: 500, textDecoration: "none", transition: "all 0.3s", ...(isActive ? { backgroundColor: "#f0f9ff", color: "#0369a1" } : { color: "#57534e" }) }}>
                    <item.icon style={{ height: "1.25rem", width: "1.25rem", ...(isActive ? { color: "#0284c7" } : { color: "#a8a29e" }) }} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div style={{ padding: "1.5rem", borderTop: "1px solid #f5f5f4" }}>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <Link to="/" onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.625rem 0.75rem", borderRadius: "0.75rem", fontSize: "0.875rem", fontWeight: 500, color: "#dc2626", textDecoration: "none" }}>
                <LogOutIcon style={{ height: "1.25rem", width: "1.25rem", color: "#f87171" }} />
                Log out
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: "2rem", overflowY: "auto", overflowX: "hidden", minWidth: 0 }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ maxWidth: "56rem", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem", paddingBottom: "3rem" }}>

            {/* Page Header */}
            <div>
              <h1 style={{ fontSize: "1.875rem", fontFamily: "sans-serif", fontWeight: "bold", color: "#1c1917", marginBottom: "0.5rem", marginTop: 0 }}>
                Resource Management
              </h1>
              <p style={{ color: "#78716c", margin: 0 }}>Upload mental health resources for students. All submissions require admin approval before publishing.</p>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "0.5rem", backgroundColor: "#f5f5f4", padding: "0.25rem", borderRadius: "0.75rem", width: "fit-content" }}>
              {[{ key: "upload", label: "Upload Resource", icon: <UploadCloudIcon style={{ width: 16, height: 16 }} /> },
                { key: "submissions", label: `My Submissions (${myResources.length})`, icon: <FileTextIcon style={{ width: 16, height: 16 }} /> }
              ].map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.25rem", borderRadius: "0.625rem", fontSize: "0.875rem", fontWeight: 500, border: "none", cursor: "pointer", transition: "all 0.2s", ...(activeTab === tab.key ? { backgroundColor: "white", color: "#0369a1", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" } : { backgroundColor: "transparent", color: "#57534e" }) }}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Upload Form */}
            {activeTab === "upload" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ backgroundColor: "white", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", overflow: "hidden" }}>
                <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #f5f5f4", background: "linear-gradient(135deg, #f0f9ff, #ffffff)" }}>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1c1917", margin: 0 }}>Upload New Resource</h2>
                  <p style={{ color: "#78716c", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>Choose a category and upload your resource file.</p>
                </div>

                {successMsg && (
                  <div style={{ margin: "1.5rem 2rem 0", padding: "1rem", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "0.5rem", color: "#166534", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>
                    <CheckCircleIcon style={{ width: 18, height: 18 }} /> {successMsg}
                  </div>
                )}
                {errorMsg && (
                  <div style={{ margin: "1.5rem 2rem 0", padding: "1rem", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "0.5rem", color: "#991b1b", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>
                    <XCircleIcon style={{ width: 18, height: 18 }} /> {errorMsg}
                  </div>
                )}

                <form onSubmit={handleUpload} style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {/* Resource Type Selection */}
                  <div>
                    <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c", marginBottom: "0.75rem", display: "block" }}>Resource Category <span style={{ color: "#ef4444" }}>*</span></label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
                      {[
                        { value: "VIDEO", label: "Videos", icon: <PlayCircleIcon style={{ width: 24, height: 24 }} />, color: "#0ea5e9", bg: "#e0f2fe" },
                        { value: "AUDIO", label: "Audio Guides", icon: <HeadphonesIcon style={{ width: 24, height: 24 }} />, color: "#8b5cf6", bg: "#ede9fe" },
                        { value: "BOOK", label: "Articles & Guides", icon: <BookOpenIcon style={{ width: 24, height: 24 }} />, color: "#10b981", bg: "#d1fae5" },
                        { value: "IMAGE", label: "Images", icon: <ImageIcon style={{ width: 24, height: 24 }} />, color: "#f59e0b", bg: "#fef3c7" },
                      ].map((cat) => (
                        <button key={cat.value} type="button" onClick={() => setType(cat.value)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", padding: "1.25rem 0.75rem", borderRadius: "0.75rem", border: `2px solid ${type === cat.value ? cat.color : "#e7e5e4"}`, backgroundColor: type === cat.value ? cat.bg : "white", cursor: "pointer", transition: "all 0.2s", color: type === cat.value ? cat.color : "#78716c" }}>
                          {cat.icon}
                          <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c" }}>Title <span style={{ color: "#ef4444" }}>*</span></label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter resource title..." style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e7e5e4", backgroundColor: "#fafaf9", outline: "none", fontSize: "0.875rem", color: "#1c1917" }} onFocus={(e) => e.target.style.borderColor = "#0ea5e9"} onBlur={(e) => e.target.style.borderColor = "#e7e5e4"} />
                  </div>

                  {/* Description */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c" }}>Description <span style={{ color: "#ef4444" }}>*</span></label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe this resource..." rows={4} style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e7e5e4", backgroundColor: "#fafaf9", outline: "none", fontSize: "0.875rem", color: "#1c1917", resize: "vertical", fontFamily: "inherit" }} onFocus={(e) => e.target.style.borderColor = "#0ea5e9"} onBlur={(e) => e.target.style.borderColor = "#e7e5e4"} />
                  </div>

                  {/* File Upload */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c" }}>File <span style={{ color: "#ef4444" }}>*</span></label>
                    <div style={{ border: "2px dashed #d6d3d1", borderRadius: "0.75rem", padding: "2rem", textAlign: "center", backgroundColor: "#fafaf9", cursor: "pointer", transition: "all 0.2s" }} onClick={() => document.getElementById("resource-file-input").click()}>
                      <UploadCloudIcon style={{ width: 36, height: 36, color: "#a8a29e", margin: "0 auto 0.75rem" }} />
                      <p style={{ margin: 0, fontSize: "0.875rem", color: "#57534e", fontWeight: 500 }}>
                        {file ? file.name : "Click to select a file"}
                      </p>
                      <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "#a8a29e" }}>
                        Supports video, audio, PDF, and image files
                      </p>
                      <input id="resource-file-input" type="file" style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
                    </div>
                  </div>

                  {/* Submit */}
                  <div style={{ paddingTop: "0.5rem", borderTop: "1px solid #f5f5f4", display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" disabled={uploading} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 2rem", backgroundColor: uploading ? "#93c5fd" : "#0ea5e9", color: "white", borderRadius: "0.5rem", fontWeight: 600, fontSize: "0.875rem", border: "none", cursor: uploading ? "not-allowed" : "pointer", transition: "background-color 0.2s" }}>
                      <UploadCloudIcon style={{ width: 18, height: 18 }} />
                      {uploading ? "Uploading..." : "Submit for Approval"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* My Submissions */}
            {activeTab === "submissions" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ backgroundColor: "white", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", overflow: "hidden" }}>
                <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #f5f5f4", background: "linear-gradient(135deg, #f0f9ff, #ffffff)" }}>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1c1917", margin: 0 }}>My Submissions</h2>
                  <p style={{ color: "#78716c", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>Track the status of your uploaded resources.</p>
                </div>

                <div style={{ padding: "1.5rem 2rem" }}>
                  {loadingRes ? (
                    <p style={{ textAlign: "center", color: "#78716c", padding: "2rem", fontStyle: "italic" }}>Loading...</p>
                  ) : myResources.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "3rem", color: "#a8a29e" }}>
                      <UploadCloudIcon style={{ width: 48, height: 48, margin: "0 auto 1rem", color: "#d6d3d1" }} />
                      <p style={{ fontSize: "1rem", fontWeight: 500, color: "#78716c", margin: "0 0 0.25rem" }}>No resources submitted yet</p>
                      <p style={{ fontSize: "0.875rem", margin: 0 }}>Upload your first resource to get started.</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {myResources.map((r) => (
                        <div key={r._id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", border: "1px solid #f5f5f4", borderRadius: "0.75rem", transition: "box-shadow 0.2s" }} onMouseOver={(e) => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)"} onMouseOut={(e) => e.currentTarget.style.boxShadow = "none"}>
                          <div style={{ width: "3rem", height: "3rem", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f0f9ff", color: "#0ea5e9", flexShrink: 0 }}>
                            {getTypeIcon(r.type, 24)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{ margin: "0 0 0.25rem", fontSize: "0.9375rem", fontWeight: 600, color: "#1c1917", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</h4>
                            <p style={{ margin: 0, fontSize: "0.75rem", color: "#a8a29e" }}>
                              {r.type} • {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                            {r.status === "rejected" && r.rejectionReason && (
                              <p style={{ margin: "0.375rem 0 0", fontSize: "0.75rem", color: "#dc2626", fontStyle: "italic" }}>
                                Reason: {r.rejectionReason}
                              </p>
                            )}
                          </div>
                          {getStatusBadge(r.status)}
                          {r.status === "pending" && (
                            <button onClick={() => handleDelete(r._id)} style={{ padding: "0.375rem", background: "none", border: "none", color: "#a8a29e", cursor: "pointer", borderRadius: "0.375rem" }} title="Delete">
                              <TrashIcon style={{ width: 16, height: 16 }} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
