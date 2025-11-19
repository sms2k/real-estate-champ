# Real Estate Champ - Customer Setup Guide

Welcome to Real Estate Champ! This guide will walk you through setting up your AI-powered property marketing platform.

## What You Received

You should have received:
- 📦 `real-estate-champ-v1.0.0.zip` - Main application package
- 🔑 Your unique license key (format: XXXX-XXXX-XXXX-XXXX)
- 📧 Your customer email address

## System Requirements

### Server Requirements
- **Node.js**: Version 18.0 or higher
- **PostgreSQL**: Version 12 or higher
- **Memory**: Minimum 1GB RAM (2GB+ recommended)
- **Storage**: Minimum 2GB available space
- **OS**: Linux, macOS, or Windows Server

### Hosting Options
This software can be installed on:
- VPS providers (DigitalOcean, Linode, Vultr)
- Cloud platforms (AWS, Google Cloud, Azure)
- Shared hosting with Node.js support (cPanel with Node.js)
- Your own server

---

## Installation Steps

### Step 1: Upload Files to Your Server

#### Option A: Using SCP (Secure Copy)
```bash
# From your local computer
scp real-estate-champ-v1.0.0.zip user@yourserver.com:/var/www/
```

#### Option B: Using FTP/SFTP
Use FileZilla or your preferred FTP client to upload the ZIP file to your server.

#### Option C: Using cPanel File Manager
1. Log into cPanel
2. Navigate to File Manager
3. Upload the ZIP file
4. Extract using cPanel's extract feature

### Step 2: Extract Files

```bash
# SSH into your server
ssh user@yourserver.com

# Navigate to web directory
cd /var/www

# Extract the package
unzip real-estate-champ-v1.0.0.zip
cd real-estate-champ
```

### Step 3: Install Node.js Dependencies

```bash
# Install all required packages
npm install

# This may take 2-5 minutes
```

**Troubleshooting:**
- If `npm install` fails, ensure Node.js 18+ is installed: `node --version`
- On shared hosting, you may need to use the full path: `/usr/local/bin/npm install`

### Step 4: Set Up PostgreSQL Database

#### Create a New Database

**Using PostgreSQL Command Line:**
```bash
# Log into PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE realestatechamp;
CREATE USER realestate_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE realestatechamp TO realestate_user;
\q
```

**Using cPanel:**
1. Go to PostgreSQL Databases
2. Create new database: `realestatechamp`
3. Create new user with a strong password
4. Add user to database with ALL PRIVILEGES

**Using DigitalOcean Managed Database:**
1. Create PostgreSQL cluster
2. Note the connection string provided
3. Create database: `realestatechamp`

### Step 5: Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit the file
nano .env
```

**Required Variables:**

```bash
# Database Connection
DATABASE_URL="postgresql://realestate_user:your_password@localhost:5432/realestatechamp"

# Authentication Secret (generate a random string)
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="https://yourdomain.com"

# Google AI API Key (leave empty for now - you'll add this in the setup wizard)
GOOGLE_AI_API_KEY=""
```

**Generate NEXTAUTH_SECRET:**
```bash
# Generate a secure random secret
openssl rand -base64 32
```

Copy the output and paste it as your `NEXTAUTH_SECRET` value.

**Database URL Format:**
```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE
```

Examples:
- Local: `postgresql://user:pass@localhost:5432/realestatechamp`
- Remote: `postgresql://user:pass@db.example.com:5432/realestatechamp`
- DigitalOcean: `postgresql://doadmin:pass@db-name.db.ondigitalocean.com:25060/realestatechamp?sslmode=require`

### Step 6: Initialize Database

