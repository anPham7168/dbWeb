const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctor');
const nurseRoutes = require('./routes/nurse');
const pharmacistRoutes = require('./routes/pharmacist');
const pingRoutes = require('./routes/ping'); // Used for simple testing

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/nurse', nurseRoutes);
app.use('/api/pharmacist', pharmacistRoutes);
app.use('/api', pingRoutes); // Support testing


const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));