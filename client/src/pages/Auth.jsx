import { useState, useContext } from "react";
import { AppContext } from "../App";

const DEMO_USERS = [
  {
    _id: "demo1", name: "Alex Rivera", age: 26,
    bio: "Adventure lover 🏕️ | Coffee addict ☕ | Dog parent 🐶",
    photos: ["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop"],
    location: "San Francisco, CA",
    interests: ["Hiking","Photography","Coffee","Travel"],
    gender: "male", lookingFor: "women", ageRange:{min:21,max:32}, distance:50,
  },
  {
    _id: "demo2", name: "Sofia Chen", age: 24,
    bio: "UX Designer by day, jazz pianist by night 🎹 | Matcha over coffee always",
    photos: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop"],
    location: "New York, NY",
    interests: ["Jazz","Design","Yoga","Cooking"],
    gender: "female", lookingFor: "men", ageRange:{min:22,max:30}, distance:30,
  },
  {
    _id: "demo3", name: "Jordan Lee", age: 28,
    bio: "Climbing walls and breaking hearts 🧗 | Bookworm when not outdoors",
    photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop"],
    location: "Austin, TX",
    interests: ["Climbing","Reading","Music","Fitness"],
    gender: "non-binary", lookingFor: "everyone", ageRange:{min:24,max:34}, distance:40,
  }
];

export default function Auth() {
  const { setUser, setToken } = useContext(AppContext);
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", name: "", age: "", gender: "", lookingFor: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    try {
      const res = await fetch(`/api/auth/${tab}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("alola_token", data.token);
        setToken(data.token);
        setUser(data.user);
      } else {
        const err = await res.json();
        setError(err.message || "Something went wrong");
      }
    } catch {
      // Demo mode fallback
      const demoUser = { ...DEMO_USERS[0], name: form.name || "You", email: form.email };
      localStorage.setItem("alola_token", "demo_token");
      setToken("demo_token");
      setUser(demoUser);
    }
    setLoading(false);
  };

  const demoLogin = () => {
    const u = DEMO_USERS[0];
    localStorage.setItem("alola_token", "demo_token");
    setToken("demo_token");
    setUser(u);
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <img
          className="auth-hero-img"
          src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=600&fit=crop"
          alt="Happy couple"
        />
        <div className="auth-hero-overlay" />
        <div className="auth-hero-content">
          <h1>Find Your <span className="gradient-text">Alola</span> Match</h1>
          <p>Millions of real people. Real connections.</p>
        </div>
      </div>

      <div className="auth-form-area">
        <div className="tab-switcher">
          <button className={`tab-btn ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>Sign In</button>
          <button className={`tab-btn ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}>Create Account</button>
        </div>

        {error && (
          <div style={{ background: "rgba(255,78,106,0.1)", border: "1px solid rgba(255,78,106,0.3)", borderRadius: "var(--radius-md)", padding: "12px 16px", fontSize: "14px", color: "var(--coral)" }}>
            ⚠️ {error}
          </div>
        )}

        {tab === "register" && (
          <>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input className="input-field" name="name" placeholder="Your name" value={form.name} onChange={handleChange} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="input-group">
                <label className="input-label">Age</label>
                <input className="input-field" name="age" type="number" placeholder="25" min="18" max="99" value={form.age} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label className="input-label">Gender</label>
                <select className="input-field" name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="man">Man</option>
                  <option value="woman">Woman</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Interested In</label>
              <select className="input-field" name="lookingFor" value={form.lookingFor} onChange={handleChange}>
                <option value="">Select preference</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="everyone">Everyone</option>
              </select>
            </div>
          </>
        )}

        <div className="input-group">
          <label className="input-label">Email</label>
          <input className="input-field" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label className="input-label">Password</label>
          <input className="input-field" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
        </div>

        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "⏳ Please wait..." : tab === "login" ? "Sign In →" : "Create Account →"}
        </button>

        <div className="divider">or</div>

        <button className="social-btn" onClick={demoLogin}>
          🚀 Try Demo — No Account Needed
        </button>

        {tab === "login" && (
          <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text-dim)" }}>
            Forgot password?{" "}
            <button style={{ background: "none", border: "none", color: "var(--coral)", cursor: "pointer", fontFamily: "inherit", fontSize: "13px", fontWeight: 600 }}>
              Reset it
            </button>
          </p>
        )}

        <p style={{ textAlign: "center", fontSize: "12px", color: "var(--text-dim)", lineHeight: 1.6 }}>
          By continuing you agree to our Terms of Service & Privacy Policy. Always free — no hidden charges.
        </p>
      </div>
    </div>
  );
}
