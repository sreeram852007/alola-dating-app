import { useContext } from "react";
import { AppContext } from "../App";

export default function Chat() {
  const { setCurrentPage } = useContext(AppContext);
  // Chat is handled within Matches page as a sub-view
  return (
    <div style={{ height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 40 }}>💬</div>
      <div style={{ fontWeight: 700 }}>Go to Connections to chat!</div>
      <button className="btn-primary" style={{ width: "auto", padding: "12px 24px" }} onClick={() => setCurrentPage("matches")}>
        Open Connections
      </button>
    </div>
  );
}
