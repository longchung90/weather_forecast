const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files from public directory
app.use(express.static('public'));



app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});