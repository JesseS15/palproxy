const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)); // Use node-fetch for Node.js

const app = express();
app.use(cors());
app.use(express.json());

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyBuEiNqa5Tmkh83oTXKXZBdjx9MNdPKxgsgwD60q2VWCEsoJVKqv7hxfEDb56V2f9B/exec'; // Replace with your correct Apps Script URL

app.post('/proxy', async (req, res) => {
  try {
    console.log('Received request:', req.body); // Log incoming request for debugging

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    console.log('Google Apps Script response:', data); // Log the response from Google Apps Script
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error proxying request:', error); // Log the error
    res.status(500).send('Error proxying request');
  }
});

// Handle OPTIONS requests (for preflight checks)
app.options('/proxy', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(204); // No content for OPTIONS
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
