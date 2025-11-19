import Link from "next/link";
import { PRICING_PLANS } from "@/lib/pricing";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            🚀 SaaS Platform for Real Estate Professionals
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto">
            Turn Property Photos Into
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Marketing Gold
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            AI-powered mobile app that transforms property images into stunning blog posts,
            social media content, and videos. Start your 14-day free trial today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Start Free Trial →
            </Link>
            <Link
              href="#pricing"
              className="bg-white hover:bg-gray-50 text-gray-800 text-lg px-8 py-4 rounded-lg font-semibold shadow-md transition-all"
            >
              View Pricing
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Market Properties
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="📱 Mobile-First PWA"
              description="Install on your phone. Upload images, chat with AI, and publish content anywhere."
            />
            <FeatureCard
              title="💬 AI Chat Assistant"
              description="Just tell the AI about your property. No forms, no hassle. It extracts everything."
            />
            <FeatureCard
              title="✨ Multi-Platform Posts"
              description="Generate optimized content for Facebook, Instagram, LinkedIn, and Google Business."
            />
            <FeatureCard
              title="📝 SEO Blog Posts"
              description="Create engaging, SEO-optimized blog posts that rank well and convert."
            />
            <FeatureCard
              title="🎥 Video Generation"
              description="Turn images into property tour videos with AI-powered Veo 3 technology."
            />
            <FeatureCard
              title="🖼️ Image Enhancement"
              description="Auto-enhance, stage, and edit photos. Sky replacement, HDR, virtual staging."
            />
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Simple 3-Step Process
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Step
              number={1}
              title="Upload & Chat"
              description="Add property images from your phone. Chat with AI about the property details."
              color="blue"
            />
            <Step
              number={2}
              title="AI Generates Content"
              description="Our AI creates blog posts, social media content, and videos tailored for each platform."
              color="indigo"
            />
            <Step
              number={3}
              title="Publish Everywhere"
              description="Review, edit if needed, and publish to all your platforms with one tap."
              color="purple"
            />
          </div>
        </div>

        {/* Pricing */}
        <div id="pricing" className="max-w-7xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade when you need more. All plans include 14-day free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING_PLANS.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className="max-w-5xl mx-auto text-center mb-20">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Trusted by Real Estate Professionals
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <StatCard number="1000+" label="Active Realtors" />
            <StatCard number="50,000+" label="Properties Listed" />
            <StatCard number="200,000+" label="Posts Generated" />
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Property Marketing?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of realtors who save hours every week with AI-powered content creation.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-white text-blue-600 hover:bg-gray-100 text-lg px-10 py-4 rounded-lg font-semibold shadow-lg transition-all"
          >
            Start Your Free Trial
          </Link>
          <p className="text-sm mt-4 opacity-75">
            14 days free • No credit card required
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Step({ number, title, description, color }: {
  number: number;
  title: string;
  description: string;
  color: string;
}) {
  const bgColor = {
    blue: 'bg-blue-600',
    indigo: 'bg-indigo-600',
    purple: 'bg-purple-600',
  }[color];

  return (
    <div className="text-center">
      <div className={`inline-flex items-center justify-center w-16 h-16 ${bgColor} text-white rounded-full text-2xl font-bold mb-4`}>
        {number}
      </div>
      <h4 className="text-xl font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PricingCard({ plan }: { plan: typeof PRICING_PLANS[0] }) {
  return (
    <div className={`bg-white rounded-xl p-8 shadow-lg ${plan.popular ? 'ring-2 ring-blue-600 relative' : ''}`}>
      {plan.popular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
      <div className="mb-6">
        <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
        <span className="text-gray-600">/month</span>
      </div>
      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start text-gray-600">
            <span className="text-green-500 mr-2">✓</span>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href={plan.price === 0 ? "/auth/signup" : `/auth/signup?plan=${plan.id}`}
        className={`block text-center py-3 px-6 rounded-lg font-semibold transition-all ${
          plan.popular
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        {plan.price === 0 ? 'Get Started Free' : 'Start Free Trial'}
      </Link>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="text-4xl font-bold text-blue-600 mb-2">{number}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}
