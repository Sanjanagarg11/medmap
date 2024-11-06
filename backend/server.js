// backend/server.js

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

// Initialize app and middleware
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // to parse JSON bodies
app.use(cors()); // Enable CORS to allow frontend to interact

// MySQL connection setup
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost', // Set environment variable or local
  user: process.env.MYSQL_USER || 'root',      // Set environment variable or local
  password: process.env.MYSQL_PASSWORD || '',  // Set environment variable or local
  database: 'medical_db',                      // Your database name
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// API to add a new patient record
app.post('/api/records', (req, res) => {
  const { name, age, disease } = req.body;

  const query = 'INSERT INTO patients (name, age, disease) VALUES (?, ?, ?)';
  db.query(query, [name, age, disease], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding record' });
    }
    res.status(201).json({ message: 'Record added successfully', data: result });
  });
});

// API to get all patient records
app.get('/api/records', (req, res) => {
  db.query('SELECT * FROM patients', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching records' });
    }
    res.status(200).json(results);
  });
});

// API to get a specific patient record by ID
app.get('/api/records/:id', (req, res) => {
  const patientId = req.params.id;
  db.query('SELECT * FROM patients WHERE id = ?', [patientId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching record' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.status(200).json(result[0]);
  });
});

// Serve static files (frontend HTML, CSS, JS) from 'frontend' directory
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Fallback to serve the doctor page as the main page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'doctor.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
