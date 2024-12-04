const express = require('express');
const { search, add, update, remove } = require('../controllers/pharmacistController');
const router = express.Router();

// Search a drug
router.get('/search', search);

// Add a new drug
router.post('/add', add);

// Update drug's information
router.put('/update', update);

// Remove drug
router.delete('/remove', remove);

module.exports = router;