import { useEffect, useState } from 'react';
import { getStudents, getBatches, createStudent, updateStudent, deleteStudent } from '../api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPhone, FiMail } from 'react-icons/fi';
import { format } from 'date-fns';

const emptyForm = {
  name:'', rollNo:'', email:'', phone:'', parentPhone:'', address:'', batch:'', joinDate:'', isActive:true
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [viewStudent, setViewStudent] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([getStudents(), getBatches()])
      .then(([s, b]) => { setStudents(s.data); setBatches(b.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = students.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase());
    const matchBatch = !filterBatch || s.batch?._id === filterBatch;
    return matchSearch && matchBatch;
  });

  const openCreate = () => { setForm(emptyForm); setEditStudent(null); setShowModal(true); };
  const openEdit = (s) => {
    setForm({
      name:s.name, rollNo:s.rollNo, email:s.email||'', phone:s.phone||'',
      parentPhone:s.parentPhone||'', address:s.address||'',
      batch:s.batch?._id||'', joinDate:s.joinDate?.split('T')[0]||'', isActive:s.isActive
    });
    setEditStudent(s);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.rollNo || !form.batch) return toast.error('Name, Roll No and Batch are required');
    setSaving(true);
    try {
      if (editStudent) {
        await updateStudent(editStudent._id, form);
        toast.success('Student updated!');
      } else {
        await createStudent(form);
        toast.success('Student added!');
      }
      setShowModal(false);
      load();
    } catch(err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);
      toast.success('Student removed');
      setDeleteConfirm(null);
      load();
    } catch { toast.error('Failed to delete'); }
  };

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Students</h2>
          <p>{students.length} students enrolled</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <FiPlus /> Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ padding: '16px 24px', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-bar">
            <span className="search-icon"><FiSearch /></span>
            <input placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-control" style={{ width: 200, marginBottom: 0 }}
            value={filterBatch} onChange={e => setFilterBatch(e.target.value)}>
            <option value="">All Batches</option>
            {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
          {(search || filterBatch) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setFilterBatch(''); }}>
              Clear Filters
            </button>
          )}
          <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-muted)' }}>
            Showing {filtered.length} of {students.length}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="loading-wrap"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👩‍🎓</div>
          <h3>No students found</h3>
          <p>{students.length === 0 ? 'Add your first student to get started' : 'Try adjusting your filters'}</p>
          {students.length === 0 && <button className="btn btn-primary" onClick={openCreate}><FiPlus /> Add Student</button>}
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll No</th>
                  <th>Batch</th>
                  <th>Contact</th>
                  <th>Join Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="avatar" style={{
                          background: `linear-gradient(135deg, ${s.batch?.color || '#6366f1'}, ${s.batch?.color || '#6366f1'}99)`,
                          color: '#fff', fontSize: 13
                        }}>{getInitials(s.name)}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                          {s.email && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        fontFamily: 'monospace', fontWeight: 700,
                        background: 'var(--surface2)', padding: '3px 8px', borderRadius: 6, fontSize: 13
                      }}>{s.rollNo}</span>
                    </td>
                    <td>
                      {s.batch && (
                        <span className="badge" style={{
                          background: s.batch.color + '22', color: s.batch.color,
                          border: `1px solid ${s.batch.color}44`
                        }}>{s.batch.name}</span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: 13 }}>
                        {s.phone && <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)' }}>
                          <FiPhone size={11} /> {s.phone}
                        </div>}
                        {s.parentPhone && <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-light)', marginTop: 2 }}>
                          <FiPhone size={11} /> {s.parentPhone} <span style={{ fontSize: 10 }}>(parent)</span>
                        </div>}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                      {s.joinDate ? format(new Date(s.joinDate), 'MMM d, yyyy') : '—'}
                    </td>
                    <td>
                      <span className={`badge ${s.isActive ? 'badge-green' : 'badge-gray'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(s)} title="Edit">
                          <FiEdit2 size={13} />
                        </button>
                        <button className="btn btn-icon btn-sm" onClick={() => setDeleteConfirm(s)}
                          style={{ background: '#fee2e2', color: '#ef4444', border: 'none' }} title="Delete">
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal modal-lg">
            <div className="modal-header">
              <h2 className="modal-title">{editStudent ? 'Edit Student' : 'Add New Student'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-control" placeholder="Student's full name" value={form.name}
                      onChange={e => setForm(f => ({...f, name: e.target.value}))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Roll Number *</label>
                    <input className="form-control" placeholder="e.g. YC001" value={form.rollNo}
                      onChange={e => setForm(f => ({...f, rollNo: e.target.value}))} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Batch *</label>
                    <select className="form-control" value={form.batch}
                      onChange={e => setForm(f => ({...f, batch: e.target.value}))} required>
                      <option value="">Select Batch</option>
                      {batches.map(b => <option key={b._id} value={b._id}>{b.name} — {b.subject}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Join Date</label>
                    <input type="date" className="form-control" value={form.joinDate}
                      onChange={e => setForm(f => ({...f, joinDate: e.target.value}))} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" placeholder="student@email.com" value={form.email}
                      onChange={e => setForm(f => ({...f, email: e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-control" placeholder="Student's phone" value={form.phone}
                      onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Parent's Phone</label>
                    <input className="form-control" placeholder="Parent/Guardian phone" value={form.parentPhone}
                      onChange={e => setForm(f => ({...f, parentPhone: e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <input className="form-control" placeholder="Home address" value={form.address}
                      onChange={e => setForm(f => ({...f, address: e.target.value}))} />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.isActive}
                      onChange={e => setForm(f => ({...f, isActive: e.target.checked}))} />
                    <span className="form-label" style={{ marginBottom: 0 }}>Active Student</span>
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editStudent ? 'Update Student' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="modal" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h2 className="modal-title">Remove Student</h2>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-muted)' }}>
                Remove <strong>{deleteConfirm.name}</strong> from the database? This cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm._id)}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