```bash
# Run database migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

**Expected Output:**
```
✓ Prisma Migrate applied 5 migrations
✓ Generated Prisma Client
```

### Step 7: Build the Application

```bash
# Create production build
npm run build
```

This takes 2-5 minutes. You should see:
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

**Common Build Errors:**
- **Out of Memory**: Increase Node.js memory: `NODE_OPTIONS="--max-old-space-size=2048" npm run build`
- **TypeScript Errors**: Ensure all dependencies installed: `rm -rf node_modules && npm install`

### Step 8: Start the Application

#### Option A: Direct Start (for testing)
```bash
npm start
```

Application runs on port 3000 by default.

#### Option B: Using PM2 (Recommended for Production)
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start npm --name "real-estate-champ" -- start

# Save PM2 configuration
pm2 save

# Set up PM2 to start on server reboot
pm2 startup
# Follow the command it outputs
```

#### Option C: Using Different Port
```bash
# If port 3000 is already in use
PORT=3001 npm start
```

---

## Complete Setup Wizard

### Step 9: Access Setup Wizard

1. Open your browser and navigate to:
   - **Local testing**: `http://localhost:3000/setup`
   - **Your domain**: `https://yourdomain.com/setup`

### Step 10: License Activation (Step 1 of 4)

![Setup Step 1 - License]

1. Enter your license key: `XXXX-XXXX-XXXX-XXXX`
2. Enter your customer email (the email you purchased with)
3. Click "Verify License"

**Troubleshooting:**
- "Invalid license key" - Double-check the license key format
- "License doesn't match email" - Ensure you're using the exact email from your purchase
- "License already used" - Contact support if you believe this is an error

### Step 11: Create Admin Account (Step 2 of 4)

1. **Full Name**: Your name
2. **Email**: Your admin email (can be different from customer email)
3. **Password**: Choose a strong password (minimum 8 characters)
4. **Confirm Password**: Re-enter password

**Password Requirements:**
- Minimum 8 characters
- Recommended: Mix of uppercase, lowercase, numbers, symbols

### Step 12: Configure Google AI (Step 3 of 4)

You'll need a Google AI API key for content generation.

**Getting Your Free Google AI API Key:**

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key that starts with `AIza...`
5. Paste into the setup wizard

**Free Tier Limits:**
- 60 requests per minute
- 1,500 requests per day
- More than enough for most realtors!

### Step 13: Company Branding (Step 4 of 4) - Optional

Customize the platform with your branding:

1. **Company Name**: Your real estate company name
2. **Company Logo URL**: URL to your logo image (optional)

You can skip this step and add branding later.

### Step 14: Complete Setup

Click "Complete Setup" - you're done!

You'll be redirected to the login page. Use your admin credentials to log in.

---

## WordPress Plugin Installation

Your package includes a WordPress plugin for easy property posting.

### Installing the Plugin

1. **Extract WordPress Plugin**
   ```bash
   # The plugin is included in your package
   unzip wordpress-plugin.zip
   ```

2. **Upload to WordPress**
   - Log into WordPress admin
   - Go to Plugins → Add New → Upload Plugin
   - Choose `wordpress-plugin.zip`
   - Click "Install Now"
   - Click "Activate"

3. **Configure Plugin**
   - Go to Settings → Real Estate Champ
   - Enter your API URL: `https://yourdomain.com`
   - Enter your API credentials (generated in dashboard)
   - Click "Save Settings"

### Using the Plugin

1. Create or edit any WordPress post
2. Look for "Real Estate Champ" meta box
3. Click "Import from Real Estate Champ"
4. Select property from dropdown
5. Generated content will populate your post

---

## Mobile App Installation

Your platform is a Progressive Web App (PWA) - it can be installed on phones like a native app!

### iPhone/iPad Installation

1. Open Safari and go to your domain
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Name it "Real Estate Champ"
5. Tap "Add"

The app icon will appear on your home screen!

### Android Installation

1. Open Chrome and go to your domain
2. Tap the menu (three dots)
3. Tap **"Install App"** or **"Add to Home Screen"**
4. Tap "Install"

The app will be installed like a regular app!

### Benefits of PWA Installation
- Works offline
- Faster loading
- Camera integration for property photos
- Push notifications (coming soon)
- No App Store required

---

