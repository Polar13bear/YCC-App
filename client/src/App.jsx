import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  FiHome, FiUsers, FiBook, FiCheckSquare, FiBarChart2,
  FiMenu, FiX
} from 'react-icons/fi';
import Dashboard from './pages/Dashboard';
import Batches from './pages/Batches';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';

const navItems = [
  { path: '/', label: 'Dashboard', icon: <FiHome /> },
  { path: '/batches', label: 'Batches', icon: <FiBook /> },
  { path: '/students', label: 'Students', icon: <FiUsers /> },
  { path: '/attendance', label: 'Attendance', icon: <FiCheckSquare /> },
  { path: '/reports', label: 'Reports', icon: <FiBarChart2 /> },
];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentPage = navItems.find(n => n.path === location.pathname);

  return (
    <div className="app-layout">
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon" style={{ background: 'transparent', boxShadow: 'none', padding: 0, overflow: 'hidden' }}>
            <img src="/logo.jpeg" alt="Yoganand Classes Logo"
              style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', display: 'block' }} />
          </div>
          <h1>Yoganand Classes</h1>
          <p>Attendance & Records</p>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Menu</div>
          {navItems.map(item => (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>© 2026 Yoganand Classes</p>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button className="hamburger" onClick={() => setSidebarOpen(o => !o)}>
              {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <img src="/logo.jpeg" alt="Logo"
              style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', display: 'block' }} />
            <div>
              <div className="topbar-title">{currentPage?.label || 'Dashboard'}</div>
              <div className="topbar-subtitle">Yoganand Classes Management</div>
            </div>
          </div>
          <div className="topbar-right">
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 15
            }}>Y</div>
          </div>
        </header>

        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/batches" element={<Batches />} />
            <Route path="/students" element={<Students />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
