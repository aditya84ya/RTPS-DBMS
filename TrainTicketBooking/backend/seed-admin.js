const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
    try {
        const pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'Aditya@1010',
            database: 'train_booking_db'
        });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        await pool.execute(
            'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['Super Admin', 'superadmin@example.com', hashedPassword, 'admin']
        );

        console.log('Admin seeded successfully');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedAdmin();
