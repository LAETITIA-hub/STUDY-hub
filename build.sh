#!/bin/bash

echo "Starting build process..."

# Install frontend dependencies
cd frontend
npm install

# Replace localhost URLs with production URLs for build
find src -name "*.js" -type f -exec sed -i 's|http://localhost:5000|/api|g' {} \;

# Build the React app
npm run build

# Move build to backend static folder
cd ..
mkdir -p backend/static
cp -r frontend/build/* backend/static/

# Install backend dependencies
pip install -r requirements.txt

echo "Build completed successfully!" 