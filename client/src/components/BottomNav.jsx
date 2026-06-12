import { useContext } from "react";
import { AppContext } from "../App";

const NAV_ITEMS = [
  { id: "discover", icon: "🔥", label: "Discover" },
  { id: "matches", icon: "💬", label: "Chats", badge: 2 },
  { id: "profile", icon: "👤", label: "Profile" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

export default function BottomNav() {
  const { currentPage, setCurrentPage } = useContext(AppContext);
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          className={`nav-item ${currentPage === item.id ? "active" : ""}`}
          onClick={() => setCurrentPage(item.id)}
          aria-label={item.label}
          aria-current={currentPage === item.id ? "page" : undefined}
        >
          <span style={{ fontSize: 22 }}>{item.icon}</span>
          {item.badge > 0 && currentPage !== item.id && (
            <span className="nav-badge">{item.badge}</span>
          )}
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
