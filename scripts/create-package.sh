#!/bin/bash

# Create installation package for Real Estate Champ
# This script creates a ZIP file to send to customers

echo "📦 Creating installation package for Real Estate Champ..."
echo ""

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")
PACKAGE_NAME="real-estate-champ-v${VERSION}.zip"
TEMP_DIR="./dist/package"

# Create temp directory
mkdir -p "$TEMP_DIR"

echo "✓ Creating temporary directory..."

# Copy necessary files
echo "✓ Copying application files..."
rsync -av \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='dist' \
  --exclude='.git' \
  --exclude='.env' \
  --exclude='.env.local' \
  --exclude='*.log' \
  --exclude='.branding.json' \
  --exclude='uploads' \
  ./ "$TEMP_DIR/"

# Create .env.example if it doesn't exist
if [ ! -f "$TEMP_DIR/.env.example" ]; then
  echo "✓ Creating .env.example..."
  cat > "$TEMP_DIR/.env.example" << 'EOF'
# Real Estate Champ - Environment Variables
#
# IMPORTANT: Rename this file to .env and fill in your values

# Database (Required)
DATABASE_URL="postgresql://user:password@localhost:5432/realestatechamp"

# NextAuth (Required)
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Google AI - Will be set during setup wizard
GOOGLE_AI_API_KEY=""

# Optional: If you want to use social media posting
# FACEBOOK_CLIENT_ID=""
# FACEBOOK_CLIENT_SECRET=""
# LINKEDIN_CLIENT_ID=""
# LINKEDIN_CLIENT_SECRET=""
EOF
fi

# Create installation instructions
echo "✓ Creating installation instructions..."
cat > "$TEMP_DIR/INSTALLATION.md" << 'EOF'
# Real Estate Champ - Installation Guide

Thank you for purchasing Real Estate Champ! Follow these steps to get started.

## 📋 What You'll Need

- A server or hosting service (VPS, DigitalOcean, AWS, etc.)
- PostgreSQL database
- Node.js 18+ installed
- Your license key (included in your purchase email)

## 🚀 Quick Installation

### Step 1: Upload Files

Upload all files from this package to your server:

```bash
# If using SCP
scp -r real-estate-champ-v*.zip user@yourserver.com:/var/www/

# Then on your server
cd /var/www
unzip real-estate-champ-v*.zip
cd real-estate-champ
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

```bash
# Create environment file
cp .env.example .env

# Edit with your database credentials
nano .env
```

Required variables:
- `DATABASE_URL` - Your PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your domain (e.g., https://yourdomain.com)

### Step 4: Set Up Database

```bash
# Run database migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

### Step 5: Build Application

```bash
npm run build
```

### Step 6: Start Application

```bash
# For production
npm start

# Or using PM2 (recommended)
pm2 start npm --name "real-estate-champ" -- start
pm2 save
pm2 startup
```

### Step 7: Complete Setup Wizard

1. Open your browser and go to `https://yourdomain.com/setup`
2. Enter your license key (from your purchase email)
3. Create your admin account
4. Configure Google AI API key (free at https://makersuite.google.com/app/apikey)
5. Optional: Add your company branding

That's it! You're ready to start creating content with AI.

## 📱 Mobile PWA Installation

Your users can install the app on their phones:

**iPhone:**
1. Open in Safari
2. Tap Share → Add to Home Screen

**Android:**
1. Open in Chrome
2. Tap Menu → Install App

## 🆘 Troubleshooting

### Port Already in Use

If port 3000 is busy, set a different port:
```bash
PORT=3001 npm start
```

### Database Connection Issues

Verify your DATABASE_URL format:
```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE
```

### Build Errors

Make sure Node.js version is 18 or higher:
```bash
node --version
```

## 📞 Support

Need help? Check the main README.md for detailed documentation.

## 🔄 Updates

To update to a new version:
1. Backup your database
2. Replace application files (keep .env and uploads/)
3. Run: `npm install && npx prisma migrate deploy && npm run build`
4. Restart: `pm2 restart real-estate-champ`
EOF

# Create WordPress plugin package
if [ -d "./wordpress-plugin/real-estate-champ" ]; then
  echo "✓ Packaging WordPress plugin..."
  cd wordpress-plugin
  zip -r "../$TEMP_DIR/wordpress-plugin.zip" real-estate-champ/
  cd ..
fi

# Create the final package
echo "✓ Creating final ZIP package..."
cd dist
zip -r "../$PACKAGE_NAME" package/
cd ..

# Clean up
echo "✓ Cleaning up..."
rm -rf "$TEMP_DIR"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Package created successfully!"
echo ""
echo "📦 File: $PACKAGE_NAME"
echo "📏 Size: $(du -h "$PACKAGE_NAME" | cut -f1)"
echo ""
echo "📧 Send this package to your customer along with:"
echo "   1. Their license key"
echo "   2. Link to INSTALLATION.md (included in package)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
