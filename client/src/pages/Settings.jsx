import { useState, useContext } from "react";
import { AppContext } from "../App";

export default function Settings() {
  const { logout } = useContext(AppContext);
  const [prefs, setPrefs] = useState({
    notifications: true,
    showOnline: true,
    hideAge: false,
    hideDistance: false,
    darkMode: true,
    distance: 50,
    ageMin: 20,
    ageMax: 35,
  });

  const toggle = key => setPrefs(p => ({ ...p, [key]: !p[key] }));
  const set = (key, val) => setPrefs(p => ({ ...p, [key]: val }));

  return (
    <div className="settings-page">
      <div style={{ paddingTop: 8, marginBottom: 20 }}>
        <div className="page-title">Settings</div>
        <div className="page-subtitle">Customize your Alola experience</div>
      </div>

      <div className="section-label" style={{ padding: 0, marginBottom: 10 }}>DISCOVERY PREFERENCES</div>
      <div className="settings-section">
        <div className="settings-item" style={{ flexDirection: "column", alignItems: "flex-start", gap: 12, cursor: "default" }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
            <span style={{ fontWeight: 600 }}>Maximum Distance</span>
            <span className="range-value">{prefs.distance} km</span>
          </div>
          <div className="range-control" style={{ width: "100%" }}>
            <input type="range" min={1} max={200} value={prefs.distance} onChange={e => set("distance", +e.target.value)} />
          </div>
        </div>
        <div className="settings-item" style={{ flexDirection: "column", alignItems: "flex-start", gap: 12, cursor: "default" }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
            <span style={{ fontWeight: 600 }}>Age Range</span>
            <span className="range-value">{prefs.ageMin}–{prefs.ageMax}</span>
          </div>
          <div className="range-control" style={{ width: "100%" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="range" min={18} max={prefs.ageMax - 1} value={prefs.ageMin} onChange={e => set("ageMin", +e.target.value)} style={{ flex: 1 }} />
              <input type="range" min={prefs.ageMin + 1} max={99} value={prefs.ageMax} onChange={e => set("ageMax", +e.target.value)} style={{ flex: 1 }} />
            </div>
          </div>
        </div>
      </div>

      <div className="section-label" style={{ padding: 0, marginBottom: 10, marginTop: 4 }}>PRIVACY</div>
      <div className="settings-section">
        {[
          { key: "showOnline", icon: "🟢", label: "Show Online Status", sub: "Let matches see when you're active" },
          { key: "hideAge", icon: "🎂", label: "Hide My Age", sub: "Age won't be shown on profile" },
          { key: "hideDistance", icon: "📍", label: "Hide My Distance", sub: "Location won't be shown" },
        ].map(item => (
          <div key={item.key} className="settings-item">
            <div className="settings-icon" style={{ background: "var(--bg-surface)" }}>{item.icon}</div>
            <div className="settings-text">
              <div className="settings-text-main">{item.label}</div>
              <div className="settings-text-sub">{item.sub}</div>
            </div>
            <Toggle on={prefs[item.key]} onClick={() => toggle(item.key)} />
          </div>
        ))}
      </div>

      <div className="section-label" style={{ padding: 0, marginBottom: 10, marginTop: 4 }}>NOTIFICATIONS</div>
      <div className="settings-section">
        {[
          { key: "notifications", icon: "🔔", label: "Push Notifications", sub: "New matches and messages" },
          { key: "darkMode", icon: "🌙", label: "Dark Mode", sub: "Easy on the eyes" },
        ].map(item => (
          <div key={item.key} className="settings-item">
            <div className="settings-icon" style={{ background: "var(--bg-surface)" }}>{item.icon}</div>
            <div className="settings-text">
              <div className="settings-text-main">{item.label}</div>
              <div className="settings-text-sub">{item.sub}</div>
            </div>
            <Toggle on={prefs[item.key]} onClick={() => toggle(item.key)} />
          </div>
        ))}
      </div>

      <div className="section-label" style={{ padding: 0, marginBottom: 10, marginTop: 4 }}>ACCOUNT</div>
      <div className="settings-section">
        {[
          { icon: "🛡️", label: "Safety Features", sub: "Block, report, & safety center", color: "#10B981" },
          { icon: "❓", label: "Help & Support", sub: "FAQs and contact support", color: "#8B5CF6" },
          { icon: "📋", label: "Terms of Service", sub: "Legal information", color: "#5B78F6" },
          { icon: "🔒", label: "Privacy Policy", sub: "How we handle your data", color: "#F59E0B" },
          { icon: "💬", label: "Send Feedback", sub: "Help us improve Alola", color: "#FF4E6A" },
        ].map((item, i) => (
          <div key={i} className="settings-item">
            <div className="settings-icon" style={{ background: `${item.color}20` }}>{item.icon}</div>
            <div className="settings-text">
              <div className="settings-text-main">{item.label}</div>
              <div className="settings-text-sub">{item.sub}</div>
            </div>
            <span className="settings-chevron">›</span>
          </div>
        ))}
      </div>

      <button
        className="btn-secondary"
        style={{ marginTop: 8, color: "var(--coral)", borderColor: "rgba(255,78,106,0.3)" }}
        onClick={logout}
      >
        Sign Out
      </button>

      <div style={{ textAlign: "center", fontSize: 12, color: "var(--text-dim)", marginTop: 20, lineHeight: 1.8 }}>
        Alola v1.0.0 · Made with ❤️ · 100% Free, Always<br />
        © 2025 Alola Dating · All rights reserved
      </div>

      <div style={{ height: 20 }} />
    </div>
  );
}

function Toggle({ on, onClick }) {
  return (
    <div className={`toggle-wrap ${on ? "on" : ""}`} onClick={onClick}>
      <div className="toggle-knob" />
    </div>
  );
}
