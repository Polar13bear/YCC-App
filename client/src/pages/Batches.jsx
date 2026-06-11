import { useEffect, useState } from 'react';
import { getBatches, createBatch, updateBatch, deleteBatch } from '../api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiClock, FiCalendar } from 'react-icons/fi';

const COLORS = ['#6366f1','#8b5cf6','#ec4899','#ef4444','#f59e0b','#10b981','#3b82f6','#06b6d4','#84cc16','#f97316'];
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const emptyForm = { name:'', subject:'', startTime:'', endTime:'', days:[], description:'', color:'#6366f1', isActive:true };

export default function Batches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBatch, setEditBatch] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = () => {
    setLoading(true);
    getBatches().then(r => setBatches(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditBatch(null); setShowModal(true); };
  const openEdit = (b) => {
    setForm({ name:b.name, subject:b.subject, startTime:b.startTime||'', endTime:b.endTime||'',
      days:b.days||[], description:b.description||'', color:b.color||'#6366f1', isActive:b.isActive });
    setEditBatch(b);
    setShowModal(true);
  };

  const toggleDay = (d) => {
    setForm(f => ({ ...f, days: f.days.includes(d) ? f.days.filter(x=>x!==d) : [...f.days, d] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.subject) return toast.error('Name and subject are required');
    setSaving(true);
    try {
      if (editBatch) {
        await updateBatch(editBatch._id, form);
        toast.success('Batch updated!');
      } else {
        await createBatch(form);
        toast.success('Batch created!');
      }
      setShowModal(false);
      load();
    } catch(err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBatch(id);
      toast.success('Batch deleted');
      setDeleteConfirm(null);
      load();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Batches</h2>
          <p>Manage all your teaching batches</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <FiPlus /> New Batch
        </button>
      </div>

      {loading ? (
        <div className="loading-wrap"><div className="spinner" /></div>
      ) : batches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No batches yet</h3>
          <p>Create your first batch to get started</p>
          <button className="btn btn-primary" onClick={openCreate}><FiPlus /> Create Batch</button>
        </div>
      ) : (
        <div className="batch-grid">
          {batches.map(b => (
            <div className="batch-card" key={b._id}>
              <div className="batch-card-header" style={{ background: `linear-gradient(135deg, ${b.color}, ${b.color}cc)` }}>
                <div className="batch-card-icon">📚</div>
                <div className="batch-card-name">{b.name}</div>
                <div className="batch-card-subject">{b.subject}</div>
              </div>
              <div className="batch-card-body">
                <div className="batch-card-info">
                  {(b.startTime && b.endTime) && (
                    <div className="batch-info-item">
                      <FiClock size={13} />
                      {b.startTime} – {b.endTime}
                    </div>
                  )}
                  {b.days?.length > 0 && (
                    <div className="batch-info-item">
                      <FiCalendar size={13} />
                      {b.days.join(', ')}
                    </div>
                  )}
                  <div className="batch-info-item">
                    <FiUsers size={13} />
                    {b.studentCount || 0} Students
                  </div>
                </div>
                {b.description && (
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.5 }}>
                    {b.description}
                  </p>
                )}
              </div>
              <div className="batch-card-footer">
                <span className={`badge ${b.isActive ? 'badge-green' : 'badge-gray'}`}>
                  {b.isActive ? 'Active' : 'Inactive'}
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(b)} title="Edit">
                    <FiEdit2 size={14} />
                  </button>
                  <button className="btn btn-icon btn-sm" onClick={() => setDeleteConfirm(b)}
                    style={{ background: '#fee2e2', color: '#ef4444', border: 'none' }} title="Delete">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editBatch ? 'Edit Batch' : 'Create New Batch'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Batch Name *</label>
                    <input className="form-control" placeholder="e.g. Batch A" value={form.name}
                      onChange={e => setForm(f => ({...f, name: e.target.value}))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject *</label>
                    <input className="form-control" placeholder="e.g. Mathematics" value={form.subject}
                      onChange={e => setForm(f => ({...f, subject: e.target.value}))} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Time</label>
                    <input type="time" className="form-control" value={form.startTime}
                      onChange={e => setForm(f => ({...f, startTime: e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Time</label>
                    <input type="time" className="form-control" value={form.endTime}
                      onChange={e => setForm(f => ({...f, endTime: e.target.value}))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Class Days</label>
                  <div className="day-chips">
                    {DAYS.map(d => (
                      <span key={d} className={`day-chip ${form.days.includes(d) ? 'selected' : ''}`}
                        onClick={() => toggleDay(d)}>{d}</span>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={2} placeholder="Optional notes..."
                    value={form.description}
                    onChange={e => setForm(f => ({...f, description: e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Color</label>
                  <div className="color-options">
                    {COLORS.map(c => (
                      <div key={c} className={`color-option ${form.color === c ? 'selected' : ''}`}
                        style={{ background: c }} onClick={() => setForm(f => ({...f, color: c}))} />
                    ))}
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.isActive}
                      onChange={e => setForm(f => ({...f, isActive: e.target.checked}))} />
                    <span className="form-label" style={{ marginBottom: 0 }}>Active Batch</span>
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editBatch ? 'Update Batch' : 'Create Batch'}
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
              <h2 className="modal-title">Delete Batch</h2>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-muted)' }}>
                Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm._id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
