import { useEffect, useState } from 'react';
import { getBatches, getStudents, getAttendanceStats, getBatchAttendanceSummary } from '../api';
import { format } from 'date-fns';
import { FiBarChart2, FiUser, FiCalendar } from 'react-icons/fi';

export default function Reports() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({});
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    getBatches().then(r => {
      setBatches(r.data);
      if (r.data.length > 0) setSelectedBatch(r.data[0]._id);
    });
  }, []);

  useEffect(() => {
    if (!selectedBatch) return;
    setLoading(true);
    setLoadingStats(true);
    Promise.all([
      getStudents({ batch: selectedBatch }),
      getBatchAttendanceSummary(selectedBatch)
    ]).then(([s, summ]) => {
      setStudents(s.data);
      setSummary(summ.data);
      // Load stats for each student
      const promises = s.data.map(st => getAttendanceStats(st._id).then(r => ({ id: st._id, ...r.data })));
      return Promise.all(promises);
    }).then(allStats => {
      const map = {};
      allStats.forEach(s => { map[s.id] = s; });
      setStats(map);
    }).finally(() => { setLoading(false); setLoadingStats(false); });
  }, [selectedBatch]);

  const currentBatch = batches.find(b => b._id === selectedBatch);
  const totalSessions = summary.length;
  const avgAttendance = students.length ? Math.round(
    students.reduce((acc, s) => acc + (stats[s._id]?.percentage || 0), 0) / students.length
  ) : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Reports</h2>
          <p>Attendance analytics and student performance</p>
        </div>
      </div>

      {/* Batch selector */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ minWidth: 240 }}>
            <label className="form-label">Select Batch</label>
            <select className="form-control" value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}>
              {batches.map(b => <option key={b._id} value={b._id}>{b.name} — {b.subject}</option>)}
            </select>
          </div>
          {currentBatch && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
              background: currentBatch.color + '18', borderRadius: 10, border: `1px solid ${currentBatch.color}33` }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: currentBatch.color }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: currentBatch.color }}>{currentBatch.name}</span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{currentBatch.subject}</span>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading-wrap"><div className="spinner" /></div>
      ) : !selectedBatch ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>Select a batch to view reports</h3>
        </div>
      ) : (
        <>
          {/* Batch Stats */}
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            {[
              { label: 'Total Students', value: students.length, icon: '👩‍🎓', color: '#6366f1', bg: '#ede9fe' },
              { label: 'Total Sessions', value: totalSessions, icon: '📅', color: '#3b82f6', bg: '#dbeafe' },
              { label: 'Avg Attendance', value: `${avgAttendance}%`, icon: '📈', color: '#10b981', bg: '#dcfce7' },
              { label: 'Low Attendance (<75%)',
                value: students.filter(s => (stats[s._id]?.percentage || 0) < 75).length,
                icon: '⚠️', color: '#ef4444', bg: '#fee2e2' },
            ].map((s, i) => (
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
            {/* Student-wise attendance */}
            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <div className="card-header">
                <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiUser /> Student Attendance Report
                </span>
              </div>
              {students.length === 0 ? (
                <div className="empty-state" style={{ padding: 40 }}>
                  <h3>No students in this batch</h3>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student</th>
                        <th>Roll No</th>
                        <th>Present</th>
                        <th>Absent</th>
                        <th>Late</th>
                        <th>Total Days</th>
                        <th>Attendance %</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s, i) => {
                        const st = stats[s._id] || { present: 0, absent: 0, late: 0, total: 0, percentage: 0 };
                        const pct = st.percentage;
                        return (
                          <tr key={s._id}>
                            <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{i + 1}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div className="avatar" style={{
                                  background: currentBatch?.color || '#6366f1', color: '#fff', fontSize: 12
                                }}>
                                  {s.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </div>
                                <span style={{ fontWeight: 500 }}>{s.name}</span>
                              </div>
                            </td>
                            <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{s.rollNo}</td>
                            <td>
                              <span style={{ color: '#10b981', fontWeight: 700 }}>{st.present}</span>
                            </td>
                            <td>
                              <span style={{ color: '#ef4444', fontWeight: 700 }}>{st.absent}</span>
                            </td>
                            <td>
                              <span style={{ color: '#f59e0b', fontWeight: 700 }}>{st.late}</span>
                            </td>
                            <td style={{ fontWeight: 600 }}>{st.total}</td>
                            <td style={{ minWidth: 160 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div className="progress-bar" style={{ flex: 1 }}>
                                  <div className="progress-fill" style={{
                                    width: `${pct}%`,
                                    background: pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'
                                  }} />
                                </div>
                                <span style={{
                                  fontSize: 13, fontWeight: 700, minWidth: 36,
                                  color: pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'
                                }}>{pct}%</span>
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${pct >= 75 ? 'badge-green' : pct >= 50 ? 'badge-yellow' : 'badge-red'}`}>
                                {pct >= 75 ? 'Good' : pct >= 50 ? 'Average' : 'Low'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Session History */}
            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <div className="card-header">
                <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiCalendar /> Session History
                </span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{totalSessions} sessions recorded</span>
              </div>
              {summary.length === 0 ? (
                <div className="empty-state" style={{ padding: 40 }}>
                  <h3>No sessions recorded yet</h3>
                  <p>Mark attendance to see session history</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Day</th>
                        <th>Present</th>
                        <th>Absent</th>
                        <th>Late</th>
                        <th>Total</th>
                        <th>Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.map(sess => {
                        const present = sess.records.filter(r => r.status === 'present').length;
                        const absent = sess.records.filter(r => r.status === 'absent').length;
                        const late = sess.records.filter(r => r.status === 'late').length;
                        const total = sess.records.length;
                        const pct = total ? Math.round((present / total) * 100) : 0;
                        return (
                          <tr key={sess._id}>
                            <td style={{ fontWeight: 600 }}>{sess.date}</td>
                            <td style={{ color: 'var(--text-muted)' }}>
                              {format(new Date(sess.date), 'EEEE')}
                            </td>
                            <td><span style={{ color: '#10b981', fontWeight: 700 }}>{present}</span></td>
                            <td><span style={{ color: '#ef4444', fontWeight: 700 }}>{absent}</span></td>
                            <td><span style={{ color: '#f59e0b', fontWeight: 700 }}>{late}</span></td>
                            <td>{total}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div className="progress-bar" style={{ width: 80 }}>
                                  <div className="progress-fill" style={{
                                    width: `${pct}%`,
                                    background: pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'
                                  }} />
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 700,
                                  color: pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444' }}>
                                  {pct}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