## Adding Users (Realtors)

### Option 1: Self-Registration
Send your realtors to: `https://yourdomain.com/auth/signup`

They can create their own accounts.

### Option 2: Admin Creates Accounts
1. Log in as admin
2. Go to Settings → Users
3. Click "Add New User"
4. Enter realtor's details
5. System sends welcome email

---

## Using the Platform

### Adding a Property

1. Log in to dashboard
2. Click "Add Property"
3. Fill in property details:
   - Address, city, state, zip
   - Price, bedrooms, bathrooms
   - Square footage
   - Property type (house, condo, etc.)
4. **Upload Photos**:
   - Drag and drop images
   - Or click to browse
   - On mobile: Take photos with camera
5. Click "Save Property"

### Generating AI Content

1. Open any property
2. Click "Generate Content"
3. Choose content type:
   - **Property Description** - Full listing description
   - **Social Media Post** - Facebook/Instagram ready
   - **Email Campaign** - Email to send to clients
   - **Feature Highlights** - Bullet points of key features
4. Click "Generate"
5. AI creates content in seconds!
6. Edit if needed
7. Copy and use anywhere

### Managing Content

All generated content is saved in the property's content library:
- Edit anytime
- Regenerate variations
- Export to WordPress
- Share on social media

---

## Domain and SSL Setup

### Setting Up Your Domain

1. **Point Domain to Server**
   - Get your server IP address
   - In your domain registrar (GoDaddy, Namecheap, etc.)
   - Create A record: `yourdomain.com` → `your.server.ip`
   - Create A record: `www.yourdomain.com` → `your.server.ip`

2. **Configure Reverse Proxy (Nginx)**

Create `/etc/nginx/sites-available/realestatechamp`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/realestatechamp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

