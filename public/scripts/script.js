// ===============================================================
// 1. DOM ELEMENTS
// ===============================================================
const elements = {
    // Existing
    btn: document.getElementById("getForecastBtn"),
    select: document.getElementById("citySelect"),
    section: document.getElementById("forecastSection"),
    grid: document.getElementById("weatherGrid"),
    cityName: document.getElementById("forecastCityName"),
    cityIcon: document.getElementById("forecastCityIcon"),
    overlay: document.getElementById("loadingOverlay"),

    // New for search
    searchInput: document.getElementById("citySearch"),
    searchBtn: document.getElementById("searchBtn"),
    searchResults: document.getElementById("searchResults")
};

// ===============================================================
// 2. CONFIGURATION
// ===============================================================
const CONFIG = {
    TRANSITION: 800,
    API_PRODUCT: "civil",
    SEARCH_DEBOUNCE: 300
};

// ===============================================================
// 3. STATE VARIABLES (NEW)
// ===============================================================
let selectedCity = null;
let currentBgLayer = null;
let map = null;
let marker = null;

// ===============================================================
// 4. WEATHER ICONS
// ===============================================================
const ICONS_IOS = {
    clear: "☀️",
    pcloudy: "⛅",
    mcloudy: "🌥️",
    cloudy: "☁️",
    humid: "🌫️",
    lightrain: "🌦️",
    oshower: "🌦️",
    ishower: "🌦️",
    rain: "🌧️",
    lightsnow: "🌨️",
    snow: "❄️",
    rainsnow: "🌧️❄️",
    ts: "⛈️",
    tsrain: "⛈️",
    windy: "💨",
    clearday: "☀️",
    clearnight: "🌕",
    pcloudyday: "⛅",
    pcloudynight: "🌥️",
    mcloudyday: "🌥️",
    mcloudynight: "☁️",
    cloudyday: "☁️",
    cloudynight: "☁️",
    humidday: "🌫️",
    humidnight: "🌫️",
    lightrainday: "🌦️",
    lightrainnight: "🌧️",
    oshowerday: "🌦️",
    oshowernight: "🌧️",
    ishowerday: "🌦️",
    ishowernight: "🌧️",
    rainday: "🌧️",
    rainnight: "🌧️",
    lightsnowday: "🌨️",
    lightsnownight: "🌨️",
    snowday: "❄️",
    snownight: "❄️",
    rainsnowday: "🌧️❄️",
    rainsnownight: "🌧️❄️",
    tsday: "⛈️",
    tsnight: "⛈️",
    tsrainday: "⛈️",
    tsrainnight: "⛈️",
    default: "❓"
};

// ===============================================================
// 5. WEATHER LABELS
// ===============================================================
const WEATHER_DETAILS = {
    clear: "Clear",
    pcloudy: "Partly Cloudy",
    mcloudy: "Mostly Cloudy",
    cloudy: "Cloudy",
    humid: "Humid",
    lightrain: "Light Rain",
    oshower: "Showers",
    ishower: "Showers",
    rain: "Rain",
    lightsnow: "Light Snow",
    snow: "Snow",
    rainsnow: "Rain & Snow",
    ts: "Thunderstorm",
    tsrain: "Thunderstorm",
    windy: "Windy",
    clearday: "Clear",
    clearnight: "Clear",
    pcloudyday: "Partly Cloudy",
    pcloudynight: "Partly Cloudy",
    mcloudyday: "Mostly Cloudy",
    mcloudynight: "Mostly Cloudy",
    cloudyday: "Cloudy",
    cloudynight: "Cloudy",
    humidday: "Humid",
    humidnight: "Humid",
    lightrainday: "Light Rain",
    lightrainnight: "Light Rain",
    oshowerday: "Showers",
    oshowernight: "Showers",
    ishowerday: "Showers",
    ishowernight: "Showers",
    rainday: "Rain",
    rainnight: "Rain",
    lightsnowday: "Light Snow",
    lightsnownight: "Light Snow",
    snowday: "Snow",
    snownight: "Snow",
    rainsnowday: "Rain & Snow",
    rainsnownight: "Rain & Snow",
    tsday: "Thunderstorm",
    tsnight: "Thunderstorm",
    tsrainday: "Thunderstorm",
    tsrainnight: "Thunderstorm",
    default: "Unknown"
};

