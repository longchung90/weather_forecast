// Optional: Simple Express.js backend with rate limiting
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many weather requests, please try again later.'
});

app.use(cors());
app.use(limiter);

// Weather proxy endpoint
app.get('/api/weather/:lat/:lon', async (req, res) => {
    try {
        const { lat, lon } = req.params;

        // Validate coordinates
        if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
            return res.status(400).json({ error: 'Invalid coordinates' });
        }

        const response = await fetch(
            `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`
        );

        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error('Weather API error:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

app.listen(PORT, () => {
    console.log(`🌤️ Weather proxy server running on port ${PORT}`);
});