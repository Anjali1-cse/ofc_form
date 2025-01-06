const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();



const app = express();
const port = 5001; // Backend server will run on port 5000

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection Pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD.trim(), // Use trim to remove extra whitespace
    port: process.env.DB_PORT,
  });
  
  
// Test database connection
pool.connect((err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
  } else {
    console.log('Connected to PostgreSQL database');
  }
});
// Route to fetch unique Regions from TEJAS_DWDM
app.get('/regions', async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT "region_code" FROM "pop_view" ORDER BY "region_code";');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Route to fetch unique Territories from TEJAS_DWDM
app.get('/territories', async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT "territory_code" FROM "pop_view" ORDER BY "territory_code";');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Route to fetch unique Territories from TEJAS_DWDM
app.get('/popcode', async (req, res) => {
  try {
      const result = await pool.query('SELECT DISTINCT "pop_code" FROM "pop_view" ORDER BY "pop_code";');
      res.json(result.rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

// Route to insert form data into new_ofc_coordinates
app.post('/submit', async (req, res) => {
  const {
      region,
      territory,
      section,
      a_end_short_pop,
      b_end_short_pop,
      a_end,
      a_latitude,
      a_longitude,
      b_pop,
      b_latitude,
      b_longitude,
  } = req.body;

  try {
      const query = `
          INSERT INTO new_ofc_coordinates (
              region,
              territory,
              section,
              a_end_short_pop,
              b_end_short_pop,
              a_end,
              a_latitude,
              a_longitude,
              b_pop,
              b_latitude,
              b_longitude
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `;

      await pool.query(query, [
          region,
          territory,
          section,
          a_end_short_pop,
          b_end_short_pop,
          a_end,
          a_latitude,
          a_longitude,
          b_pop,
          b_latitude,
          b_longitude,
      ]);

      res.status(200).json({ message: 'Data inserted successfully' });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Error inserting data into the database');
  }
});



// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
