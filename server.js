const express = require("express");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from /public
app.use(express.static(path.join(__dirname, "public")));

// Inject API key dynamically
app.get("/", (req, res) => {
    let html = fs.readFileSync(path.join(__dirname, "public", "index.html"), "utf8");
    html = html.replace("GOOGLE_MAPS_API_KEY_PLACEHOLDER", process.env.MY_WEATHER_MAP_KEY);
    res.send(html);
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
