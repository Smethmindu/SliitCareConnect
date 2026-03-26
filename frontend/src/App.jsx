import { Routes, Route, Link } from "react-router-dom";
import { Bell, BookOpen, Calendar, Home, LayoutDashboard, LogOut, Menu, MessageSquare, Settings, UserRound } from "lucide-react";
import Resources from "./pages/Resources";
import FeedbackPage from "./pages/feedback";
import Counselors from "./pages/Counselors";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">◌</div>
        <div className="brand-text">
          <span className="brand-black">SliitCare</span>
          <span className="brand-blue">Connect</span>
        </div>
      </div>

      <p className="menu-label">MENU</p>

      <nav className="sidebar-nav">
        <a href="#" className="sidebar-link">
          <Home size={20} />
          <span>Home</span>
        </a>

        <a href="#" className="sidebar-link">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </a>

        <a href="#" className="sidebar-link">
          <Calendar size={20} />
          <span>Appointments</span>
        </a>

        <Link to="/counselors" className="sidebar-link">
          <UserRound size={20} />
          <span>Counselors</span>
        </Link>

        <a href="#" className="sidebar-link">
          <MessageSquare size={20} />
          <span>Messages</span>
        </a>

        <Link to="/" className="sidebar-link active">
          <BookOpen size={20} />
          <span>Resources</span>
        </Link>
      </nav>

      <div className="sidebar-bottom">
        <a href="#" className="sidebar-link">
          <Settings size={20} />
          <span>Settings</span>
        </a>

        <a href="#" className="sidebar-link logout-link">
          <LogOut size={20} />
          <span>Log out</span>
        </a>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="topbar">
      <button className="topbar-menu">
        <Menu size={20} />
      </button>

      <div className="topbar-right">
        <button className="icon-button">
          <Bell size={18} />
        </button>

        <div className="profile-block">
          <div>
            <p className="profile-name">Sarah Jenkins</p>
            <p className="profile-role">Student</p>
          </div>
          <div className="avatar">SJ</div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="app-footer">
      <p>© 2026 SliitCareConnect. Supporting student well-being with accessible mental health resources.</p>
    </footer>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <main className="page-content">
          <Routes>
            <Route path="/" element={<Resources />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/counselors" element={<Counselors />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}
