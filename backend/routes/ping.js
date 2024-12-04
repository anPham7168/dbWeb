const express = require('express');
const router = express.Router();
const {Ping} = require('../controllers/pingController');

router.get('/ping', Ping);
module.exports = router;