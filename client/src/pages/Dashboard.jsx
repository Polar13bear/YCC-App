import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBatches, getStudents, getAttendance } from '../api';
import { format } from 'date-fns';
import { FiUsers, FiBook, FiCheckSquare, FiTrendingUp } from 'react-icons/fi';

export default function Dashboard() {
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    Promise.all([
      getBatches(),
      getStudents({ active: true }),
      getAttendance({ date: today }),
    ]).then(([b, s, a]) => {
      setBatches(b.data);
      setStudents(s.data);
      setTodayAttendance(a.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-wrap"><div className="spinner" /></div>;

  const totalPresent = todayAttendance.reduce((acc, att) =>
    acc + att.records.filter(r => r.status === 'present').length, 0);
  const totalMarked = todayAttendance.reduce((acc, att) => acc + att.records.length, 0);
  const attendanceRate = totalMarked ? Math.round((totalPresent / totalMarked) * 100) : 0;

  const stats = [
    { label: 'Total Batches', value: batches.length, icon: '📚', color: '#6366f1', bg: '#ede9fe' },
    { label: 'Total Students', value: students.length, icon: '👩‍🎓', color: '#10b981', bg: '#dcfce7' },
    { label: "Today's Present", value: totalPresent, icon: '✅', color: '#3b82f6', bg: '#dbeafe' },
    { label: 'Attendance Rate', value: `${attendanceRate}%`, icon: '📈', color: '#f59e0b', bg: '#fef9c3' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Welcome Back 👋</h2>
          <p>{format(new Date(), 'EEEE, MMMM d, yyyy')} — Have a productive day!</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon" style={{ background: s.bg }}>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
            </div>
            <div className="stat-info">
              <h3 style={{ color: s.color }}>{s.value}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Batches */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Active Batches</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/batches')}>View All</button>
          </div>
          <div>
            {batches.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No batches yet</div>
            ) : batches.slice(0, 5).map(b => (
              <div key={b._id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 24px', borderBottom: '1px solid var(--border)'
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: b.color || '#6366f1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0
                }}>
                  {b.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{b.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.subject}</div>
                </div>
                <span className="badge badge-purple">{b.studentCount || 0} students</span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Attendance */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Today's Attendance</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/attendance')}>Mark Now</button>
          </div>
          <div>
            {batches.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No batches yet</div>
            ) : batches.slice(0, 5).map(b => {
              const att = todayAttendance.find(a => a.batch?._id === b._id);
              const present = att ? att.records.filter(r => r.status === 'present').length : 0;
              const total = att ? att.records.length : b.studentCount || 0;
              const pct = total ? Math.round((present / total) * 100) : 0;
              return (
                <div key={b._id} style={{ padding: '14px 24px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{b.name}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {att ? `${present}/${total}` : 'Not marked'}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{
                      width: `${pct}%`,
                      background: pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Students */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <span className="card-title">Recent Students</span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/students')}>View All</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                <th>Batch</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.slice(0, 6).map(s => (
                <tr key={s._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{
                        background: s.batch?.color || '#6366f1', color: '#fff'
                      }}>{s.name.charAt(0)}</div>
                      <span style={{ fontWeight: 500 }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{s.rollNo}</td>
                  <td>
                    {s.batch && (
                      <span className="badge badge-purple">{s.batch.name}</span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{s.phone || '—'}</td>
                  <td><span className="badge badge-green">Active</span></td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No students yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
