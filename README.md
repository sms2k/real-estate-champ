# Real Estate Champ

AI-powered property marketing platform that transforms property listings into engaging blog posts, social media content, and videos.

## Features

- **AI Chat Interface**: Gather property information through natural conversation with Google Gemini
- **Automatic Content Generation**: Create platform-specific posts for Facebook, Instagram, LinkedIn, and Google Business Profile
- **Blog Post Creation**: Generate SEO-optimized blog posts for WordPress
- **Video Generation**: Create property tour videos using Google Veo 3 (when available)
- **Image Enhancement**: AI-powered image editing with Imagen 3 (when available)
- **Multi-User Support**: Super admin and realtor roles with company-wide API management
- **Direct Publishing**: Post directly to connected social accounts and WordPress
- **Webhook Integration**: Send generated content to custom endpoints

## Tech Stack

- **Frontend/Backend**: Next.js 16 with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **AI**: Google Gemini API (text, vision, Veo 3, Imagen 3)
- **Styling**: Tailwind CSS
- **Social APIs**: Facebook Graph API, LinkedIn API, Google Business Profile API

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google AI API key
- Social media developer accounts (Facebook, LinkedIn, Google)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd real-estate-champ
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and fill in your credentials (see Configuration section below)

4. **Set up the database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Create the first super admin user** (run this after setting up the database)
   ```bash
   npm run create-admin
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### Database

Set up a PostgreSQL database and update the `DATABASE_URL` in your `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/real_estate_champ"
```

### NextAuth Configuration

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Add it to `.env`:

```env
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Google AI API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and add to `.env`:

```env
GOOGLE_AI_API_KEY="your-google-ai-api-key"
```

### Facebook/Instagram Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" and "Instagram Basic Display" products
4. Get your App ID and App Secret
5. Add to `.env`:

```env
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-app-secret"
INSTAGRAM_APP_ID="your-facebook-app-id"  # Same as Facebook
INSTAGRAM_APP_SECRET="your-facebook-app-secret"
```

6. Configure OAuth redirect URL: `http://localhost:3000/api/auth/callback/facebook`

### LinkedIn Setup

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Request access to "Sign In with LinkedIn" and "Share on LinkedIn"
4. Get your Client ID and Client Secret
5. Add to `.env`:

```env
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
```

6. Configure OAuth redirect URL: `http://localhost:3000/api/auth/callback/linkedin`

### Google Business Profile API Setup

**Step 1: Enable the API**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google My Business API
   - Google Business Profile API (newer version)
4. Go to "APIs & Services" > "Credentials"

**Step 2: Create OAuth 2.0 Credentials**

1. Click "Create Credentials" > "OAuth 2.0 Client ID"
2. Choose "Web application"
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy the Client ID and Client Secret

**Step 3: Configure OAuth Consent Screen**

1. Go to "OAuth consent screen"
2. Select "External" user type
3. Fill in required information
4. Add scopes:
   - `https://www.googleapis.com/auth/business.manage`
5. Add test users (your email and client emails)

**Step 4: Add to Environment Variables**

```env
GOOGLE_BUSINESS_CLIENT_ID="your-google-client-id"
GOOGLE_BUSINESS_CLIENT_SECRET="your-google-client-secret"
```

**Important Notes:**
- Google Business Profile API requires your app to be verified for production use
- During development, you can use test users
- Each location needs to be verified and claimed
- API access may have limits and quotas

