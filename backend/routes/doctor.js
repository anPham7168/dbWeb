const express = require('express');
const { upcoming, search, update } = require('../controllers/doctorController');
const router = express.Router();
// const db = require('../config/db');

// Fetching upcoming patients for the doctor
router.get('/upcoming', upcoming);
// router.get('/upcoming', async (req, res) => {
//     const { doc_ssn } = req.query;
//     try {
//         const result = await db.query(
//             `SELECT p.ssn, p.fname, p.lname, p.address
//             FROM patients p
//             JOIN examinations e ON p.ssn = e.pa_ssn
//             WHERE e.doc_ssn = $1 AND e.diagnosis IS NULL`,
//             [doc_ssn]
//         );
//         res.json(result.rows);
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

// Search patient examination records
router.get('/search', search);
// router.get('/search', async (req, res) => {
//     const { query } = req.query;
//     try {
//         const result = await db.query(
//             `SELECT e.*, p.fname, p.lname
//             FROM examinations e
//             JOIN patients p ON e.pa_ssn = p.ssn
//             WHERE p.ssn = $1 OR CONCAT(p.fname, ' ', p.lname) ILIKE $2`,
//             [query, `%${query}%`]
//         );
//         res.json(result.rows);
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

// Update an examination
router.put('/update', update);
// router.put('/update', async (req, res) => {
//     const { pa_ssn, diagnosis, medications } = req.body; 
//     try {
//         const result = await db.query(
//             `UPDATE examinations
//             SET diagnosis = $1, medications = $2 
//             WHERE pa_ssn = $3`,
//             [diagnosis, medications, pa_ssn]
//         );

//         if (result.rowCount > 0) {
//             res.send('Examination updated successfully!');
//         } else {
//             res.status(404).send('Examination not found.');
//         }
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

module.exports = router;