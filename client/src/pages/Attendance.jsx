import { useEffect, useState } from 'react';
import { getBatches, getStudents, getAttendance, markAttendance } from '../api';
import toast from 'react-hot-toast';
import { format, addDays, subDays } from 'date-fns';
import { FiChevronLeft, FiChevronRight, FiSave, FiCheckCircle, FiUsers } from 'react-icons/fi';

export default function Attendance() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: 'present'|'absent'|'late' }
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getBatches().then(r => {
      setBatches(r.data);
      if (r.data.length > 0) setSelectedBatch(r.data[0]._id);
    });
  }, []);

  useEffect(() => {
    if (!selectedBatch) return;
    setLoading(true);
    setSaved(false);
    Promise.all([
      getStudents({ batch: selectedBatch, active: true }),
      getAttendance({ batch: selectedBatch, date })
    ]).then(([s, a]) => {
      setStudents(s.data);
      const att = a.data[0];
      if (att) {
        const map = {};
        att.records.forEach(r => { map[r.student._id] = r.status; });
        setAttendance(map);
        setSaved(true);
      } else {
        // Default all absent
        const map = {};
        s.data.forEach(st => { map[st._id] = 'absent'; });
        setAttendance(map);
      }
    }).finally(() => setLoading(false));
  }, [selectedBatch, date]);

  const setStatus = (studentId, status) => {
    setAttendance(a => ({ ...a, [studentId]: status }));
    setSaved(false);
  };

  const markAll = (status) => {
    const map = {};
    students.forEach(s => { map[s._id] = status; });
    setAttendance(map);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!selectedBatch || students.length === 0) return;
    setSaving(true);
    try {
      const records = students.map(s => ({
        student: s._id,
        status: attendance[s._id] || 'absent'
      }));
      await markAttendance({ batch: selectedBatch, date, records });
      toast.success('Attendance saved!');
      setSaved(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const presentCount = Object.values(attendance).filter(v => v === 'present').length;
  const absentCount = Object.values(attendance).filter(v => v === 'absent').length;
  const lateCount = Object.values(attendance).filter(v => v === 'late').length;
  const total = students.length;
  const pct = total ? Math.round((presentCount / total) * 100) : 0;

  const currentBatch = batches.find(b => b._id === selectedBatch);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Mark Attendance</h2>
          <p>Record daily attendance for each batch</p>
        </div>
      </div>

      {/* Controls */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ padding: '20px 24px', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Batch Select */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <label className="form-label">Select Batch</label>
            <select className="form-control" value={selectedBatch}
              onChange={e => setSelectedBatch(e.target.value)}>
              <option value="">Choose batch...</option>
              {batches.map(b => <option key={b._id} value={b._id}>{b.name} — {b.subject}</option>)}
            </select>
          </div>
          {/* Date */}
          <div>
            <label className="form-label">Date</label>
            <div className="date-nav">
              <button onClick={() => setDate(format(subDays(new Date(date), 1), 'yyyy-MM-dd'))}>
                <FiChevronLeft />
              </button>
              <input type="date" className="form-control" style={{ width: 160 }}
                value={date} onChange={e => setDate(e.target.value)} />
              <button onClick={() => setDate(format(addDays(new Date(date), 1), 'yyyy-MM-dd'))}>
                <FiChevronRight />
              </button>
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div>
              <label className="form-label" style={{ opacity: 0 }}>.</label>
              <button className="btn btn-success" onClick={handleSave} disabled={saving || students.length === 0}>
                <FiSave /> {saving ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {!selectedBatch ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>Select a batch</h3>
          <p>Choose a batch above to mark attendance</p>
        </div>
      ) : loading ? (
        <div className="loading-wrap"><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
          {/* Students List */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {currentBatch && (
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: currentBatch.color, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700
                  }}>{currentBatch.name.charAt(0)}</div>
                )}
                <div>
                  <div className="card-title">{currentBatch?.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {format(new Date(date), 'EEEE, MMMM d yyyy')}
                  </div>
                </div>
                {saved && (
                  <span className="badge badge-green" style={{ marginLeft: 8 }}>
                    <FiCheckCircle size={11} style={{ marginRight: 4 }} /> Saved
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-sm" style={{ background: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: 8 }}
                  onClick={() => markAll('present')}>All Present</button>
                <button className="btn btn-sm" style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8 }}
                  onClick={() => markAll('absent')}>All Absent</button>
              </div>
            </div>

            {students.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><FiUsers /></div>
                <h3>No students in this batch</h3>
                <p>Add students to this batch first</p>
              </div>
            ) : (
              <div>
                {students.map((s, i) => (
                  <div className="attendance-student-row" key={s._id}>
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: 'var(--surface2)', color: 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, flexShrink: 0
                    }}>{i + 1}</div>
                    <div className="avatar" style={{
                      background: `linear-gradient(135deg, ${currentBatch?.color || '#6366f1'}, ${currentBatch?.color || '#6366f1'}99)`,
                      color: '#fff', fontSize: 13
                    }}>
                      {s.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.rollNo}</div>
                    </div>
                    <div className="attendance-status-btns">
                      {['present', 'absent', 'late'].map(status => (
                        <button
                          key={status}
                          className={`status-btn ${status} ${attendance[s._id] === status ? 'active' : ''}`}
                          onClick={() => setStatus(s._id, status)}
                        >
                          {status === 'present' ? '✓ Present' : status === 'absent' ? '✗ Absent' : '⏰ Late'}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div className="card-header">
                <span className="card-title">Summary</span>
              </div>
              <div className="card-body">
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: 48, fontWeight: 800, color: pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444' }}>
                    {pct}%
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Attendance Rate</div>
                </div>
                <div className="progress-bar" style={{ marginBottom: 20 }}>
                  <div className="progress-fill" style={{
                    width: `${pct}%`,
                    background: pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'
                  }} />
                </div>
                {[
                  { label: 'Present', count: presentCount, color: '#10b981', bg: '#dcfce7' },
                  { label: 'Absent', count: absentCount, color: '#ef4444', bg: '#fee2e2' },
                  { label: 'Late', count: lateCount, color: '#f59e0b', bg: '#fef9c3' },
                  { label: 'Total', count: total, color: '#6366f1', bg: '#ede9fe' },
                ].map(item => (
                  <div key={item.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px', borderRadius: 10, marginBottom: 8,
                    background: item.bg
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: item.color }}>{item.label}</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: item.color }}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
              onClick={handleSave} disabled={saving || students.length === 0}>
              <FiSave /> {saving ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
