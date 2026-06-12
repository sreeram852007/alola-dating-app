import { useState, useEffect, createContext, useContext } from "react";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Matches from "./pages/Matches";
import Chat from "./pages/Chat";
import Discover from "./pages/Discover";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import Splash from "./pages/Splash";
import "./index.css";

export const AppContext = createContext(null);

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("discover");
  const [showSplash, setShowSplash] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("alola_token"));
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        logout();
      }
    } catch (e) {
      setUser(null);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("alola_token");
    setToken(null);
    setUser(null);
    setCurrentPage("discover");
  };

  const contextValue = {
    user, setUser, token, setToken,
    currentPage, setCurrentPage,
    notifications, setNotifications,
    logout
  };

  if (showSplash) return <Splash />;
  if (!user && !token) return (
    <AppContext.Provider value={contextValue}>
      <Auth />
    </AppContext.Provider>
  );

  return (
    <AppContext.Provider value={contextValue}>
      <div className="app-wrapper">
        {currentPage === "discover" && <Discover />}
        {currentPage === "search" && <Search />}
        {currentPage === "matches" && <Matches />}
        {currentPage === "chat" && <Chat />}
        {currentPage === "profile" && <Profile />}
        {currentPage === "settings" && <Settings />}
        <BottomNav />
      </div>
    </AppContext.Provider>
  );
}