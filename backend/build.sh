#!/bin/bash

# Build script for Render deployment
# This script is run during the build phase on Render

set -e

echo "Starting build process..."

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python3 manage.py migrate --noinput

# Collect static files
python3 manage.py collectstatic --noinput --clear

echo "Build completed successfully!"