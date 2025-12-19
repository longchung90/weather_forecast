// ===============================
// 📦 Imports & Config
// ===============================
import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { Resend } from "resend";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===============================
// 🌍 Middleware
// ===============================
app.use(cors({
    origin: [
        // Portfolio site
        'https://lcportfolio.org',
        'https://www.lcportfolio.org',
        'https://api.lcportfolio.org',

        // Weather site ✅ NEW
        'https://weather-forecast-global.onrender.com',

        // Local development
        'http://localhost:10000',
        'http://localhost:3000',
        'http://localhost:5500',
        'http://127.0.0.1:5500'
    ],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

// ✅ Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// 📬 Contact API - Portfolio
// ===============================
const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/api/contact", async (req, res) => {
    console.log("📬 Contact form received:", req.body);

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            error: "All fields are required"
        });
    }

    try {
        const data = await resend.emails.send({
            from: "Portfolio Contact <onboarding@resend.dev>",
            to: "chunglonghoa@gmail.com",
            subject: `New message from ${name}`,
            html: `
                <h2>New Message from Portfolio</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
        });

        console.log("✅ Email sent successfully:", data);
        res.json({ success: true, data });
    } catch (error) {
        console.error("❌ Email send failed:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ===============================
// 🏙️ City Request API - Weather Site ✅ NEW
// ===============================
app.post("/api/city-request", async (req, res) => {
    console.log("🏙️ City request received:", req.body);

    const { cityName, userEmail, message } = req.body;

    if (!cityName) {
        return res.status(400).json({
            success: false,
            error: "City name is required"
        });
    }

    try {
        const data = await resend.emails.send({
            from: "Weather Site <onboarding@resend.dev>",
            to: "chunglonghoa@gmail.com",
            subject: `🏙️ New City Request: ${cityName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4a90d9; border-bottom: 2px solid #4a90d9; padding-bottom: 10px;">
                        🌍 New City Background Request
                    </h2>
                    
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">City Requested:</p>
                        <p style="margin: 5px 0 0 0; font-size: 1.5rem; font-weight: bold;">${cityName}</p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p style="margin: 0 0 10px 0;"><strong>📧 User Email:</strong></p>
                        <p style="margin: 0; color: #555;">${userEmail || 'Not provided'}</p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p style="margin: 0 0 10px 0;"><strong>💬 Message:</strong></p>
                        <p style="margin: 0; color: #555;">${message || 'No additional details'}</p>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    
                    <p style="color: #888; font-size: 0.85rem; text-align: center;">
                        Sent from Global Weather Explorer Contact Form
                    </p>
                </div>
            `,
        });

        console.log("✅ City request email sent:", data);
        res.json({ success: true, message: "Request sent!" });
    } catch (error) {
        console.error("❌ City request email failed:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ===============================
// 🏠 SPA Fallback - MUST BE LAST!
// ===============================
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===============================
// 🚀 Start Server
// ===============================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📬 Portfolio contact: POST /api/contact`);
    console.log(`🏙️ City requests: POST /api/city-request`);
});