// ===============================================================
// 6. CITIES DATABASE (170 cities)
// ===============================================================
const CITIES_DATA = {
    // EUROPE
    paris: { name: "Paris", country: "France", lat: 48.8566, lon: 2.3522, flag: "🇫🇷", region: "Europe" },
    london: { name: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278, flag: "🇬🇧", region: "Europe" },
    brussels: { name: "Brussels", country: "Belgium", lat: 50.8503, lon: 4.3517, flag: "🇧🇪", region: "Europe" },
    amsterdam: { name: "Amsterdam", country: "Netherlands", lat: 52.3676, lon: 4.9041, flag: "🇳🇱", region: "Europe" },
    geneva: { name: "Geneva", country: "Switzerland", lat: 46.2044, lon: 6.1432, flag: "🇨🇭", region: "Europe" },
    zurich: { name: "Zürich", country: "Switzerland", lat: 47.3769, lon: 8.5417, flag: "🇨🇭", region: "Europe" },
    berlin: { name: "Berlin", country: "Germany", lat: 52.5200, lon: 13.4050, flag: "🇩🇪", region: "Europe" },
    munich: { name: "Munich", country: "Germany", lat: 48.1351, lon: 11.5820, flag: "🇩🇪", region: "Europe" },
    frankfurt: { name: "Frankfurt", country: "Germany", lat: 50.1109, lon: 8.6821, flag: "🇩🇪", region: "Europe" },
    hamburg: { name: "Hamburg", country: "Germany", lat: 53.5511, lon: 9.9937, flag: "🇩🇪", region: "Europe" },
    cologne: { name: "Cologne", country: "Germany", lat: 50.9375, lon: 6.9603, flag: "🇩🇪", region: "Europe" },
    vienna: { name: "Vienna", country: "Austria", lat: 48.2082, lon: 16.3738, flag: "🇦🇹", region: "Europe" },
    prague: { name: "Prague", country: "Czech Republic", lat: 50.0755, lon: 14.4378, flag: "🇨🇿", region: "Europe" },
    budapest: { name: "Budapest", country: "Hungary", lat: 47.4979, lon: 19.0402, flag: "🇭🇺", region: "Europe" },
    warsaw: { name: "Warsaw", country: "Poland", lat: 52.2297, lon: 21.0122, flag: "🇵🇱", region: "Europe" },
    krakow: { name: "Krakow", country: "Poland", lat: 50.0647, lon: 19.9450, flag: "🇵🇱", region: "Europe" },
    rome: { name: "Rome", country: "Italy", lat: 41.9028, lon: 12.4964, flag: "🇮🇹", region: "Europe" },
    milan: { name: "Milan", country: "Italy", lat: 45.4642, lon: 9.1900, flag: "🇮🇹", region: "Europe" },
    florence: { name: "Florence", country: "Italy", lat: 43.7696, lon: 11.2558, flag: "🇮🇹", region: "Europe" },
    venice: { name: "Venice", country: "Italy", lat: 45.4408, lon: 12.3155, flag: "🇮🇹", region: "Europe" },
    naples: { name: "Naples", country: "Italy", lat: 40.8518, lon: 14.2681, flag: "🇮🇹", region: "Europe" },
    madrid: { name: "Madrid", country: "Spain", lat: 40.4168, lon: -3.7038, flag: "🇪🇸", region: "Europe" },
    barcelona: { name: "Barcelona", country: "Spain", lat: 41.3851, lon: 2.1734, flag: "🇪🇸", region: "Europe" },
    seville: { name: "Seville", country: "Spain", lat: 37.3891, lon: -5.9845, flag: "🇪🇸", region: "Europe" },
    valencia: { name: "Valencia", country: "Spain", lat: 39.4699, lon: -0.3763, flag: "🇪🇸", region: "Europe" },
    lisbon: { name: "Lisbon", country: "Portugal", lat: 38.7223, lon: -9.1393, flag: "🇵🇹", region: "Europe" },
    porto: { name: "Porto", country: "Portugal", lat: 41.1579, lon: -8.6291, flag: "🇵🇹", region: "Europe" },
    athens: { name: "Athens", country: "Greece", lat: 37.9838, lon: 23.7275, flag: "🇬🇷", region: "Europe" },
    bucharest: { name: "Bucharest", country: "Romania", lat: 44.4268, lon: 26.1025, flag: "🇷🇴", region: "Europe" },
    sofia: { name: "Sofia", country: "Bulgaria", lat: 42.6977, lon: 23.3219, flag: "🇧🇬", region: "Europe" },
    belgrade: { name: "Belgrade", country: "Serbia", lat: 44.7866, lon: 20.4489, flag: "🇷🇸", region: "Europe" },
    zagreb: { name: "Zagreb", country: "Croatia", lat: 45.8150, lon: 15.9819, flag: "🇭🇷", region: "Europe" },
    ljubljana: { name: "Ljubljana", country: "Slovenia", lat: 46.0569, lon: 14.5058, flag: "🇸🇮", region: "Europe" },
    sarajevo: { name: "Sarajevo", country: "Bosnia", lat: 43.8563, lon: 18.4131, flag: "🇧🇦", region: "Europe" },
    podgorica: { name: "Podgorica", country: "Montenegro", lat: 42.4304, lon: 19.2594, flag: "🇲🇪", region: "Europe" },
    skopje: { name: "Skopje", country: "North Macedonia", lat: 41.9973, lon: 21.4280, flag: "🇲🇰", region: "Europe" },
    tirana: { name: "Tirana", country: "Albania", lat: 41.3275, lon: 19.8187, flag: "🇦🇱", region: "Europe" },
    stockholm: { name: "Stockholm", country: "Sweden", lat: 59.3293, lon: 18.0686, flag: "🇸🇪", region: "Europe" },
    oslo: { name: "Oslo", country: "Norway", lat: 59.9139, lon: 10.7522, flag: "🇳🇴", region: "Europe" },
    copenhagen: { name: "Copenhagen", country: "Denmark", lat: 55.6761, lon: 12.5683, flag: "🇩🇰", region: "Europe" },
    helsinki: { name: "Helsinki", country: "Finland", lat: 60.1699, lon: 24.9384, flag: "🇫🇮", region: "Europe" },
    reykjavik: { name: "Reykjavik", country: "Iceland", lat: 64.1466, lon: -21.9426, flag: "🇮🇸", region: "Europe" },
    dublin: { name: "Dublin", country: "Ireland", lat: 53.3498, lon: -6.2603, flag: "🇮🇪", region: "Europe" },
    edinburgh: { name: "Edinburgh", country: "Scotland", lat: 55.9533, lon: -3.1883, flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", region: "Europe" },
    bratislava: { name: "Bratislava", country: "Slovakia", lat: 48.1486, lon: 17.1077, flag: "🇸🇰", region: "Europe" },
    tallinn: { name: "Tallinn", country: "Estonia", lat: 59.4370, lon: 24.7536, flag: "🇪🇪", region: "Europe" },
    riga: { name: "Riga", country: "Latvia", lat: 56.9496, lon: 24.1052, flag: "🇱🇻", region: "Europe" },
    vilnius: { name: "Vilnius", country: "Lithuania", lat: 54.6872, lon: 25.2797, flag: "🇱🇹", region: "Europe" },
    kyiv: { name: "Kyiv", country: "Ukraine", lat: 50.4501, lon: 30.5234, flag: "🇺🇦", region: "Europe" },
    chisinau: { name: "Chișinău", country: "Moldova", lat: 47.0105, lon: 28.8638, flag: "🇲🇩", region: "Europe" },
    minsk: { name: "Minsk", country: "Belarus", lat: 53.9006, lon: 27.5590, flag: "🇧🇾", region: "Europe" },
    moscow: { name: "Moscow", country: "Russia", lat: 55.7558, lon: 37.6173, flag: "🇷🇺", region: "Europe" },
    stpetersburg: { name: "St. Petersburg", country: "Russia", lat: 59.9311, lon: 30.3609, flag: "🇷🇺", region: "Europe" },
    istanbul: { name: "Istanbul", country: "Turkey", lat: 41.0082, lon: 28.9784, flag: "🇹🇷", region: "Europe" },
    ankara: { name: "Ankara", country: "Turkey", lat: 39.9334, lon: 32.8597, flag: "🇹🇷", region: "Europe" },
    nicosia: { name: "Nicosia", country: "Cyprus", lat: 35.1856, lon: 33.3823, flag: "🇨🇾", region: "Europe" },
    valletta: { name: "Valletta", country: "Malta", lat: 35.8989, lon: 14.5146, flag: "🇲🇹", region: "Europe" },
    luxembourg: { name: "Luxembourg", country: "Luxembourg", lat: 49.6116, lon: 6.1319, flag: "🇱🇺", region: "Europe" },
    monaco: { name: "Monaco", country: "Monaco", lat: 43.7384, lon: 7.4246, flag: "🇲🇨", region: "Europe" },

    // NORTH AMERICA
    newyork: { name: "New York", country: "USA", lat: 40.7128, lon: -74.0060, flag: "🇺🇸", region: "North America" },
    losangeles: { name: "Los Angeles", country: "USA", lat: 34.0522, lon: -118.2437, flag: "🇺🇸", region: "North America" },
    chicago: { name: "Chicago", country: "USA", lat: 41.8781, lon: -87.6298, flag: "🇺🇸", region: "North America" },
    houston: { name: "Houston", country: "USA", lat: 29.7604, lon: -95.3698, flag: "🇺🇸", region: "North America" },
    phoenix: { name: "Phoenix", country: "USA", lat: 33.4484, lon: -112.0740, flag: "🇺🇸", region: "North America" },
    sanfrancisco: { name: "San Francisco", country: "USA", lat: 37.7749, lon: -122.4194, flag: "🇺🇸", region: "North America" },
    seattle: { name: "Seattle", country: "USA", lat: 47.6062, lon: -122.3321, flag: "🇺🇸", region: "North America" },
    miami: { name: "Miami", country: "USA", lat: 25.7617, lon: -80.1918, flag: "🇺🇸", region: "North America" },
    lasvegas: { name: "Las Vegas", country: "USA", lat: 36.1699, lon: -115.1398, flag: "🇺🇸", region: "North America" },
    denver: { name: "Denver", country: "USA", lat: 39.7392, lon: -104.9903, flag: "🇺🇸", region: "North America" },
    boston: { name: "Boston", country: "USA", lat: 42.3601, lon: -71.0589, flag: "🇺🇸", region: "North America" },
    atlanta: { name: "Atlanta", country: "USA", lat: 33.7490, lon: -84.3880, flag: "🇺🇸", region: "North America" },
    dallas: { name: "Dallas", country: "USA", lat: 32.7767, lon: -96.7970, flag: "🇺🇸", region: "North America" },
    washingtondc: { name: "Washington D.C.", country: "USA", lat: 38.9072, lon: -77.0369, flag: "🇺🇸", region: "North America" },
    neworleans: { name: "New Orleans", country: "USA", lat: 29.9511, lon: -90.0715, flag: "🇺🇸", region: "North America" },
    honolulu: { name: "Honolulu", country: "USA", lat: 21.3069, lon: -157.8583, flag: "🇺🇸", region: "North America" },
    toronto: { name: "Toronto", country: "Canada", lat: 43.6532, lon: -79.3832, flag: "🇨🇦", region: "North America" },
    vancouver: { name: "Vancouver", country: "Canada", lat: 49.2827, lon: -123.1207, flag: "🇨🇦", region: "North America" },
    montreal: { name: "Montreal", country: "Canada", lat: 45.5017, lon: -73.5673, flag: "🇨🇦", region: "North America" },
    calgary: { name: "Calgary", country: "Canada", lat: 51.0447, lon: -114.0719, flag: "🇨🇦", region: "North America" },
    ottawa: { name: "Ottawa", country: "Canada", lat: 45.4215, lon: -75.6972, flag: "🇨🇦", region: "North America" },
    mexicocity: { name: "Mexico City", country: "Mexico", lat: 19.4326, lon: -99.1332, flag: "🇲🇽", region: "North America" },
    cancun: { name: "Cancun", country: "Mexico", lat: 21.1619, lon: -86.8515, flag: "🇲🇽", region: "North America" },
    guadalajara: { name: "Guadalajara", country: "Mexico", lat: 20.6597, lon: -103.3496, flag: "🇲🇽", region: "North America" },

    // CENTRAL AMERICA & CARIBBEAN
    guatemalacity: { name: "Guatemala City", country: "Guatemala", lat: 14.6349, lon: -90.5069, flag: "🇬🇹", region: "Central America" },
    belizecity: { name: "Belize City", country: "Belize", lat: 17.5046, lon: -88.1962, flag: "🇧🇿", region: "Central America" },
    sanjose: { name: "San Jose", country: "Costa Rica", lat: 9.9281, lon: -84.0907, flag: "🇨🇷", region: "Central America" },
    panamacity: { name: "Panama City", country: "Panama", lat: 8.9824, lon: -79.5199, flag: "🇵🇦", region: "Central America" },
    havana: { name: "Havana", country: "Cuba", lat: 23.1136, lon: -82.3666, flag: "🇨🇺", region: "Caribbean" },
    kingston: { name: "Kingston", country: "Jamaica", lat: 17.9714, lon: -76.7920, flag: "🇯🇲", region: "Caribbean" },
    santodomingo: { name: "Santo Domingo", country: "Dominican Republic", lat: 18.4861, lon: -69.9312, flag: "🇩🇴", region: "Caribbean" },
    sanjuan: { name: "San Juan", country: "Puerto Rico", lat: 18.4655, lon: -66.1057, flag: "🇵🇷", region: "Caribbean" },
    nassau: { name: "Nassau", country: "Bahamas", lat: 25.0343, lon: -77.3963, flag: "🇧🇸", region: "Caribbean" },

    // SOUTH AMERICA
    buenosaires: { name: "Buenos Aires", country: "Argentina", lat: -34.6037, lon: -58.3816, flag: "🇦🇷", region: "South America" },
    saopaulo: { name: "São Paulo", country: "Brazil", lat: -23.5505, lon: -46.6333, flag: "🇧🇷", region: "South America" },
    riodejaneiro: { name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lon: -43.1729, flag: "🇧🇷", region: "South America" },
    bogota: { name: "Bogotá", country: "Colombia", lat: 4.7110, lon: -74.0721, flag: "🇨🇴", region: "South America" },
    medellin: { name: "Medellin", country: "Colombia", lat: 6.2442, lon: -75.5812, flag: "🇨🇴", region: "South America" },
    cartagena: { name: "Cartagena", country: "Colombia", lat: 10.3910, lon: -75.4794, flag: "🇨🇴", region: "South America" },
    lima: { name: "Lima", country: "Peru", lat: -12.0464, lon: -77.0428, flag: "🇵🇪", region: "South America" },
    cusco: { name: "Cusco", country: "Peru", lat: -13.5319, lon: -71.9675, flag: "🇵🇪", region: "South America" },
    santiago: { name: "Santiago", country: "Chile", lat: -33.4489, lon: -70.6693, flag: "🇨🇱", region: "South America" },
    caracas: { name: "Caracas", country: "Venezuela", lat: 10.4806, lon: -66.9036, flag: "🇻🇪", region: "South America" },
    quito: { name: "Quito", country: "Ecuador", lat: -0.1807, lon: -78.4678, flag: "🇪🇨", region: "South America" },
    lapaz: { name: "La Paz", country: "Bolivia", lat: -16.4897, lon: -68.1193, flag: "🇧🇴", region: "South America" },
    montevideo: { name: "Montevideo", country: "Uruguay", lat: -34.9011, lon: -56.1645, flag: "🇺🇾", region: "South America" },
    asuncion: { name: "Asuncion", country: "Paraguay", lat: -25.2637, lon: -57.5759, flag: "🇵🇾", region: "South America" },

    // ASIA
    tokyo: { name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503, flag: "🇯🇵", region: "Asia" },
    osaka: { name: "Osaka", country: "Japan", lat: 34.6937, lon: 135.5023, flag: "🇯🇵", region: "Asia" },
    kyoto: { name: "Kyoto", country: "Japan", lat: 35.0116, lon: 135.7681, flag: "🇯🇵", region: "Asia" },
    seoul: { name: "Seoul", country: "South Korea", lat: 37.5665, lon: 126.9780, flag: "🇰🇷", region: "Asia" },
    beijing: { name: "Beijing", country: "China", lat: 39.9042, lon: 116.4074, flag: "🇨🇳", region: "Asia" },
    shanghai: { name: "Shanghai", country: "China", lat: 31.2304, lon: 121.4737, flag: "🇨🇳", region: "Asia" },
    hongkong: { name: "Hong Kong", country: "Hong Kong", lat: 22.3193, lon: 114.1694, flag: "🇭🇰", region: "Asia" },
    taipei: { name: "Taipei", country: "Taiwan", lat: 25.0330, lon: 121.5654, flag: "🇹🇼", region: "Asia" },
    singapore: { name: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198, flag: "🇸🇬", region: "Asia" },
    kualalumpur: { name: "Kuala Lumpur", country: "Malaysia", lat: 3.1390, lon: 101.6869, flag: "🇲🇾", region: "Asia" },
    bangkok: { name: "Bangkok", country: "Thailand", lat: 13.7563, lon: 100.5018, flag: "🇹🇭", region: "Asia" },
    phuket: { name: "Phuket", country: "Thailand", lat: 7.8804, lon: 98.3923, flag: "🇹🇭", region: "Asia" },
    hanoi: { name: "Hanoi", country: "Vietnam", lat: 21.0278, lon: 105.8342, flag: "🇻🇳", region: "Asia" },
    hochiminh: { name: "Ho Chi Minh City", country: "Vietnam", lat: 10.8231, lon: 106.6297, flag: "🇻🇳", region: "Asia" },
    jakarta: { name: "Jakarta", country: "Indonesia", lat: -6.2088, lon: 106.8456, flag: "🇮🇩", region: "Asia" },
    bali: { name: "Bali", country: "Indonesia", lat: -8.3405, lon: 115.0920, flag: "🇮🇩", region: "Asia" },
    manila: { name: "Manila", country: "Philippines", lat: 14.5995, lon: 120.9842, flag: "🇵🇭", region: "Asia" },
    delhi: { name: "Delhi", country: "India", lat: 28.6139, lon: 77.2090, flag: "🇮🇳", region: "Asia" },
    mumbai: { name: "Mumbai", country: "India", lat: 19.0760, lon: 72.8777, flag: "🇮🇳", region: "Asia" },
    bangalore: { name: "Bangalore", country: "India", lat: 12.9716, lon: 77.5946, flag: "🇮🇳", region: "Asia" },
    kolkata: { name: "Kolkata", country: "India", lat: 22.5726, lon: 88.3639, flag: "🇮🇳", region: "Asia" },
    kathmandu: { name: "Kathmandu", country: "Nepal", lat: 27.7172, lon: 85.3240, flag: "🇳🇵", region: "Asia" },
    colombo: { name: "Colombo", country: "Sri Lanka", lat: 6.9271, lon: 79.8612, flag: "🇱🇰", region: "Asia" },
    dhaka: { name: "Dhaka", country: "Bangladesh", lat: 23.8103, lon: 90.4125, flag: "🇧🇩", region: "Asia" },

    // MIDDLE EAST
    dubai: { name: "Dubai", country: "UAE", lat: 25.2048, lon: 55.2708, flag: "🇦🇪", region: "Middle East" },
    abudhabi: { name: "Abu Dhabi", country: "UAE", lat: 24.4539, lon: 54.3773, flag: "🇦🇪", region: "Middle East" },
    doha: { name: "Doha", country: "Qatar", lat: 25.2854, lon: 51.5310, flag: "🇶🇦", region: "Middle East" },
    kuwaitcity: { name: "Kuwait City", country: "Kuwait", lat: 29.3759, lon: 47.9774, flag: "🇰🇼", region: "Middle East" },
    riyadh: { name: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lon: 46.6753, flag: "🇸🇦", region: "Middle East" },
    muscat: { name: "Muscat", country: "Oman", lat: 23.5880, lon: 58.3829, flag: "🇴🇲", region: "Middle East" },
    amman: { name: "Amman", country: "Jordan", lat: 31.9454, lon: 35.9284, flag: "🇯🇴", region: "Middle East" },
    beirut: { name: "Beirut", country: "Lebanon", lat: 33.8938, lon: 35.5018, flag: "🇱🇧", region: "Middle East" },
    telaviv: { name: "Tel Aviv", country: "Israel", lat: 32.0853, lon: 34.7818, flag: "🇮🇱", region: "Middle East" },
    jerusalem: { name: "Jerusalem", country: "Israel", lat: 31.7683, lon: 35.2137, flag: "🇮🇱", region: "Middle East" },
    tehran: { name: "Tehran", country: "Iran", lat: 35.6892, lon: 51.3890, flag: "🇮🇷", region: "Middle East" },
    cairo: { name: "Cairo", country: "Egypt", lat: 30.0444, lon: 31.2357, flag: "🇪🇬", region: "Middle East" },

    // AFRICA
    casablanca: { name: "Casablanca", country: "Morocco", lat: 33.5731, lon: -7.5898, flag: "🇲🇦", region: "Africa" },
    marrakech: { name: "Marrakech", country: "Morocco", lat: 31.6295, lon: -7.9811, flag: "🇲🇦", region: "Africa" },
    algiers: { name: "Algiers", country: "Algeria", lat: 36.7538, lon: 3.0588, flag: "🇩🇿", region: "Africa" },
    tunis: { name: "Tunis", country: "Tunisia", lat: 36.8065, lon: 10.1815, flag: "🇹🇳", region: "Africa" },
    lagos: { name: "Lagos", country: "Nigeria", lat: 6.5244, lon: 3.3792, flag: "🇳🇬", region: "Africa" },
    abuja: { name: "Abuja", country: "Nigeria", lat: 9.0765, lon: 7.3986, flag: "🇳🇬", region: "Africa" },
    accra: { name: "Accra", country: "Ghana", lat: 5.6037, lon: -0.1870, flag: "🇬🇭", region: "Africa" },
    dakar: { name: "Dakar", country: "Senegal", lat: 14.7167, lon: -17.4677, flag: "🇸🇳", region: "Africa" },
    nairobi: { name: "Nairobi", country: "Kenya", lat: -1.2921, lon: 36.8219, flag: "🇰🇪", region: "Africa" },
    addisababa: { name: "Addis Ababa", country: "Ethiopia", lat: 9.0320, lon: 38.7469, flag: "🇪🇹", region: "Africa" },
    daressalaam: { name: "Dar es Salaam", country: "Tanzania", lat: -6.7924, lon: 39.2083, flag: "🇹🇿", region: "Africa" },
    kampala: { name: "Kampala", country: "Uganda", lat: 0.3476, lon: 32.5825, flag: "🇺🇬", region: "Africa" },
    kigali: { name: "Kigali", country: "Rwanda", lat: -1.9403, lon: 29.8739, flag: "🇷🇼", region: "Africa" },
    johannesburg: { name: "Johannesburg", country: "South Africa", lat: -26.2041, lon: 28.0473, flag: "🇿🇦", region: "Africa" },
    capetown: { name: "Cape Town", country: "South Africa", lat: -33.9249, lon: 18.4241, flag: "🇿🇦", region: "Africa" },
    durban: { name: "Durban", country: "South Africa", lat: -29.8587, lon: 31.0218, flag: "🇿🇦", region: "Africa" },
    harare: { name: "Harare", country: "Zimbabwe", lat: -17.8252, lon: 31.0335, flag: "🇿🇼", region: "Africa" },
    gaborone: { name: "Gaborone", country: "Botswana", lat: -24.6282, lon: 25.9231, flag: "🇧🇼", region: "Africa" },
    windhoek: { name: "Windhoek", country: "Namibia", lat: -22.5609, lon: 17.0658, flag: "🇳🇦", region: "Africa" },
    maputo: { name: "Maputo", country: "Mozambique", lat: -25.9692, lon: 32.5732, flag: "🇲🇿", region: "Africa" },
    luanda: { name: "Luanda", country: "Angola", lat: -8.8390, lon: 13.2894, flag: "🇦🇴", region: "Africa" },

    // OCEANIA
    sydney: { name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093, flag: "🇦🇺", region: "Oceania" },
    melbourne: { name: "Melbourne", country: "Australia", lat: -37.8136, lon: 144.9631, flag: "🇦🇺", region: "Oceania" },
    brisbane: { name: "Brisbane", country: "Australia", lat: -27.4698, lon: 153.0251, flag: "🇦🇺", region: "Oceania" },
    perth: { name: "Perth", country: "Australia", lat: -31.9505, lon: 115.8605, flag: "🇦🇺", region: "Oceania" },
    adelaide: { name: "Adelaide", country: "Australia", lat: -34.9285, lon: 138.6007, flag: "🇦🇺", region: "Oceania" },
    auckland: { name: "Auckland", country: "New Zealand", lat: -36.8509, lon: 174.7645, flag: "🇳🇿", region: "Oceania" },
    wellington: { name: "Wellington", country: "New Zealand", lat: -41.2866, lon: 174.7756, flag: "🇳🇿", region: "Oceania" },
    queenstown: { name: "Queenstown", country: "New Zealand", lat: -45.0312, lon: 168.6626, flag: "🇳🇿", region: "Oceania" },
    fiji: { name: "Fiji Islands", country: "Fiji", lat: -18.1416, lon: 178.4419, flag: "🇫🇯", region: "Oceania" }
};

// ===============================================================
// 7. GENERATE DROPDOWN FROM CITIES_DATA
// ===============================================================
function generateCityDropdown() {
    const select = elements.select;
    if (!select) {
        console.error("❌ Select element not found!");
        return;
    }

    // Clear existing options
    select.innerHTML = '<option value="" disabled selected>🌍 Choose a city</option>';

    // Group cities by region
    const regions = {};
    Object.entries(CITIES_DATA).forEach(([key, city]) => {
        if (!regions[city.region]) {
            regions[city.region] = [];
        }
        regions[city.region].push({ key, ...city });
    });

    // Define region order
    const regionOrder = [
        "Europe",
        "North America",
        "Central America",
        "Caribbean",
        "South America",
        "Asia",
        "Middle East",
        "Africa",
        "Oceania"
    ];

    // Create optgroups for each region
    regionOrder.forEach(regionName => {
        const cities = regions[regionName];
        if (!cities || cities.length === 0) return;

        const optgroup = document.createElement("optgroup");
        optgroup.label = `🌐 ${regionName} (${cities.length})`;

        // Sort cities alphabetically within region
        cities.sort((a, b) => a.name.localeCompare(b.name));

        cities.forEach(city => {
            const option = document.createElement("option");
            option.value = `${city.lat},${city.lon}`;
            option.dataset.bg = city.key;
            option.dataset.name = city.name;
            option.dataset.flag = city.flag;
            option.dataset.country = city.country;
            option.textContent = `${city.flag} ${city.name}, ${city.country}`;
            optgroup.appendChild(option);
        });

        select.appendChild(optgroup);
    });

    console.log(`✅ Generated dropdown with ${Object.keys(CITIES_DATA).length} cities`);
}

// ===============================================================
// 8. CHANGE BACKGROUND
// ===============================================================
function changeBackground(imagePath) {
    console.log("Changing background to:", imagePath);

    const img = new Image();
    img.src = imagePath;

    img.onload = () => {
        console.log("Image loaded:", imagePath);

        const newLayer = document.createElement("div");
        newLayer.className = "bg-layer";
        newLayer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('${imagePath}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            z-index: -100;
            opacity: 0;
            transition: opacity 0.8s ease;
            pointer-events: none;
        `;

        document.body.appendChild(newLayer);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                newLayer.style.opacity = "1";
            });
        });

        setTimeout(() => {
            document.documentElement.style.setProperty("--hero-img", `url('${imagePath}')`);

            if (currentBgLayer && currentBgLayer !== newLayer) {
                currentBgLayer.remove();
            }

            currentBgLayer = newLayer;
            console.log("Background transition complete");
        }, 900);
    };

    img.onerror = () => {
        console.error("Failed to load image:", imagePath);
    };
}

// ===============================================================
// 9. UPDATE CITY (Dropdown Selection) - UPDATED
// ===============================================================
function updateCity() {
    const opt = elements.select.options[elements.select.selectedIndex];
    if (!opt || !opt.value) return;

    const cityKey = opt.dataset.bg;
    const cityData = CITIES_DATA[cityKey];

    console.log("City selected from dropdown:", cityKey, cityData);

    // Set selected city from dropdown
    selectedCity = {
        ...cityData,
        key: cityKey,
        isSearchResult: false
    };

    // Clear search input
    if (elements.searchInput) {
        elements.searchInput.value = "";
    }
    hideSearchResults();

    // Update header text
    if (elements.cityName) {
        elements.cityName.textContent = cityData?.name || opt.dataset.name;
    }
    if (elements.cityIcon) {
        elements.cityIcon.textContent = cityData?.flag || opt.dataset.flag;
    }

    // Change background
    const bgPath = `images/${cityKey}.jpg`;
    changeBackground(bgPath);
}

// ===============================================================
// 10. SEARCH CITY (Geocoding API) - NEW
// ===============================================================
async function searchCity(query) {
    if (!query || query.trim().length < 2) {
        hideSearchResults();
        return;
    }

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;

    console.log("Searching for:", query);

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            displaySearchResults(data.results);
        } else {
            displayNoResults();
        }
    } catch (error) {
        console.error("Search error:", error);
        displayNoResults();
    }
}

// ===============================================================
// 11. DISPLAY SEARCH RESULTS - NEW
// ===============================================================
function displaySearchResults(results) {
    const ul = elements.searchResults;
    if (!ul) return;

    ul.innerHTML = "";

    results.forEach(city => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="city-name">${city.name}</div>
            <div class="city-details">${city.admin1 || ""} ${city.country} • ${city.latitude.toFixed(2)}°, ${city.longitude.toFixed(2)}°</div>
        `;

        li.addEventListener("click", () => selectSearchedCity(city));
        ul.appendChild(li);
    });

    ul.classList.remove("hidden");
}

// ===============================================================
// 12. DISPLAY NO RESULTS - NEW
// ===============================================================
function displayNoResults() {
    const ul = elements.searchResults;
    if (!ul) return;

    ul.innerHTML = `<li class="no-results">No cities found</li>`;
    ul.classList.remove("hidden");
}

// ===============================================================
// 13. HIDE SEARCH RESULTS - NEW
// ===============================================================
function hideSearchResults() {
    if (elements.searchResults) {
        elements.searchResults.classList.add("hidden");
    }
}

// ===============================================================
// 14. SELECT SEARCHED CITY - NEW
// ===============================================================
function selectSearchedCity(city) {
    console.log("Selected from search:", city);

    // Create city object matching CITIES_DATA structure
    selectedCity = {
        key: city.name.toLowerCase().replace(/\s+/g, ""),
        name: city.name,
        country: city.country,
        lat: city.latitude,
        lon: city.longitude,
        flag: getCountryFlag(city.country_code),
        region: "Search Result",
        isSearchResult: true
    };

    // Update search input
    if (elements.searchInput) {
        elements.searchInput.value = `${city.name}, ${city.country}`;
    }
    hideSearchResults();

    // Clear dropdown selection
    if (elements.select) {
        elements.select.selectedIndex = 0;
    }

    // Update header display
    if (elements.cityName) {
        elements.cityName.textContent = selectedCity.name;
    }
    if (elements.cityIcon) {
        elements.cityIcon.textContent = selectedCity.flag;
    }

    // Use default background for searched cities
    changeBackground("images/default.jpg");
}

// ===============================================================
// 15. GET COUNTRY FLAG FROM COUNTRY CODE - NEW
// ===============================================================
function getCountryFlag(countryCode) {
    if (!countryCode) return "🌍";

    // Convert country code to flag emoji (e.g., "US" -> "🇺🇸")
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map(char => 127397 + char.charCodeAt(0));

    return String.fromCodePoint(...codePoints);
}

// ===============================================================
// 16. LEAFLET MAP
// ===============================================================
function initLeafletMap(lat, lon) {
    const mapContainer = document.getElementById("map");
    if (!mapContainer) {
        console.error("Map container not found!");
        return;
    }

    if (!map) {
        map = L.map("map").setView([lat, lon], 7);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
            attribution: "© OpenStreetMap"
        }).addTo(map);

        marker = L.marker([lat, lon]).addTo(map);
    } else {
        map.setView([lat, lon], 7);
        marker.setLatLng([lat, lon]);
    }

    setTimeout(() => {
        map.invalidateSize();
    }, 400);
}

