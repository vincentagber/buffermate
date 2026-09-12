#!/bin/bash

# Script to set up Supabase for development
# This script disables email confirmation and creates a test user

echo "🚀 Setting up Supabase for development..."

# Note: Email confirmation is typically disabled via Supabase dashboard
# Project Settings → Authentication → Email / Phone
# Toggle OFF: "Confirm email"

echo "✅ Setup Instructions:"
echo ""
echo "1. Go to: https://app.supabase.com/project/sgsmadjmfwgvtbqrmbhw"
echo "2. Navigate to: Authentication → Providers"
echo "3. Under 'Email', toggle OFF 'Confirm email'"
echo "4. Enable OAuth providers (Google, GitHub)"
echo ""
echo "Test User Credentials:"
echo "  Email: demo@buffermate.app"
echo "  Password: Demo@12345"
echo ""
echo "To create the test user, run the seed script:"
echo "  npm run seed"
echo ""
