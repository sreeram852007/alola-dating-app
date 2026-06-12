import { useState, useContext } from "react";
import { AppContext } from "../App";

export default function Search() {
  const { token, setCurrentPage } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setSearchResults(data.users || []);
    } catch (err) {
      console.error("Search error:", err);
    }
    setLoading(false);
  };

  const sendMessage = (targetUser) => {
    localStorage.setItem("chatWith", JSON.stringify(targetUser));
    setCurrentPage("matches");
  };

  return (
    <div className="search-page" style={{ height: "100vh", overflowY: "auto", padding: "20px", paddingBottom: "80px" }}>
      <div className="page-title">Find People</div>
      <div className="page-subtitle">Search by name to find and connect</div>

      <div style={{ display: "flex", gap: "10px", marginTop: "20px", marginBottom: "20px" }}>
        <input
          type="text"
          className="input-field"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          style={{ flex: 1 }}
        />
        <button className="btn-primary" onClick={handleSearch} style={{ width: "auto", padding: "0 20px" }}>
          🔍 Search
        </button>
      </div>

      {loading && (
        <div className="empty-state">
          <div className="empty-emoji">⏳</div>
          <div className="empty-title">Searching...</div>
        </div>
      )}

      {!loading && searchResults.length === 0 && searchQuery && (
        <div className="empty-state">
          <div className="empty-emoji">🔍</div>
          <div className="empty-title">No users found</div>
          <div className="empty-desc">Try a different name</div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {searchResults.map((result) => (
          <div
            key={result._id}
            style={{
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <img
              src={result.photos?.[0] || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"}
              alt={result.name}
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: "18px" }}>{result.name}, {result.age}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>📍 {result.location || "Unknown"}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "4px" }}>
                {result.interests?.slice(0, 3).join(" • ") || "No interests yet"}
              </div>
            </div>
            <button
              className="btn-primary"
              style={{ width: "auto", padding: "10px 16px" }}
              onClick={() => sendMessage(result)}
            >
              💬 Message
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}