// ===============================================================
// 17. LOAD WEATHER
// ===============================================================
async function loadWeather(lat, lon) {
    const url = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=${CONFIG.API_PRODUCT}&output=json`;

    console.log("Fetching weather:", url);

    let response, text, data;

    try {
        response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        text = await response.text();
    } catch (err) {
        console.error("Fetch error:", err);
        elements.grid.innerHTML = `<div class="error-box">Unable to fetch weather data.</div>`;
        return;
    }

    try {
        data = JSON.parse(text);
        console.log("Weather data:", data);
    } catch {
        elements.grid.innerHTML = `<div class="error-box">Invalid data received.</div>`;
        return;
    }

    elements.grid.innerHTML = "";

    if (!data.dataseries || data.dataseries.length === 0) {
        elements.grid.innerHTML = `<div class="error-box">No forecast available.</div>`;
        return;
    }

    const hour = new Date().getHours();
    const suffix = (hour >= 6 && hour < 18) ? "day" : "night";

    data.dataseries.slice(0, 7).forEach((day, i) => {
        if (day.temp2m == null) return;

        const date = new Date();
        date.setDate(date.getDate() + i);
        const weekday = date.toLocaleString("en-US", { weekday: "short" });
        const monthDay = date.toLocaleString("en-US", { month: "short", day: "numeric" });

        const rawCode = day.weather || "default";
        const baseCode = rawCode.replace(/(day|night)$/i, "");

        const icon = ICONS_IOS[rawCode] || ICONS_IOS[baseCode + suffix] || ICONS_IOS[baseCode] || ICONS_IOS.default;
        const label = WEATHER_DETAILS[rawCode] || WEATHER_DETAILS[baseCode + suffix] || WEATHER_DETAILS[baseCode] || WEATHER_DETAILS.default;

        const temp = Math.round(day.temp2m);
        const high = temp + 2;
        const low = temp - 2;

        const windSpeed = day.wind10m?.speed || 0;
        const windDir = day.wind10m?.direction || "N";

        const rainy = ["rain", "lightrain", "oshower", "ishower", "ts", "tsrain", "rainsnow"];
        const snowy = ["snow", "lightsnow", "rainsnow"];
        const rainChance = rainy.includes(baseCode) ? Math.round((day.cloudcover || 5) / 9 * 100) : 0;
        const snowChance = snowy.includes(baseCode) ? Math.round((day.cloudcover || 5) / 9 * 100) : 0;

        let humidity = "—";
        if (day.rh2m) {
            humidity = typeof day.rh2m === "number" ? day.rh2m + "%" : day.rh2m;
        }

        const card = document.createElement("div");
        card.className = "weather-card weather-animate";
        card.style.animationDelay = `${i * 0.1}s`;

        card.innerHTML = `
            <div class="w-day">${weekday}</div>
            <div class="w-date">${monthDay}</div>
            <div class="w-icon">${icon}</div>
            <div class="w-temp">${temp}<sup>°C</sup></div>
            <div class="w-cond">${label}</div>
            <div class="w-hilo">H: ${high}° · L: ${low}°</div>
            <div class="w-extra">
                <div><strong>Humidity</strong><span>${humidity}</span></div>
                <div><strong>Wind</strong><span>${windSpeed} km/h</span></div>
                <div><strong>Rain</strong><span>${rainChance}%</span></div>
                ${snowChance > 0 ? `<div><strong>Snow</strong><span>${snowChance}%</span></div>` : ""}
            </div>
        `;

        elements.grid.appendChild(card);
    });
}

// ===============================================================
// 18. HANDLE GET FORECAST CLICK - UPDATED
// ===============================================================
async function handleGet() {
    let lat, lon;

    // Check if we have a selected city (from dropdown or search)
    if (selectedCity) {
        lat = selectedCity.lat;
        lon = selectedCity.lon;
        console.log("Getting forecast for selected city:", selectedCity.name);
    } else {
        // Fallback to dropdown value
        const val = elements.select.value;
        if (!val) {
            alert("Please select a city from the dropdown or search for one!");
            return;
        }
        [lat, lon] = val.split(",").map(Number);
        console.log("Getting forecast from dropdown value:", lat, lon);
    }

    elements.overlay.classList.add("active");
    elements.section.classList.remove("hidden");

    setTimeout(() => {
        elements.section.scrollIntoView({ behavior: "smooth" });
    }, 100);

    initLeafletMap(lat, lon);
    await loadWeather(lat, lon);

    elements.overlay.classList.remove("active");
}

// ===============================================================
// 19. INITIALIZE - UPDATED
// ===============================================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("🌤️ Global Weather Explorer initialized");

    // Generate dropdown from CITIES_DATA
    generateCityDropdown();

    // Verify elements
    Object.entries(elements).forEach(([key, el]) => {
        if (el) {
            console.log(`✅ ${key}`);
        } else {
            console.warn(`⚠️ ${key} not found (may be optional)`);
        }
    });

    // ═══════════════════════════════════════════════════════
    // DROPDOWN EVENT
    // ═══════════════════════════════════════════════════════
    if (elements.select) {
        elements.select.addEventListener("change", updateCity);
    }

    // ═══════════════════════════════════════════════════════
    // SEARCH EVENTS
    // ═══════════════════════════════════════════════════════
    if (elements.searchInput) {
        // Search on typing (with debounce)
        let searchTimeout;
        elements.searchInput.addEventListener("input", (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchCity(e.target.value);
            }, CONFIG.SEARCH_DEBOUNCE);
        });

        // Search on Enter key
        elements.searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                searchCity(e.target.value);
            }
        });

        // Hide results when clicking outside
        document.addEventListener("click", (e) => {
            if (!e.target.closest(".control-group")) {
                hideSearchResults();
            }
        });
    }

    if (elements.searchBtn) {
        elements.searchBtn.addEventListener("click", () => {
            searchCity(elements.searchInput.value);
        });
    }

    // ═══════════════════════════════════════════════════════
    // GET FORECAST BUTTON
    // ═══════════════════════════════════════════════════════
    if (elements.btn) {
        elements.btn.addEventListener("click", handleGet);
    }

    // ═══════════════════════════════════════════════════════
    // CHANGE CITY BUTTON
    // ═══════════════════════════════════════════════════════
    const changeBtn = document.getElementById("changeCityBtn");
    if (changeBtn) {
        changeBtn.addEventListener("click", () => {
            elements.section.classList.add("hidden");
            selectedCity = null;
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});