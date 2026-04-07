import { useState } from "react";
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

const conversations = [
  {
    id: "1",
    name: "Dr. Emily Chen",
    role: "Counselor",
    lastMessage: "That sounds like a great plan. Let's discuss how...",
    time: "10:42 AM",
    unread: 2,
    avatar: "https://i.pravatar.cc/150?u=emily",
    online: true,
  },
  {
    id: "2",
    name: "Wellness Center Admin",
    role: "Support",
    lastMessage: "Your appointment for next Tuesday has been...",
    time: "Yesterday",
    unread: 0,
    avatar: "https://i.pravatar.cc/150?u=admin",
    online: false,
  },
  {
    id: "3",
    name: "Dr. Marcus Rivera",
    role: "Counselor",
    lastMessage: "I have attached the breathing exercises we tal...",
    time: "Tuesday",
    unread: 0,
    avatar: "https://i.pravatar.cc/150?u=marcus",
    online: false,
  },
];

const messages = [
  {
    id: "1",
    senderId: "2",
    text: "Hi Sarah, how have you been feeling since our last session?",
    time: "10:30 AM",
    isOwn: false,
    status: "read",
  },
  {
    id: "2",
    senderId: "me",
    text: "Hi Dr. Chen. I've been trying the mindfulness exercises before bed, and they seem to be helping a bit with the sleep issues.",
    time: "10:35 AM",
    isOwn: true,
    status: "read",
  },
  {
    id: "3",
    senderId: "2",
    text: "That's wonderful to hear! Are you still doing the 5-4-3-2-1 grounding technique when you feel anxious during the day?",
    time: "10:38 AM",
    isOwn: false,
    status: "read",
  },
  {
    id: "4",
    senderId: "me",
    text: "Mostly, yes. But I sometimes forget when I'm in the middle of a stressful class.",
    time: "10:40 AM",
    isOwn: true,
    status: "read",
  },
  {
    id: "5",
    senderId: "2",
    text: "That sounds like a great plan. Let's discuss how we can create smaller, more manageable triggers for the technique during our next session.",
    time: "10:42 AM",
    isOwn: false,
    status: "unread",
  },
];

