# Real Estate Champ - FREE Edition

**AI-Powered Property Marketing Platform** - A completely FREE, open-source tool for real estate professionals to create stunning social media content, blog posts, and marketing materials using AI.

## 🎁 Free & Open Source

This is a **100% FREE** application with **NO payment processing**, **NO subscriptions**, and **NO usage limits**. Give it to as many people as you want!

Perfect for:
- Real estate agents who want to save time on content creation
- Property managers marketing multiple listings
- Real estate photographers offering value-added services
- Anyone in real estate looking to leverage AI for marketing

---

## ✨ Features

### 📱 Mobile-First Design
- **Camera Integration** - Take property photos directly from your phone
- **Progressive Web App** - Install on your phone like a native app
- **Touch-Optimized UI** - Large buttons, easy navigation
- **Works Offline** - Basic functionality without internet

### 🤖 AI Content Generation
- **Blog Posts** - SEO-optimized property descriptions (800+ words)
- **Social Media** - Platform-specific posts for Facebook, Instagram, LinkedIn, Google Business
- **Smart Editing** - AI suggests improvements to your property photos
- **Natural Language** - Chat with AI to gather property details

### 🏠 Property Management
- Unlimited properties
- Unlimited image uploads
- Unlimited AI content generation
- Organize by status (Draft, Published, Archived)

### 🔗 Integrations
- **WordPress Plugin** - Sync content directly to your WordPress site
- **Social Media** - Connect Facebook, Instagram, LinkedIn, Google Business
- **Webhooks** - Send data to any external service
- **RESTful API** - Build custom integrations

---

## 🚀 Quick Start

### For Realtors (Users)

1. **Get the URL** from whoever installed the platform for you
2. **Open on your phone** and tap "Add to Home Screen"
3. **Sign up** with your email
4. **Start creating**:
   - Tap "New Property"
   - Take photos with your phone camera
   - Chat with AI about the property
   - Generate social media posts
   - Publish!

### For Developers (Installation)

#### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Google AI API key (free tier available)

#### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd real-estate-champ

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
nano .env  # Add your database URL and Google AI key

# Run database migrations
npx prisma migrate deploy
npx prisma generate

# Build the application
npm run build

# Start the server
npm start
```

The app will be available at `http://localhost:3000`

---

## 📋 Environment Variables

Create a `.env` file with these required variables:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/realestatechamp"

# Google AI (for content generation)
GOOGLE_AI_API_KEY="your-google-ai-key-here"
# Get from: https://makersuite.google.com/app/apikey

# Authentication
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"  # Change to your domain in production
```

---

## 📱 Mobile Usage

### Installing the PWA (Progressive Web App)

**On iPhone:**
1. Open Safari and go to your site
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" - Done!

**On Android:**
1. Open Chrome and go to your site
2. Tap the three dots menu
3. Tap "Install App" or "Add to Home Screen"
4. Tap "Install" - Done!

### Taking Property Photos
- The app uses your phone's camera directly
- Take 5-15 photos of each property
- Photos are optimized automatically
- Works in landscape or portrait mode

### Content Generation Workflow
1. **Create Property** (2 minutes)
   - Tap camera icon
   - Take photos of the property
   - Fill in basic details

2. **AI Chat** (3 minutes)
   - Answer AI's questions about the property
   - Or paste MLS description
   - AI extracts structured data

3. **Generate Content** (1 minute)
   - Tap "Generate Content"
   - Select platforms (Facebook, Instagram, Blog, etc.)
   - AI creates custom content for each platform

4. **Review & Publish** (2 minutes)
   - Review AI-generated posts
   - Make any edits
   - Publish directly or schedule

**Total Time: ~8 minutes per property** (vs. 2+ hours manual)

---

## 🔌 WordPress Plugin

A WordPress plugin is included for seamless integration!

### Installation

```bash
# Copy plugin to WordPress
cp -r wordpress-plugin/real-estate-champ /path/to/wordpress/wp-content/plugins/

