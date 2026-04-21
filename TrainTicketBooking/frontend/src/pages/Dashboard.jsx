import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { token, user } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/auth');
            return;
        }
        fetchHistory();
    }, [token]);

    const fetchHistory = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/booking/history', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setHistory(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleCancel = async (pnr) => {
        if (!window.confirm('Are you sure you want to cancel this ticket?')) return;
        try {
            const res = await fetch('http://localhost:5000/api/booking/cancel', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ pnr_number: pnr })
            });
            
            if (res.ok) {
                alert('Ticket cancelled successfully.');
                fetchHistory();
            } else {
                alert('Failed to cancel ticket.');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
            <h2 className="text-gradient">Welcome, {user?.name}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Here are your booking details and journey history.</p>
            
            {loading ? <p>Loading history...</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {history.length === 0 ? (
                        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                            <h3 style={{ color: 'var(--text-muted)' }}>You have no bookings yet.</h3>
                            <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/trains')}>Book a Ticket</button>
                        </div>
                    ) : history.map((ticket, index) => (
                        <motion.div 
                            key={ticket.ticket_id}
                            className="glass-panel"
                            style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: ticket.status === 'CANCELLED' ? 0.6 : 1 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div>
                                <h3 style={{ marginBottom: '0.5rem' }}>{ticket.train_name} ({ticket.train_number})</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                    PNR: <strong style={{ color: 'var(--text-main)' }}>{ticket.pnr_number}</strong> | Passenger: {ticket.passenger_name}
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
                                    <span>{ticket.source_station} ({ticket.departure_time.substring(0, 5)})</span>
                                    <span>➔</span>
                                    <span>{ticket.destination_station} ({ticket.arrival_time.substring(0, 5)})</span>
                                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>₹{ticket.total_fare}</span>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                                <span style={{ 
                                    padding: '0.25rem 0.75rem', 
                                    borderRadius: '12px', 
                                    fontSize: '0.875rem', 
                                    fontWeight: 600,
                                    backgroundColor: ticket.status === 'CONFIRMED' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                    color: ticket.status === 'CONFIRMED' ? '#4ade80' : '#f87171'
                                }}>
                                    {ticket.status}
                                </span>
                                
                                {ticket.status === 'CONFIRMED' && (
                                    <button 
                                        className="btn-secondary" 
                                        style={{ borderColor: '#ef4444', color: '#ef4444', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                        onClick={() => handleCancel(ticket.pnr_number)}
                                    >
                                        Cancel Ticket
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
