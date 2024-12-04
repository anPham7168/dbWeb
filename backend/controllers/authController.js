const pool = require('../config/db');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// Login function
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Fetch user by username
        const result = await pool.query('SELECT * FROM employees WHERE username = $1', [username]);

        if (result.rows.length === 0) return res.status(400).send('Invalid credentials');

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).send('Invalid credentials');

        // Generate JWT
        //const token = jwt.sign({ id: user.ssn, role: user.role }, 'jwt_secret', { expiresIn: '1h' });

        res.send({ ssn: user.ssn, role: user.role });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = { login };