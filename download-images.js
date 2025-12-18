// Link to .env file
require('dotenv').config();

const https = require('https');
const fs = require('fs');

// Pull API key from .env
const API_KEY = process.env.PIXABAY_API_KEY;

// Check if API key exists
if (!API_KEY) {
    console.log('❌ Error: PIXABAY_API_KEY not found in .env file');
    process.exit(1);
}

// All cities to download (excluding your existing 20)
const cities = [
    // Europe Additional
    'oslo', 'reykjavik', 'edinburgh', 'luxembourg', 'zurich', 'monaco',
    'barcelona', 'milan', 'venice', 'florence', 'naples', 'porto',
    'valencia', 'seville', 'valletta', 'nicosia', 'munich', 'frankfurt',
    'hamburg', 'cologne', 'krakow', 'zagreb', 'ljubljana', 'belgrade',
    'sofia', 'sarajevo', 'skopje', 'tirana', 'podgorica', 'chisinau',
    'kyiv', 'minsk', 'moscow', 'st petersburg', 'tallinn', 'riga', 'vilnius',

    // Asia
    'tokyo', 'osaka', 'kyoto', 'beijing', 'shanghai', 'hong kong', 'seoul',
    'taipei', 'singapore', 'bangkok', 'kuala lumpur', 'jakarta', 'manila',
    'hanoi', 'ho chi minh', 'bali', 'phuket', 'mumbai', 'delhi', 'bangalore',
    'kolkata', 'kathmandu', 'dhaka', 'colombo', 'dubai', 'abu dhabi', 'doha',
    'riyadh', 'tel aviv', 'jerusalem', 'amman', 'beirut', 'istanbul', 'ankara',
    'tehran', 'kuwait city', 'muscat',

    // Africa
    'cairo', 'casablanca', 'marrakech', 'tunis', 'algiers', 'nairobi',
    'addis ababa', 'dar es salaam', 'kampala', 'kigali', 'lagos', 'accra',
    'dakar', 'abuja', 'cape town', 'johannesburg', 'durban', 'windhoek',
    'gaborone', 'harare', 'luanda', 'maputo',

    // North America
    'new york', 'los angeles', 'chicago', 'san francisco', 'miami',
    'washington dc', 'boston', 'seattle', 'las vegas', 'denver', 'houston',
    'dallas', 'phoenix', 'atlanta', 'new orleans', 'honolulu', 'toronto',
    'vancouver', 'montreal', 'calgary', 'ottawa', 'mexico city', 'cancun',
    'guadalajara',

    // Central America & Caribbean
    'havana', 'san juan', 'kingston', 'nassau', 'panama city', 'san jose',
    'guatemala city', 'belize city', 'santo domingo',

    // South America
    'rio de janeiro', 'sao paulo', 'buenos aires', 'lima', 'bogota',
    'santiago', 'caracas', 'quito', 'montevideo', 'asuncion', 'la paz',
    'cusco', 'medellin', 'cartagena',

    // Oceania
    'sydney', 'melbourne', 'brisbane', 'perth', 'adelaide', 'auckland',
    'wellington', 'queenstown', 'fiji'
];

// Download image from URL
const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filename);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filename, () => { });
            reject(err);
        });
    });
};

// Search Pixabay and download
const searchAndDownload = async (city) => {
    const searchTerm = `${city} city skyline`;
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(searchTerm)}&image_type=photo&orientation=horizontal&min_width=1920&per_page=3`;

    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', async () => {
                try {
                    const result = JSON.parse(data);
                    if (result.hits && result.hits.length > 0) {
                        const imageUrl = result.hits[0].largeImageURL;
                        const filename = `images/${city.replace(/\s+/g, '').toLowerCase()}.jpg`;

                        await downloadImage(imageUrl, filename);
                        console.log(`✅ Downloaded: ${city}`);
                        resolve(true);
                    } else {
                        console.log(`❌ No image found: ${city}`);
                        resolve(false);
                    }
                } catch (err) {
                    console.log(`❌ Error parsing: ${city}`);
                    reject(err);
                }
            });
        }).on('error', reject);
    });
};

// Main function
const main = async () => {
    console.log('🚀 Starting image download...\n');

    // Create images folder if it doesn't exist
    if (!fs.existsSync('images')) {
        fs.mkdirSync('images');
    }

    let success = 0;
    let failed = 0;

    for (const city of cities) {
        try {
            const result = await searchAndDownload(city);
            if (result) success++;
            else failed++;

            // Wait 500ms between requests (respect rate limits)
            await new Promise(r => setTimeout(r, 500));
        } catch (err) {
            console.log(`❌ Failed: ${city} - ${err.message}`);
            failed++;
        }
    }

    console.log('\n=============================');
    console.log(`🎉 Download complete!`);
    console.log(`✅ Success: ${success}`);
    console.log(`❌ Failed: ${failed}`);
    console.log('=============================');
};

main();