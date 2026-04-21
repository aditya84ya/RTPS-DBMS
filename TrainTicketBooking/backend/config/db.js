const mysql = require('mysql2/promise');

const rawPort = process.env.DB_PORT;
if (rawPort && !/^\d+$/.test(rawPort)) {
    throw new Error('DB_PORT must be a valid numeric value');
}

const dbPort = rawPort ? Number(rawPort) : 3306;
const dbPassword = process.env.DB_PASSWORD;

if (!dbPassword) {
    throw new Error('DB_PASSWORD environment variable is required');
}

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: dbPassword,
    database: process.env.DB_NAME || 'train_booking_db',
    port: dbPort,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
