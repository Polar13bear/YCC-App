import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../api';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1=email, 2=otp+newpass, 3=done
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword({ email });
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.error('Passwords do not match');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await resetPassword({ email, otp, password });
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
      padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/logo.jpeg" alt="Logo" style={{ width: 72, height: 72, borderRadius: 18, objectFit: 'cover', marginBottom: 16, boxShadow: '0 8px 32px rgba(0,0,0,.3)' }} />
          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, margin: 0 }}>Yoganand Classes</h1>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: '36px 40px', boxShadow: '0 25px 50px rgba(0,0,0,.3)' }}>
          {step === 1 && (
            <>
              <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6366f1', fontSize: 14, fontWeight: 500, marginBottom: 20 }}>
                <FiArrowLeft /> Back to login
              </Link>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, color: '#0f172a' }}>Forgot password?</h2>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>Enter your email and we'll send you an OTP</p>
              <form onSubmit={handleSendOTP}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input className="form-control" type="email" placeholder="you@email.com" style={{ paddingLeft: 42 }}
                      value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15 }}>
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, color: '#0f172a' }}>Enter OTP</h2>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>
                We sent a 6-digit OTP to <strong>{email}</strong>
              </p>
              <form onSubmit={handleReset}>
                <div className="form-group">
                  <label className="form-label">OTP Code</label>
                  <input className="form-control" placeholder="Enter 6-digit OTP"
                    style={{ fontSize: 22, fontWeight: 700, letterSpacing: 8, textAlign: 'center' }}
                    value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} required />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input className="form-control" type="password" placeholder="New password" style={{ paddingLeft: 42 }}
                      value={password} onChange={e => setPassword(e.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input className="form-control" type="password" placeholder="Repeat password" style={{ paddingLeft: 42 }}
                      value={confirm} onChange={e => setConfirm(e.target.value)} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15 }}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
                <button type="button" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
                  onClick={() => setStep(1)}>Resend OTP</button>
              </form>
            </>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <FiCheckCircle size={56} style={{ color: '#10b981', marginBottom: 16 }} />
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>Password Reset!</h2>
              <p style={{ color: '#64748b', marginBottom: 24 }}>Your password has been reset successfully.</p>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => navigate('/login')}>Sign In Now</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
