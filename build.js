#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the template HTML file
const htmlTemplate = fs.readFileSync('index.html', 'utf8');

// Replace the placeholder with the actual API key from environment
const apiKey = process.env.GOOGLE_MAPS_API_KEY || 'REPLACE_WITH_YOUR_ACTUAL_API_KEY';
const htmlWithApiKey = htmlTemplate.replace(
    'key=REPLACE_WITH_YOUR_ACTUAL_API_KEY',
    `key=${apiKey}`
);

// Write the processed HTML to a dist folder
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

fs.writeFileSync('dist/index.html', htmlWithApiKey);

// Copy other files to dist
const filesToCopy = ['script.js', 'css', 'images'];

filesToCopy.forEach(file => {
    const src = path.join(__dirname, file);
    const dest = path.join(__dirname, 'dist', file);

    if (fs.existsSync(src)) {
        if (fs.lstatSync(src).isDirectory()) {
            // Copy directory recursively
            copyDir(src, dest);
        } else {
            // Copy file
            fs.copyFileSync(src, dest);
        }
    }
});

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const files = fs.readdirSync(src);

    files.forEach(file => {
        const srcFile = path.join(src, file);
        const destFile = path.join(dest, file);

        if (fs.lstatSync(srcFile).isDirectory()) {
            copyDir(srcFile, destFile);
        } else {
            fs.copyFileSync(srcFile, destFile);
        }
    });
}

console.log('✅ Build completed! API key injected from environment variable.');
console.log('📁 Files ready in ./dist/ folder');