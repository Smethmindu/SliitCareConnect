import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UploadCloudIcon, 
  FileTextIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  TrashIcon, 
  PlayCircleIcon, 
  HeadphonesIcon, 
  BookOpenIcon, 
  ImageIcon,
  AlertTriangleIcon 
} from "lucide-react";

const API = "http://localhost:3000/api/resources";

function getAuth() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return { token };
}

export default function AdminResources() {
  const { token } = getAuth();
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'upload', 'pending'
  
  // Upload state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("VIDEO");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  // Data state
  const [resources, setResources] = useState([]);
  const [pendingResources, setPendingResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // Always fetch pending count on mount for the badge
  useEffect(() => {
    fetchPendingResources();
  }, []);

  useEffect(() => {
    if (activeTab === "all") fetchResources();
    if (activeTab === "pending") fetchPendingResources();
  }, [activeTab]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setResources(res.data);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingResources = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API}/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingResources(res.data);
    } catch (error) {
      console.error("Failed to fetch pending resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !description || !type || !file) {
      alert("Please fill all fields and choose a file.");
      return;
    }
    if (!token) {
      alert("Unauthorized.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("type", type);
      formData.append("file", file);

      await axios.post(API, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });

      setSuccessMsg("Resource uploaded successfully!");
      setTitle("");
      setDescription("");
      setType("VIDEO");
      setFile(null);
      
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload resource.");
    } finally {
      setUploading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(`${API}/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPendingResources();
    } catch (error) {
      console.error("Approval failed:", error);
      alert("Failed to approve resource.");
    }
  };

  const handleRejectSubmit = async (id) => {
    try {
      await axios.patch(`${API}/${id}/reject`, { reason: rejectReason }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRejectingId(null);
      setRejectReason("");
      fetchPendingResources();
    } catch (error) {
      console.error("Rejection failed:", error);
      alert("Failed to reject resource.");
    }
  };

  const handleDelete = async (id, isPending = false) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (isPending) fetchPendingResources();
      else fetchResources();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete resource.");
    }
  };

  const handleFixData = async () => {
    if (!window.confirm("This will move all counselor-uploaded resources (that were never reviewed) back to 'pending' status. Continue?")) return;
    try {
      const res = await axios.patch(`${API}/fix-status`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      fetchResources();
      fetchPendingResources();
    } catch (error) {
      console.error("Fix failed:", error);
      alert("Failed to fix data.");
    }
  };

  const getTypeIcon = (t, size = 20) => {
    if (t === "VIDEO") return <PlayCircleIcon style={{ width: size, height: size }} />;
    if (t === "AUDIO") return <HeadphonesIcon style={{ width: size, height: size }} />;
    if (t === "BOOK") return <BookOpenIcon style={{ width: size, height: size }} />;
    return <ImageIcon style={{ width: size, height: size }} />;
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#1c1917", margin: "0 0 0.5rem 0" }}>Resource Management</h1>
          <p style={{ color: "#78716c", margin: 0 }}>Upload direct resources or approve counselor submissions.</p>
        </div>
        <button onClick={handleFixData} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", fontSize: "0.8rem", fontWeight: 500, backgroundColor: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d", borderRadius: "0.5rem", cursor: "pointer", whiteSpace: "nowrap" }}>
          <AlertTriangleIcon style={{ width: 14, height: 14 }} /> Fix Counselor Data
        </button>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", backgroundColor: "#f5f5f4", padding: "0.25rem", borderRadius: "0.75rem", width: "fit-content" }}>
        {[
          { key: "all", label: "Published Resources", icon: <FileTextIcon style={{ width: 16, height: 16 }} /> },
          { key: "pending", label: `Pending Approvals (${pendingResources.length || 0})`, icon: <ClockIcon style={{ width: 16, height: 16 }} /> },
          { key: "upload", label: "Direct Upload", icon: <UploadCloudIcon style={{ width: 16, height: 16 }} /> }
        ].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.25rem", borderRadius: "0.625rem", fontSize: "0.875rem", fontWeight: 500, border: "none", cursor: "pointer", transition: "all 0.2s", ...(activeTab === tab.key ? { backgroundColor: "white", color: "#0369a1", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" } : { backgroundColor: "transparent", color: "#57534e" }) }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          
          {/* Published Resources */}
          {activeTab === "all" && (
            <div style={{ backgroundColor: "white", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", padding: "2rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1c1917", margin: "0 0 1.5rem 0" }}>Published Resources</h2>
              {loading ? (
                <p style={{ color: "#78716c", textAlign: "center" }}>Loading...</p>
              ) : resources.length === 0 ? (
                <p style={{ color: "#78716c", textAlign: "center", padding: "2rem" }}>No resources published yet.</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                  {resources.map((res) => (
                    <div key={res._id} style={{ border: "1px solid #e7e5e4", borderRadius: "0.75rem", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ padding: "0.5rem", backgroundColor: "#f0f9ff", color: "#0ea5e9", borderRadius: "0.5rem" }}>
                          {getTypeIcon(res.type, 20)}
                        </div>
                        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "#1c1917", flex: 1 }}>{res.title}</h3>
                      </div>
                      <p style={{ margin: 0, fontSize: "0.875rem", color: "#57534e", lineHeight: 1.5, flex: 1 }}>{res.description}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid #f5f5f4" }}>
                        <span style={{ fontSize: "0.75rem", color: "#a8a29e", fontWeight: 500 }}>{res.type}</span>
                        <button onClick={() => handleDelete(res._id)} style={{ padding: "0.375rem 0.75rem", fontSize: "0.75rem", fontWeight: 500, backgroundColor: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "0.375rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <TrashIcon style={{ width: 14, height: 14 }} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pending Approvals */}
          {activeTab === "pending" && (
            <div style={{ backgroundColor: "white", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", padding: "2rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1c1917", margin: "0 0 1.5rem 0" }}>Pending Approvals</h2>
              {loading ? (
                <p style={{ color: "#78716c", textAlign: "center" }}>Loading...</p>
              ) : pendingResources.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#a8a29e" }}>
                  <CheckCircleIcon style={{ width: 48, height: 48, margin: "0 auto 1rem", color: "#d1fae5" }} />
                  <p style={{ fontSize: "1rem", fontWeight: 500, color: "#78716c", margin: "0 0 0.25rem" }}>All caught up!</p>
                  <p style={{ fontSize: "0.875rem", margin: 0 }}>No pending resources to review.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {pendingResources.map((res) => (
                    <div key={res._id} style={{ border: "1px solid #e7e5e4", borderRadius: "0.75rem", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "#fafaf9" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                        <div style={{ display: "flex", gap: "1rem" }}>
                           <div style={{ padding: "0.75rem", backgroundColor: "#fffbeb", color: "#d97706", borderRadius: "0.5rem", height: "fit-content" }}>
                             {getTypeIcon(res.type, 24)}
                           </div>
                           <div>
                             <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.125rem", fontWeight: 600, color: "#1c1917" }}>{res.title}</h3>
                             <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", color: "#57534e", lineHeight: 1.5 }}>{res.description}</p>
                             <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.75rem", color: "#a8a29e", fontWeight: 500 }}>
                               <span>Type: {res.type}</span>
                               <span>•</span>
                               <span>Submitted by: {res.uploadedBy?.firstName ? `${res.uploadedBy.firstName} ${res.uploadedBy.lastName || ""}`.trim() : "Counselor"}</span>
                               <span>•</span>
                               <span>{new Date(res.createdAt).toLocaleDateString()}</span>
                             </div>
                           </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <button onClick={() => handleApprove(res._id)} style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", fontWeight: 600, backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
                            <CheckCircleIcon style={{ width: 16, height: 16 }} /> Approve
                          </button>
                          <button onClick={() => setRejectingId(rejectingId === res._id ? null : res._id)} style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", fontWeight: 600, backgroundColor: "white", color: "#ef4444", border: "1px solid #fca5a5", borderRadius: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
                            <XCircleIcon style={{ width: 16, height: 16 }} /> {rejectingId === res._id ? "Cancel Reject" : "Reject"}
                          </button>
                          <button onClick={() => handleDelete(res._id, true)} style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", fontWeight: 600, backgroundColor: "white", color: "#78716c", border: "1px solid #e7e5e4", borderRadius: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center", marginTop: "auto" }}>
                            <TrashIcon style={{ width: 16, height: 16 }} /> Delete
                          </button>
                        </div>
                      </div>

                      {/* Rejection Form */}
                      {rejectingId === res._id && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ marginTop: "0.5rem", paddingTop: "1rem", borderTop: "1px solid #e7e5e4", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                          <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1c1917" }}>Reason for Rejection <span style={{ color: "#ef4444" }}>*</span></label>
                          <textarea 
                            value={rejectReason} 
                            onChange={(e) => setRejectReason(e.target.value)} 
                            placeholder="Explain why this resource is being rejected..." 
                            rows={3} 
                            style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e7e5e4", fontSize: "0.875rem", fontFamily: "inherit", outline: "none", resize: "vertical" }} 
                          />
                          <button 
                            disabled={!rejectReason.trim()} 
                            onClick={() => handleRejectSubmit(res._id)} 
                            style={{ alignSelf: "flex-end", padding: "0.5rem 1.25rem", fontSize: "0.875rem", fontWeight: 600, backgroundColor: rejectReason.trim() ? "#ef4444" : "#fca5a5", color: "white", border: "none", borderRadius: "0.5rem", cursor: rejectReason.trim() ? "pointer" : "not-allowed" }}
                          >
                            Confirm Rejection
                          </button>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Direct Upload */}
          {activeTab === "upload" && (
            <div style={{ backgroundColor: "white", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", overflow: "hidden" }}>
              <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #f5f5f4", background: "linear-gradient(135deg, #f0f9ff, #ffffff)" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1c1917", margin: 0 }}>Direct Upload (Auto-Approved)</h2>
                <p style={{ color: "#78716c", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>Resources uploaded by admins bypass the approval process.</p>
              </div>

              {successMsg && (
                <div style={{ margin: "1.5rem 2rem 0", padding: "1rem", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "0.5rem", color: "#166534", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>
                  <CheckCircleIcon style={{ width: 18, height: 18 }} /> {successMsg}
                </div>
              )}

              <form onSubmit={handleUpload} style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c" }}>Title <span style={{ color: "#ef4444" }}>*</span></label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter resource title..." style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e7e5e4", backgroundColor: "#fafaf9", outline: "none", fontSize: "0.875rem", color: "#1c1917" }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c" }}>Description <span style={{ color: "#ef4444" }}>*</span></label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe this resource..." rows={4} style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e7e5e4", backgroundColor: "#fafaf9", outline: "none", fontSize: "0.875rem", color: "#1c1917", resize: "vertical", fontFamily: "inherit" }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c" }}>File <span style={{ color: "#ef4444" }}>*</span></label>
                  <div style={{ border: "2px dashed #d6d3d1", borderRadius: "0.75rem", padding: "2rem", textAlign: "center", backgroundColor: "#fafaf9", cursor: "pointer", transition: "all 0.2s" }} onClick={() => document.getElementById("admin-resource-file").click()}>
                    <UploadCloudIcon style={{ width: 36, height: 36, color: "#a8a29e", margin: "0 auto 0.75rem" }} />
                    <p style={{ margin: 0, fontSize: "0.875rem", color: "#57534e", fontWeight: 500 }}>{file ? file.name : "Click to select a file"}</p>
                    <input id="admin-resource-file" type="file" style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
                  </div>
                </div>

                <div style={{ paddingTop: "0.5rem", borderTop: "1px solid #f5f5f4", display: "flex", justifyContent: "flex-end" }}>
                  <button type="submit" disabled={uploading} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 2rem", backgroundColor: uploading ? "#93c5fd" : "#0ea5e9", color: "white", borderRadius: "0.5rem", fontWeight: 600, fontSize: "0.875rem", border: "none", cursor: uploading ? "not-allowed" : "pointer" }}>
                    <UploadCloudIcon style={{ width: 18, height: 18 }} />
                    {uploading ? "Uploading..." : "Publish Resource"}
                  </button>
                </div>
              </form>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}