import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Bell, BookOpen, Calendar, Home, LayoutDashboard, Leaf, LogOut, Menu, MessageSquare, Settings } from "lucide-react";
import Resources from "./pages/Resources";
import FeedbackPage from "./pages/Feedback";
function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">
          <Leaf size={20} />
        </div>
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

        <a href="#" className="sidebar-link">
          <MessageSquare size={20} />
          <span>Messages</span>
        </a>

        <Link to="/" className={`sidebar-link ${path === '/' ? 'active' : ''}`}>
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

      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="icon-button" style={{ position: 'relative' }}>
          <Bell size={18} />
          <span style={{ position: 'absolute', top: '4px', right: '4px', width: '6px', height: '6px', backgroundColor: '#ef4444', borderRadius: '50%', border: '1px solid white' }}></span>
        </button>

        <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb' }}></div>

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
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}
