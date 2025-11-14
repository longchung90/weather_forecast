#!/bin/bash
# build-script.sh - Render build script to inject API key

# Create a config file with the API key at build time
echo "window.GOOGLE_MAPS_CONFIG = { apiKey: '$GOOGLE_MAPS_API_KEY' };" > config.js

echo "✅ API key injected into config.js"
echo "🚀 Build complete"