const pool = require('../config/db');

// Upcoming patients function
const upcoming = async (req, res) => {
    const { doc_ssn } = req.query;
    try {
        const result = await pool.query(
            `SELECT p.ssn, CONCAT(p.fname, ' ', p.lname) AS fullname, p.sex, 
            EXTRACT(YEAR FROM AGE(p.birth_date)) AS AGE, p.blood_type, 
            pms.allergies, pms.chronic_diseases, pms.cur_medicines
            FROM patients p
            JOIN patient_med_statuses pms ON p.ssn = pms.pa_ssn
            JOIN examinations e ON p.ssn = e.pa_ssn
            WHERE e.diagnosis IS NULL AND e.doc_ssn = $1`,
            [doc_ssn]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

// Search for a patient
const search = async (req, res) => {
    const { query, doc_ssn } = req.query;
    try {
        const result = await pool.query(
            `SELECT CONCAT(p.fname, ' ', p.lname) AS fullname, p.sex, 
            EXTRACT(YEAR FROM AGE(p.birth_date)) AS age, p.blood_type, 
            TO_CHAR(e.date, 'YYYY-MM-DD') AS date, e.diagnosis, e.medications
            FROM patients p
            JOIN examinations e ON p.ssn = e.pa_ssn
            WHERE e.doc_ssn = $1 AND (p.ssn = $2 OR CONCAT(p.fname, ' ', p.lname) ILIKE $3)`,
            [doc_ssn, query, `%${query}%`]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Update an examination
const update = async (req, res) => {
    const { pa_ssn, doc_ssn, diagnosis, medications } = req.body; 
    try {
        const result = await pool.query(
            `UPDATE examinations
            SET diagnosis = $1, medications = $2
            WHERE pa_ssn = $3 AND doc_ssn = $4`,
            [diagnosis, medications, pa_ssn, doc_ssn]
        );

        if (result.rowCount > 0) {
            res.send('Examination updated successfully!');
        } else {
            res.status(404).send('Examination not found.');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = { upcoming, search, update };