import { useState, useRef, useContext, useEffect } from "react";
import { AppContext } from "../App";

const SAMPLE_PROFILES = [
  {
    _id: "p1", name: "Emma Watson", age: 25,
    bio: "Oxford grad living in London 📚 | Plant mum 🌿 | Passionate about sustainability and good coffee",
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=700&fit=crop",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=700&fit=crop",
    ],
    location: "London, UK", distance: "2 km",
    interests: ["Books","Plants","Sustainability","Coffee","Art"],
    verified: true,
  },
  {
    _id: "p2", name: "Marcus Johnson", age: 29,
    bio: "Chef & food photographer 🍜 | Exploring the world one dish at a time | Fluent in sarcasm",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=700&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=700&fit=crop",
    ],
    location: "Paris, France", distance: "5 km",
    interests: ["Cooking","Photography","Travel","Wine","Music"],
    verified: true,
  },
  {
    _id: "p3", name: "Priya Sharma", age: 27,
    bio: "Neuroscience PhD candidate 🧠 | Yoga instructor on weekends | Amateur astronomer ✨",
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=700&fit=crop",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=700&fit=crop",
    ],
    location: "Mumbai, India", distance: "1 km",
    interests: ["Science","Yoga","Astronomy","Hiking","Meditation"],
    verified: false,
  },
  {
    _id: "p4", name: "Lucas Silva", age: 31,
    bio: "Architect designing better cities 🏙️ | Jazz musician at heart 🎷 | Fluent in 4 languages",
    photos: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=700&fit=crop",
    ],
    location: "São Paulo, Brazil", distance: "8 km",
    interests: ["Architecture","Jazz","Languages","Design","Travel"],
    verified: true,
  },
  {
    _id: "p5", name: "Yuki Tanaka", age: 23,
    bio: "Manga artist & game dev 🎮 | Night owl 🦉 | Ramen connoisseur 🍜 | Let's explore Tokyo together",
    photos: [
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=700&fit=crop",
    ],
    location: "Tokyo, Japan", distance: "3 km",
    interests: ["Gaming","Art","Anime","Ramen","Music"],
    verified: true,
  },
  {
    _id: "p6", name: "Amara Diallo", age: 26,
    bio: "Social entrepreneur changing lives 🌍 | Marathon runner 🏃‍♀️ | Afrobeats dancer 💃",
    photos: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=700&fit=crop",
    ],
    location: "Lagos, Nigeria", distance: "12 km",
    interests: ["Entrepreneurship","Running","Dance","Fashion","Community"],
    verified: true,
  },
];

const FILTERS = ["All", "Nearby", "New", "Online", "Verified"];

