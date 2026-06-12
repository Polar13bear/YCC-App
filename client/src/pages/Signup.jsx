import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await signup({ name: form.name, email: form.email, password: form.password });
      setDone(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
      padding: 20,
    }}>
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(99,102,241,.15)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(139,92,246,.1)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/logo.jpeg" alt="Logo" style={{ width: 72, height: 72, borderRadius: 18, objectFit: 'cover', marginBottom: 16, boxShadow: '0 8px 32px rgba(0,0,0,.3)' }} />
          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, margin: 0 }}>Yoganand Classes</h1>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, marginTop: 6 }}>Create your admin account</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: '36px 40px', boxShadow: '0 25px 50px rgba(0,0,0,.3)' }}>
          {done ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <FiCheckCircle size={56} style={{ color: '#10b981', marginBottom: 16 }} />
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>Check your email!</h2>
              <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: 24 }}>
                We've sent a verification link to <strong>{form.email}</strong>. Click the link to activate your account.
              </p>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => navigate('/login')}>Go to Login</button>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, color: '#0f172a' }}>Create account</h2>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>Fill in your details to get started</p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <FiUser style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input className="form-control" placeholder="Your full name" style={{ paddingLeft: 42 }}
                      value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input className="form-control" type="email" placeholder="you@email.com" style={{ paddingLeft: 42 }}
                      value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input className="form-control" type={showPass ? 'text' : 'password'} placeholder="Min 6 characters"
                      style={{ paddingLeft: 42, paddingRight: 42 }}
                      value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                    <button type="button" onClick={() => setShowPass(s => !s)}
                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                      {showPass ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input className="form-control" type="password" placeholder="Repeat password"
                      style={{ paddingLeft: 42 }}
                      value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} required />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, marginTop: 4 }}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#64748b' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#6366f1', fontWeight: 600 }}>Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
