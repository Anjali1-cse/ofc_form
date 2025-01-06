const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD.trim(),
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

// Route to fetch unique Regions from pop_view
app.get('/regions', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT "region_code" FROM "pop_view" ORDER BY "region_code";');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route to fetch unique Territories from pop_view based on region_code
app.get('/territories', async (req, res) => {
  const { region_code } = req.query;
  try {
    const query = `SELECT DISTINCT "territory_code" FROM "pop_view" WHERE "region_code" = $1 ORDER BY "territory_code";`;
    const result = await pool.query(query, [region_code]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route to fetch unique POP codes from pop_view
app.get('/popcode', async (req, res) => {
  const { region_code } = req.query;
  try {
    // Corrected query
    const result = await pool.query('SELECT DISTINCT "pop_code" FROM "pop_view" WHERE "region_code" = $1 ORDER BY "pop_code";', [region_code]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Route to fetch unique Sections from MDWDM_ROUTES
app.get('/sections', async (req, res) => {
  const { region_code } = req.query;
    try {
    const result = await pool.query('SELECT DISTINCT "ROUTE_NAME" FROM "MDWDM_ROUTES" WHERE "REGION" = $1 ORDER BY "ROUTE_NAME";',[region_code]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route to insert form data into new_ofc_coordinates table
app.post('/submit', async (req, res) => {
  const {
    region,
    territory,
    section,
    cable_type,
    a_end_short_pop,
    b_end_short_pop,
    a_end,
    a_latitude,
    a_longitude,
    b_end,
    b_latitude,
    b_longitude,
  } = req.body;

  try {
    const query = `
      INSERT INTO new_ofc_coordinates (
        region,
        territory,
        section,
        cable_type,
        a_end_short_pop,
        b_end_short_pop,
        a_end,
        a_latitude,
        a_longitude,
        b_end,
        b_latitude,
        b_longitude
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `;

    await pool.query(query, [
      region,
      territory,
      section,
      cable_type,
      a_end_short_pop,
      b_end_short_pop,
      a_end,
      a_latitude,
      a_longitude,
      b_end,
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