# Or zip and upload via WordPress admin
cd wordpress-plugin
zip -r real-estate-champ.zip real-estate-champ/
```

Then activate via WordPress admin → Plugins → Real Estate Champ → Activate

### Configuration

1. Go to **Real Estate Champ** → **Settings** in WordPress admin
2. Enter your **Google AI API Key**
3. (Optional) Configure social media OAuth credentials
4. Save settings

The plugin creates:
- Custom database tables for properties and content
- REST API endpoints for the mobile app
- Admin interface for management

---

## 🛠 Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js v5
- **AI**: Google Gemini 2.0 Flash
- **PWA**: next-pwa, Workbox
- **Image Upload**: React Dropzone
- **Form Validation**: Zod, React Hook Form

---

## 📁 Project Structure

```
real-estate-champ/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   ├── auth/              # Auth pages (signin, signup)
│   │   └── dashboard/         # Dashboard pages
│   ├── lib/                   # Utilities
│   │   ├── ai/               # AI integration (Gemini)
│   │   ├── api/              # API helpers
│   │   └── auth/             # Authentication logic
│   └── types/                 # TypeScript types
├── prisma/
│   └── schema.prisma          # Database schema
├── wordpress-plugin/          # WordPress plugin
└── public/                    # Static assets
```

---

## 🎯 API Endpoints

All endpoints require authentication except `/api/auth/*`

### Properties
- `GET /api/properties` - List all properties
- `POST /api/properties` - Create property
- `GET /api/properties/[id]` - Get single property
- `PUT /api/properties/[id]` - Update property
- `DELETE /api/properties/[id]` - Delete property
- `POST /api/properties/[id]/images` - Upload images
- `POST /api/properties/[id]/generate` - Generate AI content

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth.js handlers

### Chat
- `POST /api/chat` - Chat with AI about property

### Social Accounts
- `GET /api/social-accounts` - List connected accounts
- `POST /api/social-accounts` - Connect new account

---

## 🚢 Deployment Options

### Option 1: Vercel (Recommended)

```bash
npm i -g vercel
vercel  # Follow prompts
```

Add environment variables in Vercel dashboard.

### Option 2: Docker

```bash
docker build -t real-estate-champ .
docker run -p 3000:3000 --env-file .env real-estate-champ
```

### Option 3: VPS/Server

```bash
# Install dependencies
npm install

# Build
npm run build

# Run with PM2 (or similar)
pm2 start npm --name "real-estate-champ" -- start
```

---

## 🎁 Distribution & Licensing

This is **FREE software**. You can:
- ✅ Give it to anyone
- ✅ Install it on multiple servers
- ✅ Modify the code
- ✅ Use it commercially
- ✅ White-label it
- ✅ Sell setup/support services

**Just don't claim you built it from scratch!**

### Sharing with Clients

To give this to a realtor:

1. **Set up a server** (DigitalOcean, AWS, Vercel, etc.)
2. **Install the application** following the steps above
3. **Create an admin account** for yourself
4. **Give them the URL** and help them create an account
5. **Done!** They can use it unlimited, forever, free

---

## 🔒 Security

- Password hashing with bcrypt
- JWT-based sessions
- SQL injection prevention via Prisma
- XSS protection
- CSRF tokens
- Environment variable encryption
- Rate limiting on API routes

---

## 🤝 Contributing

This is free software! Contributions welcome:
1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📞 Support

- **Documentation**: See docs in the `/docs` folder
- **Issues**: Open an issue on GitHub
- **WordPress Plugin**: See `wordpress-plugin/README.md`

---

## 📝 License

ISC License - Free to use, modify, and distribute!

---

## 🙏 Credits

Built with:
- Google Gemini AI
- Next.js team
- Prisma team
- NextAuth.js team
- All the amazing open source contributors

---

## 🗺 Roadmap

Future enhancements (feel free to contribute!):
- Video generation support (when Google Veo 3 API is available)
- Image editing with Imagen 3
- Multi-language support
- Property comparison tools
- Analytics dashboard
- Email campaigns
- CRM integration
- 3D virtual tours

---

**Made with ❤️ for the real estate community**

No subscriptions. No limits. Just great AI-powered content creation.
