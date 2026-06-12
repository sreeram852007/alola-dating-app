import { useState, useContext, useEffect } from "react";
import { AppContext } from "../App";

const ALL_INTERESTS = [
  "Hiking", "Photography", "Coffee", "Travel", "Music", "Art", "Reading",
  "Cooking", "Yoga", "Gaming", "Movies", "Fitness", "Dancing", "Nature",
  "Fashion", "Science", "Tech", "Food", "Wine", "Dogs", "Cats", "Sports",
];

export default function Profile() {
  const { user, setUser, token } = useContext(AppContext);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    bio: "",
    interests: [],
  });

  useEffect(() => {
    if (user) {
      setForm({
        bio: user.bio || "",
        interests: user.interests || [],
      });
      setLoading(false);
    } else if (token) {
      // Fetch user data if not loaded
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
    setLoading(false);
  };

  const toggleInterest = (i) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(i) ? f.interests.filter(x => x !== i) : [...f.interests, i],
    }));
  };

  const save = async () => {
    // Save to backend
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio: form.bio, interests: form.interests }),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setEditing(false);
      } else {
        // Fallback to local update if backend fails
        setUser(u => ({ ...u, ...form }));
        setEditing(false);
      }
    } catch (err) {
      // Local update only
      setUser(u => ({ ...u, ...form }));
      setEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="empty-state">
          <div className="empty-emoji">⏳</div>
          <div className="empty-title">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="empty-state">
          <div className="empty-emoji">👤</div>
          <div className="empty-title">Not logged in</div>
          <div className="empty-desc">Please sign in to view your profile</div>
        </div>
      </div>
    );
  }

  const u = user;

  return (
    <div className="profile-page">
      <div className="profile-cover">
        <img
          className="profile-cover-img"
          src={u.photos?.[0] || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"}
          alt={u.name}
        />
        <div className="profile-cover-gradient" />
        <div className="profile-photo-edit">
          <button className="icon-btn">📷</button>
        </div>
      </div>

      <div className="profile-body">
        <div className="profile-name-row">
          <div className="profile-name">{u.name || "Your Name"}</div>
          <div className="profile-age-badge">{u.age || "??"}</div>
        </div>
        <div className="profile-location">📍 {u.location || "Your Location"}</div>

        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-value">💖 {u.matches?.length || 0}</div>
            <div className="stat-label">Matches</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">👍 {u.likes || 0}</div>
            <div className="stat-label">Likes</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">⭐ {u.superLikes || 0}</div>
            <div className="stat-label">Super Likes</div>
          </div>
        </div>

        <div className="premium-banner">
          <div className="premium-banner-crown">👑</div>
          <h3>Alola Premium</h3>
          <p>Unlock unlimited likes, see who likes you, and more — all for free on Alola!</p>
          <div className="premium-features">
            <span className="premium-feature">✅ Unlimited Likes</span>
            <span className="premium-feature">✅ See Who Liked You</span>
            <span className="premium-feature">✅ Rewind Swipes</span>
            <span className="premium-feature">✅ Passport — Swipe Worldwide</span>
            <span className="premium-feature">✅ Profile Boost</span>
            <span className="premium-feature">✅ No Ads Ever</span>
          </div>
          <button className="btn-gold">All Features — Always Free 🎁</button>
        </div>

        <div className="section-header">
          <span className="section-title">About Me</span>
          <button className="section-edit-btn" onClick={() => setEditing(e => !e)}>
            {editing ? "Cancel" : "Edit ✏️"}
          </button>
        </div>

        {editing ? (
          <div style={{ marginBottom: 20 }}>
            <textarea
              className="input-field"
              rows={4}
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Write something about yourself..."
            />
            <button className="btn-primary" style={{ marginTop: 10 }} onClick={save}>Save Changes</button>
          </div>
        ) : (
          <div className="profile-bio">{u.bio || "Tap Edit to add a bio!"}</div>
        )}

        <div className="section-header">
          <span className="section-title">Interests</span>
          {editing && <span style={{ fontSize: 12, color: "var(--text-dim)" }}>Tap to select</span>}
        </div>
        <div className="interests-grid" style={{ marginBottom: 24 }}>
          {(editing ? ALL_INTERESTS : (u.interests || [])).map(i => (
            <button
              key={i}
              className={`interest-pill ${(form.interests || u.interests || []).includes(i) ? "selected" : ""}`}
              onClick={() => editing && toggleInterest(i)}
              style={{ cursor: editing ? "pointer" : "default" }}
            >
              {i}
            </button>
          ))}
          {!editing && (u.interests?.length === 0) && (
            <span style={{ color: "var(--text-dim)", fontSize: 14 }}>No interests added yet</span>
          )}
        </div>

        <div className="section-header">
          <span className="section-title">My Photos</span>
          <button className="section-edit-btn">Add Photos</button>
        </div>
        <div className="photos-grid">
          {(u.photos || []).map((p, i) => (
            <img key={i} className="photo-thumb" src={p} alt="" />
          ))}
          {Array.from({ length: Math.max(0, 6 - (u.photos?.length || 0)) }).map((_, i) => (
            <div key={i} className="photo-add-btn">+</div>
          ))}
        </div>

        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}