export function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState(
    conversations[0],
  );
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setNewMessage("");
  };

  return (
    <div
      style={{
        height: "calc(100vh - 8rem)",
        display: "flex",
        backgroundColor: "white",
        borderRadius: "1rem",
        border: "1px solid #e7e5e4",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        overflow: "hidden",
      }}
    >
      {/* Sidebar List */}
      <div
        style={{
          width: window.innerWidth < 768 ? "100%" : "24rem",
          borderRight: window.innerWidth < 768 ? "none" : "1px solid #e7e5e4",
          display:
            window.innerWidth < 768 && activeConversation ? "none" : "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "1rem", borderBottom: "1px solid #e7e5e4" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "#1c1917",
              marginBottom: "1rem",
              marginTop: 0,
            }}
          >
            Messages
          </h2>
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                inset: "0 0 0 0.75rem",
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              <SearchIcon
                style={{
                  height: "1.25rem",
                  width: "1.25rem",
                  color: "#a8a29e",
                }}
              />
            </div>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 1rem 0.5rem 2.5rem",
                borderRadius: "0.5rem",
                backgroundColor: "#fafaf9",
                border: "1px solid #e7e5e4",
                fontSize: "0.875rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveConversation(conv)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem",
                cursor: "pointer",
                transition: "background-color 0.2s",
                borderBottom: "1px solid #f5f5f4",
                ...(activeConversation?.id === conv.id
                  ? { backgroundColor: "#f0f9ff" }
                  : { backgroundColor: "white" }),
              }}
            >
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "3rem",
                    width: "3rem",
                    borderRadius: "50%",
                    backgroundColor: "#e7e5e4",
                    color: "#57534e",
                    fontSize: "1.25rem",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={conv.avatar}
                    alt={conv.name}
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                {conv.online && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      height: "0.75rem",
                      width: "0.75rem",
                      borderRadius: "50%",
                      border: "2px solid white",
                      backgroundColor: "#22c55e",
                    }}
                  />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "0.125rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#1c1917",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      margin: 0,
                    }}
                  >
                    {conv.name}
                  </h3>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#a8a29e",
                      whiteSpace: "nowrap",
                      marginLeft: "0.5rem",
                    }}
                  >
                    {conv.time}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: conv.unread ? "#292524" : "#78716c",
                      fontWeight: conv.unread ? 500 : 400,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      margin: 0,
                    }}
                  >
                    {conv.lastMessage}
                  </p>
                  {conv.unread > 0 && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "1.25rem",
                        width: "1.25rem",
                        borderRadius: "9999px",
                        fontSize: "0.625rem",
                        fontWeight: "bold",
                        backgroundColor: "#0ea5e9",
                        color: "white",
                        marginLeft: "0.5rem",
                      }}
                    >
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div
        style={{
          flex: 1,
          display:
            window.innerWidth < 768 && !activeConversation ? "none" : "flex",
          flexDirection: "column",
          backgroundColor: "#fafaf9",
        }}
      >
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div
              style={{
                padding: "1rem",
                borderBottom: "1px solid #e7e5e4",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                {window.innerWidth < 768 && (
                  <button
                    onClick={() => setActiveConversation(null)}
                    style={{
                      padding: "0.5rem",
                      marginRight: "-0.5rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#78716c",
                    }}
                  >
                    <ArrowLeftIcon
                      style={{ height: "1.25rem", width: "1.25rem" }}
                    />
                  </button>
                )}
                <div
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "2.5rem",
                    width: "2.5rem",
                    borderRadius: "50%",
                    backgroundColor: "#e7e5e4",
                    color: "#57534e",
                    fontSize: "0.875rem",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={activeConversation.avatar}
                    alt="Avatar"
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#1c1917",
                      margin: "0 0 0.125rem 0",
                    }}
                  >
                    {activeConversation.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: activeConversation.online ? "#16a34a" : "#78716c",
                      margin: 0,
                    }}
                  >
                    {activeConversation.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <button
                  style={{
                    padding: "0.5rem",
                    color: "#78716c",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "0.375rem",
                  }}
                >
                  <PhoneIcon style={{ height: "1.25rem", width: "1.25rem" }} />
                </button>
                <button
                  style={{
                    padding: "0.5rem",
                    color: "#78716c",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "0.375rem",
                  }}
                >
                  <VideoIcon style={{ height: "1.25rem", width: "1.25rem" }} />
                </button>
                <button
                  style={{
                    padding: "0.5rem",
                    color: "#78716c",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "0.375rem",
                  }}
                >
                  <MoreVerticalIcon
                    style={{ height: "1.25rem", width: "1.25rem" }}
                  />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#a8a29e",
                    backgroundColor: "white",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    border: "1px solid #f5f5f4",
                  }}
                >
                  Today
                </span>
              </div>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: msg.isOwn ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: "0.5rem",
                      maxWidth: "75%",
                      flexDirection: msg.isOwn ? "row-reverse" : "row",
                    }}
                  >
                    {!msg.isOwn && (
                      <div
                        style={{
                          position: "relative",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "1.5rem",
                          width: "1.5rem",
                          borderRadius: "50%",
                          backgroundColor: "#e7e5e4",
                          color: "#57534e",
                          fontSize: "0.625rem",
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={activeConversation.avatar}
                          alt="Avatar"
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}
                    <div
                      style={{
                        padding: "0.75rem 1rem",
                        borderRadius: "1rem",
                        fontSize: "0.9375rem",
                        lineHeight: 1.5,
                        ...(msg.isOwn
                          ? {
                              backgroundColor: "#0ea5e9",
                              color: "white",
                              borderBottomRightRadius: "0.25rem",
                            }
                          : {
                              backgroundColor: "white",
                              color: "#292524",
                              border: "1px solid #e7e5e4",
                              borderBottomLeftRadius: "0.25rem",
                            }),
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      marginTop: "0.25rem",
                      ...(msg.isOwn
                        ? { marginRight: "2rem" }
                        : { marginLeft: "2rem" }),
                    }}
                  >
                    <span style={{ fontSize: "0.625rem", color: "#a8a29e" }}>
                      {msg.time}
                    </span>
                    {msg.isOwn &&
                      (msg.status === "read" ? (
                        <CheckCheckIcon
                          style={{
                            height: "0.75rem",
                            width: "0.75rem",
                            color: "#0ea5e9",
                          }}
                        />
                      ) : (
                        <CheckIcon
                          style={{
                            height: "0.75rem",
                            width: "0.75rem",
                            color: "#a8a29e",
                          }}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div
              style={{
                padding: "1rem",
                backgroundColor: "white",
                borderTop: "1px solid #e7e5e4",
              }}
            >
              <form
                onSubmit={handleSend}
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "0.5rem",
                }}
              >
                <button
                  type="button"
                  style={{
                    padding: "0.5rem",
                    color: "#a8a29e",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "9999px",
                    transition: "background-color 0.2s",
                    marginBottom: "0.25rem",
                  }}
                >
                  <PaperclipIcon
                    style={{ height: "1.25rem", width: "1.25rem" }}
                  />
                </button>
                <div
                  style={{
                    flex: 1,
                    backgroundColor: "#fafaf9",
                    borderRadius: "1.25rem",
                    border: "1px solid #e7e5e4",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: "0.25rem 0.5rem",
                    minHeight: "2.75rem",
                  }}
                >
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    rows={1}
                    style={{
                      flex: 1,
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#292524",
                      fontSize: "0.9375rem",
                      resize: "none",
                      outline: "none",
                      padding: "0.5rem",
                      maxHeight: "120px",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e);
                      }
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  style={{
                    padding: "0.75rem",
                    borderRadius: "9999px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    cursor: newMessage.trim() ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
                    ...(newMessage.trim()
                      ? { backgroundColor: "#0ea5e9", color: "white" }
                      : { backgroundColor: "#f5f5f4", color: "#d6d3d1" }),
                  }}
                >
                  <SendIcon style={{ height: "1.25rem", width: "1.25rem" }} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#a8a29e",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#f5f5f4",
                borderRadius: "50%",
                padding: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              <MessageSquareIcon
                style={{ height: "3rem", width: "3rem", color: "#d6d3d1" }}
              />
            </div>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: 500,
                color: "#57534e",
                margin: "0 0 0.5rem 0",
              }}
            >
              Your Messages
            </h3>
            <p style={{ fontSize: "0.875rem", margin: 0 }}>
              Select a conversation from the list to start chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
