import { useState, useContext } from "react";
import { AppContext } from "../App";

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
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    }
    setLoading(false);
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
          <p>Real people. Real connections. 100% Free.</p>
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