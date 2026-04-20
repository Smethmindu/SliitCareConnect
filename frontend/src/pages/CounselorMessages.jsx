import { useState, useEffect, useRef, useCallback } from "react";
import {
  SearchIcon,
  SendIcon,
  CheckCheckIcon,
  CheckIcon,
  PaperclipIcon,
  PhoneIcon,
  VideoIcon,
  MoreVerticalIcon,
  ArrowLeftIcon,
  MessageSquareIcon,
  CalendarIcon,
  LayoutDashboardIcon,
  BellIcon,
  LogOutIcon,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API = "http://localhost:3000/api/messages";

function getAuthHeaders() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function getCurrentUser() {
  const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function formatConvTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  const oneDay = 86400000;
  if (diff < oneDay && d.getDate() === now.getDate()) return formatTime(dateStr);
  if (diff < 2 * oneDay) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

export function CounselorMessages() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const userId = currentUser?.id;
  const userName = currentUser ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() : "Counselor";
  const userRole = currentUser?.role || "counselor";

  // Counselor layout helpers
  let validName = currentUser?.firstName
    ? `${currentUser.firstName} ${currentUser.lastName || ""}`.trim()
    : currentUser?.name;
  if (!validName || validName === "undefined undefined" || validName === "undefined") validName = "Counselor";
  const displayName = validName;
  const userInitials = displayName !== "Counselor" && displayName.length > 0
    ? displayName.split(" ").map((n) => n.charAt(0)).join("").substring(0, 2).toUpperCase()
    : "C";
  const userRoleStr = currentUser?.role
    ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)
    : "Counselor";

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { icon: LayoutDashboardIcon, label: "Dashboard", path: "/counselor-dashboard" },
    { icon: CalendarIcon, label: "Appointments", path: "/counselor-appointments" },
    { icon: MessageSquareIcon, label: "Messages", path: "/counselor-messages" },
  ];

  // ─── Messaging state ───
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);

  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  const fetchConversations = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API}/conversations/${userId}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setConversations(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoadingConvs(false);
    }
  }, [userId]);

  const fetchMessages = useCallback(async (convId) => {
    if (!convId) return;
    try {
      const res = await fetch(`${API}/${convId}/messages`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  }, []);

  const markRead = useCallback(async (convId) => {
    if (!convId || !userId) return;
    try {
      await fetch(`${API}/read/${convId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId }),
      });
    } catch (err) {
      console.error("Error marking read:", err);
    }
  }, [userId]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  useEffect(() => {
    pollRef.current = setInterval(() => {
      fetchConversations();
      if (activeConv) fetchMessages(activeConv._id);
    }, 3000);
    return () => clearInterval(pollRef.current);
  }, [fetchConversations, fetchMessages, activeConv]);

  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv._id);
      markRead(activeConv._id);
    }
  }, [activeConv, fetchMessages, markRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;
    const text = newMessage.trim();
    setNewMessage("");

    const optimistic = {
      _id: "temp-" + Date.now(),
      conversationId: activeConv._id,
      senderId: userId,
      senderName: userName,
      senderRole: userRole,
      text,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      await fetch(`${API}/send`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          conversationId: activeConv._id,
          senderId: userId,
          senderName: userName,
          senderRole: userRole,
          text,
        }),
      });
      fetchMessages(activeConv._id);
      fetchConversations();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const getOtherParticipant = (conv) => {
    if (!conv?.participants) return { name: "Unknown", avatar: "", role: "" };
    const other = conv.participants.find((p) => p.userId !== userId);
    return other || conv.participants[0] || { name: "Unknown", avatar: "", role: "" };
  };

  const filteredConvs = conversations.filter((conv) => {
    const other = getOtherParticipant(conv);
    return other.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // ─── Render ───
  return (
    <div style={{ height: "100vh", backgroundColor: "#fdfbf7", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <header style={{ flexShrink: 0, width: "100%", backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #f5f5f4" }}>
        <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "0 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", height: "4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
              <div style={{ backgroundColor: "#f0f9ff", padding: "0.5rem", borderRadius: "0.75rem" }}>
                <img src="/logo.png" alt="Logo" style={{ height: "2.5rem", width: "auto", objectFit: "contain" }} />
              </div>
              <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "#292524", letterSpacing: "-0.025em" }}>
                SliitCare<span style={{ color: "#0ea5e9" }}>Connect</span>
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button style={{ padding: "0.5rem", color: "#a8a29e", background: "none", border: "none", position: "relative", cursor: "pointer" }}>
              <BellIcon style={{ height: "1.25rem", width: "1.25rem" }} />
              <span style={{ position: "absolute", top: "0.375rem", right: "0.375rem", height: "0.5rem", width: "0.5rem", backgroundColor: "#f87171", borderRadius: "50%", border: "2px solid white" }} />
            </button>
            <div style={{ height: "2rem", width: "1px", backgroundColor: "#e7e5e4", margin: "0 0.25rem" }} />
            <Link to="/settings" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "#44403c", margin: 0 }}>{displayName}</p>
                <p style={{ fontSize: "0.75rem", color: "#78716c", margin: 0 }}>{userRoleStr}</p>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: "2rem", width: "2rem", borderRadius: "50%", backgroundColor: "#e7e5e4", color: "#57534e", fontSize: "0.875rem", fontWeight: "bold" }}>{userInitials}</div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div style={{ display: "flex", flex: 1, maxWidth: "1600px", width: "100%", margin: "0 auto", overflow: "hidden" }}>
        {/* Sidebar */}
        <aside style={{ width: "16rem", backgroundColor: "white", borderRight: "1px solid #f5f5f4", flexShrink: 0, display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <div style={{ padding: "1.5rem", flex: 1 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#a8a29e", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>Menu</div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link key={item.path} to={item.path} style={{
                    display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.625rem 0.75rem",
                    borderRadius: "0.75rem", fontSize: "0.875rem", fontWeight: 500, textDecoration: "none",
                    transition: "all 0.3s",
                    ...(isActive ? { backgroundColor: "#f0f9ff", color: "#0369a1" } : { color: "#57534e" }),
                  }}>
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

        {/* Messages Content */}
        <main style={{ flex: 1, padding: "2rem", overflowY: "auto", overflowX: "hidden", minWidth: 0 }}>
          <div style={{ maxWidth: "64rem", margin: "0 auto", height: "calc(100vh - 8rem)" }}>
            <div style={{
              height: "100%", display: "flex", backgroundColor: "white", borderRadius: "1rem",
              border: "1px solid #e7e5e4", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)", overflow: "hidden",
            }}>
              {/* Conversation List */}
              <div style={{ width: "20rem", borderRight: "1px solid #e7e5e4", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "1rem", borderBottom: "1px solid #e7e5e4" }}>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1c1917", marginBottom: "1rem", marginTop: 0 }}>Messages</h2>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", inset: "0 0 0 0.75rem", display: "flex", alignItems: "center", pointerEvents: "none" }}>
                      <SearchIcon style={{ height: "1.25rem", width: "1.25rem", color: "#a8a29e" }} />
                    </div>
                    <input
                      type="text" placeholder="Search conversations..." value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.5rem", borderRadius: "0.5rem", backgroundColor: "#fafaf9", border: "1px solid #e7e5e4", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {loadingConvs ? (
                    <p style={{ padding: "2rem", textAlign: "center", color: "#78716c", fontSize: "0.875rem" }}>Loading...</p>
                  ) : filteredConvs.length === 0 ? (
                    <p style={{ padding: "2rem", textAlign: "center", color: "#78716c", fontSize: "0.875rem", fontStyle: "italic" }}>No conversations yet.</p>
                  ) : (
                    filteredConvs.map((conv) => {
                      const other = getOtherParticipant(conv);
                      const avatarUrl = other.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(other.name)}&background=e0f2fe&color=0284c7`;
                      return (
                        <div key={conv._id} onClick={() => setActiveConv(conv)} style={{
                          display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", cursor: "pointer",
                          borderBottom: "1px solid #f5f5f4",
                          ...(activeConv?._id === conv._id ? { backgroundColor: "#f0f9ff" } : { backgroundColor: "white" }),
                        }}>
                          <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                            <img src={avatarUrl} alt={other.name} style={{ height: "100%", width: "100%", objectFit: "cover" }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.125rem" }}>
                              <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1c1917", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0 }}>{other.name}</h3>
                              <span style={{ fontSize: "0.7rem", color: "#a8a29e", whiteSpace: "nowrap", marginLeft: "0.5rem" }}>{formatConvTime(conv.lastMessageAt)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <p style={{ fontSize: "0.8rem", color: conv.unreadCount ? "#292524" : "#78716c", fontWeight: conv.unreadCount ? 500 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0 }}>
                                {conv.lastMessage || "Start a conversation..."}
                              </p>
                              {conv.unreadCount > 0 && (
                                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: "1.25rem", minWidth: "1.25rem", borderRadius: "9999px", fontSize: "0.625rem", fontWeight: "bold", backgroundColor: "#0ea5e9", color: "white", marginLeft: "0.5rem", padding: "0 0.25rem" }}>
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Chat Area */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#fafaf9" }}>
                {activeConv ? (
                  <>
                    {/* Chat Header */}
                    {(() => {
                      const other = getOtherParticipant(activeConv);
                      const avatarUrl = other.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(other.name)}&background=e0f2fe&color=0284c7`;
                      return (
                        <div style={{ padding: "1rem", borderBottom: "1px solid #e7e5e4", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                              <img src={avatarUrl} alt="Avatar" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
                            </div>
                            <div>
                              <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#1c1917", margin: "0 0 0.125rem 0" }}>{other.name}</h3>
                              <p style={{ fontSize: "0.75rem", color: "#16a34a", margin: 0 }}>Student</p>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            {[PhoneIcon, VideoIcon, MoreVerticalIcon].map((Icon, i) => (
                              <button key={i} style={{ padding: "0.5rem", color: "#78716c", background: "none", border: "none", cursor: "pointer", borderRadius: "0.375rem" }}>
                                <Icon style={{ height: "1.25rem", width: "1.25rem" }} />
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {messages.length === 0 ? (
                        <div style={{ textAlign: "center", color: "#a8a29e", padding: "3rem 1rem", fontStyle: "italic" }}>No messages yet. Say hello! 👋</div>
                      ) : (
                        messages.map((msg) => {
                          const isOwn = msg.senderId === userId;
                          const other = getOtherParticipant(activeConv);
                          const av = other.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(other.name)}&background=e0f2fe&color=0284c7&size=32`;
                          return (
                            <div key={msg._id} style={{ display: "flex", flexDirection: "column", alignItems: isOwn ? "flex-end" : "flex-start" }}>
                              <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", maxWidth: "75%", flexDirection: isOwn ? "row-reverse" : "row" }}>
                                {!isOwn && (
                                  <div style={{ width: "1.5rem", height: "1.5rem", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                                    <img src={av} alt="Avatar" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
                                  </div>
                                )}
                                <div style={{
                                  padding: "0.75rem 1rem", borderRadius: "1rem", fontSize: "0.9375rem", lineHeight: 1.5,
                                  ...(isOwn
                                    ? { backgroundColor: "#0ea5e9", color: "white", borderBottomRightRadius: "0.25rem" }
                                    : { backgroundColor: "white", color: "#292524", border: "1px solid #e7e5e4", borderBottomLeftRadius: "0.25rem" }),
                                }}>
                                  {msg.text}
                                </div>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.25rem", ...(isOwn ? { marginRight: "0.5rem" } : { marginLeft: "2rem" }) }}>
                                <span style={{ fontSize: "0.625rem", color: "#a8a29e" }}>{formatTime(msg.createdAt)}</span>
                                {isOwn && (msg.read
                                  ? <CheckCheckIcon style={{ height: "0.75rem", width: "0.75rem", color: "#0ea5e9" }} />
                                  : <CheckIcon style={{ height: "0.75rem", width: "0.75rem", color: "#a8a29e" }} />
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div style={{ padding: "1rem", backgroundColor: "white", borderTop: "1px solid #e7e5e4" }}>
                      <form onSubmit={handleSend} style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
                        <button type="button" style={{ padding: "0.5rem", color: "#a8a29e", background: "none", border: "none", cursor: "pointer", borderRadius: "9999px", marginBottom: "0.25rem" }}>
                          <PaperclipIcon style={{ height: "1.25rem", width: "1.25rem" }} />
                        </button>
                        <div style={{ flex: 1, backgroundColor: "#fafaf9", borderRadius: "1.25rem", border: "1px solid #e7e5e4", display: "flex", alignItems: "flex-end", padding: "0.25rem 0.5rem", minHeight: "2.75rem" }}>
                          <textarea
                            value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..." rows={1}
                            style={{ flex: 1, backgroundColor: "transparent", border: "none", color: "#292524", fontSize: "0.9375rem", resize: "none", outline: "none", padding: "0.5rem", maxHeight: "120px", fontFamily: "inherit" }}
                            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                          />
                        </div>
                        <button type="submit" disabled={!newMessage.trim()} style={{
                          padding: "0.75rem", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center",
                          border: "none", cursor: newMessage.trim() ? "pointer" : "not-allowed", transition: "all 0.2s",
                          ...(newMessage.trim() ? { backgroundColor: "#0ea5e9", color: "white" } : { backgroundColor: "#f5f5f4", color: "#d6d3d1" }),
                        }}>
                          <SendIcon style={{ height: "1.25rem", width: "1.25rem" }} />
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#a8a29e", padding: "2rem", textAlign: "center" }}>
                    <div style={{ backgroundColor: "#f5f5f4", borderRadius: "50%", padding: "1.5rem", marginBottom: "1rem" }}>
                      <MessageSquareIcon style={{ height: "3rem", width: "3rem", color: "#d6d3d1" }} />
                    </div>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: 500, color: "#57534e", margin: "0 0 0.5rem 0" }}>Your Messages</h3>
                    <p style={{ fontSize: "0.875rem", margin: 0 }}>Select a conversation to start chatting with a student.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
