const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres', 
    host: 'localhost', 
    database: 'Hospitals_ASM1', 
    password: '203031', 
    port: 5432, 
});

module.exports = pool;