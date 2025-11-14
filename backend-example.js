// This would be a backend endpoint (e.g., /api/map)
// For Render, you'd create this as a separate service or serverless function

const express = require('express');
const app = express();

app.get('/api/map', (req, res) => {
    const { lat, lon } = req.query;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!lat || !lon) {
        return res.status(400).json({ error: 'Missing lat or lon parameters' });
    }
    
    // Return the map URL with API key
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=10&size=600x400&markers=color:red%7C${lat},${lon}&maptype=roadmap&format=png&key=${apiKey}`;
    
    // Option A: Return the URL
    res.json({ mapUrl });
    
    // Option B: Proxy the image directly
    // res.redirect(mapUrl);
});

app.listen(3000);