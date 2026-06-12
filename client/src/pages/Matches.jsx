import { useState, useContext } from "react";
import { AppContext } from "../App";

// Empty arrays - no bots, only real matches from backend
const NEW_MATCHES = [];
const CONVERSATIONS = [];

export default function Matches() {
  const { setCurrentPage } = useContext(AppContext);
  const [selectedChat, setSelectedChat] = useState(null);
  const [activeTab, setActiveTab] = useState("matches");

  if (selectedChat) {
    return <ChatWindow match={selectedChat} onBack={() => setSelectedChat(null)} />;
  }

  return (
    <div className="matches-page">
      <div className="page-header">
        <div className="page-title">Connections</div>
        <div className="page-subtitle">0 unread messages</div>
      </div>

      <div style={{ display: "flex", gap: 8, padding: "0 20px 16px", flexShrink: 0 }}>
        <button
          className={`filter-chip ${activeTab === "matches" ? "active" : ""}`}
          onClick={() => setActiveTab("matches")}
        >
          New Matches (0)
        </button>
        <button
          className={`filter-chip ${activeTab === "messages" ? "active" : ""}`}
          onClick={() => setActiveTab("messages")}
        >
          Messages
        </button>
        <button
          className={`filter-chip ${activeTab === "likes" ? "active" : ""}`}
          onClick={() => setActiveTab("likes")}
        >
          Likes 💖
        </button>
      </div>

      {activeTab === "likes" ? (
        <div className="empty-state">
          <div className="empty-emoji">💖</div>
          <div className="empty-title">People who liked you</div>
          <div className="empty-desc">Swipe right to match instantly with people who already like you!</div>
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap", justifyContent: "center" }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ width: 80, height: 80, borderRadius: 12, overflow: "hidden", position: "relative" }}>
                <div style={{ width: "100%", height: "100%", background: "var(--bg-card)", filter: "blur(4px)" }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🔒</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 8 }}>Always free on Alola!</div>
        </div>
      ) : (
        <>
          <div className="section-label">NEW MATCHES (0)</div>
          <div className="new-matches-row">
            {NEW_MATCHES.length === 0 && (
              <div className="empty-state" style={{ padding: "20px", width: "100%" }}>
                <div className="empty-emoji">💞</div>
                <div className="empty-title">No matches yet</div>
                <div className="empty-desc">Swipe right on profiles to find your match!</div>
              </div>
            )}
          </div>

          <div className="section-label">MESSAGES</div>
          <div className="conversations-list">
            {CONVERSATIONS.length === 0 ? (
              <div className="empty-state" style={{ padding: "40px 20px" }}>
                <div className="empty-emoji">💬</div>
                <div className="empty-title">No messages yet</div>
                <div className="empty-desc">When you match with someone, you'll see their messages here!</div>
              </div>
            ) : (
              CONVERSATIONS.map(c => (
                <div key={c._id} className="convo-item" onClick={() => setSelectedChat(c)}>
                  <div className="convo-avatar-wrap">
                    <img className="convo-avatar" src={c.photo} alt={c.name} />
                    {c.online && <div className="online-dot" />}
                  </div>
                  <div className="convo-info">
                    <div className="convo-top">
                      <span className="convo-name">{c.name}, {c.age}</span>
                      <span className="convo-time">{c.time}</span>
                    </div>
                    <div className="convo-msg">{c.lastMsg}</div>
                  </div>
                  {c.unread > 0 && <div className="convo-unread-badge">{c.unread}</div>}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ChatWindow({ match, onBack }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! I noticed we matched 😊", sent: false, time: "2:30 PM" },
    { id: 2, text: "Hi! Yes, your profile is amazing ✨", sent: true, time: "2:31 PM" },
    { id: 3, text: "Thanks! I love your photos. That hiking trip looked incredible!", sent: false, time: "2:32 PM" },
    { id: 4, text: "It was! That was the Alps last summer 🏔️", sent: true, time: "2:33 PM" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const sendMsg = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), text: input, sent: true, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages(m => [...m, newMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const replies = [
        "That's so interesting! Tell me more 😊",
        "Haha, you're funny! 😄",
        "I totally agree with that!",
        "We should definitely meet up sometime! ☕",
        "You seem really cool 🌟",
      ];
      setMessages(m => [...m, {
        id: Date.now() + 1,
        text: replies[Math.floor(Math.random() * replies.length)],
        sent: false,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]);
    }, 1500);
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <button className="chat-back" onClick={onBack}>←</button>
        <img className="chat-header-avatar" src={match.photo} alt={match.name} />
        <div className="chat-header-info">
          <div className="chat-header-name">{match.name}</div>
          <div className="chat-header-status">● Online now</div>
        </div>
        <div className="chat-header-actions">
          <button className="icon-btn" style={{ width: 36, height: 36 }}>📞</button>
          <button className="icon-btn" style={{ width: 36, height: 36 }}>📹</button>
        </div>
      </div>

      <div className="chat-messages">
        <div className="msg-date-divider">Today</div>
        {messages.map(m => (
          <div key={m.id} className={`msg-row ${m.sent ? "sent" : ""}`}>
            {!m.sent && <img className="msg-avatar" src={match.photo} alt="" />}
            <div>
              <div className={`msg-bubble ${m.sent ? "sent" : "received"}`}>{m.text}</div>
              <div className={`msg-time ${m.sent ? "sent" : ""}`}>{m.time}</div>
            </div>
          </div>
        ))}
        {typing && (
          <div className="msg-row">
            <img className="msg-avatar" src={match.photo} alt="" />
            <div className="typing-indicator">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-area">
        <div className="chat-input-wrap">
          <button className="emoji-btn">😊</button>
          <textarea
            className="chat-input"
            placeholder="Type a message..."
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
          />
          <button className="attach-btn">📎</button>
        </div>
        <button className="send-btn" onClick={sendMsg} disabled={!input.trim()}>➤</button>
      </div>
    </div>
  );
}