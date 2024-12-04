const express = require('express');
const { search, create, add } = require('../controllers/nurseController');
const router = express.Router();
// const db = require('../config/db');

// Search for a patient
router.get('/search', search);

// Create a new examination
router.put('/create', create);

// Add a new patient 
router.post('/add', add);
// router.post('/add-patient', async (req, res) => {
//     const { ssn, fname, lname, sex, dob, address, phone, insurance, emergency, blood, allergies, chronic, medicines } = req.body;
//     try {
//         await db.query(
//             `INSERT INTO patients (ssn, fname, lname, sex, birth_date, address, telephone, insurance_no, emer_contact, blood_type)
//             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
//             [ssn, fname, lname, sex, dob, address, phone, insurance, emergency, blood]
//         );
//         await db.query(
//             `INSERT INTO examinations (date, doc_ssn, pa_ssn)
//             VALUES (CURRENT_DATE, $1, $2)`,
//             []
//         )
//     } 
// })

module.exports = router;