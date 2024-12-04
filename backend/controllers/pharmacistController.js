const pool = require('../config/db');

// Search drug
const search = async (req, res) => {
    const { query } = req.query;
    try {
        const result = await pool.query(
            `SELECT drug_id, drug_name, quantity, price, 
            TO_CHAR(exp_date, 'YYYY-MM-DD') AS exp_date, effects, out_of_date
            FROM drugs
            WHERE drug_name ILIKE $1`,
            [`%${query}%`]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Add new drug
const add = async (req, res) => {
    const { drug_name, quantity, price, exp_date, effects } = req.body;
    try {
        await pool.query(
            `INSERT INTO drugs (drug_name, quantity, price, exp_date, effects)
            VALUES ($1, $2, $3, $4, $5)`,
            [drug_name, quantity, price, exp_date, effects]
        );
        res.send('Drug added successfully!');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Update drug's information
const update = async (req, res) => {
    const { drug_name, quantity, price, exp_date, effects } = req.body;
    try {
        const result = await pool.query(
            `UPDATE drugs
            SET quantity = $1, price = $2, exp_date = $3, effects = $4
            WHERE drug_name = $5`,
            [quantity, price, exp_date, effects, drug_name]
        );
        if (result.rowCount > 0) {
            res.send('Drug updated successfully!');
        } else {
            res.status(404).send('Drug not found.');
        } 
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Remove drug
const remove = async (req, res) => {
    const { drug_id } = req.query;
    try {
        console.log('Drug ID received for removal:', drug_id);
        if (!drug_id) {
            res.status(400).send('Drug ID is required.');
            return;
        }

        // Start a transaction
        const client = await pool.connect();

        try {
            await client.query('BEGIN'); // Begin transaction

            // Delete from drug_management table
            const drugManagementResult = await client.query(
                `DELETE FROM drug_management
                WHERE drug_id = $1`,
                [drug_id]
            );

            // Delete from drugs table
            const drugsResult = await client.query(
                `DELETE FROM drugs
                WHERE drug_id = $1`,
                [drug_id]
            );

            await client.query('COMMIT'); // Commit transaction

            if (drugsResult.rowCount > 0) {
                res.send('Drug removed successfully!');
            } else {
                res.status(404).send('Drug not found.');
            }
        } catch (transactionError) {
            await client.query('ROLLBACK'); // Rollback transaction on error
            console.error('Transaction error:', transactionError.message);
            res.status(500).send('An error occurred while removing the drug.');
        } finally {
            client.release(); // Release client back to the pool
        }
    } catch (error) {
        console.error('Error during drug removal:', error.message);
        res.status(500).send(error.message);
    }
};

module.exports = { search, add, update, remove };