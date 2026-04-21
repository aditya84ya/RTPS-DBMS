import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { apiUrl } from '../config/api';

export default function BookingModal({ train, onClose }) {
  const { token, user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    age: '',
    gender: 'Male',
    email: user ? user.email : '',
    phone: '',
    journey_date: new Date().toISOString().split('T')[0],
    payment_mode: 'UPI'
  });
  
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [pnr, setPnr] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch(apiUrl('/api/booking/book'), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...formData,
          train_id: train.train_id
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setPnr(data.pnr);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div 
          className="glass-panel modal-content"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <h2 className="text-gradient">Booking Confirmed!</h2>
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Your PNR is</p>
              <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: 'var(--primary)' }}>{pnr}</h3>
              <button className="btn-secondary" style={{ marginTop: '2rem' }} onClick={() => { onClose(); window.location.reload(); }}>
                Close
              </button>
            </div>
          ) : (
            <>
              <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                Book Ticket: {train.train_name}
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Passenger Name</label>
                    <input type="text" className="form-control" name="name" required onChange={handleChange} value={formData.name} />
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input type="number" className="form-control" name="age" required onChange={handleChange} value={formData.age} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Gender</label>
                    <select className="form-control" name="gender" onChange={handleChange} value={formData.gender}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Payment Mode</label>
                    <select className="form-control" name="payment_mode" onChange={handleChange} value={formData.payment_mode}>
                      <option value="UPI">UPI</option>
                      <option value="CARD">Card</option>
                      <option value="CASH">Cash</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" className="form-control" name="email" required onChange={handleChange} value={formData.email} />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" className="form-control" name="phone" required onChange={handleChange} value={formData.phone} />
                </div>

                {status === 'error' && <p style={{ color: 'red', fontSize: '0.875rem' }}>Failed to book. Please try again.</p>}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                  <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Booking...' : `Pay ₹${train.fare_per_seat}`}
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