export default function Discover() {
  const { user, setCurrentPage } = useContext(AppContext);
  const [profiles, setProfiles] = useState(SAMPLE_PROFILES);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All");
  const [matchPopup, setMatchPopup] = useState(null);
  const [swipeDir, setSwipeDir] = useState(null);
  const cardRef = useRef(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  const current = profiles[currentIdx];

  const onPointerDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX || e.touches?.[0]?.clientX;
    cardRef.current?.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDragging.current || !cardRef.current) return;
    const x = e.clientX || e.touches?.[0]?.clientX;
    currentX.current = x - startX.current;
    const rotate = currentX.current * 0.08;
    cardRef.current.style.transform = `translateX(${currentX.current}px) rotate(${rotate}deg)`;

    const likeEl = cardRef.current.querySelector(".card-badge-like");
    const nopeEl = cardRef.current.querySelector(".card-badge-nope");
    if (likeEl) likeEl.style.opacity = currentX.current > 30 ? Math.min((currentX.current - 30) / 80, 1) : 0;
    if (nopeEl) nopeEl.style.opacity = currentX.current < -30 ? Math.min((-currentX.current - 30) / 80, 1) : 0;
  };

  const onPointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const threshold = 80;
    if (currentX.current > threshold) {
      swipeCard("like");
    } else if (currentX.current < -threshold) {
      swipeCard("nope");
    } else {
      if (cardRef.current) {
        cardRef.current.style.transition = "transform 0.3s ease";
        cardRef.current.style.transform = "";
        setTimeout(() => { if (cardRef.current) cardRef.current.style.transition = ""; }, 300);
      }
    }
  };

  const swipeCard = (dir) => {
    setSwipeDir(dir);
    if (cardRef.current) {
      const tx = dir === "like" ? 500 : -500;
      cardRef.current.style.transition = "transform 0.4s ease";
      cardRef.current.style.transform = `translateX(${tx}px) rotate(${dir === "like" ? 20 : -20}deg)`;
    }
    setTimeout(() => {
      if (dir === "like" && Math.random() > 0.5) {
        setMatchPopup(current);
      }
      nextCard();
    }, 400);
  };

  const nextCard = () => {
    setCurrentIdx(i => i + 1);
    setPhotoIdx(0);
    setSwipeDir(null);
    if (cardRef.current) {
      cardRef.current.style.transition = "";
      cardRef.current.style.transform = "";
    }
  };

  const handleCardTap = (e) => {
    if (!current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) {
      setPhotoIdx(i => Math.max(0, i - 1));
    } else {
      setPhotoIdx(i => Math.min((current.photos.length || 1) - 1, i + 1));
    }
  };

  if (!current) return (
    <div className="discover-page">
      <div className="discover-header">
        <span className="header-logo">Alola</span>
      </div>
      <div className="empty-state">
        <div className="empty-emoji">💞</div>
        <div className="empty-title">You've seen everyone!</div>
        <div className="empty-desc">Check back later for new people, or expand your distance settings to find more matches.</div>
        <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => { setCurrentIdx(0); setProfiles(SAMPLE_PROFILES); }}>
          Refresh Profiles
        </button>
      </div>
    </div>
  );

  return (
    <div className="discover-page">
      <div className="discover-header">
        <span className="header-logo">Alola</span>
        <div className="header-actions">
          <button className="icon-btn" title="Filters">⚙️</button>
          <button className="icon-btn" title="Notifications" onClick={() => setCurrentPage("matches")}>🔔</button>
        </div>
      </div>

      <div className="filter-bar">
        {FILTERS.map(f => (
          <button key={f} className={`filter-chip ${activeFilter === f ? "active" : ""}`} onClick={() => setActiveFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="cards-stack">
        {/* Background card */}
        {profiles[currentIdx + 1] && (
          <div className="swipe-card" style={{ transform: "scale(0.95) translateY(16px)", zIndex: 0 }}>
            <img className="card-photo" src={profiles[currentIdx + 1].photos[0]} alt="" />
            <div className="card-overlay" />
          </div>
        )}

        {/* Active card */}
        <div
          ref={cardRef}
          className="swipe-card"
          style={{ zIndex: 1 }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onClick={handleCardTap}
        >
          <img className="card-photo" src={current.photos[photoIdx] || current.photos[0]} alt={current.name} draggable={false} />
          <div className="card-overlay" />

          {current.photos.length > 1 && (
            <div className="photo-dots">
              {current.photos.map((_, i) => (
                <div key={i} className={`photo-dot ${i === photoIdx ? "active" : "inactive"}`} />
              ))}
            </div>
          )}

          <div className="card-badge-like">❤️ LIKE</div>
          <div className="card-badge-nope">✕ NOPE</div>

          <div className="card-info">
            <div className="card-name-age">
              <span className="card-name">{current.name}</span>
              <span className="card-age">{current.age}</span>
              {current.verified && <span title="Verified" style={{ fontSize: 16 }}>✅</span>}
            </div>
            <div className="card-location">📍 {current.location} · {current.distance} away</div>
            <div className="card-bio">{current.bio}</div>
            <div className="card-interests">
              {current.interests.slice(0, 4).map(i => (
                <span key={i} className="interest-tag">{i}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="swipe-actions">
        <button className="action-btn rewind" title="Rewind" onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}>↩️</button>
        <button className="action-btn nope" title="Nope" onClick={() => swipeCard("nope")}>✕</button>
        <button className="action-btn superlike" title="Super Like" onClick={() => swipeCard("superlike")}>⭐</button>
        <button className="action-btn like" title="Like" onClick={() => swipeCard("like")}>❤️</button>
        <button className="action-btn boost" title="Boost" onClick={() => {}}>⚡</button>
      </div>

      {matchPopup && (
        <div className="match-popup-overlay" onClick={() => setMatchPopup(null)}>
          <div className="match-popup" onClick={e => e.stopPropagation()}>
            <span className="match-emoji">🎉</span>
            <h2>It's a Match!</h2>
            <p>You and {matchPopup.name} liked each other</p>
            <div className="match-avatars" style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 24 }}>
              <img className="match-avatar" src={user?.photos?.[0] || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"} alt="You" />
              <span className="match-heart">💞</span>
              <img className="match-avatar" src={matchPopup.photos[0]} alt={matchPopup.name} />
            </div>
            <button className="btn-primary" onClick={() => { setMatchPopup(null); setCurrentPage("matches"); }}>
              Send a Message 💬
            </button>
            <button className="btn-secondary" style={{ marginTop: 10 }} onClick={() => setMatchPopup(null)}>
              Keep Swiping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
