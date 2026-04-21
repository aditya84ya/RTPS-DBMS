import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, PlusCircle, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../config/api';

export default function AdminDashboard() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
      train_id: null,
      train_number: '',
      train_name: '',
      source_station: '',
      destination_station: '',
      departure_time: '',
      arrival_time: '',
      total_seats: '',
      fare_per_seat: ''
  });

  useEffect(() => {
      if (!user || user.role !== 'admin') {
          navigate('/');
          return;
      }
      fetchTrains();
  }, [user, navigate]);

  const fetchTrains = () => {
      setLoading(true);
      fetch(apiUrl('/api/trains'))
        .then(res => res.json())
        .then(data => {
            setTrains(data);
            setLoading(false);
        })
        .catch(err => console.error(err));
  };

  const handleChange = (e) => {
      setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleEdit = (train) => {
      setFormData({
          train_id: train.train_id,
          train_number: train.train_number,
          train_name: train.train_name,
          source_station: train.source_station,
          destination_station: train.destination_station,
          departure_time: train.departure_time,
          arrival_time: train.arrival_time,
          total_seats: train.total_seats,
          fare_per_seat: train.fare_per_seat
      });
      setShowForm(true);
  };

  const handleDelete = async (id) => {
      if (!window.confirm("Are you sure you want to delete this train?")) return;
      try {
          const res = await fetch(apiUrl(`/api/trains/${id}`), {
              method: 'DELETE',
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });
          if (res.ok) {
              fetchTrains();
          } else {
              const data = await res.json();
              alert(data.error || 'Failed to delete');
          }
      } catch (err) {
          console.error(err);
      }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      const isUpdating = formData.train_id !== null;
      const url = isUpdating 
          ? apiUrl(`/api/trains/${formData.train_id}`) 
          : apiUrl('/api/trains/');
          
      const method = isUpdating ? 'PUT' : 'POST';

      try {
          const res = await fetch(url, {
              method,
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(formData)
          });

          if (res.ok) {
              fetchTrains();
              resetForm();
          } else {
              const data = await res.json();
              alert(data.error || 'Failed to save');
          }
      } catch (err) {
          console.error(err);
      }
  };

  const resetForm = () => {
      setFormData({
          train_id: null,
          train_number: '',
          train_name: '',
          source_station: '',
          destination_station: '',
          departure_time: '',
          arrival_time: '',
          total_seats: '',
          fare_per_seat: ''
      });
      setShowForm(false);
  };

  return (
    <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem', maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h2 className="text-gradient" style={{ margin: 0 }}>Admin Dashboard</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Manage all trains in the system.</p>
          </div>
          <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle size={20} /> Add New Train
          </button>
      </div>

      {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel" 
            style={{ padding: '2rem', marginBottom: '3rem', position: 'relative' }}
          >
              <button 
                  onClick={resetForm}
                  style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                  <X size={24} />
              </button>
              <h3 style={{ marginTop: 0, marginBottom: '2rem' }}>{formData.train_id ? 'Update Train' : 'Add New Train'}</h3>
              
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="form-group">
                      <label>Train Number</label>
                      <input type="text" name="train_number" value={formData.train_number} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                      <label>Train Name</label>
                      <input type="text" name="train_name" value={formData.train_name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                      <label>Source Station</label>
                      <input type="text" name="source_station" value={formData.source_station} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                      <label>Destination Station</label>
                      <input type="text" name="destination_station" value={formData.destination_station} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                      <label>Departure Time (HH:MM:SS)</label>
                      <input type="time" step="1" name="departure_time" value={formData.departure_time} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                      <label>Arrival Time (HH:MM:SS)</label>
                      <input type="time" step="1" name="arrival_time" value={formData.arrival_time} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                      <label>Total Seats</label>
                      <input type="number" name="total_seats" value={formData.total_seats} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                      <label>Fare Per Seat (₹)</label>
                      <input type="number" step="0.01" name="fare_per_seat" value={formData.fare_per_seat} onChange={handleChange} required />
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                      <button type="button" onClick={resetForm} className="btn-secondary" style={{ padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', background: 'var(--surface-hover)', cursor: 'pointer', color: 'white' }}>Cancel</button>
                      <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: '8px' }}>{formData.train_id ? 'Save Changes' : 'Create Train'}</button>
                  </div>
              </form>
          </motion.div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading trains...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {trains.map((train, index) => (
            <motion.div 
              key={train.train_id}
              className="glass-panel"
              style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid var(--primary)' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {train.train_name} <span style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>#{train.train_number}</span>
                  </h4>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      {train.source_station} → {train.destination_station} | {train.departure_time.substring(0,5)} - {train.arrival_time.substring(0,5)} | ₹{train.fare_per_seat}
                  </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                      onClick={() => handleEdit(train)}
                      style={{ background: 'rgba(250, 204, 21, 0.1)', color: '#facc15', border: '1px solid rgba(250, 204, 21, 0.2)', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Edit Train"
                  >
                      <Edit2 size={18} />
                  </button>
                  <button 
                      onClick={() => handleDelete(train.train_id)}
                      style={{ background: 'rgba(248, 113, 113, 0.1)', color: '#f87171', border: '1px solid rgba(248, 113, 113, 0.2)', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Delete Train"
                  >
                      <Trash2 size={18} />
                  </button>
              </div>
            </motion.div>
          ))}
          {trains.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No trains found.</div>
          )}
        </div>
      )}
    </div>
  );
}
