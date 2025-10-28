#!/bin/bash

# Build the application with environment variables
echo "🚀 Building European Weather Explorer..."
node build.js

# Start a simple HTTP server
echo "🌐 Starting web server..."
cd dist
python3 -m http.server $PORT