3. **Install SSL Certificate (Free with Let's Encrypt)**

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts
# Certificate auto-renews!
```

---

## Troubleshooting

### Application Won't Start

**Check Node.js version:**
```bash
node --version  # Should be 18.0.0 or higher
```

**Check if port is already in use:**
```bash
lsof -i :3000  # See what's using port 3000
```

**Check logs:**
```bash
pm2 logs real-estate-champ
```

### Database Connection Errors

**Test database connection:**
```bash
psql "postgresql://user:pass@host:5432/dbname"
```

**Common issues:**
- Wrong password in DATABASE_URL
- PostgreSQL not running: `sudo systemctl status postgresql`
- Firewall blocking port 5432
- Wrong host (use `localhost` for local DB)

### Build Errors

**Clear cache and rebuild:**
```bash
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Can't Access Setup Wizard

**Make sure app is running:**
```bash
pm2 status  # Should show "online"
```

**Check firewall:**
```bash
# Allow port 3000
sudo ufw allow 3000
```

**Check NEXTAUTH_URL:**
- Must match your actual domain
- Include protocol: `https://yourdomain.com`

### Google AI API Errors

**"Invalid API key":**
- Double-check the key starts with `AIza`
- Ensure no extra spaces
- Regenerate key if needed

**"Quota exceeded":**
- Free tier: 60/min, 1,500/day
- Wait a minute and try again
- Consider upgrading Google AI quota

---

## Maintenance and Updates

### Backing Up Your Data

**Backup Database:**
```bash
# Create backup
pg_dump realestatechamp > backup-$(date +%Y%m%d).sql

# Restore from backup
psql realestatechamp < backup-20240101.sql
```

**Backup Uploads:**
```bash
# Backup images
tar -czf uploads-backup.tar.gz public/uploads/
```

### Updating to New Version

When you receive an update package:

1. **Backup first!**
2. **Extract new version to temporary location**
3. **Stop application:**
   ```bash
   pm2 stop real-estate-champ
   ```
4. **Backup current .env file:**
   ```bash
   cp .env .env.backup
   ```
5. **Replace files (keep .env and uploads/):**
   ```bash
   rsync -av --exclude='.env' --exclude='uploads/' new-version/ /var/www/real-estate-champ/
   ```
6. **Install dependencies:**
   ```bash
   npm install
   ```
7. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```
8. **Rebuild:**
   ```bash
   npm run build
   ```
9. **Restart:**
   ```bash
   pm2 restart real-estate-champ
   ```

### Monitoring

**Check application status:**
```bash
pm2 status
pm2 logs real-estate-champ
```

**Check disk space:**
```bash
df -h
```

**Check memory:**
```bash
free -h
```

---

## Getting Help

### Before Contacting Support

1. Check this guide's Troubleshooting section
2. Check application logs: `pm2 logs real-estate-champ`
3. Verify all environment variables are set correctly
4. Try restarting: `pm2 restart real-estate-champ`

### When Contacting Support

Please include:
- Your license key
- Server operating system and version
- Node.js version: `node --version`
- PostgreSQL version: `psql --version`
- Error messages (full text)
- What you were doing when error occurred

### Self-Help Resources

- **Node.js Documentation**: https://nodejs.org/docs
- **PostgreSQL Documentation**: https://www.postgresql.org/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Prisma Documentation**: https://www.prisma.io/docs

---

## Security Best Practices

### Secure Your Installation

1. **Strong Passwords**
   - Use unique password for database
   - Use unique password for admin account
   - Never reuse passwords

2. **Keep Software Updated**
   - Update Node.js regularly
   - Update PostgreSQL
   - Apply security patches promptly

3. **Firewall Configuration**
   ```bash
   # Only allow necessary ports
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   sudo ufw enable
   ```

4. **Regular Backups**
   - Automate daily database backups
   - Store backups off-server
   - Test restore process

5. **SSL Certificate**
   - Always use HTTPS in production
   - Let's Encrypt is free
   - Certificates auto-renew

6. **Environment Variables**
   - Never commit .env to version control
   - Keep NEXTAUTH_SECRET secure
   - Rotate secrets periodically

---

## FAQ

### Can I install this on shared hosting?
Yes, if your host supports Node.js 18+ and PostgreSQL. cPanel with Node.js support works well.

### How many users can I have?
Unlimited! Each installation supports unlimited realtors and properties.

### Do I need to pay for Google AI?
No, the free tier is very generous and sufficient for most real estate agents.

### Can I customize the branding?
Yes, you can set your company name and logo in the setup wizard or settings.

### Can I use this with multiple domains?
Each license is for one domain. Contact sales for multi-domain licensing.

### What happens if my license expires?
The software continues working. Expiration only affects your support and update eligibility.

### Can I resell this to my clients?
No, each client needs their own license. Contact us about reseller programs.

### Is my data secure?
Yes, all data is stored in YOUR database on YOUR server. You have complete control.

### Can I modify the code?
Your license permits customization for your own use. You cannot redistribute modified versions.

### How do I add more realtors?
Unlimited realtors can sign up or you can create accounts from the admin panel.

---

## Success Checklist

- [ ] Files uploaded and extracted
- [ ] Node.js 18+ installed
- [ ] PostgreSQL database created
- [ ] .env file configured
- [ ] `npm install` completed successfully
- [ ] Database migrations ran successfully
- [ ] Application built successfully
- [ ] Application started with PM2
- [ ] Domain pointed to server
- [ ] SSL certificate installed
- [ ] Setup wizard completed
- [ ] License activated
- [ ] Google AI API key configured
- [ ] Admin account created
- [ ] First property added successfully
- [ ] AI content generated successfully
- [ ] WordPress plugin installed (if using)
- [ ] Mobile app installed on phone

---

## Welcome to Real Estate Champ!

Congratulations on completing setup! You now have a powerful AI-powered property marketing platform.

**Next Steps:**
1. Add your first property
2. Generate AI content
3. Invite your team
4. Install mobile app
5. Start creating amazing property listings!

**Need Help?**
We're here to support you. Keep this guide handy for reference.

Happy selling! 🏠🎉
