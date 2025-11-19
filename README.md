# 🏠 Real Estate Champ - AI-Powered Property Marketing Platform

Transform property photos into professional marketing content in seconds! A multi-tenant SaaS platform designed for realtors to quickly capture property photos on their phones and automatically generate engaging social media posts, blog articles, and marketing materials using Google's Gemini AI.

## ✨ Key Features

### 📱 **Mobile-First Design**
- **PWA (Progressive Web App)** - Install on iPhone or Android like a native app
- **Camera Integration** - Take photos directly from the app
- **Offline Support** - Works without internet, syncs when online
- **Touch-Optimized** - Large buttons, easy navigation, perfect for on-site use

### 🤖 **AI-Powered Content Generation**
- **Blog Posts** - SEO-optimized articles (800+ words)
- **Social Media Posts** - Platform-specific content for Facebook, Instagram, LinkedIn
- **Google Business Profile Posts** - Local business optimized
- **Smart Hashtags** - AI generates relevant hashtags
- **Video Generation** - Coming soon with Gemini Veo 3
- **Image Enhancement** - Coming soon with Imagen 3

### 💰 **Multi-Tenant SaaS**
- **Subscription Plans** - FREE, STARTER ($49), PRO ($99), ENTERPRISE ($299)
- **Usage Limits** - Properties and monthly content generation tracking
- **Stripe Integration** - Automated billing and subscription management
- **White Label** - Custom branding for PRO+ plans
- **Usage Analytics** - Track performance and ROI

### 🔗 **Integrations**
- **WordPress** - Optional auto-posting to your blog
- **Facebook** - Direct posting with OAuth
- **Instagram** - Business account posting
- **LinkedIn** - Professional network posting
- **Google Business Profile** - Local SEO posting
- **Webhooks** - Send data to any external service

## 🚀 Quick Start

### For Realtors (Users)

1. **Sign Up**
   - Visit https://your-platform-url.com
   - Create account (14-day free trial on paid plans)
   - Choose your plan

2. **Install Mobile App**
   - iPhone: Safari → Share → "Add to Home Screen"
   - Android: Chrome → Menu → "Install App"

3. **Add First Property**
   - Open app → Tap "+ Add Property"
   - Take photos with camera
   - Fill basic details
   - Tap "Create Property"

4. **Generate Content**
   - Open property → Tap "Generate Social Media Posts"
   - Wait 10-30 seconds
   - AI creates posts for all platforms
   - Review and post!

**See detailed instructions:** [MOBILE-USAGE.md](./MOBILE-USAGE.md)

### For Developers (Setup)

#### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Google AI API key (Gemini)
- Stripe account (for payments)

#### Environment Setup

```bash
# Clone repository
git clone https://github.com/yourusername/real-estate-champ.git
cd real-estate-champ

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your values
nano .env
```

#### Required Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/realestatechamp"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Google Gemini AI
GOOGLE_AI_API_KEY="your-gemini-api-key"

# Stripe (for payments)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID="price_..."
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID="price_..."
NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID="price_..."

# Social Media OAuth (Optional)
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-app-secret"
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
GOOGLE_BUSINESS_CLIENT_ID="your-google-client-id"
GOOGLE_BUSINESS_CLIENT_SECRET="your-google-client-secret"
```

#### Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
```

#### Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

#### Build for Production

```bash
npm run build
npm start
```

## 📚 Documentation

- **[Mobile Usage Guide](./MOBILE-USAGE.md)** - For realtors using the app
- **[WordPress Integration](./WORDPRESS-INTEGRATION.md)** - WordPress setup and plugin
- **[SaaS Setup Guide](./SAAS-SETUP.md)** - Business model and revenue guide
- **[API Documentation](./docs/API.md)** - API endpoints reference

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- React 18
- TypeScript
- Tailwind CSS 3
- PWA with next-pwa

**Backend:**
- Next.js API Routes
- NextAuth.js v5 (Authentication)
- Prisma ORM
- PostgreSQL

**AI/ML:**
- Google Gemini 2.0 (Text generation)
- Gemini Veo 3 (Video - coming soon)
- Imagen 3 (Image editing - coming soon)

**Payments:**
- Stripe Checkout
- Stripe Customer Portal
- Subscription webhooks

**Deployment:**
- Vercel (recommended)
- Docker support
- Any Node.js hosting

### Database Schema

```
User
├── Properties (1:many)
│   ├── Images
│   ├── Videos
│   └── Generated Content
├── Social Accounts
├── Subscription
└── Usage Records

Subscription
└── Invoices
```

See full schema: `prisma/schema.prisma`

### API Endpoints

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js handlers

**Properties:**
- `GET /api/properties` - List properties
- `POST /api/properties` - Create property
- `GET /api/properties/[id]` - Get single property
- `PATCH /api/properties/[id]` - Update property
- `DELETE /api/properties/[id]` - Delete property

