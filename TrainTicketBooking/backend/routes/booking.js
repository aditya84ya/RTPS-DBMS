const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authMiddleware } = require('../middleware/authMiddleware');

// Get booking history for logged-in user
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT t.ticket_id, t.pnr_number, t.journey_date, t.seat_number, t.status, t.total_fare,
                   tr.train_name, tr.train_number, tr.source_station, tr.destination_station, tr.departure_time, tr.arrival_time,
                   p.name as passenger_name
            FROM tickets t
            JOIN trains tr ON t.train_id = tr.train_id
            JOIN passengers p ON t.passenger_id = p.passenger_id
            WHERE t.user_id = ?
            ORDER BY t.booking_date DESC
        `, [req.user.user_id]);
        
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// Book a ticket API
router.post('/book', authMiddleware, async (req, res) => {
    const { name, age, gender, email, phone, train_id, journey_date, payment_mode } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Find or create passenger
        let passenger_id;
        const [passengers] = await connection.query('SELECT passenger_id FROM passengers WHERE email = ?', [email]);
        
        if (passengers.length > 0) {
            passenger_id = passengers[0].passenger_id;
        } else {
            const [result] = await connection.query(
                'INSERT INTO passengers (name, age, gender, email, phone) VALUES (?, ?, ?, ?, ?)',
                [name, age, gender, email, phone]
            );
            passenger_id = result.insertId;
        }

        // 2. Call stored procedure to book ticket
        await connection.query('CALL sp_book_ticket(?, ?, ?, ?, ?, @pnr_out)', [
            train_id, passenger_id, req.user.user_id, journey_date, payment_mode
        ]);
        
        const [pnrResult] = await connection.query('SELECT @pnr_out as pnr');
        const pnrOut = pnrResult[0].pnr;
        
        await connection.commit();

        res.json({ message: 'Booking successful', pnr: pnrOut });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ error: 'Failed to book ticket' });
    } finally {
        if (connection) connection.release();
    }
});

// Cancel a ticket API
router.post('/cancel', authMiddleware, async (req, res) => {
    const { pnr_number } = req.body;
    try {
        // sp_cancel_ticket now checks ownership internally using p_user_id
        await db.query('CALL sp_cancel_ticket(?, ?)', [pnr_number, req.user.user_id]);
        res.json({ message: 'Ticket cancelled successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to cancel ticket. Unauthorized or already cancelled.' });
    }
});

module.exports = router;
