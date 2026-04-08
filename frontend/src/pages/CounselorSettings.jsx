import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboardIcon,
  CalendarIcon,
  MessageSquareIcon,
  LogOutIcon,
  LeafIcon,
  BellIcon,
  UserIcon,
  MailIcon,
  CameraIcon,
  GraduationCapIcon,
  AwardIcon,
  SaveIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  Edit2Icon,
} from "lucide-react";

export function CounselorSettings() {
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);

  const navItems = [
    { icon: LayoutDashboardIcon, label: "Dashboard", path: "/counselor-dashboard" },
    { icon: CalendarIcon, label: "Appointments", path: "/counselor-appointments" },
    { icon: MessageSquareIcon, label: "Messages", path: "/counselor-messages" },
  ];

  const [formData, setFormData] = useState({
    firstName: "Emily",
    lastName: "Chen",
    email: "emily.chen@sliitcare.com",
    dob: "1985-06-15",
    speciality: "Clinical Psychologist",
    specialitiesTags: "Anxiety, Depression, Mindfulness",
    bio: "I am a licensed clinical psychologist with over 10 years of experience helping university students navigate academic stress, anxiety, and personal growth transitions.",
    education: "Ph.D. in Clinical Psychology, Stanford University",
    credentials: "State Licensed Psychologist (#PSY12345), Certified Cognitive Behavioral Therapist",
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const validateField = (name, value) => {
    let error = null;
    switch (name) {
      case "firstName":
        if (!value.trim()) error = "First name is required.";
        else if (!/^[a-zA-Z\s-]*$/.test(value)) error = "First name can only contain letters.";
        break;
      case "lastName":
        if (!value.trim()) error = "Last name is required.";
        else if (!/^[a-zA-Z\s-]*$/.test(value)) error = "Last name can only contain letters.";
        break;
      case "email":
        if (!value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "A valid email address is required.";
        break;
      case "dob":
        if (!value) error = "Date of Birth is required.";
        else {
          const today = new Date();
          const birthDate = new Date(value);
          let age = today.getFullYear() - birthDate.getFullYear();
          if (age < 18) error = "Counselor must be at least 18 years old.";
          if (birthDate > today) error = "Date of Birth cannot be in the future.";
        }
        break;
      case "speciality":
        if (!value.trim()) error = "Primary role/speciality is required.";
        else if (value.trim().length < 5) error = "Speciality title is too short.";
        break;
      case "bio":
        if (!value.trim() || value.length < 20) error = "Bio must be at least 20 characters long.";
        break;
      default:
        break;
    }
    return error;
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Aggressive real-time validation 'bothering' the user while typing
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    setSuccessMsg("");
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateAll()) {
      // Simulate API call
      setTimeout(() => {
        setSuccessMsg("Your profile has been successfully updated.");
        setIsEditing(false);
        setTimeout(() => setSuccessMsg(""), 4000); // fade out
      }, 500);
    }
  };

  return (
    <div style={{ height: "100vh", backgroundColor: "#fdfbf7", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <header style={{ flexShrink: 0, width: "100%", backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #f5f5f4" }}>
        <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "0 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", height: "4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
              <div style={{ backgroundColor: "#f0f9ff", padding: "0.5rem", borderRadius: "0.75rem" }}>
                <img src="/logo.png" alt="Logo" style={{ height: "2.5rem", width: "auto", objectFit: "contain" }} />
              </div>
              <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "#292524", letterSpacing: "-0.025em" }}>
                SliitCare<span style={{ color: "#0ea5e9" }}>Connect</span>
              </span>
            </Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button style={{ padding: "0.5rem", color: "#a8a29e", background: "none", border: "none", position: "relative", cursor: "pointer" }}>
              <BellIcon style={{ height: "1.25rem", width: "1.25rem" }} />
              <span style={{ position: "absolute", top: "0.375rem", right: "0.375rem", height: "0.5rem", width: "0.5rem", backgroundColor: "#f87171", borderRadius: "50%", border: "2px solid white" }}></span>
            </button>
            <div style={{ height: "2rem", width: "1px", backgroundColor: "#e7e5e4", margin: "0 0.25rem" }}></div>
            <Link to="/counselor-settings" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c", margin: 0 }}>Dr. {formData.firstName} {formData.lastName}</p>
                <p style={{ fontSize: "0.75rem", color: "#78716c", margin: 0 }}>Counselor</p>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: "2rem", width: "2rem", borderRadius: "50%", backgroundColor: "#e0f2fe", color: "#0369a1", fontSize: "0.875rem", fontWeight: "bold", border: "1px solid #bae6fd" }}>
                {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Layout Area Wrapper */}
      <div style={{ display: "flex", flex: 1, maxWidth: "1600px", width: "100%", margin: "0 auto", overflow: "hidden" }}>
        
        {/* Sidebar */}
        <aside style={{ width: "16rem", backgroundColor: "white", borderRight: "1px solid #f5f5f4", flexShrink: 0, display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <div style={{ padding: "1.5rem", flex: 1 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#a8a29e", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>Menu</div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.625rem 0.75rem",
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      textDecoration: "none",
                      transition: "all 0.3s",
                      ...(isActive ? { backgroundColor: "#f0f9ff", color: "#0369a1" } : { color: "#57534e" }),
                    }}
                  >
                    <item.icon style={{ height: "1.25rem", width: "1.25rem", ...(isActive ? { color: "#0284c7" } : { color: "#a8a29e" }) }} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div style={{ padding: "1.5rem", borderTop: "1px solid #f5f5f4" }}>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.625rem 0.75rem", borderRadius: "0.75rem", fontSize: "0.875rem", fontWeight: 500, color: "#dc2626", textDecoration: "none" }}>
                <LogOutIcon style={{ height: "1.25rem", width: "1.25rem", color: "#f87171" }} />
                Log out
              </Link>
            </nav>
          </div>
        </aside>

        {/* Dynamic Inner Content */}
        <main style={{ flex: 1, padding: "2rem", overflowY: "auto", overflowX: "hidden", minWidth: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            style={{
              maxWidth: "56rem",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              paddingBottom: "3rem",
            }}
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
                Profile Settings
              </h1>
              <p style={{ color: "#78716c", margin: 0 }}>
                Update your professional information and public visibility.
              </p>
            </div>

            <div style={{ backgroundColor: "white", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", overflow: "hidden" }}>
              
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "2rem", borderBottom: "1px solid #f5f5f4" }}>
                <div style={{ position: "relative" }}>
                   <div style={{ height: "6rem", width: "6rem", borderRadius: "50%", backgroundColor: "#e7e5e4", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                     <img src="https://i.pravatar.cc/150?u=emily" alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                   </div>
                   <button style={{ position: "absolute", bottom: 0, right: 0, height: "2rem", width: "2rem", borderRadius: "50%", backgroundColor: "white", border: "1px solid #e7e5e4", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#57534e", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                      <CameraIcon style={{ width: "1rem", height: "1rem" }} />
                   </button>
                </div>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1c1917", margin: "0 0 0.25rem 0" }}>Profile Picture</h2>
                  <p style={{ color: "#78716c", fontSize: "0.875rem", margin: 0 }}>PNG, JPG or WEBP under 5MB</p>
                </div>
              </div>

              {/* Toggle View vs Edit Modes */}
              {successMsg && !isEditing && (
                <div style={{ padding: "0 2rem" }}>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ padding: "1rem", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "0.5rem", color: "#166534", display: "flex", alignItems: "center", gap: "0.5rem" }}
                  >
                    <CheckCircleIcon style={{ width: "1.25rem", height: "1.25rem" }} />
                    <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{successMsg}</span>
                  </motion.div>
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleSubmit} style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                
                <AnimatePresence>
                  {successMsg && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      style={{ padding: "1rem", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "0.5rem", color: "#166534", display: "flex", alignItems: "center", gap: "0.5rem" }}
                    >
                      <CheckCircleIcon style={{ width: "1.25rem", height: "1.25rem" }} />
                      <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{successMsg}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#1c1917", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <UserIcon style={{ width: "1.25rem", height: "1.25rem", color: "#0ea5e9" }} /> Personal Details
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c" }}>First Name <span style={{color: "#ef4444"}}>*</span></label>
                    <input name="firstName" value={formData.firstName} onChange={handleChange} onBlur={handleBlur} style={{ padding: "0.75rem", borderRadius: "0.5rem", border: `1px solid ${errors.firstName ? '#ef4444' : '#e7e5e4'}`, backgroundColor: "#fafaf9", outline: "none", fontSize: "0.875rem", color: "#1c1917" }} />
                    {errors.firstName && <span style={{ color: "#ef4444", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}><AlertCircleIcon style={{width: "0.75rem", height: "0.75rem"}}/> {errors.firstName}</span>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c" }}>Last Name <span style={{color: "#ef4444"}}>*</span></label>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} onBlur={handleBlur} style={{ padding: "0.75rem", borderRadius: "0.5rem", border: `1px solid ${errors.lastName ? '#ef4444' : '#e7e5e4'}`, backgroundColor: "#fafaf9", outline: "none", fontSize: "0.875rem", color: "#1c1917" }} />
                    {errors.lastName && <span style={{ color: "#ef4444", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}><AlertCircleIcon style={{width: "0.75rem", height: "0.75rem"}}/> {errors.lastName}</span>}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c" }}>Email Address <span style={{color: "#ef4444"}}>*</span></label>
                    <div style={{ position: "relative" }}>
                       <MailIcon style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", width: "1rem", height: "1rem", color: "#a8a29e" }} />
                       <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} style={{ width: "100%", boxSizing: "border-box", padding: "0.75rem 0.75rem 0.75rem 2.5rem", borderRadius: "0.5rem", border: `1px solid ${errors.email ? '#ef4444' : '#e7e5e4'}`, backgroundColor: "#fafaf9", outline: "none", fontSize: "0.875rem", color: "#1c1917" }} />
                    </div>
                    {errors.email && <span style={{ color: "#ef4444", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}><AlertCircleIcon style={{width: "0.75rem", height: "0.75rem"}}/> {errors.email}</span>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c" }}>Date of Birth <span style={{color: "#ef4444"}}>*</span></label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} onBlur={handleBlur} style={{ padding: "0.75rem", borderRadius: "0.5rem", border: `1px solid ${errors.dob ? '#ef4444' : '#e7e5e4'}`, backgroundColor: "#fafaf9", outline: "none", fontSize: "0.875rem", color: "#292524" }} />
                    {errors.dob && <span style={{ color: "#ef4444", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}><AlertCircleIcon style={{width: "0.75rem", height: "0.75rem"}}/> {errors.dob}</span>}
                  </div>
                </div>

                <div style={{ height: "1px", backgroundColor: "#f5f5f4", margin: "1rem 0" }}></div>

                <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#1c1917", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <AwardIcon style={{ width: "1.25rem", height: "1.25rem", color: "#10b981" }} /> Professional Information
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c" }}>Primary Role / Title <span style={{color: "#ef4444"}}>*</span></label>
                  <input name="speciality" value={formData.speciality} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. Clinical Psychologist" style={{ padding: "0.75rem", borderRadius: "0.5rem", border: `1px solid ${errors.speciality ? '#ef4444' : '#e7e5e4'}`, backgroundColor: "#fafaf9", outline: "none", fontSize: "0.875rem", color: "#1c1917" }} />
                  {errors.speciality && <span style={{ color: "#ef4444", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}><AlertCircleIcon style={{width: "0.75rem", height: "0.75rem"}}/> {errors.speciality}</span>}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c" }}>Specialities (Comma Separated)</label>
                  <input name="specialitiesTags" value={formData.specialitiesTags} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. Anxiety, Depression, Academic Stress" style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e7e5e4", backgroundColor: "#fafaf9", outline: "none", fontSize: "0.875rem", color: "#1c1917" }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c" }}>About Me / Bio <span style={{color: "#ef4444"}}>*</span></label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} onBlur={handleBlur} rows={4} style={{ padding: "0.75rem", borderRadius: "0.5rem", border: `1px solid ${errors.bio ? '#ef4444' : '#e7e5e4'}`, backgroundColor: "#fafaf9", outline: "none", fontSize: "0.875rem", color: "#1c1917", resize: "vertical", fontFamily: "inherit" }} />
                  {errors.bio && <span style={{ color: "#ef4444", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}><AlertCircleIcon style={{width: "0.75rem", height: "0.75rem"}}/> {errors.bio}</span>}
                </div>

                <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#1c1917", margin: "1rem 0 0 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <GraduationCapIcon style={{ width: "1.25rem", height: "1.25rem", color: "#8b5cf6" }} /> Education & Credentials
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c" }}>Universities & Degrees</label>
                  <input name="education" value={formData.education} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. Master's in Social Work, UCLA" style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e7e5e4", backgroundColor: "#fafaf9", outline: "none", fontSize: "0.875rem", color: "#1c1917" }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c" }}>Licenses & Certifications</label>
                  <input name="credentials" value={formData.credentials} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. State Licensed Therapist" style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e7e5e4", backgroundColor: "#fafaf9", outline: "none", fontSize: "0.875rem", color: "#1c1917" }} />
                </div>

                <div style={{ marginTop: "1rem", paddingTop: "1.5rem", borderTop: "1px solid #f5f5f4", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                  <button type="button" onClick={() => { setIsEditing(false); setErrors({}); }} style={{ padding: "0.75rem 1.5rem", backgroundColor: "white", color: "#57534e", borderRadius: "0.5rem", fontWeight: 500, fontSize: "0.875rem", border: "1px solid #e7e5e4", cursor: "pointer" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f4'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                    Cancel
                  </button>
                  <button type="submit" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", backgroundColor: "#0ea5e9", color: "white", borderRadius: "0.5rem", fontWeight: 600, fontSize: "0.875rem", border: "none", cursor: "pointer", transition: "background-color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0284c7'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0ea5e9'}>
                    <SaveIcon style={{ width: "1.25rem", height: "1.25rem" }} /> Save Profile
                  </button>
                </div>

              </form>
              ) : (
                <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1c1917", margin: "0 0 0.5rem 0" }}>Personal & Professional Info</h3>
                      <p style={{ color: "#78716c", fontSize: "0.875rem", margin: 0 }}>Review your public-facing details below.</p>
                    </div>
                    <button onClick={() => setIsEditing(true)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "white", color: "#0ea5e9", borderRadius: "0.5rem", fontWeight: 500, fontSize: "0.875rem", border: "1px solid #bae6fd", cursor: "pointer", transition: "all 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                      <Edit2Icon style={{ width: "1rem", height: "1rem" }} /> Edit Profile
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: window.innerWidth < 640 ? "1fr" : "1fr 1fr", gap: "1.5rem" }}>
                    <div>
                      <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#a8a29e", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.25rem 0" }}>Full Name</p>
                      <p style={{ fontSize: "1rem", color: "#292524", fontWeight: 500, margin: 0 }}>Dr. {formData.firstName} {formData.lastName}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#a8a29e", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.25rem 0" }}>Email Address</p>
                      <p style={{ fontSize: "1rem", color: "#292524", fontWeight: 500, margin: 0 }}>{formData.email}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#a8a29e", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.25rem 0" }}>Date of Birth</p>
                      <p style={{ fontSize: "1rem", color: "#292524", fontWeight: 500, margin: 0 }}>{formData.dob}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#a8a29e", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.25rem 0" }}>Primary Role / Title</p>
                      <p style={{ fontSize: "1rem", color: "#292524", fontWeight: 500, margin: 0 }}>{formData.speciality}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#a8a29e", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.5rem 0" }}>Specialities</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {formData.specialitiesTags.split(',').map((tag, idx) => tag.trim() ? <span key={idx} style={{ backgroundColor: "#e0f2fe", color: "#0284c7", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 500 }}>{tag.trim()}</span> : null)}
                    </div>
                  </div>

                  <div>
                    <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#a8a29e", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.5rem 0" }}>About Me / Bio</p>
                    <p style={{ fontSize: "0.875rem", color: "#57534e", lineHeight: 1.6, margin: 0 }}>{formData.bio}</p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: window.innerWidth < 640 ? "1fr" : "1fr 1fr", gap: "1.5rem" }}>
                    <div>
                      <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#a8a29e", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.25rem 0" }}>Education & Degrees</p>
                      <p style={{ fontSize: "0.875rem", color: "#292524", margin: 0 }}>{formData.education}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#a8a29e", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.25rem 0" }}>Licenses & Certifications</p>
                      <p style={{ fontSize: "0.875rem", color: "#292524", margin: 0 }}>{formData.credentials}</p>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
