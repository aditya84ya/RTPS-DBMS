const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Get all trains (public)
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM trains');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch trains' });
    }
});

// Admin Route: Add a train
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    const { train_number, train_name, source_station, destination_station, departure_time, arrival_time, total_seats, fare_per_seat } = req.body;
    try {
        await db.query(
            `INSERT INTO trains 
            (train_number, train_name, source_station, destination_station, departure_time, arrival_time, total_seats, available_seats, fare_per_seat) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [train_number, train_name, source_station, destination_station, departure_time, arrival_time, total_seats, total_seats, fare_per_seat]
        );
        res.status(201).json({ message: 'Train added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add train' });
    }
});

// Admin Route: Update a train
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { train_number, train_name, source_station, destination_station, departure_time, arrival_time, total_seats, fare_per_seat } = req.body;
    try {
        await db.query(
            `UPDATE trains SET 
                train_number = ?, train_name = ?, source_station = ?, destination_station = ?, 
                departure_time = ?, arrival_time = ?, total_seats = ?, fare_per_seat = ?
            WHERE train_id = ?`,
            [train_number, train_name, source_station, destination_station, departure_time, arrival_time, total_seats, fare_per_seat, req.params.id]
        );
        // Note: Updates available_seats logic might need more handling if total_seats change dramatically. For simplicity, just updating fields.
        res.json({ message: 'Train updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update train' });
    }
});

// Admin Route: Delete a train
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        
        // Find tickets for this train to delete associated payments first
        const [tickets] = await connection.query('SELECT ticket_id FROM tickets WHERE train_id = ?', [req.params.id]);
        const ticketIds = tickets.map(t => t.ticket_id);
        
        if (ticketIds.length > 0) {
            await connection.query('DELETE FROM payments WHERE ticket_id IN (?)', [ticketIds]);
            await connection.query('DELETE FROM tickets WHERE train_id = ?', [req.params.id]);
        }
        
        // Delete the train itself
        await connection.query('DELETE FROM trains WHERE train_id = ?', [req.params.id]);
        
        await connection.commit();
        res.json({ message: 'Train deleted successfully' });
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ error: 'Failed to delete train. Server error.' });
    } finally {
        connection.release();
    }
});

module.exports = router;
