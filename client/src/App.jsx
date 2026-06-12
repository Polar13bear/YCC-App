import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';
import {
  FiHome, FiUsers, FiBook, FiCheckSquare, FiBarChart2,
  FiMenu, FiX, FiLogOut, FiUser
} from 'react-icons/fi';
import Dashboard from './pages/Dashboard';
import Batches from './pages/Batches';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';

const navItems = [
  { path: '/', label: 'Dashboard', icon: <FiHome /> },
  { path: '/batches', label: 'Batches', icon: <FiBook /> },
  { path: '/students', label: 'Students', icon: <FiUsers /> },
  { path: '/attendance', label: 'Attendance', icon: <FiCheckSquare /> },
  { path: '/reports', label: 'Reports', icon: <FiBarChart2 /> },
];

function ProtectedLayout({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentPage = navItems.find(n => n.path === location.pathname);

  const handleLogout = () => {
    localStorage.removeItem('ycc_token');
    localStorage.removeItem('ycc_user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

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
            <button key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User info at bottom */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,.08)', marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: 13, flexShrink: 0 }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              <div style={{ color: 'rgba(255,255,255,.45)', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.role}</div>
            </div>
          </div>
          <button className="nav-item" style={{ width: '100%', color: 'rgba(255,255,255,.5)' }} onClick={handleLogout}>
            <span className="nav-icon"><FiLogOut /></span> Logout
          </button>
        </div>

        <div className="sidebar-footer">
          <p>© 2026 Yoganand Classes</p>
        </div>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button className="hamburger" onClick={() => setSidebarOpen(o => !o)}>
              {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <img src="/logo.jpeg" alt="Logo" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
            <div>
              <div className="topbar-title">{currentPage?.label || 'Dashboard'}</div>
              <div className="topbar-subtitle">Yoganand Classes Management</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right', display: 'none' }} className="user-info-topbar">
              <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.email}</div>
            </div>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 15
            }}>{user?.name?.charAt(0)?.toUpperCase() || 'Y'}</div>
          </div>
        </header>

        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/batches" element={<Batches />} />
            <Route path="/students" element={<Students />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ycc_user')); } catch { return null; }
  });

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/*" element={user ? <ProtectedLayout user={user} setUser={setUser} /> : <Navigate to="/login" />} />
    </Routes>
  );
}
