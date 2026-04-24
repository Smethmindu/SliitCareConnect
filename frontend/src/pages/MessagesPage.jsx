/**
 * MEMBER 1: Auth & User Management (Student Messaging)
 * STUDENT MESSAGES PAGE
 * This component allows students to chat with counselors or other staff.
 * It features real-time-like updates via 3-second polling and an optimistic UI.
 */
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
} from "lucide-react";

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

export function MessagesPage() {
  const user = getCurrentUser();
  const userId = user?.id;
  const userName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Student";
  const userRole = user?.role || "student";

  // --- MESSAGING STATE ---
  const [conversations, setConversations] = useState([]); // All active chats for the student
  const [activeConv, setActiveConv] = useState(null); // The chat currently open
  const [messages, setMessages] = useState([]); // List of messages in the open chat
  const [newMessage, setNewMessage] = useState(""); // Input field state
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);

  const messagesEndRef = useRef(null); // Used for auto-scrolling to latest message
  const pollRef = useRef(null); // Interval ID for polling

  // Fetch conversations
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

  // Fetch messages for active conversation
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

  // Mark as read
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

  // Initial load
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Polling for new data
  /**
   * POLLING SYSTEM (Real-time Simulation)
   * This application uses a polling architecture rather than WebSockets.
   * Every 3 seconds, it re-fetches data. This ensures the student 
   * sees new counselor replies even if they don't refresh the page, 
   * and handles multi-device synchronization (syncing read counts).
   */
  useEffect(() => {
    pollRef.current = setInterval(() => {
      fetchConversations();
      if (activeConv) {
        fetchMessages(activeConv._id);
      }
    }, 3000);
    return () => clearInterval(pollRef.current);
  }, [fetchConversations, fetchMessages, activeConv]);

  // When active conversation changes
  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv._id);
      markRead(activeConv._id);
    }
  }, [activeConv, fetchMessages, markRead]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectConv = (conv) => {
    setActiveConv(conv);
  };

  /**
   * HANDLE SEND
   * 1. Updates the UI with the new message immediately (Optimistic).
   * 2. Saves to database via API.
   * 3. Triggers a refresh to confirm delivery.
   */
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;

    const text = newMessage.trim();
    setNewMessage("");

    // --- OPTIMISTIC UI ---
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
      // Refresh to confirm delivery
      fetchMessages(activeConv._id);
      fetchConversations();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Get the "other" participant for display
  const getOtherParticipant = (conv) => {
    if (!conv?.participants) return { name: "Unknown", avatar: "", role: "" };
    const other = conv.participants.find((p) => p.userId !== userId);
    return other || conv.participants[0] || { name: "Unknown", avatar: "", role: "" };
  };

  const filteredConvs = conversations.filter((conv) => {
    const other = getOtherParticipant(conv);
    return other.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!userId) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#78716c" }}>
        Please log in to view your messages.
      </div>
    );
  }

  return (
    <div
      style={{
        height: "calc(100vh - 8rem)",
        display: "flex",
        backgroundColor: "white",
        borderRadius: "1rem",
        border: "1px solid #e7e5e4",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        overflow: "hidden",
      }}
    >
      {/* Sidebar List */}
      <div
        style={{
          width: window.innerWidth < 768 ? "100%" : "24rem",
          borderRight: window.innerWidth < 768 ? "none" : "1px solid #e7e5e4",
          display: window.innerWidth < 768 && activeConv ? "none" : "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "1rem", borderBottom: "1px solid #e7e5e4" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1c1917", marginBottom: "1rem", marginTop: 0 }}>
            Messages
          </h2>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: "0 0 0 0.75rem", display: "flex", alignItems: "center", pointerEvents: "none" }}>
              <SearchIcon style={{ height: "1.25rem", width: "1.25rem", color: "#a8a29e" }} />
            </div>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%", padding: "0.5rem 1rem 0.5rem 2.5rem", borderRadius: "0.5rem",
                backgroundColor: "#fafaf9", border: "1px solid #e7e5e4", fontSize: "0.875rem",
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {loadingConvs ? (
            <p style={{ padding: "2rem", textAlign: "center", color: "#78716c", fontSize: "0.875rem" }}>Loading...</p>
          ) : filteredConvs.length === 0 ? (
            <p style={{ padding: "2rem", textAlign: "center", color: "#78716c", fontSize: "0.875rem", fontStyle: "italic" }}>
              No conversations yet.
            </p>
          ) : (
            filteredConvs.map((conv) => {
              const other = getOtherParticipant(conv);
              const avatarUrl = other.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(other.name)}&background=e0f2fe&color=0284c7`;
              return (
                <div
                  key={conv._id}
                  onClick={() => handleSelectConv(conv)}
                  style={{
                    display: "flex", alignItems: "center", gap: "1rem", padding: "1rem",
                    cursor: "pointer", transition: "background-color 0.2s", borderBottom: "1px solid #f5f5f4",
                    ...(activeConv?._id === conv._id ? { backgroundColor: "#f0f9ff" } : { backgroundColor: "white" }),
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <div style={{
                      position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center",
                      height: "3rem", width: "3rem", borderRadius: "50%", backgroundColor: "#e7e5e4",
                      overflow: "hidden", flexShrink: 0,
                    }}>
                      <img src={avatarUrl} alt={other.name} style={{ height: "100%", width: "100%", objectFit: "cover" }} />
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.125rem" }}>
                      <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1c1917", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0 }}>
                        {other.name}
                      </h3>
                      <span style={{ fontSize: "0.75rem", color: "#a8a29e", whiteSpace: "nowrap", marginLeft: "0.5rem" }}>
                        {formatConvTime(conv.lastMessageAt)}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{
                        fontSize: "0.875rem", color: conv.unreadCount ? "#292524" : "#78716c",
                        fontWeight: conv.unreadCount ? 500 : 400, whiteSpace: "nowrap", overflow: "hidden",
                        textOverflow: "ellipsis", margin: 0,
                      }}>
                        {conv.lastMessage || "Start a conversation..."}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          height: "1.25rem", minWidth: "1.25rem", borderRadius: "9999px", fontSize: "0.625rem",
                          fontWeight: "bold", backgroundColor: "#0ea5e9", color: "white", marginLeft: "0.5rem",
                          padding: "0 0.25rem",
                        }}>
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

      {/* Main Chat Area */}
      <div
        style={{
          flex: 1,
          display: window.innerWidth < 768 && !activeConv ? "none" : "flex",
          flexDirection: "column",
          backgroundColor: "#fafaf9",
        }}
      >
        {activeConv ? (
          <>
            {/* Chat Header */}
            {(() => {
              const other = getOtherParticipant(activeConv);
              const avatarUrl = other.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(other.name)}&background=e0f2fe&color=0284c7`;
              return (
                <div style={{ padding: "1rem", borderBottom: "1px solid #e7e5e4", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    {window.innerWidth < 768 && (
                      <button onClick={() => setActiveConv(null)} style={{ padding: "0.5rem", marginRight: "-0.5rem", background: "none", border: "none", cursor: "pointer", color: "#78716c" }}>
                        <ArrowLeftIcon style={{ height: "1.25rem", width: "1.25rem" }} />
                      </button>
                    )}
                    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", height: "2.5rem", width: "2.5rem", borderRadius: "50%", backgroundColor: "#e7e5e4", overflow: "hidden", flexShrink: 0 }}>
                      <img src={avatarUrl} alt="Avatar" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#1c1917", margin: "0 0 0.125rem 0" }}>{other.name}</h3>
                      <p style={{ fontSize: "0.75rem", color: "#16a34a", margin: 0 }}>
                        {other.role === "counselor" ? "Counselor" : "Student"}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button style={{ padding: "0.5rem", color: "#78716c", background: "none", border: "none", cursor: "pointer", borderRadius: "0.375rem" }}>
                      <PhoneIcon style={{ height: "1.25rem", width: "1.25rem" }} />
                    </button>
                    <button style={{ padding: "0.5rem", color: "#78716c", background: "none", border: "none", cursor: "pointer", borderRadius: "0.375rem" }}>
                      <VideoIcon style={{ height: "1.25rem", width: "1.25rem" }} />
                    </button>
                    <button style={{ padding: "0.5rem", color: "#78716c", background: "none", border: "none", cursor: "pointer", borderRadius: "0.375rem" }}>
                      <MoreVerticalIcon style={{ height: "1.25rem", width: "1.25rem" }} />
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: "center", color: "#a8a29e", padding: "3rem 1rem", fontStyle: "italic" }}>
                  No messages yet. Say hello! 👋
                </div>
              ) : (
                <>
                  <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "#a8a29e", backgroundColor: "white", padding: "0.25rem 0.75rem", borderRadius: "9999px", border: "1px solid #f5f5f4" }}>
                      Messages
                    </span>
                  </div>
                  {messages.map((msg) => {
                    const isOwn = msg.senderId === userId;
                    return (
                      <div key={msg._id} style={{ display: "flex", flexDirection: "column", alignItems: isOwn ? "flex-end" : "flex-start" }}>
                        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", maxWidth: "75%", flexDirection: isOwn ? "row-reverse" : "row" }}>
                          {!isOwn && (
                            <div style={{
                              position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center",
                              height: "1.5rem", width: "1.5rem", borderRadius: "50%", backgroundColor: "#e7e5e4",
                              overflow: "hidden", flexShrink: 0,
                            }}>
                              {(() => {
                                const other = getOtherParticipant(activeConv);
                                const av = other.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(other.name)}&background=e0f2fe&color=0284c7&size=32`;
                                return <img src={av} alt="Avatar" style={{ height: "100%", width: "100%", objectFit: "cover" }} />;
                              })()}
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
                        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.25rem", ...(isOwn ? { marginRight: "2rem" } : { marginLeft: "2rem" }) }}>
                          <span style={{ fontSize: "0.625rem", color: "#a8a29e" }}>{formatTime(msg.createdAt)}</span>
                          {isOwn && (msg.read ? (
                            <CheckCheckIcon style={{ height: "0.75rem", width: "0.75rem", color: "#0ea5e9" }} />
                          ) : (
                            <CheckIcon style={{ height: "0.75rem", width: "0.75rem", color: "#a8a29e" }} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: "1rem", backgroundColor: "white", borderTop: "1px solid #e7e5e4" }}>
              <form onSubmit={handleSend} style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
                <button type="button" style={{ padding: "0.5rem", color: "#a8a29e", background: "none", border: "none", cursor: "pointer", borderRadius: "9999px", marginBottom: "0.25rem" }}>
                  <PaperclipIcon style={{ height: "1.25rem", width: "1.25rem" }} />
                </button>
                <div style={{ flex: 1, backgroundColor: "#fafaf9", borderRadius: "1.25rem", border: "1px solid #e7e5e4", display: "flex", alignItems: "flex-end", padding: "0.25rem 0.5rem", minHeight: "2.75rem" }}>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    rows={1}
                    style={{ flex: 1, backgroundColor: "transparent", border: "none", color: "#292524", fontSize: "0.9375rem", resize: "none", outline: "none", padding: "0.5rem", maxHeight: "120px", fontFamily: "inherit" }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e); }
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  style={{
                    padding: "0.75rem", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center",
                    border: "none", cursor: newMessage.trim() ? "pointer" : "not-allowed", transition: "all 0.2s",
                    ...(newMessage.trim() ? { backgroundColor: "#0ea5e9", color: "white" } : { backgroundColor: "#f5f5f4", color: "#d6d3d1" }),
                  }}
                >
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
            <p style={{ fontSize: "0.875rem", margin: 0 }}>Select a conversation from the list to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