**Content Generation:**
- `POST /api/properties/[id]/generate` - Generate AI content
- `POST /api/properties/[id]/images` - Upload images
- `POST /api/chat` - AI chat for property info

**Billing:**
- `POST /api/billing/checkout` - Create checkout session
- `POST /api/billing/portal` - Billing portal access

**Webhooks:**
- `POST /api/webhooks/stripe` - Stripe webhook handler

## 💼 Business Model

### Pricing Tiers

| Plan | Price | Properties | Content/Month | Features |
|------|-------|------------|---------------|----------|
| **FREE** | $0 | 5 | 10 | Basic features |
| **STARTER** | $49 | 25 | 100 | Video generation |
| **PRO** | $99 | Unlimited | Unlimited | White label |
| **ENTERPRISE** | $299 | Unlimited | Unlimited | API access, priority support |

### Revenue Potential

With 100 paying customers:
- 60% Starter ($49) = $2,940/mo
- 30% Pro ($99) = $2,970/mo
- 10% Enterprise ($299) = $2,990/mo

**Total: $8,900/month = $106,800/year**

See detailed business plan: [SAAS-SETUP.md](./SAAS-SETUP.md)

## 🔧 Configuration

### Pricing Configuration

Edit `src/lib/pricing.ts` to customize:
- Plan features
- Usage limits
- Pricing amounts
- Feature flags

### AI Configuration

Edit `src/lib/ai/gemini.ts` to customize:
- Model selection
- Temperature settings
- Prompt templates
- Content formats

### WordPress Integration

Two modes available:

1. **SaaS Mode** (Recommended)
   - Deploy standalone
   - Optional WordPress sync
   - Best for mobile usage

2. **WordPress Plugin**
   - Runs in WordPress
   - Located in `wordpress-plugin/`
   - See [WORDPRESS-INTEGRATION.md](./WORDPRESS-INTEGRATION.md)

## 🔒 Security

- ✅ HTTPS required in production
- ✅ JWT session tokens
- ✅ bcrypt password hashing
- ✅ CSRF protection
- ✅ Rate limiting on API routes
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection
- ✅ Secure headers middleware

## 📱 PWA Features

- **Offline Mode** - Works without internet
- **Install Prompt** - Add to home screen
- **Push Notifications** - Coming soon
- **Background Sync** - Automatic data sync
- **Camera Access** - Direct photo capture
- **Fast Loading** - Cached assets

## 🎨 Customization

### Branding

1. Update `public/` assets:
   - `favicon.ico`
   - `icon-192x192.png`
   - `icon-512x512.png`

2. Edit `public/manifest.json`:
   - App name
   - Description
   - Theme colors

3. Update `src/app/layout.tsx` metadata

### Styling

- Edit `tailwind.config.ts` for theme
- Modify `src/app/globals.css` for global styles
- Component styles in respective files

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📈 Analytics & Monitoring

**Built-in:**
- Usage tracking per user
- Subscription analytics
- Content generation metrics

**Recommended Integrations:**
- Google Analytics
- Sentry (error tracking)
- LogRocket (session replay)
- Mixpanel (product analytics)

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Docker

```bash
# Build
docker build -t real-estate-champ .

# Run
docker run -p 3000:3000 --env-file .env real-estate-champ
```

### Manual Deployment

```bash
# Build
npm run build

# Start
npm start
```

**Environment:** Set all environment variables on your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

For licensing inquiries: contact@realestatechamp.com

## 🆘 Support

- **Email:** support@realestatechamp.com
- **Documentation:** https://docs.realestatechamp.com
- **Video Tutorials:** https://youtube.com/realestatechamp
- **Discord Community:** https://discord.gg/realestatechamp

## 🗺️ Roadmap

### Q1 2025
- ✅ Core SaaS platform
- ✅ Mobile PWA
- ✅ AI content generation
- ✅ Multi-tenant architecture

### Q2 2025
- 🎥 Video generation (Gemini Veo 3)
- 🎨 Image enhancement (Imagen 3)
- 📊 Advanced analytics
- 🔔 Push notifications

### Q3 2025
- 🤖 AI property descriptions
- 🗣️ Voice input
- 🌐 Multi-language support
- 📱 Native mobile apps

### Q4 2025
- 🏢 Team collaboration
- 📈 CRM integration
- 🎯 Lead tracking
- 💬 Chatbot for property inquiries

## 👏 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Prisma](https://prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Gemini](https://deepmind.google/technologies/gemini/)
- [Stripe](https://stripe.com/)

## 📞 Contact

- **Website:** https://realestatechamp.com
- **Email:** hello@realestatechamp.com
- **Twitter:** @realestatechamp
- **LinkedIn:** linkedin.com/company/realestatechamp

---

Made with ❤️ for realtors who want to work smarter, not harder.

**Start transforming your property marketing today! 🚀**
