#!/bin/bash

# Replace YOUR_API_KEY_HERE with your actual Google Maps API key
API_KEY="YOUR_API_KEY_HERE"

echo "🔑 Building with API key: ${API_KEY:0:10}..."
GOOGLE_MAPS_API_KEY="$API_KEY" node build.js

echo "🌐 Starting test server..."
cd dist && python3 -m http.server 8080