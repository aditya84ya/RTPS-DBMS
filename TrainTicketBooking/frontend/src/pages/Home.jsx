import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <motion.div 
        className="hero-content"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-gradient">Experience the Future<br />of Train Travel</h1>
        <p style={{ marginTop: '1.5rem', marginBottom: '3rem', fontSize: '1.25rem', color: 'var(--text-muted)' }}>
          Book your next journey with CaptainTrains. Seamless booking, realtime availability, and a 3D immersive experience.
        </p>

        <motion.div 
          className="glass-panel" 
          style={{ padding: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <button 
            className="btn-primary" 
            style={{ fontSize: '1.25rem', padding: '1rem 3rem' }}
            onClick={() => navigate('/trains')}
          >
            Find Tickets
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
