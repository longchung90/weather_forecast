// Quick test script - DO NOT commit this file to git
// Add your actual API key here for local testing only

const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual key

// Test the API key
function testGoogleMapsKey() {
    const lat = 48.8566; // Paris
    const lon = 2.3522;
    
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=10&size=600x400&markers=color:red%7C${lat},${lon}&maptype=roadmap&format=png&key=${GOOGLE_MAPS_API_KEY}`;
    
    console.log('Testing map URL...');
    
    const img = new Image();
    img.onload = () => {
        console.log('✅ API key works!');
        document.body.appendChild(img);
    };
    
    img.onerror = () => {
        console.error('❌ API key failed');
    };
    
    img.src = mapUrl;
}

// Add this to your main script temporarily
window.GOOGLE_MAPS_API_KEY = GOOGLE_MAPS_API_KEY;