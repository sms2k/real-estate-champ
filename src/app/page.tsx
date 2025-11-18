import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Real Estate Champ
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered property marketing platform that transforms your property listings into engaging blog posts and social media content
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Feature Cards */}
            <FeatureCard
              title="AI Chat Assistant"
              description="Simply chat with our AI to gather all property information. No complex forms - just conversation."
              icon="💬"
            />
            <FeatureCard
              title="Auto-Generate Content"
              description="Create blog posts, Facebook, Instagram, LinkedIn, and Google Business posts automatically."
              icon="✨"
            />
            <FeatureCard
              title="Video Creation"
              description="Generate property tour videos using Google Veo 3 from your uploaded images."
              icon="🎥"
            />
            <FeatureCard
              title="Image Enhancement"
              description="Automatically enhance, stage, and edit property photos using AI."
              icon="🖼️"
            />
            <FeatureCard
              title="One-Click Publishing"
              description="Connect your social accounts and publish directly or send via webhooks."
              icon="🚀"
            />
            <FeatureCard
              title="WordPress Integration"
              description="Automatically publish SEO-optimized blog posts to your WordPress site."
              icon="📝"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/signin"
              className="btn btn-primary text-lg px-8 py-3"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="btn btn-secondary text-lg px-8 py-3"
            >
              Create Account
            </Link>
          </div>

          <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Step
                number={1}
                title="Upload Images"
                description="Drag and drop your property images. Our AI will analyze and enhance them."
              />
              <Step
                number={2}
                title="Chat About Property"
                description="Tell our AI about the property through natural conversation. It extracts all the details."
              />
              <Step
                number={3}
                title="Generate & Publish"
                description="Review AI-generated content and publish to all your connected platforms with one click."
              />
            </div>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Supported Platforms
            </h3>
            <div className="flex flex-wrap justify-center gap-4 text-gray-700">
              <PlatformBadge name="Facebook" />
              <PlatformBadge name="Instagram" />
              <PlatformBadge name="LinkedIn" />
              <PlatformBadge name="Google Business" />
              <PlatformBadge name="WordPress" />
              <PlatformBadge name="Custom Webhooks" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon }: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full text-xl font-bold mb-4">
        {number}
      </div>
      <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PlatformBadge({ name }: { name: string }) {
  return (
    <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
      {name}
    </span>
  );
}
