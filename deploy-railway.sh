#!/bin/bash
# Quick deployment script for Railway

echo "🚀 Deploying to Railway..."
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null
then
    echo "📦 Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

echo "🔑 Logging in to Railway..."
railway login

echo ""
echo "📂 Select service to deploy:"
echo "  1) Backend API (./backend)"
echo "  2) AI Service (./ai-service)"
echo "  3) Both"
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "🚢 Deploying Backend API..."
        cd backend
        railway up
        ;;
    2)
        echo "🤖 Deploying AI Service..."
        cd ai-service
        railway up
        ;;
    3)
        echo "🚢 Deploying Backend API..."
        cd backend
        railway up
        cd ../ai-service
        echo "🤖 Deploying AI Service..."
        railway up
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment complete!"
echo "📊 View your services at: https://railway.app/dashboard"
