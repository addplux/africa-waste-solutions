#!/bin/bash
# Deploy to Vercel Script

echo "🚀 Deploying Flask App to Vercel..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI is not installed."
    echo "📦 Installing Vercel CLI globally..."
    npm install -g vercel
fi

echo "📁 Current directory: flask-frontend"
cd "$(dirname "$0")"

echo ""
echo "⚙️  Important: Make sure you have configured environment variables:"
echo "   - SECRET_KEY"
echo "   - BACKEND_API_URL"
echo ""
echo "🔑 Starting deployment..."
echo ""

# Deploy to Vercel
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your app should now be live on Vercel"
echo ""
echo "📝 Don't forget to:"
echo "   1. Configure environment variables in Vercel dashboard"
echo "   2. Deploy your backend API"
echo "   3. Test all functionality"
