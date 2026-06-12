import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const BASE = import.meta.env.VITE_API_URL || 'https://ycc-app-server.onrender.com/api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { setStatus('error'); setMessage('Invalid verification link.'); return; }
    axios.get(`${BASE}/auth/verify-email?token=${token}`)
      .then(r => { setStatus('success'); setMessage(r.data.message); })
      .catch(err => { setStatus('error'); setMessage(err.response?.data?.message || 'Verification failed.'); });
  }, []);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
      padding: 20,
    }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '40px', textAlign: 'center', maxWidth: 440, width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,.3)' }}>
        <img src="/logo.jpeg" alt="Logo" style={{ width: 60, height: 60, borderRadius: 14, objectFit: 'cover', marginBottom: 20 }} />
        {status === 'loading' && (
          <>
            <div className="spinner" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#64748b' }}>Verifying your email...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <FiCheckCircle size={52} style={{ color: '#10b981', marginBottom: 16 }} />
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Email Verified! 🎉</h2>
            <p style={{ color: '#64748b', marginBottom: 24 }}>{message}</p>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => navigate('/login')}>Go to Login</button>
          </>
        )}
        {status === 'error' && (
          <>
            <FiXCircle size={52} style={{ color: '#ef4444', marginBottom: 16 }} />
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Verification Failed</h2>
            <p style={{ color: '#64748b', marginBottom: 24 }}>{message}</p>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => navigate('/signup')}>Try Signing Up Again</button>
          </>
        )}
      </div>
    </div>
  );
}
