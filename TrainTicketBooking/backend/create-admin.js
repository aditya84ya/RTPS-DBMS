const db = require('./backend/config/db');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        const email = 'admin3@example.com';
        const password = 'admin';
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        await db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Admin Three', email, hashed, 'admin']);
        console.log('Admin created');
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
createAdmin();
