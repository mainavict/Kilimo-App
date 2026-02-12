// src/server.js
require ('dotenv').config();
const express = require('express');

const app = express();
const PORT = 5000; 

app.get('/', (req, res) => {
  res.send(' Kilimo Backend!');
});

app.listen(PORT, () => {
  console.log(`Kilimo Backend server running on port ${PORT}`);
});