import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import BookingModal from '../components/BookingModal';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function TrainsList() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/trains')
      .then(res => res.json())
      .then(data => {
        setTrains(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleBookClick = (train) => {
      if (!user) {
          alert('You must be logged in to book a ticket.');
          navigate('/auth');
          return;
      }
      setSelectedTrain(train);
  };

  const calculateDuration = (dep, arr) => {
      // Assuming HH:MM:SS
      const dParts = dep.split(':').map(Number);
      const aParts = arr.split(':').map(Number);
      let diffMins = (aParts[0]*60 + aParts[1]) - (dParts[0]*60 + dParts[1]);
      if (diffMins < 0) diffMins += 24 * 60;
      const h = Math.floor(diffMins / 60);
      const m = diffMins % 60;
      return `${h}h ${m}m`;
  };

  return (
    <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem', maxWidth: '1000px' }}>
      <h2 className="text-gradient" style={{ textAlign: 'center', marginBottom: '3rem' }}>Trains Available</h2>
      
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading trains...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {trains.map((train, index) => (
            <motion.div 
              key={train.train_id}
              className="glass-panel"
              style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {/* Train Info */}
              <div style={{ flex: '1', minWidth: '200px' }}>
                <h3 style={{ margin: '0 0 0.25rem 0' }}>{train.train_name}</h3>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>#{train.train_number}</span>
              </div>
              
              {/* Route & Duration */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: '2', minWidth: '300px' }}>
                  <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'Outfit' }}>{train.departure_time.substring(0, 5)}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{train.source_station}</div>
                  </div>
                  <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          {calculateDuration(train.departure_time, train.arrival_time)}
                      </span>
                      <div style={{ width: '100%', height: '2px', backgroundColor: 'var(--border-light)', position: 'relative' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)', position: 'absolute', top: '-2px', left: '0' }} />
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)', position: 'absolute', top: '-2px', right: '0' }} />
                      </div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'Outfit' }}>{train.arrival_time.substring(0, 5)}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{train.destination_station}</div>
                  </div>
              </div>
              
              {/* Booking Actions */}
              <div style={{ display: 'flex', flex: '1', justifyContent: 'flex-end', alignItems: 'center', gap: '1.5rem', minWidth: '200px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>₹{train.fare_per_seat}</div>
                    <div style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        color: train.available_seats > 100 ? '#4ade80' : train.available_seats > 0 ? '#facc15' : '#f87171' 
                    }}>
                        {train.available_seats} Seats Available
                    </div>
                </div>
                <button 
                  className="btn-primary" 
                  onClick={() => handleBookClick(train)}
                  style={{ opacity: train.available_seats > 0 ? 1 : 0.5, padding: '0.75rem 1.5rem' }}
                  disabled={train.available_seats === 0}
                >
                  Book
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedTrain && (
        <BookingModal train={selectedTrain} onClose={() => setSelectedTrain(null)} />
      )}
    </div>
  );
}
