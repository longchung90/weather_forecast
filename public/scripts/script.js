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

    // Search
    searchInput: document.getElementById("citySearch"),
    searchBtn: document.getElementById("searchBtn"),
    searchResults: document.getElementById("searchResults"),

    // Contact Form (NEW)
    contactForm: document.getElementById("cityRequestForm"),
    submitBtn: document.getElementById("submitBtn"),
    formStatus: document.getElementById("formStatus")
};

// ===============================================================
// 2. CONFIGURATION
// ===============================================================
const CONFIG = {
    TRANSITION: 800,
    API_PRODUCT: "civil",
    SEARCH_DEBOUNCE: 300,
    API_ENDPOINT: "https://lcportfolio.org/api/city-request"  // ✅ Your backend
};
// ===============================================================
// 3. STATE VARIABLES
// ===============================================================
let selectedCity = null;
let currentBgLayer = null;
let map = null;
let marker = null;

// ===============================================================
// 4. WEATHER ICONS
// ===============================================================
const ICONS_IOS = {
    // ... (keep all your icons)
};

// ===============================================================
// 5. WEATHER LABELS
// ===============================================================
const WEATHER_DETAILS = {
    // ... (keep all your labels)
};

// ===============================================================
// 6. CITIES DATABASE
// ===============================================================
const CITIES_DATA = {
    // ... (keep all your cities)
};

// ===============================================================
// 7. GENERATE DROPDOWN
// ===============================================================
function generateCityDropdown() {
    // ... (keep your function)
}

// ===============================================================
// 8. CHANGE BACKGROUND
// ===============================================================
function changeBackground(imagePath) {
    // ... (keep your function)
}

// ===============================================================
// 9. UPDATE CITY (Dropdown)
// ===============================================================
function updateCity() {
    // ... (keep your function)
}

// ===============================================================
// 10. SEARCH CITY
// ===============================================================
async function searchCity(query) {
    // ... (keep your function)
}

// ===============================================================
// 11. DISPLAY SEARCH RESULTS
// ===============================================================
function displaySearchResults(results) {
    // ... (keep your function)
}

// ===============================================================
// 12. DISPLAY NO RESULTS
// ===============================================================
function displayNoResults() {
    // ... (keep your function)
}

// ===============================================================
// 13. HIDE SEARCH RESULTS
// ===============================================================
function hideSearchResults() {
    // ... (keep your function)
}

// ===============================================================
// 14. SELECT SEARCHED CITY
// ===============================================================
function selectSearchedCity(city) {
    // ... (keep your function)
}

// ===============================================================
// 15. GET COUNTRY FLAG
// ===============================================================
function getCountryFlag(countryCode) {
    // ... (keep your function)
}

// ===============================================================
// 16. FIND MATCHING CITY KEY
// ===============================================================
function findMatchingCityKey(cityName) {
    // ... (keep your function)
}

// ===============================================================
// 17. LEAFLET MAP
// ===============================================================
function initLeafletMap(lat, lon) {
    // ... (keep your function)
}

// ===============================================================
// 18. LOAD WEATHER
// ===============================================================
async function loadWeather(lat, lon) {
    // ... (keep your function)
}

// ===============================================================
// 19. HANDLE GET FORECAST
// ===============================================================
async function handleGet() {
    // ... (keep your function)
}

// ===============================================================
// 20. HANDLE CONTACT FORM SUBMISSION (NEW - as function)
// ===============================================================
async function handleContactForm(e) {
    e.preventDefault();

    const btn = elements.submitBtn;
    const btnText = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');
    const formStatus = elements.formStatus;

    // Get form data
    const cityNameInput = document.getElementById('cityName').value.trim();
    const userEmail = document.getElementById('userEmail').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validation
    if (!cityNameInput) {
        formStatus.textContent = '⚠️ Please enter a city name';
        formStatus.className = 'form-status error';
        return;
    }

    // UI: Loading state
    btn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
        const response = await fetch(CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cityName: cityNameInput,
                userEmail: userEmail || 'Not provided',
                message: message || 'No additional details'
            })
        });

        const data = await response.json();

        if (response.ok) {
            formStatus.textContent = '✅ Thanks! We\'ll add that city soon!';
            formStatus.classList.add('success');
            e.target.reset();
        } else {
            throw new Error(data.error || 'Something went wrong');
        }

    } catch (error) {
        formStatus.textContent = '❌ Failed to send. Please try again.';
        formStatus.classList.add('error');
        console.error('Form error:', error);
    } finally {
        btn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

// ===============================================================
// 21. INITIALIZE
// ===============================================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("🌤️ Global Weather Explorer initialized");

    // Generate dropdown
    generateCityDropdown();

    // Verify elements
    Object.entries(elements).forEach(([key, el]) => {
        if (el) {
            console.log(`✅ ${key}`);
        } else {
            console.warn(`⚠️ ${key} not found`);
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
        let searchTimeout;
        elements.searchInput.addEventListener("input", (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchCity(e.target.value);
            }, CONFIG.SEARCH_DEBOUNCE);
        });

        elements.searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                searchCity(e.target.value);
            }
        });

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
            changeBackground("images/global.jpg");
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // ═══════════════════════════════════════════════════════
    // CONTACT FORM (NOW INSIDE DOMContentLoaded!)
    // ═══════════════════════════════════════════════════════
    if (elements.contactForm) {
        elements.contactForm.addEventListener("submit", handleContactForm);
        console.log("✅ Contact form initialized");
    }

});

