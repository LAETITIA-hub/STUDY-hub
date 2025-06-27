#!/bin/bash

# This script prepares the frontend for production deployment
# by temporarily replacing localhost URLs with production URLs

echo "Preparing frontend for production deployment..."

# Create a backup of original files
mkdir -p temp_backup
cp -r frontend/src temp_backup/

# Replace localhost URLs with production URLs
# We'll use a placeholder that will be replaced during build
find frontend/src -name "*.js" -type f -exec sed -i 's|http://localhost:5000|/api|g' {} \;

echo "Frontend prepared for production deployment." 