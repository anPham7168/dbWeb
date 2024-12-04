const pool = require('../config/db');

// Search patient
const search = async (req, res) => {
    const { query } = req.query;
    console.log("Search query received:", query);
    try {
        const result = await pool.query(
            `SELECT ssn, CONCAT(fname, ' ', lname) AS fullname, sex, 
            EXTRACT(YEAR FROM AGE(birth_date)) AS age, insurance_no, 
            emer_contact, blood_type
            FROM patients
            WHERE ssn = $1 OR CONCAT(fname, ' ', lname) ILIKE $2`,
            [query, `%${query}%`]
        );
        console.log("Search results:", result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error("Error during search:", error.message);
        res.status(500).send(error.message);
    }
};

// Create a new examination
const create = async (req, res) => {
    const { pa_ssn, doc_ssn } = req.body;
    try {
        console.log("Received Data:", { pa_ssn, doc_ssn});
        await pool.query(
            `INSERT INTO examinations (date, doc_ssn, pa_ssn)
            VALUES (CURRENT_DATE, $1, $2)`,
            [doc_ssn, pa_ssn]
        );
        res.send('Examination created for patient.');
    } catch (error) {
        console.error("Errorr Details:", error);
        res.status(500).send(error.message);
    }
};

// Add a new patient
const add = async (req, res) => {
    const { ssn, fname, lname, sex, birth_date, address, telephone, insurance_no, emer_contact, blood_type, nur_ssn, doc_ssn } = req.body;
    const client = await pool.connect(); // Start a transaction

    try {
        await client.query('BEGIN'); // Begin transaction

        // Insert a new patient
        await client.query(
            `INSERT INTO patients (ssn, fname, lname, sex, birth_date, 
            address, telephone, insurance_no, emer_contact, blood_type, nur_ssn)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [ssn, fname, lname, sex, birth_date, address, telephone, insurance_no, emer_contact, blood_type, nur_ssn]
        );

        // Create a new examination for the patient
        await client.query(
            `INSERT INTO examinations (date, doc_ssn, pa_ssn)
            VALUES (CURRENT_DATE, $1, $2)`,
            [doc_ssn, ssn]
        );

        await client.query('COMMIT'); // Commit transaction
        res.send('Patient added and examination created successfully!');
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        res.status(500).send(error.message);
    } finally {
        client.release(); // Release the client
    }
};

module.exports = { search, create, add };