**Verification Process (for production):**
1. Complete the [OAuth verification process](https://support.google.com/cloud/answer/9110914)
2. Provide privacy policy and terms of service
3. Demonstrate how your app uses the Business Profile API
4. Submit for review (can take 4-6 weeks)

### WordPress Integration

For each WordPress site you want to connect:

1. Install and activate the "Application Passwords" plugin (or use WordPress 5.6+)
2. Go to Users > Your Profile > Application Passwords
3. Create a new application password
4. Save the site details in the application's admin panel

## Project Structure

```
real-estate-champ/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js app router
│   │   ├── api/              # API routes
│   │   ├── dashboard/        # User dashboard
│   │   ├── admin/            # Admin panel
│   │   └── auth/             # Auth pages
│   ├── components/           # React components
│   ├── lib/                  # Utilities and services
│   │   ├── ai/              # Google Gemini integration
│   │   ├── social/          # Social media APIs
│   │   ├── storage/         # File and data storage
│   │   ├── webhooks/        # Webhook system
│   │   └── auth/            # Authentication
│   └── types/               # TypeScript types
├── data/                     # Property JSON files
├── uploads/                  # Uploaded media files
└── public/                   # Static assets
```

## Usage

### For Super Admin

1. Log in with your admin account
2. Go to Admin Panel
3. Configure company-wide API keys:
   - Google AI API key
   - Social media app credentials
4. Manage users and monitor usage

### For Realtors

1. **Sign In**
   - Create an account or sign in

2. **Connect Social Accounts**
   - Go to Dashboard > Connected Accounts
   - Connect Facebook, Instagram, LinkedIn, Google Business
   - Configure WordPress sites
   - Set up webhooks if needed

3. **Create Property Listing**
   - Click "New Property"
   - Upload property images
   - Chat with the AI to provide property details
   - Review extracted information

4. **Generate Content**
   - Click "Generate Content"
   - Select platforms (Facebook, Instagram, LinkedIn, Google Business, Blog)
   - Choose options (generate video, edit images)
   - Preview generated content

5. **Publish**
   - Review all generated content
   - Edit if needed
   - Click "Publish to All" or select individual platforms
   - Content is posted to connected accounts and sent to webhooks

## API Endpoints

### Properties

- `POST /api/properties` - Create new property
- `GET /api/properties` - List user's properties
- `GET /api/properties/[id]` - Get property details
- `PUT /api/properties/[id]` - Update property
- `DELETE /api/properties/[id]` - Delete property

### Content Generation

- `POST /api/content/generate` - Generate all content for a property
- `POST /api/content/blog` - Generate blog post only
- `POST /api/content/social` - Generate social media posts
- `POST /api/content/video` - Generate property video

### Social Media

- `POST /api/social/connect/[platform]` - Initiate OAuth connection
- `POST /api/social/publish` - Publish to social platforms
- `GET /api/social/accounts` - List connected accounts

### Webhooks

- `POST /api/webhooks` - Create webhook
- `GET /api/webhooks` - List webhooks
- `PUT /api/webhooks/[id]` - Update webhook
- `DELETE /api/webhooks/[id]` - Delete webhook
- `POST /api/webhooks/test` - Test webhook

### Admin (Super Admin Only)

- `POST /api/admin/api-keys` - Manage company API keys
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/[id]` - Update user role

## Development

### Run in development mode

```bash
npm run dev
```

### Build for production

```bash
npm run build
npm start
```

### Database migrations

```bash
# Create a new migration
npx prisma migrate dev --name description

# Apply migrations in production
npx prisma migrate deploy

# Reset database (WARNING: destroys data)
npx prisma migrate reset
```

### Linting

```bash
npm run lint
```

## Troubleshooting

### Issue: Prisma Client not generated

**Solution:**
```bash
npx prisma generate
```

### Issue: Database connection failed

**Solution:**
- Check your `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Verify credentials and database name

### Issue: OAuth redirects not working

**Solution:**
- Verify redirect URLs in developer consoles match exactly
- For Facebook: Use `https` in production
- For development, ensure `http://localhost:3000` is allowed

### Issue: Gemini API rate limits

**Solution:**
- Implement exponential backoff
- Cache generated content
- Consider upgrading API tier

### Issue: Image uploads failing

**Solution:**
- Check `MAX_FILE_SIZE` in `.env`
- Verify `uploads/` directory has write permissions
- Check available disk space

## Security Considerations

1. **API Keys**: Never commit `.env` files. Use environment variables in production.
2. **File Uploads**: Validate file types and sizes. Scan for malware in production.
3. **OAuth Tokens**: Tokens are encrypted in database. Use long-lived tokens with refresh.
4. **Webhooks**: Verify webhook signatures before processing.
5. **Rate Limiting**: Implement rate limiting for API endpoints in production.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Self-Hosted

1. Build the application: `npm run build`
2. Set up PostgreSQL database
3. Set environment variables
4. Run migrations: `npx prisma migrate deploy`
5. Start the server: `npm start`
6. Use a process manager like PM2 for production

## License

ISC

## Support

For issues or questions, please open an issue on GitHub.

---

**Note**: Google Veo 3 and Imagen 3 APIs are currently in limited preview. The implementation includes placeholder code that will be updated when these APIs become publicly available. You can use alternative video creation (ffmpeg) and image editing services in the meantime.
